import React, { useState } from "react";
import { signupUser } from "../api/authApi";
import ThemeToggle from "../components/ThemeToggle";
import "../css/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      console.log("Submitting form with data:", formData);
      const result = await signupUser({
        name: formData.fullName, // backend expects username?
        email: formData.email,
        password: formData.password,
        
      });

      setMessage("Signup successful! You can now log in.");
      console.log(result);
       window.location.href = "/login  ";
    } catch (error) {
      setMessage(error.message || "Signup failed!");
    }
  };

  return (
    <div className="sign-up-page">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <ThemeToggle />
      </div>
      <div className="form-container">
      <h2>Signup</h2>
      <form id="signupForm" method="post" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          Signup
        </button>
      </form>

        {message && <p style={{ marginTop: "10px", textAlign: "center", color: message.includes("successful") ? "#28a745" : "#dc3545" }}>{message}</p>}

        <div className="form-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>

  );
};

export default Signup;
