import React, { useState } from 'react';
import { signupUser } from '../api/authApi';
import '../css/index.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form with data:', formData);
      // const result = await signupUser(formData);
      // setMessage('Signup successful! You can now log in.');
      // console.log(result);
    } catch (error) {
      setMessage(error.error || 'Signup failed!');
    }
  };

  return (
     <div class="form-container">
    <h2>Signup</h2>
    <form id="signupForm" method="post" onSubmit={handleSubmit}>
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required/>
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="name@example.com" required/>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required/>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required/>
      </div>

      <button type="submit" class="btn-submit">Signup</button>
    </form>

    <div class="form-footer">
      Already have an account? <a href="/login.html">Login</a>
    </div>
  </div>
  );
};

export default Signup;
