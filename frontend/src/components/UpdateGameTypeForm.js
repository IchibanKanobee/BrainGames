import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateGameTypeForm.css";

const UpdateOrDeleteGameType = () => {
  const [oldName, setOldName] = useState(""); // Selected game type name
  const [newName, setNewName] = useState("");
  const [gameTypes, setGameTypes] = useState([]); // Store game types

  // Function to fetch game types from the API
  const fetchGameTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/game-types/");
      setGameTypes(response.data);
    } catch (error) {
      console.error("Error fetching game types", error);
    }
  };

  // useEffect to fetch game types on component mount
  useEffect(() => {
    fetchGameTypes();
  }, []);

  const handleUpdate = async () => {
    if (!oldName || !newName) {
      alert("Please select an old game type name and enter a new name.");
      return;
    }
    if (oldName === newName) {
      alert("Please make sure the new name is different from the old name.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:8001/api/update-game-type/",
        {
          oldName: oldName,
          newName: newName,
        }
      );
      console.log("Game type updated successfully:", response.data);
      alert("Game type updated successfully!");
    } catch (error) {
      console.error("Error updating game type", error);
      alert("Error updating game type.");
    }
  };

  const handleDelete = async () => {
    if (!oldName) {
      alert("Please select a game type name to delete.");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8001/api/delete-game-type/${oldName}/`
      );
      console.log("Game type deleted successfully:", response.data);
      alert("Game type deleted successfully!");
      setOldName(""); // Clear the selected name after deletion
      setNewName(""); // Optionally clear the new name input
    } catch (error) {
      console.error("Error deleting game type", error);
      alert("Error deleting game type.");
    }
  };

  return (
    <div className="form-container">
      <h2>Update or Delete Game Type</h2>

      <div className="form-group">
        <label>Old Game Type Name:</label>
        <select
          value={oldName}
          onChange={(e) => setOldName(e.target.value)}
          onFocus={fetchGameTypes} // Fetch game types when clicked
        >
          <option value="">Select a game type</option>
          {gameTypes.map((gameType) => (
            <option key={gameType.game_type_id} value={gameType.game_type_name}>
              {gameType.game_type_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>New Game Type Name:</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter the new game type name"
        />
      </div>

      <div className="button-group">
        <button onClick={handleUpdate}>Update Game Type</button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete Game Type
        </button>
      </div>
    </div>
  );
};

export default UpdateOrDeleteGameType;
