import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner,Button } from "react-bootstrap";
import '../css/home.css';
import { useNavigate } from "react-router-dom";


const HomeDashboard = () => {
  const navigate = useNavigate(); 
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  //Session check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      navigate("/login");
    }else{
      console.log("User session found:",user);
    }
  },[navigate]);

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
          const API_KEY = "1a475d5d92a5d54b07ab3e2f1463fa26"; // Replace with your OpenWeather API key

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await res.json();
          setWeather({
            temp: Math.round(data.main.temp),
            desc: data.weather[0].description,
            city: data.name,
          });
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

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };


  return (
    <Container className="main mt-4">
      {/* Greeting, Time, Date */}
      <Row className="mb-4">
        <Col>
          <h1>{greeting} 👋</h1>
          <p className="lead">{currentTime}</p>
          <p className="text-muted">{currentDate}</p>
           <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {/* Weather Card */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Current Weather</Card.Title>
              {loadingWeather ? (
                <Spinner animation="border" size="sm" />
              ) : weather ? (
                <Card.Text>
                  {weather.city} | {weather.temp}°C | {weather.desc}
                </Card.Text>
              ) : (
                <Card.Text>Unable to fetch weather</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Today's Events Section */}
<Row className="mt-4">
  <Col md={4}>
    <Card>
      <Card.Body className="d-flex justify-content-between align-items-start">
        {/* <div>
          <Card.Title>Today's Schedule</Card.Title>
          {todayEvents.length > 0 ? (
            <ul className="list-group list-group-flush mt-2">
              {todayEvents.map((event, index) => (
                <li key={index} className="list-group-item p-2">
                  <strong>{event.title}</strong> <br />
                  <small>{event.date}</small>
                </li>
              ))}
            </ul>
          ) : (
            <Card.Text className="mt-2">No events for today 🎉</Card.Text>
          )}
        </div>

        {/* Button on the right side */}
        {/* {todayEvents.length === 0 && ( */} 
          <button
            className="btn btn-primary btn-sm ms-3"
            onClick={() => navigate("/Scheduler")} // change based on your routing
          >
            Add Event
          </button>

          <button
            className="btn btn-primary btn-sm ms-3"
            onClick={() => navigate("/Playlist")} // change based on your routing
          >
            Explore Playlist
          </button>
         {/* )} */}
      </Card.Body>
    </Card>
  </Col>
  
</Row>

    </Container>
  );
};

export default HomeDashboard;
