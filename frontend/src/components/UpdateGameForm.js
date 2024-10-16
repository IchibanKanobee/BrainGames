import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateGameForm = ({ gameId }) => {
  const [gameName, setGameName] = useState("");
  const [gameComplexity, setGameComplexity] = useState(1);
  const [gameDescription, setGameDescription] = useState("");
  const [gameRoutePath, setGameRoutePath] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [gameTypes, setGameTypes] = useState([]);

  useEffect(() => {
    // Fetch the existing game details
    axios
      .get(`http://localhost:8001/api/games/${gameId}/`)
      .then((response) => {
        const game = response.data;
        setGameName(game.game_name);
        setGameComplexity(game.game_complexity);
        setGameDescription(game.game_description);
        setGameRoutePath(game.game_route_path);
        // Assume you have a way to set game types
        setGameTypes(game.game_types);
      })
      .catch((error) => {
        console.error("Error fetching game details:", error);
      });
  }, [gameId]);

  const handleImageChange = (e) => {
    setGameImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("game_name", gameName);
    formData.append("game_complexity", gameComplexity);
    formData.append("game_description", gameDescription);
    formData.append("game_route_path", gameRoutePath);
    if (gameImage) {
      formData.append("game_image", gameImage);
    }
    // Assuming gameTypes is an array of IDs
    formData.append(
      "game_types",
      JSON.stringify(gameTypes.map((type) => type.game_type_id))
    );

    axios
      .put(`http://localhost:8001/api/games/${gameId}/update/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Game updated successfully:", response.data);
        // Handle success (e.g., redirect or show a success message)
      })
      .catch((error) => {
        console.error("Error updating game:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Game Name</label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
        />
      </div>

      <div>
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

      <div>
        <label>Game Description</label>
        <textarea
          value={gameDescription}
          onChange={(e) => setGameDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Game Route Path</label>
        <input
          type="text"
          value={gameRoutePath}
          onChange={(e) => setGameRoutePath(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Game Image</label>
        <input type="file" onChange={handleImageChange} />
      </div>

      <button type="submit">Update Game</button>
    </form>
  );
};

export default UpdateGameForm;
