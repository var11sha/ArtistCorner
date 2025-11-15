import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from '../pages/Signup.js';
import Login from '../pages/login.js';
import Home from '../pages/Home.js';
import Scheduler from '../pages/Scheduler.js';
import Playlist from "../pages/Playlist.js";
import "../css/playlist.css";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
