import React, { useState, useEffect } from "react";
import "./SnakeGameForm.css";
import yellowFlower from "./yellow_flower.png";
import blueFlower from "./blue_flower.png";
import pinkFlower from "./pink_flower.png";

const initialDirection = { x: 1, y: 0 };
const decorationImages = [yellowFlower, blueFlower, pinkFlower];

function SnakeGameForm({
  cellCount = 5, // Default to 5 for testing
  gridWidth = 400,
  borderWidth = "2px",
  lineWidth = "1px",
  speed = 200,
}) {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState({});
  const [decorations, setDecorations] = useState([]); // State for decorations
  const [direction, setDirection] = useState(initialDirection);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState("initial");

  const cellSize =
    (gridWidth - (cellCount - 1) * parseInt(lineWidth)) / cellCount;

  // Generate Food Position
  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * cellCount),
        y: Math.floor(Math.random() * cellCount),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      ) ||
      decorations.some(
        (decoration) => decoration.x === newFood.x && decoration.y === newFood.y
      )
    );
    return newFood;
  };

  // Generate Decorations Position
  const generateDecorations = (count) => {
    const newDecorations = [];
    while (newDecorations.length < count) {
      const newDecoration = {
        x: Math.floor(Math.random() * cellCount),
        y: Math.floor(Math.random() * cellCount),
        image:
          decorationImages[Math.floor(Math.random() * decorationImages.length)],
      };

      // Ensure the decoration does not overlap with the snake or food
      const isOverlapping =
        snake.some(
          (segment) =>
            segment.x === newDecoration.x && segment.y === newDecoration.y
        ) ||
        (food.x === newDecoration.x && food.y === newDecoration.y);

      if (!isOverlapping) {
        newDecorations.push(newDecoration);
      }
    }
    return newDecorations;
  };

  // Initialize Game State
  const initializeGame = () => {
    // Randomly place the snake in a valid position
    const startX = Math.floor(Math.random() * cellCount);
    const startY = Math.floor(Math.random() * cellCount);

    setSnake([{ x: startX, y: startY }]);
    setFood(generateFood());
    setDecorations(
      generateDecorations(Math.floor(cellCount * cellCount * 0.05))
    ); // Generate decorations
    setDirection(initialDirection);
    setIsGameOver(false);
    setGameState("started");
  };

  // Handle Keyboard Controls
  useEffect(() => {
    if (isGameOver || gameState === "stopped") return;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isGameOver, gameState]);

  // Move the Snake
  useEffect(() => {
    if (isGameOver || gameState !== "started") return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[0];

        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake.unshift(newHead);
          setFood(generateFood()); // Generate new food
        } else {
          newSnake.pop(); // Remove the tail
          newSnake.unshift(newHead);
        }

        // Check collision with walls or snake body
        if (
          newHead.x < 0 ||
          newHead.x >= cellCount ||
          newHead.y < 0 ||
          newHead.y >= cellCount ||
          newSnake
            .slice(1)
            .some(
              (segment) => segment.x === newHead.x && segment.y === newHead.y
            )
        ) {
          setIsGameOver(true);
          setGameState("stopped"); // Change state to stopped on game over
          return prevSnake;
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, cellCount, gameState, speed]);

  // Show alert when game is over
  useEffect(() => {
    if (isGameOver) {
      alert("The Game is Over"); // Show alert message when game ends
    }
  }, [isGameOver]);

  // Start/Pause/Restart Game
  const handleGameState = () => {
    if (gameState === "initial") {
      initializeGame(); // Initialize the game state
    } else if (gameState === "stopped") {
      // Reset the game state to initial conditions when stopped
      initializeGame(); // Initialize the game again
    } else if (gameState === "started") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("started");
    }
  };

  return (
    <div
      className="game-board"
      style={{
        "--grid-width": `${gridWidth}px`,
        "--cell-size": `${cellSize}px`,
        "--border-width": borderWidth,
        "--line-width": lineWidth,
        "--cell-count": cellCount,
      }}
    >
      <div className="grid">
        {Array.from({ length: cellCount }, (_, y) =>
          Array.from({ length: cellCount }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={`cell ${
                snake.some((segment) => segment.x === x && segment.y === y)
                  ? "snake"
                  : food.x === x && food.y === y
                  ? "food"
                  : decorations.some(
                      (decoration) => decoration.x === x && decoration.y === y
                    )
                  ? "decoration"
                  : ""
              }`}
            >
              {decorations.some(
                (decoration) => decoration.x === x && decoration.y === y
              ) && (
                <img
                  src={
                    decorations.find(
                      (decoration) => decoration.x === x && decoration.y === y
                    ).image
                  }
                  alt="Decoration"
                  className="decoration-image"
                />
              )}
            </div>
          ))
        )}
      </div>
      <h2>Score: {snake.length - 1}</h2>
      <button onClick={handleGameState}>
        {gameState === "initial"
          ? "Start"
          : gameState === "paused"
          ? "Resume"
          : gameState === "stopped"
          ? "Restart"
          : "Pause"}
      </button>

      {/* Mobile Controls */}
      <div className="controls">
        <button onClick={() => setDirection({ x: 0, y: -1 })}>↑</button>
        <div>
          <button onClick={() => setDirection({ x: -1, y: 0 })}>←</button>
          <button onClick={() => setDirection({ x: 1, y: 0 })}>→</button>
        </div>
        <button onClick={() => setDirection({ x: 0, y: 1 })}>↓</button>
      </div>
    </div>
  );
}

export default SnakeGameForm;
