import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddGameTypeForm from "./components/AddGameTypeForm"; // Make sure the import path is correct
import UpdateGameTypeForm from "./components/UpdateGameTypeForm";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for the AddGameTypeForm */}
        <Route path="/add-game-type" element={<AddGameTypeForm />} />
        <Route path="/update-game-type" element={<UpdateGameTypeForm />} />
        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
