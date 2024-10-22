import React, { useState, useEffect } from "react";
import "./SnakeGameForm.css";

const initialSnake = [{ x: 10, y: 10 }];
const initialDirection = { x: 1, y: 0 };

function SnakeGameForm({
  cellCount = 20,
  gridWidth = 400, // Set the total grid width in pixels
  borderWidth = "2px",
  lineWidth = "1px",
}) {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(initialDirection);
  const [isGameOver, setIsGameOver] = useState(false);

  // Calculate the size of each cell based on the gridWidth and cellCount
  const cellSize =
    (gridWidth - (cellCount - 1) * parseInt(lineWidth)) / cellCount;

  // Handle Keyboard Controls
  useEffect(() => {
    if (isGameOver) return;

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
  }, [isGameOver]);

  // Move the Snake
  useEffect(() => {
    if (isGameOver) return;

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
          return prevSnake;
        }

        newSnake.unshift(newHead);
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, cellCount]);

  // Mobile controls (direction changes)
  const handleDirection = (newDirection) => {
    setDirection(newDirection);
  };

  return (
    <div
      className="game-board"
      style={{
        "--grid-width": `${gridWidth}px`, // Pass gridWidth dynamically
        "--cell-size": `${cellSize}px`, // Pass calculated cell size
        "--border-width": borderWidth,
        "--line-width": lineWidth,
        "--cell-count": cellCount,
      }}
    >
      {isGameOver ? (
        <h1>Game Over</h1>
      ) : (
        <>
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

          {/* Mobile Controls */}
          <div className="controls">
            <button onClick={() => handleDirection({ x: 0, y: -1 })}>↑</button>
            <div>
              <button onClick={() => handleDirection({ x: -1, y: 0 })}>
                ←
              </button>
              <button onClick={() => handleDirection({ x: 1, y: 0 })}>→</button>
            </div>
            <button onClick={() => handleDirection({ x: 0, y: 1 })}>↓</button>
          </div>
        </>
      )}
    </div>
  );
}

export default SnakeGameForm;
