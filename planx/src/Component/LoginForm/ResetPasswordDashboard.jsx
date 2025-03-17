import React, { useState } from "react";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
          setError("Please enter your email.");
          return;
      }
      if (!validateEmail(email)) {
          setError("Invalid email format. Please enter a valid email.");
          return;
      }
  
      try {
          const response = await fetch("/forgetPassowrd", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email })
          });
          const data = await response.json();
  
          if (!data.exists) {
              setError("Email does not exist in our system.");
              return;
          }
          
          setError("");
          alert("Your request has been sent!");
      } catch (error) {
          setError("An error occurred. Please try again.");
      }
  };
  

    return (
        <div className="body">
            <div className="forgot-password-wrapper">
                <h2>Forgot Password?</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Reset Password</button>
                    <button type="button" onClick={() => window.location.href = './Login'}>Home</button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
