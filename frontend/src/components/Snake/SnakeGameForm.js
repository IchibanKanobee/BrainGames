import React, { useState, useEffect } from "react";
import "./SnakeGameForm.css";

const initialSnake = [{ x: 10, y: 10 }];
const initialDirection = { x: 1, y: 0 };

function SnakeGameForm({
  cellCount = 20,
  gridWidth = 400,
  borderWidth = "2px",
  lineWidth = "1px",
  initialSpeed = 200,
}) {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(initialDirection);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState("initial");
  const [speed, setSpeed] = useState(initialSpeed);

  const cellSize =
    (gridWidth - (cellCount - 1) * parseInt(lineWidth)) / cellCount;

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
          setFood({
            x: Math.floor(Math.random() * cellCount),
            y: Math.floor(Math.random() * cellCount),
          });
        } else {
          newSnake.pop();
        }

        // Check collision with walls or snake body
        if (
          newHead.x < 0 ||
          newHead.x >= cellCount ||
          newHead.y < 0 ||
          newHead.y >= cellCount ||
          newSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setIsGameOver(true);
          setGameState("stopped"); // Change state to stopped on game over
          return prevSnake;
        }

        newSnake.unshift(newHead);
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
      setGameState("started");
    } else if (gameState === "stopped") {
      // Reset the game state to initial conditions when stopped
      setSnake(initialSnake);
      setFood({
        x: Math.floor(Math.random() * cellCount),
        y: Math.floor(Math.random() * cellCount),
      });
      setDirection(initialDirection);
      setIsGameOver(false);
      setGameState("started");
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
