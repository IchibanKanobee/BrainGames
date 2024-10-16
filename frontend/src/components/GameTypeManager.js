import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLoggedInUserString } from "./utils.js";
import "./styles/colors.css";
import "./GameTypeManager.css";

const GameTypeManager = (props) => {
  const [allGameTypes, setAllGameTypes] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("");
  const [currentGameTypes, setCurrentGameTypes] = useState([]);

  useEffect(() => {
    //    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    const currentUser = JSON.parse(getLoggedInUserString());

    axios
      .get("http://localhost:8001/api/game-types/", {
        params: {
          user: currentUser?.id, // Include current user ID in the request if needed
        },

        //        headers: {
        //          Authorization: `Token ${token}`,
        //        },
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
      setCurrentGameTypes(props.currentGameTypes); // Initialize current GameTypes with initialGameTypes
    }
  }, [props.currentGameTypes, allGameTypes]); // Dependencies: props.initialGameTypes and allGameTypes

  useEffect(() => {
    if (props.currentGameTypes) {
      setCurrentGameTypes(props.currentGameTypes); // Initialize current GameTypes with initialGameTypes
    }
  }, [currentGameTypes]); // Dependencies: props.initialGameTypes and allGameTypes

  useEffect(() => {
    if (props.clearGameTypes) {
      setCurrentGameTypes([]); // Clear GameTypes when the clearGameTypes prop is true
    }
  }, [props.clearGameTypes]);

  const addGameType = (gameTypeId) => {
    // Check if the selected GameType is already in the selectedGameTypes array
    const isAlreadyCurrent = currentGameTypes.some(
      (gameType) => gameType.game_type_id === gameTypeId
    );

    if (isAlreadyCurrent) {
      return; // If the GameType is already selected, do nothing
    }

    if (gameTypeId) {
      const selectedGameTypeObject = allGameTypes.find(
        (gameType) => gameType.game_type_id === parseInt(gameTypeId, 10)
      );

      let updatedGameTypes = [...currentGameTypes];

      // Add the new GameType to the list
      updatedGameTypes.push(selectedGameTypeObject);
      setCurrentGameTypes(updatedGameTypes);
      setSelectedGameType(""); // Clear the selection

      if (props.onGameTypesChange) {
        props.onGameTypesChange(updatedGameTypes); // Pass search data to the parent component
      }

      props.setShowGameTypeList(true); // Show the GameType list when a new GameType is added
    }
  };

  const removeGameType = (gameTypeToRemove) => {
    const oldGameTypes = currentGameTypes;
    const newGameTypes = oldGameTypes.filter(
      (gameType) => gameType.game_type_id !== gameTypeToRemove.Ggame_type_id
    );
    setCurrentGameTypes(newGameTypes);
    if (props.onGameTypesChange) {
      props.onGameTypesChange(newGameTypes); // Pass search data to the parent component
    }
  };

  return (
    <div className="GameType-manager-container">
      <select
        className="GameType-dropdown"
        value={selectedGameType}
        onChange={(e) => {
          const GameTypeId = e.target.value;
          setSelectedGameType(GameTypeId); // Update selected GameType state
          addGameType(GameTypeId); // Add GameType immediately
        }}
      >
        <option value="" disabled>
          Select GameTypes
        </option>
        {allGameTypes.map((GameType) => {
          // Check if this GameType is already in currentGameTypes
          const isDisabled = currentGameTypes.some(
            (currentGameType) =>
              currentGameType.GameType_id === GameType.GameType_id
          );

          return (
            <option
              key={GameType.GameType_id}
              value={GameType.GameType_id}
              disabled={isDisabled}
            >
              {GameType.name}
            </option>
          );
        })}
      </select>
      {props.showGameTypeList && (
        <div className="GameType-list">
          {currentGameTypes.map((GameType, index) => (
            <div key={index} className="GameType-item">
              {GameType.name}
              <span
                className="remove-GameType"
                onClick={() => removeGameType(GameType)}
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
