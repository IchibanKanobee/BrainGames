import React, { useState, useEffect } from "react";
import "./SnakeGameForm.css";

const initialDirection = { x: 1, y: 0 };

function SnakeGameForm({
  cellCount = 5, // Default to 5 for testing
  gridWidth = 400,
  borderWidth = "2px",
  lineWidth = "1px",
  initialSpeed = 200,
}) {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState({});
  const [direction, setDirection] = useState(initialDirection);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState("initial");
  const [speed, setSpeed] = useState(initialSpeed);

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
      )
    );
    return newFood;
  };

  // Initialize Game State
  const initializeGame = () => {
    // Randomly place the snake in a valid position
    const startX = Math.floor(Math.random() * cellCount);
    const startY = Math.floor(Math.random() * cellCount);

    setSnake([{ x: startX, y: startY }]);
    setFood(generateFood());
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
      alert("The End"); // Show alert message when game ends
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
                  : ""
              }`}
            ></div>
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
