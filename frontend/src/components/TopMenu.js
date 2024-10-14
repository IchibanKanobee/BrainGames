import React, { useState } from "react";
import Auth from "./Auth"; // Import your Auth component
import { useNavigate } from "react-router-dom";
import homeImage from "../images/home.png";

import "./TopMenu.css"; // Import the CSS for styling

const TopMenu = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    //  navigate("/home");
  };

  return (
    <div className="top-menu">
      <button onClick={handleHomeClick} className="menu-button">
        <img src={homeImage} alt="Home" />
      </button>
      <div className="menu-right">
        <Auth currentUser={currentUser} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default TopMenu;
