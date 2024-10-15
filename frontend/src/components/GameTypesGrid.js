import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GameTypesGrid.css"; // Add styling here if necessary

const GameTypesGrid = ({
  columns = 5,
  imageWidth = 200,
  imageHeight = 100,
}) => {
  const [gameTypes, setGameTypes] = useState([]);
  const navigate = useNavigate();

  // Fetch game types from API
  useEffect(() => {
    fetch("http://localhost:8001/api/game-types/")
      .then((response) => response.json())
      .then((data) => setGameTypes(data))
      .catch((error) => console.error("Error fetching game types:", error));
  }, []);

  // Handle clicking on an image
  const handleImageClick = (gameTypeId) => {
    navigate(`/game-types/${gameTypeId}`); // Define the URL logic later
  };

  return (
    <div
      className="game-types-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "20px",
      }}
    >
      {gameTypes.map((gameType) => (
        <div key={gameType.id} className="game-type-item">
          <img
            src={`http://localhost:8001${gameType.game_type_image}`}
            alt={gameType.game_type_name}
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(gameType.id)}
          />
          <p>{gameType.game_type_name}</p>
        </div>
      ))}
    </div>
  );
};

export default GameTypesGrid;
