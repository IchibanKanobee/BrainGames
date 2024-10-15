// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import GameTypesGrid from "./GameTypesGrid"; // Adjust the path based on your folder structure

const Home = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <h1>Game Types</h1>
      {/* Rendering GameTypesGrid as the only component */}
      <GameTypesGrid />
    </div>
  );
};

export default Home;
