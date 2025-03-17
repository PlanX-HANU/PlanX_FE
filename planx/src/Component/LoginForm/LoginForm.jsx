import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const validateEmail = (email) => {
    if (email.length < 4) return "Email must be at least 4 characters";
    if (!email.includes('@')) return "Email must contain '@'";
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = password.length < 6 ? "Password must be at least 6 characters" : "";
    setEmailError(emailErr);
    setPasswordError(passwordErr);
  
    if (!emailErr && !passwordErr) {
      try {
        const response = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "Email does not exist") {
            setEmailError("Email does not exist in the system");
          } else if (data.error === "Incorrect password") {
            setPasswordError("Password is incorrect");
          } else {
            alert("Login failed!");
          }
          return;
        }

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

  // Xử lý gửi yêu cầu quên mật khẩu
  const handleResetPassword = async () => {
    const emailErr = validateEmail(resetEmail);
    setResetMessage('');
    if (emailErr) {
      setResetMessage(emailErr);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        setResetMessage(data.error || "Something went wrong!");
        return;
      }

      setResetMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setResetMessage("Error: " + error.message);
    }
  };

  return (
    <div className="body">
      <div className="wrapper">
        {isLoggedIn ? (
          <div>
            <h1>Welcome!</h1>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
        ) : showResetPassword ? (
          // Giao diện nhập email để đặt lại mật khẩu
          <div className="reset-password">
            <h2>Reset Password</h2>
            <input
              type="text"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Confirm</button>
            {resetMessage && <p className="message">{resetMessage}</p>}
            <button onClick={() => setShowResetPassword(false)}>Back to Login</button>
          </div>
        ) : (
          // Giao diện đăng nhập
          <form onSubmit={handleSubmit}>
            <h1>Plan X</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </div>
            {emailError && <p className="error">{emailError}</p>}
            
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}

            <div className="remember-forgot">
            <a href="#" onClick={() => navigate("/forget-password")}>Forgot password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
