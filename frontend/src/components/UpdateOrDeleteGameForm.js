import React, { useState, useEffect } from "react";
import axios from "axios";
import GameTypeManager from "./GameTypeManager";
import "./UpdateOrDeleteGameForm.css";

const UpdateOrDeleteGameForm = () => {
  const [games, setGames] = useState([]); // Stores list of games fetched from API
  const [selectedGame, setSelectedGame] = useState(null); // Stores the currently selected game
  const [gameName, setGameName] = useState("");
  const [gameComplexity, setGameComplexity] = useState(1);
  const [gameDescription, setGameDescription] = useState("");
  const [gameRoutePath, setGameRoutePath] = useState("");
  const [gameImage, setGameImage] = useState(null); // Stores the file selected by user
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // Stores the URL of the current image
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // Stores the preview URL for new selected image
  const [gameTypes, setGameTypes] = useState([]);
  const [showGameTypeList, setShowGameTypeList] = useState(true); // Control visibility of the tag list

  // Function to fetch games from the API
  const fetchGames = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/games/");
      setGames(response.data); // Set the list of games
    } catch (error) {
      console.error("Error fetching games", error);
    }
  };

  // Fetch all games on component mount using fetchGames function
  useEffect(() => {
    fetchGames();
  }, []);

  // When a game is selected, populate the form with its details
  const handleGameSelect = (e) => {
    const selectedGame = games.find(
      (game) => game.game_id === parseInt(e.target.value)
    );
    setSelectedGame(selectedGame);
    setGameName(selectedGame.game_name);
    setGameComplexity(selectedGame.game_complexity);
    setGameDescription(selectedGame.game_description);
    setGameRoutePath(selectedGame.game_route_path);
    setGameTypes(selectedGame.game_types); // Assuming game_types are available in the response
    setCurrentImageUrl(selectedGame.game_image); // Set current image URL
    setGameImage(null); // Reset selected image file
    setImagePreviewUrl(""); // Clear the image preview
  };

  // Handle image file selection and create preview URL for new image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setGameImage(file);

    // Create a URL for the new selected image to preview it
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    } else {
      setImagePreviewUrl(""); // Clear preview if no image is selected
    }
  };

  const handleGameTypeChange = (selectedGameTypes) => {
    setGameTypes(selectedGameTypes);
  };

  // Update the selected game
  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("game_name", gameName);
    formData.append("game_complexity", gameComplexity);
    formData.append("game_description", gameDescription);
    formData.append("game_route_path", gameRoutePath);
    formData.append(
      "game_types",
      JSON.stringify(gameTypes.map((gt) => parseInt(gt.game_type_id, 10)))
    );

    if (gameImage) {
      formData.append("game_image", gameImage);
    }

    axios
      .put(
        `http://localhost:8001/api/games/${selectedGame.game_id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Game updated successfully:", response.data);
        alert("Game updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating game:", error);
        alert("Error updating game:", error);
      });
  };

  // Delete the selected game
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8001/api/games/${selectedGame.game_id}/delete/`)
      .then(() => {
        alert("Game deleted successfully!");
        // Reset the form after deletion
        setSelectedGame(null);
        setGameName("");
        setGameComplexity(1);
        setGameDescription("");
        setGameRoutePath("");
        setGameTypes([]);
        setGameImage(null);
        setCurrentImageUrl(""); // Reset current image
        setImagePreviewUrl(""); // Clear the preview
      })
      .catch((error) => {
        console.error("Error deleting game:", error);
        alert("Error deleting game:", error);
      });
  };

  return (
    <form onSubmit={handleUpdate} className="update-delete-game-form">
      <div className="form-group">
        <label>Select Game</label>
        <select
          onChange={handleGameSelect}
          value={selectedGame ? selectedGame.game_id : ""}
        >
          <option value="">-- Select a Game --</option>
          {games.map((game) => (
            <option key={game.game_id} value={game.game_id}>
              {game.game_name}
            </option>
          ))}
        </select>
      </div>

      {selectedGame && (
        <>
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

            {/* Display the image preview below the file input */}
            <div className="image-preview">
              {/* Show current image thumbnail if available and no new image is selected */}
              {currentImageUrl && !imagePreviewUrl && (
                <>
                  <p>Current Image:</p>
                  <img
                    src={`http://localhost:8001${currentImageUrl}`}
                    alt="Current Game Thumbnail"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </>
              )}
              {/* Show selected new image preview if a new file is selected */}
              {imagePreviewUrl && (
                <>
                  <p>Selected Image:</p>
                  <img
                    src={imagePreviewUrl}
                    alt="Selected Game Thumbnail"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </>
              )}
            </div>
          </div>

          <GameTypeManager
            currentGameTypes={gameTypes}
            onGameTypesChange={handleGameTypeChange}
            showGameTypeList={true}
            setShowGameTypeList={setShowGameTypeList}
          />

          <div className="form-group">
            <button type="submit">Update Game</button>
            <button
              type="button"
              onClick={handleDelete}
              style={{ marginLeft: "10px" }}
            >
              Delete Game
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default UpdateOrDeleteGameForm;
