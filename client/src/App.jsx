import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Landing from "./Pages/Landing.jsx";
import StudentDashboard from "./Pages/StudentDashboard.jsx";
import MentorDashboard from "./Pages/MentorDashboard.jsx";
import Register from "./Pages/Register.jsx";
import Profile from "./Pages/Profile.jsx";
import Login from "./Pages/Login.jsx";
import AppNavbar from "./components/AppNavbar";

export default function App() {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  // After login/register, redirect to home
  const handleLogin = (userObj) => {
    setUser(userObj);
    setRole(userObj.role);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("role", userObj.role);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    setRole("");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <AppNavbar user={user} role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route
          path="/login"
          element={<Login setUser={handleLogin} setRole={setRole} />}
        />
        <Route
          path="/register"
          element={<Register setUser={handleLogin} setRole={setRole} />}
        />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </>
  );
}
