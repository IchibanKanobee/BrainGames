import React, { useState } from "react";
import axios from "axios";
import GameTypeManager from "./GameTypeManager";
import "./AddGameForm.css";

const AddGameForm = () => {
  const [gameName, setGameName] = useState("");
  const [gameLevel, setGameLevel] = useState(1);
  const [gameDescription, setGameDescription] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [gameTypes, setGameTypes] = useState([]);
  const [showGameTypeList, setShowGameTypeList] = useState(false); // Control visibility of the game type list

  const handleGameTypeChange = (selectedGameTypes) => {
    setGameTypes(selectedGameTypes);
  };

  const handleImageChange = (e) => {
    setGameImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("game_name", gameName);
    formData.append("game_level", gameLevel);
    formData.append("game_description", gameDescription);
    formData.append("game_image", gameImage);
    formData.append(
      "game_types",
      JSON.stringify(gameTypes.map((gt) => gt.game_type_id))
    );

    axios
      .post("http://localhost:8001/api/games/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Game added successfully:", response.data);
        // Clear the form after successful submission
        setGameName("");
        setGameLevel(1);
        setGameDescription("");
        setGameImage(null);
        setGameTypes([]);
      })
      .catch((error) => {
        console.error("Error adding game:", error);
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
        <label>Game Level</label>
        <input
          type="number"
          value={gameLevel}
          onChange={(e) => setGameLevel(e.target.value)}
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
        showGameTypeList={true}
        setShowGameTypeList={setShowGameTypeList}
      />

      <button type="submit">Add Game</button>
    </form>
  );
};

export default AddGameForm;
