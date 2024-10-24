import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/colors.css";
import "./Auth.css";
import userImage from "../images/user.png";

const Auth = ({ currentUser, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (!currentUser) {
      navigate("/login"); // Navigate to the login page if not logged in
    } else {
      setDropdownOpen(!dropdownOpen); // Toggle dropdown if logged in
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout(); // Call the logout function passed as a prop
    navigate("/login");
  };

  return (
    <div className="auth">
      <button
        className={`auth-button ${currentUser ? "logged-in" : "logged-out"}`}
        onClick={handleButtonClick}
      >
        {currentUser && <span>{currentUser.username}</span>}
      </button>
      {dropdownOpen && (
        <div className="dropdown-auth">
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
