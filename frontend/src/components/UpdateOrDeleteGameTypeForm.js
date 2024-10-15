import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateOrDeleteGameTypeForm.css";

const UpdateOrDeleteGameType = () => {
  const [oldName, setOldName] = useState(""); // Selected game type name
  const [newName, setNewName] = useState("");
  const [gameTypes, setGameTypes] = useState([]); // Store game types
  const [selectedImage, setSelectedImage] = useState(null); // New image for updating
  const [currentImage, setCurrentImage] = useState(""); // To display current image
  const [imagePreview, setImagePreview] = useState(null); // Thumbnail preview for new image

  // Function to fetch game types from the API
  const fetchGameTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/game-types/");
      setGameTypes(response.data);
    } catch (error) {
      console.error("Error fetching game types", error);
    }
  };

  // Fetch current image of the selected game type
  const fetchCurrentImage = (selectedGameType) => {
    const selected = gameTypes.find(
      (gameType) => gameType.game_type_name === selectedGameType
    );
    if (selected) {
      setCurrentImage(selected.game_type_image);
    } else {
      setCurrentImage(""); // Reset if no game type is found
    }
  };

  // useEffect to fetch game types on component mount
  useEffect(() => {
    fetchGameTypes();
  }, []);

  // Handle image selection and generate a thumbnail preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // Generate image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Clear preview if no file is selected
    }
  };

  const handleUpdate = async () => {
    if (!oldName) {
      alert("Please select an old game type name.");
      return;
    }

    // Check if both the name and image are the same as old ones
    if (!newName && !selectedImage) {
      alert("No changes detected. Please update either the name or the image.");
      return;
    }

    // If new name is blank but a new image is selected, submit the old name and new image
    if (!newName && selectedImage) {
      const formData = new FormData();
      formData.append("oldName", oldName);
      formData.append("image", selectedImage);

      try {
        const response = await axios.put(
          "http://localhost:8001/api/update-game-type/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Game type updated successfully!");
        fetchGameTypes(); // Refresh game types after update
        setSelectedImage(null); // Clear selected image
        setImagePreview(null); // Clear image preview
        return;
      } catch (error) {
        console.error("Error updating game type", error);
        alert("Error updating game type.");
      }
    }

    // Check if the new name and image are the same as old ones
    const currentGameType = gameTypes.find(
      (gameType) => gameType.game_type_name === oldName
    );
    if (
      currentGameType &&
      currentGameType.game_type_name === newName &&
      !selectedImage
    ) {
      alert("No changes detected. Please update either the name or the image.");
      return;
    }

    // Proceed with form submission for both name and image change
    const formData = new FormData();
    formData.append("oldName", oldName);
    if (newName) {
      formData.append("newName", newName);
    }
    if (selectedImage) {
      formData.append("image", selectedImage); // Include image in the update request
    }

    try {
      const response = await axios.put(
        "http://localhost:8001/api/update-game-type/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Game type updated successfully!");
      fetchGameTypes(); // Refresh game types after update
      setSelectedImage(null); // Clear selected image
      setImagePreview(null); // Clear image preview
      setNewName(""); // Clear new name input
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
      alert("Game type deleted successfully!");
      setOldName(""); // Clear the selected name after deletion
      setNewName(""); // Optionally clear the new name input
      setCurrentImage(""); // Clear current image on delete
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
          onChange={(e) => {
            setOldName(e.target.value);
            fetchCurrentImage(e.target.value); // Fetch current image on game type selection
          }}
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

      {currentImage && (
        <div className="current-image">
          <img
            src={`http://localhost:8001${currentImage}`} // Ensure the image URL is correct
            alt="Current Game Type"
            width="200"
          />
        </div>
      )}

      <div className="form-group">
        <label>New Game Type Name:</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter the new game type name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">New Image (optional):</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange} // Handle new image selection and preview
          accept="image/*"
        />
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="New Game Type Preview" width="200" />
        </div>
      )}

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
