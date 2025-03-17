import React from "react";
import LoginForm from "./Component/LoginForm/LoginForm";
import'./App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPasswordDashboard from "./Component/LoginForm/ResetPasswordDashboard";
function App() {
  return (
    <Router>
      <Routes>
      <Route element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forget-password" element={<ResetPasswordDashboard/>} />
      </Routes>
    </Router>
  );
}
export default App;