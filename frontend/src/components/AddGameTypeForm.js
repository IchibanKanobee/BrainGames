import React, { useState } from "react";
import axios from "axios";
import "./AddGameTypeForm.css"; // Import the CSS file

const AddGameTypeForm = () => {
  const [gameTypeName, setGameTypeName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8001/api/add-game-type/",
        {
          game_type_name: gameTypeName,
        }
      );

      if (response.status === 201) {
        setSuccess("Game type added successfully!");
        setGameTypeName("");
      }
    } catch (err) {
      setError("Failed to add game type. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="add-game-type-form">
      <h2>Add Game Type</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameTypeName">Game Type Name:</label>
          <input
            type="text"
            id="gameTypeName"
            value={gameTypeName}
            onChange={(e) => setGameTypeName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Game Type</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default AddGameTypeForm;
