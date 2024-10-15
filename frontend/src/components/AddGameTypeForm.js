import React, { useState } from "react";
import axios from "axios";
import "./AddGameTypeForm.css"; // Import the CSS file

const AddGameTypeForm = () => {
  const [gameTypeName, setGameTypeName] = useState("");
  const [gameTypeImage, setGameTypeImage] = useState(null); // To store the selected image file
  const [imagePreview, setImagePreview] = useState(""); // To store the image preview URL
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    //e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("game_type_name", gameTypeName);
    if (gameTypeImage) {
      formData.append("game_type_image", gameTypeImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8001/api/add-game-type/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Game type added successfully!");
        setGameTypeName("");
        setGameTypeImage(null);
        setImagePreview(""); // Clear the image preview
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      setError("Failed to add game type. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGameTypeImage(file);

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file);
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

        <div className="form-group">
          <label htmlFor="gameTypeImage">Game Type Image:</label>
          <input
            type="file"
            id="gameTypeImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected Game Type" width="200" />
          </div>
        )}

        <button type="submit">Add Game Type</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default AddGameTypeForm;
