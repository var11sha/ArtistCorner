import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import '../css/home.css';
import { useNavigate } from "react-router-dom";
import { getUserEvents } from "../api/eventApi";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); 
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [detectedMood, setDetectedMood] = useState("relax");
  const [user, setUser] = useState(null);

  // Session check and get user
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
      console.log("User session found:", userData);
    }
  }, [navigate]);

  // Update time, date, greeting every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      // Time
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Greeting
      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      // Date
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ];
      const dayName = days[now.getDay()];
      const date = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      setCurrentDate(`${dayName}, ${date} ${monthName} ${year}`);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch weather using browser geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const API_KEY = "1a475d5d92a5d54b07ab3e2f1463fa26";

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await res.json();
          const weatherData = {
            temp: Math.round(data.main.temp),
            desc: data.weather[0].description,
            city: data.name,
            condition: data.weather[0].main,
            icon: data.weather[0].icon
          };
          setWeather(weatherData);
          
          // Determine mood based on weather
          const weatherMood = getMoodFromWeather(weatherData);
          setDetectedMood(weatherMood);
          
          setLoadingWeather(false);
        } catch (err) {
          console.error("Weather fetch error:", err);
          setLoadingWeather(false);
        }
      });
    } else {
      setLoadingWeather(false);
      console.error("Geolocation not supported.");
    }
  }, []);

  // Function to determine mood from weather
  const getMoodFromWeather = (weatherData) => {
    const condition = weatherData.condition.toLowerCase();
    const temp = weatherData.temp;
    
    if (condition.includes("rain") || condition.includes("drizzle")) {
      return "relax"; // Cozy, chill music for rainy days
    } else if (condition.includes("sun") || condition.includes("clear")) {
      if (temp > 25) return "morning"; // Energetic for hot sunny days
      return "relax"; // Chill for pleasant sunny days
    } else if (condition.includes("cloud")) {
      return "study"; // Focus music for cloudy days
    } else if (condition.includes("snow")) {
      return "relax"; // Cozy music for snow
    } else if (temp < 10) {
      return "relax"; // Warm, comforting music for cold days
    }
    return "relax"; // Default
  };

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!user?.id && !user?._id) return;
      
      setLoadingEvents(true);
      try {
        const userId = user.id || user._id;
        const events = await getUserEvents(userId);
        
        // Filter upcoming events (today and future)
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const upcoming = events
          .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= now;
          })
          .slice(0, 5); // Get top 5 upcoming events
        
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (user) {
      fetchUpcomingEvents();
    }
  }, [user]);

  // Fetch recommended playlists based on upcoming events and weather
  useEffect(() => {
    const fetchRecommendedPlaylists = async () => {
      setLoadingPlaylists(true);
      try {
        // Determine mood from upcoming events or weather
        let moodToUse = detectedMood;
        
        if (upcomingEvents.length > 0) {
          // Get the next event's category and map to mood
          const nextEvent = upcomingEvents[0];
          const categoryMoodMap = {
            "Fitness": "workout",
            "Study": "study",
            "Meal": "relax",
            "Relax": "relax",
            "Travel": "morning"
          };
          moodToUse = categoryMoodMap[nextEvent.category] || detectedMood;
        }

        const res = await fetch(
          `http://localhost:5000/api/spotify/playlist?mood=${moodToUse}`
        );
        const data = await res.json();
        
        // Handle both playlists and tracks response
        const playlists = data.playlists || data.tracks || [];
        setRecommendedPlaylists(playlists.slice(0, 4)); // Get top 4 playlists
      } catch (error) {
        console.error("Error fetching recommended playlists:", error);
      } finally {
        setLoadingPlaylists(false);
      }
    };

    if (detectedMood && !loadingEvents) {
      fetchRecommendedPlaylists();
    }
  }, [detectedMood, upcomingEvents, loadingEvents]);

  // Format event date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate.getTime() === today.getTime()) {
      return "Today";
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (eventDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      "Fitness": "danger",
      "Study": "primary",
      "Meal": "success",
      "Relax": "info",
      "Travel": "warning"
    };
    return colors[category] || "secondary";
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Container className="main mt-4 pb-5">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2">{greeting} {user?.username || user?.name || "User"} 👋</h1>
              <p className="lead mb-1">{currentTime}</p>
              <p className="text-muted mb-0">{currentDate}</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <ThemeToggle />
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Weather and Mood Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="weather-card shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <span className="me-2">🌤️</span> Current Weather
              </Card.Title>
              {loadingWeather ? (
                <Spinner animation="border" size="sm" />
              ) : weather ? (
                <div>
                  <div className="d-flex align-items-center mb-2">
                    {weather.icon && (
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                        alt={weather.desc}
                        className="me-2"
                        style={{ width: '50px', height: '50px' }}
                      />
                    )}
                    <div>
                      <h4 className="mb-0">{weather.temp}°C</h4>
                      <small className="text-muted">{weather.desc}</small>
                    </div>
                  </div>
                  <p className="mb-0"><strong>{weather.city}</strong></p>
                </div>
              ) : (
                <Card.Text>Unable to fetch weather</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mood-card shadow-sm">
            <Card.Body>
              <Card.Title>
                <span className="me-2">🎵</span> Detected Mood
              </Card.Title>
              <div>
                <Badge bg="primary" className="p-2 mb-2" style={{ fontSize: '1rem' }}>
                  {detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)}
                </Badge>
                <p className="text-muted mb-0 small">
                  Based on weather and your schedule
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Events Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <span className="me-2">📅</span> Upcoming Events
                </Card.Title>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => navigate("/scheduler")}
                  >
                    View Calendar
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate("/scheduler")}
                  >
                    Add Event
                  </Button>
                </div>
              </div>
              
              {loadingEvents ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="events-list">
                  {upcomingEvents.map((event, index) => (
                    <div key={event._id || index} className="event-item p-3 mb-2 border rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{event.title}</h5>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge bg={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            <small className="text-muted">
                              {formatEventDate(event.date)}
                              {event.startTime && ` • ${event.startTime}`}
                            </small>
                          </div>
                          {event.description && (
                            <p className="text-muted small mb-0">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No upcoming events 🎉</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/scheduler")}
                  >
                    Schedule Your First Event
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recommended Playlists Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <span className="me-2">🎧</span> Recommended Playlists
                </Card.Title>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate("/playlist")}
                >
                  Explore More
                </Button>
              </div>
              
              {loadingPlaylists ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : recommendedPlaylists.length > 0 ? (
                <Row>
                  {recommendedPlaylists.map((playlist, index) => (
                    <Col md={3} sm={6} key={playlist.id || playlist.url || index} className="mb-3">
                      <div 
                        className="playlist-card-home cursor-pointer"
                        onClick={() => window.open(playlist.url, '_blank')}
                      >
                        <img 
                          src={playlist.image || "https://via.placeholder.com/200"} 
                          alt={playlist.name}
                          className="playlist-img-home"
                        />
                        <div className="playlist-info-home mt-2">
                          <h6 className="mb-1">{playlist.name}</h6>
                          <p className="text-muted small mb-0">
                            {playlist.owner || playlist.artist || "Spotify"}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No playlists available</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/playlist")}
                  >
                    Browse Playlists
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">
                <span className="me-2">⚡</span> Quick Actions
              </Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => navigate("/scheduler")}
                >
                  📅 View Schedule
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => navigate("/playlist")}
                >
                  🎵 Browse Playlists
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => navigate("/scheduler")}
                >
                  ➕ Add New Event
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeDashboard;
