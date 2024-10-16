import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLoggedInUserString } from "./utils.js";
import "../styles/colors.css";
import "./GameTypeManager.css";

const GameTypeManager = (props) => {
  const [allGameTypes, setAllGameTypes] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("");
  const [currentGameTypes, setCurrentGameTypes] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(getLoggedInUserString());

    axios
      .get("http://localhost:8001/api/game-types/", {
        params: {
          user: currentUser?.id,
        },
      })
      .then((response) => {
        const gameTypes = response.data;
        setAllGameTypes(gameTypes);
      })
      .catch((error) => {
        console.error("There was an error fetching the game types:", error);
      });
  }, []);

  useEffect(() => {
    if (props.currentGameTypes && allGameTypes.length) {
      setCurrentGameTypes(props.currentGameTypes);
    }
  }, [props.currentGameTypes, allGameTypes]);

  useEffect(() => {
    if (props.currentGameTypes) {
      setCurrentGameTypes(props.currentGameTypes);
    }
  }, [currentGameTypes]);

  useEffect(() => {
    if (props.clearGameTypes) {
      setCurrentGameTypes([]);
    }
  }, [props.clearGameTypes]);

  const addGameType = (gameTypeId) => {
    const isAlreadyCurrent = currentGameTypes.some(
      (gameType) => gameType.game_type_id === gameTypeId
    );

    if (isAlreadyCurrent) {
      return;
    }

    if (gameTypeId) {
      const selectedGameTypeObject = allGameTypes.find(
        (gameType) => gameType.game_type_id === parseInt(gameTypeId, 10)
      );

      let updatedGameTypes = [...currentGameTypes];

      updatedGameTypes.push(selectedGameTypeObject);
      setCurrentGameTypes(updatedGameTypes);
      setSelectedGameType("");

      if (props.onGameTypesChange) {
        props.onGameTypesChange(updatedGameTypes);
      }

      props.setShowGameTypeList(true);
    }
  };

  const removeGameType = (gameTypeToRemove) => {
    const newGameTypes = currentGameTypes.filter(
      (gameType) => gameType.game_type_id !== gameTypeToRemove.game_type_id
    );
    setCurrentGameTypes(newGameTypes);
    if (props.onGameTypesChange) {
      props.onGameTypesChange(newGameTypes);
    }
  };

  return (
    <div className="GameType-manager-container">
      <select
        className="GameType-dropdown"
        value={selectedGameType}
        onChange={(e) => {
          const gameTypeId = e.target.value;
          setSelectedGameType(gameTypeId);
          addGameType(gameTypeId);
        }}
      >
        <option value="" disabled>
          Select GameTypes
        </option>
        {allGameTypes.map((gameType) => {
          const isDisabled = currentGameTypes.some(
            (currentGameType) =>
              currentGameType.game_type_id === gameType.game_type_id
          );

          return (
            <option
              key={gameType.game_type_id}
              value={gameType.game_type_id}
              disabled={isDisabled}
            >
              {gameType.game_type_name}{" "}
              {/* Updated to display game_type_name */}
            </option>
          );
        })}
      </select>

      {props.showGameTypeList && (
        <div className="GameType-list">
          {currentGameTypes.map((gameType, index) => (
            <div key={index} className="GameType-item">
              {gameType.game_type_name}{" "}
              {/* Updated to display game_type_name */}
              <span
                className="remove-GameType"
                onClick={() => removeGameType(gameType)}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameTypeManager;
