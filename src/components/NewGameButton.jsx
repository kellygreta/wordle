import React from "react";

const NewGameButton = ({ resetGame }) => {
  return (
    <div className="text-center">
      <button
        onClick={resetGame}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        New Game
      </button>
    </div>
  );
};

export default NewGameButton;
