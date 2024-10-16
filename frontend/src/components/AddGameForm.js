import React, { useState } from "react";
import axios from "axios";
import GameTypeManager from "./GameTypeManager";
import "./AddGameForm.css";

const AddGameForm = () => {
  const [gameName, setGameName] = useState("");
  const [gameComplexity, setGameComplexity] = useState(1);
  const [gameDescription, setGameDescription] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [gameImagePreview, setGameImagePreview] = useState(null); // New state for image preview
  const [gameRoutePath, setGameRoutePath] = useState(""); // New state for Route Path
  const [gameTypes, setGameTypes] = useState([]);
  const [showGameTypeList, setShowGameTypeList] = useState(false); // Control visibility of the game type list

  const handleGameTypeChange = (selectedGameTypes) => {
    setGameTypes(selectedGameTypes);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGameImage(file);
      setGameImagePreview(URL.createObjectURL(file)); // Create preview URL
    } else {
      setGameImage(null);
      setGameImagePreview(null); // Reset if no file is selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("game_name", gameName);
    formData.append("game_complexity", gameComplexity);
    formData.append("game_description", gameDescription);
    formData.append("game_route_path", gameRoutePath); // Add the Route Path to form data

    // Append the image file only if an image was selected
    if (gameImage) {
      formData.append("game_image", gameImage);
    }

    const game_types_string = JSON.stringify(gameTypes);
    formData.append("game_types", game_types_string);

    axios
      .post("http://localhost:8001/api/add-game/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Game added successfully:", response.data);
        alert("Game added successfully!");

        // Clear the form after successful submission
        setGameName("");
        setGameComplexity(1);
        setGameDescription("");
        setGameImage(null);
        setGameImagePreview(null); // Reset image preview
        setGameRoutePath(""); // Clear the Route Path field
        setGameTypes([]);
        setShowGameTypeList(false);
      })
      .catch((error) => {
        console.error("Error adding game:", error);
        alert("Error adding game:", error);
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
        <label>Game Route Path</label>
        <input
          type="text"
          value={gameRoutePath}
          onChange={(e) => setGameRoutePath(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Game Image</label>
        <input type="file" onChange={handleImageChange} />
        {gameImagePreview && (
          <img
            src={gameImagePreview}
            alt="Selected Game"
            style={{ width: "200px", marginTop: "10px" }} // Thumbnail size
          />
        )}
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
