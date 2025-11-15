import { use, useState } from "react";
import "../css/login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Checking...");
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('data: ', data);
      if (response.ok) {
        setMessage("✅ Login Successful");
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User:", data.user);
        //session management
           window.location.href = "/ ";
        // later we will store token in localStorage
      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    // <div style={{ margin: "30px" }}>
    //   <h2>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Enter Email"
    //       onChange={handleChange}
    //       value={formData.email}
    //     /><br /><br />
        
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Enter Password"
    //       onChange={handleChange}
    //       value={formData.password}
    //     /><br /><br />

    //     <button type="submit">Login</button>
    //   </form>

    //   <p>{message}</p>
    // </div>

    <div className="login-page">
<div class="form-container">
    <h2>Login</h2>
    <form id="loginForm" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="name@example.com" 
        onChange={handleChange}
          value={formData.email} required />
      </div>

       {/* Password Field  */}
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange}
          value={formData.password} required/>
      </div>

       {/* Submit Button  */}
      <button type="submit" class="btn-submit" >Login</button>
    </form>
       
       {message && <p style={{ marginTop: "10px" }}>{message}</p>}

    <div class="form-footer">
      Don't have an account?  <a href="/signup">Sign up</a>
    </div>
  </div>
    </div>
    
  );
}

export default Login;
