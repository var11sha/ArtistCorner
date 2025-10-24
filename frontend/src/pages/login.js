import { useState } from "react";

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

      if (response.ok) {
        setMessage("✅ Login Successful");
        localStorage.setItem("authToken", data.token);
        console.log("User:", data.user);
        // later we will store token in localStorage
      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          value={formData.email}
        /><br /><br />
        
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          value={formData.password}
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;
