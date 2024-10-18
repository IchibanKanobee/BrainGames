import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddGameForm from "./components/AddGameForm";
import UpdateOrDeleteGameForm from "./components/UpdateOrDeleteGameForm";
import AddGameTypeForm from "./components/AddGameTypeForm";
import UpdateOrDeleteGameTypeForm from "./components/UpdateOrDeleteGameTypeForm.js";
import TopMenu from "./components/TopMenu";
import { getLoggedInUserString } from "./components/utils.js";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import GamesGrid from "./components/GamesGrid";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch current user data, if logged in
    const loggedInUser = getLoggedInUserString(); // Implement this function to fetch user data
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (token, newUser) => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    localStorage.setItem("authToken", token);
    const newUserString = JSON.stringify(newUser).replace(/\n/g, "");
    localStorage.setItem("user", JSON.stringify(newUserString));

    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <div className="App">
        <TopMenu currentUser={currentUser} onLogout={handleLogout} />
        <Routes>
          {/* Define the route for the AddGameTypeForm */}
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login currentUser={currentUser} onLogin={handleLogin} />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/add-game" element={<AddGameForm />} />
          <Route path="/add-game-type" element={<AddGameTypeForm />} />
          <Route
            path="/update-game-type"
            element={<UpdateOrDeleteGameTypeForm />}
          />
          <Route path="/update-game" element={<UpdateOrDeleteGameForm />} />
          <Route path="/game-types/:gameTypeId" element={<GamesGrid />} />

          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
