import React, { useState } from "react";
import axios from "axios";
import GameTypeManager from "./GameTypeManager";
import "./AddGameForm.css";

const AddGameForm = () => {
  const [gameName, setGameName] = useState("");
  const [gameComplexity, setGameComplexity] = useState(1);
  const [gameDescription, setGameDescription] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [gameTypes, setGameTypes] = useState([]);
  const [showGameTypeList, setShowGameTypeList] = useState(true); // Control visibility of the game type list

  const handleGameTypeChange = (selectedGameTypes) => {
    setGameTypes(selectedGameTypes);
  };

  const handleImageChange = (e) => {
    setGameImage(e.target.files[0]); // Get the first file from the input
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("game_name", gameName);
    formData.append("game_complexity", gameComplexity);
    formData.append("game_description", gameDescription);
    formData.append("game_image", gameImage);

    // Append selected game types as an array
    gameTypes.forEach((gameType) => {
      formData.append("game_types", gameType.game_type_id);
    });

    axios
      .post("http://localhost:8001/api/add-game/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the request is sent as form data
        },
      })
      .then((response) => {
        console.log("Game added successfully:", response.data);
        // Clear the form after successful submission
        setGameName("");
        setGameComplexity(1);
        setGameDescription("");
        setGameImage(null);
        setGameTypes([]);
        setShowGameTypeList(false);
      })
      .catch((error) => {
        console.error("Error adding game:", error.response?.data || error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="add-game-form">
      <div className="form-group">
        <label>Game Name</label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Game Complexity</label>
        <input
          type="number"
          value={gameComplexity}
          onChange={(e) => setGameComplexity(e.target.value)}
          min="1"
          max="100"
          required
        />
      </div>

      <div className="form-group">
        <label>Game Description</label>
        <textarea
          value={gameDescription}
          onChange={(e) => setGameDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Game Image</label>
        <input type="file" onChange={handleImageChange} />
      </div>

      <GameTypeManager
        currentGameTypes={gameTypes}
        onGameTypesChange={handleGameTypeChange}
        showGameTypeList={showGameTypeList}
        setShowGameTypeList={setShowGameTypeList}
      />

      <button type="submit">Add Game</button>
    </form>
  );
};

export default AddGameForm;
