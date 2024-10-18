import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GamesGrid.css"; // Add CSS styling for grid if necessary

const GameGrid = ({
  columns = 4, // Default to 4 columns, can be adjusted via props
  imageWidth = 200,
  imageHeight = 100,
}) => {
  const [games, setGames] = useState([]);
  const { gameTypeId } = useParams(); // Get the selected gameTypeId from URL
  const navigate = useNavigate();

  // Fetch games based on selected game type
  useEffect(() => {
    if (gameTypeId) {
      fetch(`http://localhost:8001/api/games/?game_type=${gameTypeId}`)
        .then((response) => response.json())
        .then((data) => setGames(data))
        .catch((error) => console.error("Error fetching games:", error));
    }
  }, [gameTypeId]);

  // Handle clicking on a game image to navigate to the game's route
  const handleImageClick = (gameRoutePath) => {
    if (gameRoutePath) {
      navigate(gameRoutePath); // Navigate to the game's specific route path
    } else {
      console.error("Game route path is undefined!");
    }
  };

  return (
    <div
      className="game-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "20px",
      }}
    >
      {games.map((game) => (
        <div key={game.game_id} className="game-item">
          <img
            src={`http://localhost:8001${game.game_image}`}
            alt={game.game_name}
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(game.game_route_path)} // Navigate on click
          />
          <p>{game.game_name}</p>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
