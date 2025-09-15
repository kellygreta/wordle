import React from "react";

const Keyboard = ({ rows, handleKeyPress, getKeyClass, gameState }) => {
  return (
    <div className="mb-6">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={getKeyClass(key)}
              disabled={gameState !== "playing"}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
