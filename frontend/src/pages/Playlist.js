// src/pages/Playlist.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge, Tabs, Tab, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlaylistCard from "./Components/playlistCard.js";
import MoodFilter from "./Components/moodFilter.js";
import { getUserEvents } from "../api/eventApi";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import "../css/playlist.css";

const Playlist = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [mood, setMood] = useState("relax");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("playlists");
  const [weather, setWeather] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [detectedMood, setDetectedMood] = useState("relax");
  const [user, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Fetch weather and determine mood
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
          
          // Determine mood from weather
          const weatherMood = getMoodFromWeather(weatherData);
          setDetectedMood(weatherMood);
          setMood(weatherMood); // Set as default mood
        } catch (err) {
          console.error("Weather fetch error:", err);
        }
      });
    }
  }, []);

  // Function to determine mood from weather
  const getMoodFromWeather = (weatherData) => {
    const condition = weatherData.condition.toLowerCase();
    const temp = weatherData.temp;
    
    if (condition.includes("rain") || condition.includes("drizzle")) {
      return "relax";
    } else if (condition.includes("sun") || condition.includes("clear")) {
      if (temp > 25) return "morning";
      return "relax";
    } else if (condition.includes("cloud")) {
      return "study";
    } else if (condition.includes("snow")) {
      return "relax";
    } else if (temp < 10) {
      return "relax";
    }
    return "relax";
  };

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!user?.id && !user?._id) return;
      
      try {
        const userId = user.id || user._id;
        const events = await getUserEvents(userId);
        
        // Filter upcoming events
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const upcoming = events
          .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= now;
          })
          .slice(0, 3); // Get top 3 upcoming events
        
        setUpcomingEvents(upcoming);

        // If we have upcoming events, determine mood from the next event
        if (upcoming.length > 0) {
          const nextEvent = upcoming[0];
          const categoryMoodMap = {
            "Fitness": "workout",
            "Study": "study",
            "Meal": "relax",
            "Relax": "relax",
            "Travel": "morning"
          };
          const eventMood = categoryMoodMap[nextEvent.category] || detectedMood;
          setDetectedMood(eventMood);
          setMood(eventMood); // Update mood based on event
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (user) {
      fetchUpcomingEvents();
    }
  }, [user, detectedMood]);

  // Fetch all content based on mood
  useEffect(() => {
    if (mood) {
      fetchAllContent(mood);
    }
  }, [mood]);

  const fetchAllContent = async (selectedMood) => {
    setLoading(true);
    try {
      // Fetch all content types in parallel
      const [playlistsRes, albumsRes, artistsRes, podcastsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/spotify/playlist?mood=${selectedMood}`),
        fetch(`http://localhost:5000/api/spotify/albums?mood=${selectedMood}`),
        fetch(`http://localhost:5000/api/spotify/artists?mood=${selectedMood}`),
        fetch(`http://localhost:5000/api/spotify/podcasts?mood=${selectedMood}`)
      ]);

      const [playlistsData, albumsData, artistsData, podcastsData] = await Promise.all([
        playlistsRes.json(),
        albumsRes.json(),
        artistsRes.json(),
        podcastsRes.json()
      ]);

      setPlaylists(playlistsData.playlists || []);
      setAlbums(albumsData.albums || []);
      setArtists(artistsData.artists || []);
      setPodcasts(podcastsData.podcasts || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render content cards based on type
  const renderContentCard = (item, type) => {
    const commonProps = {
      className: "content-card",
      onClick: () => window.open(item.url, '_blank'),
      style: { cursor: 'pointer' }
    };

    switch (type) {
      case 'playlist':
        return (
          <Col md={3} sm={6} key={item.id || item.url} className="mb-4">
            <Card {...commonProps} className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={item.image || "https://via.placeholder.com/200"} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-truncate" style={{ fontSize: '0.95rem' }}>
                  {item.name}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {item.owner || item.artist || "Spotify"}
                </Card.Text>
                {item.description && (
                  <Card.Text className="small text-truncate">
                    {item.description}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        );

      case 'album':
        return (
          <Col md={3} sm={6} key={item.id || item.url} className="mb-4">
            <Card {...commonProps} className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={item.image || "https://via.placeholder.com/200"} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-truncate" style={{ fontSize: '0.95rem' }}>
                  {item.name}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {item.artist}
                </Card.Text>
                <div className="d-flex gap-2 mt-2">
                  <Badge bg="secondary">{item.albumType}</Badge>
                  {item.totalTracks && (
                    <Badge bg="info">{item.totalTracks} tracks</Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );

      case 'artist':
        return (
          <Col md={3} sm={6} key={item.id || item.url} className="mb-4">
            <Card {...commonProps} className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={item.image || "https://via.placeholder.com/200"} 
                style={{ height: '200px', objectFit: 'cover', borderRadius: '50%' }}
                className="mx-auto mt-3"
              />
              <Card.Body>
                <Card.Title className="text-center" style={{ fontSize: '0.95rem' }}>
                  {item.name}
                </Card.Title>
                <div className="text-center">
                  {item.followers > 0 && (
                    <Card.Text className="text-muted small">
                      {item.followers.toLocaleString()} followers
                    </Card.Text>
                  )}
                  {item.genres && item.genres.length > 0 && (
                    <div className="mt-2">
                      {item.genres.slice(0, 2).map((genre, idx) => (
                        <Badge key={idx} bg="primary" className="me-1">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );

      case 'podcast':
        return (
          <Col md={3} sm={6} key={item.id || item.url} className="mb-4">
            <Card {...commonProps} className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={item.image || "https://via.placeholder.com/200"} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-truncate" style={{ fontSize: '0.95rem' }}>
                  {item.name}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {item.publisher || "Unknown Publisher"}
                </Card.Text>
                {item.description && (
                  <Card.Text className="small text-truncate">
                    {item.description}
                  </Card.Text>
                )}
                {item.totalEpisodes > 0 && (
                  <Badge bg="success" className="mt-2">
                    {item.totalEpisodes} episodes
                  </Badge>
                )}
              </Card.Body>
            </Card>
          </Col>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="playlist-page py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="mb-2">🎧 Your AI Music Discovery</h1>
              <p className="subtitle mb-0">
                Curated playlists, albums, artists, and podcasts based on your mood, weather, and schedule
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-light" onClick={() => navigate("/")}>
                🏠 Home
              </Button>
              <Button variant="outline-light" onClick={() => navigate("/scheduler")}>
                📅 Schedule
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </Col>
      </Row>

      {/* Weather and Mood Info */}
      {(weather || upcomingEvents.length > 0) && (
        <Row className="mb-4">
          <Col md={6}>
            {weather && (
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    {weather.icon && (
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                        alt={weather.desc}
                        style={{ width: '60px', height: '60px' }}
                        className="me-3"
                      />
                    )}
                    <div>
                      <Card.Title className="mb-1" style={{ fontSize: '1.1rem' }}>
                        {weather.city} • {weather.temp}°C
                      </Card.Title>
                      <Card.Text className="text-muted small mb-0">
                        {weather.desc}
                      </Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={6}>
            {upcomingEvents.length > 0 && (
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title style={{ fontSize: '1rem' }}>📅 Next Event</Card.Title>
                  <Card.Text className="mb-1">
                    <strong>{upcomingEvents[0].title}</strong>
                  </Card.Text>
                  <Badge bg="primary">{upcomingEvents[0].category}</Badge>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      )}

      {/* Detected Mood Display */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="mb-2">Current Mood</Card.Title>
                  <Badge bg="primary" style={{ fontSize: '1.2rem', padding: '8px 16px' }}>
                    {detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)}
                  </Badge>
                  <p className="text-muted small mt-2 mb-0">
                    {weather && "Based on weather"}
                    {weather && upcomingEvents.length > 0 && " and "}
                    {upcomingEvents.length > 0 && "your upcoming events"}
                    {!weather && upcomingEvents.length === 0 && "Default selection"}
                  </p>
                </div>
                <MoodFilter selectedMood={mood} onMoodChange={setMood} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different content types */}
      <Row>
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            fill
          >
            <Tab eventKey="playlists" title={`🎵 Playlists (${playlists.length})`}>
              <Row className="mt-3">
                {loading ? (
                  <Col className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading playlists...</p>
                  </Col>
                ) : playlists.length > 0 ? (
                  playlists.map(item => renderContentCard(item, 'playlist'))
                ) : (
                  <Col className="text-center py-5">
                    <p className="text-muted">No playlists found</p>
                  </Col>
                )}
              </Row>
            </Tab>

            <Tab eventKey="albums" title={`💿 Albums (${albums.length})`}>
              <Row className="mt-3">
                {loading ? (
                  <Col className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading albums...</p>
                  </Col>
                ) : albums.length > 0 ? (
                  albums.map(item => renderContentCard(item, 'album'))
                ) : (
                  <Col className="text-center py-5">
                    <p className="text-muted">No albums found</p>
                  </Col>
                )}
              </Row>
            </Tab>

            <Tab eventKey="artists" title={`🎤 Artists (${artists.length})`}>
              <Row className="mt-3">
                {loading ? (
                  <Col className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading artists...</p>
                  </Col>
                ) : artists.length > 0 ? (
                  artists.map(item => renderContentCard(item, 'artist'))
                ) : (
                  <Col className="text-center py-5">
                    <p className="text-muted">No artists found</p>
                  </Col>
                )}
              </Row>
            </Tab>

            <Tab eventKey="podcasts" title={`🎙️ Podcasts (${podcasts.length})`}>
              <Row className="mt-3">
                {loading ? (
                  <Col className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading podcasts...</p>
                  </Col>
                ) : podcasts.length > 0 ? (
                  podcasts.map(item => renderContentCard(item, 'podcast'))
                ) : (
                  <Col className="text-center py-5">
                    <p className="text-muted">No podcasts found</p>
                  </Col>
                )}
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Playlist;
