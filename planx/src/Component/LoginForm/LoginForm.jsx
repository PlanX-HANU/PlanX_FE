import React, { useState } from 'react';
import { FaUser, FaLock, FaKey } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const validateEmail = (email) => {
    if (email.length < 4) {
      return "Email must be at least 4 characters";
    } else if (!email.includes('@')) {
      return "Email must contain '@'";
    } 
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
  
    if (!emailErr && !passwordErr) {
      try {
        const response = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
  
        if (!response.ok) {
          console.log(email)
          throw new Error("Login failed!");
        }
  
        const data = await response.json();
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("firstAccessToken", data.firstAccessToken);
  
        setIsLoggedIn(true);
        alert("Login successful!");
      } catch (error) {
        console.error("Login error:", error);
        alert("Login error: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("firstAccessToken");
    setIsLoggedIn(false);
    alert("Bạn đã đăng xuất!");
  };

  return (
    <div className="body">
      <div className="wrapper">
        {isLoggedIn ? (
          <div>
            <h1>Welcome!</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>Account Management</h1>
            <div className="input-box">
              <input
                type="text"
                className="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <FaUser className="icon" />
            </div>
            {emailError && <p className="error">{emailError}</p>}
            <div className="input-box">
              <input
                type="password"
                className="text"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <FaLock className="icon" />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}

      

            <div className="remember-forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
