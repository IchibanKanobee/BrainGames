// GamesGrid.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GamesGrid.css"; // Add CSS styling here if necessary

const GamesGrid = ({ columns = 5, imageWidth = 200, imageHeight = 100 }) => {
  const [games, setGames] = useState([]);
  const { gameTypeId } = useParams(); // Retrieve the game type ID from the URL

  // Fetch games of the selected game type from API
  useEffect(() => {
    fetch(`http://localhost:8001/api/games/?game_type_id=${gameTypeId}`)
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error("Error fetching games:", error));
  }, [gameTypeId]);

  return (
    <div
      className="games-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "20px",
      }}
    >
      {games.map((game) => (
        <div key={game.id} className="game-item">
          <img
            src={`http://localhost:8001${game.game_image}`}
            alt={game.game_name}
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              cursor: "pointer",
            }}
          />
          <p>{game.game_name}</p>
        </div>
      ))}
    </div>
  );
};

export default GamesGrid;
