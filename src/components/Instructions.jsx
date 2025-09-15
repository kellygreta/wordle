import React from "react";

const Instructions = ({ darkMode, wordCount }) => {
  return (
    <div
      className={`mt-6 text-center text-xs ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      <div className="mb-2">
        <span className="inline-block w-4 h-4 bg-green-500 mr-1 rounded-sm"></span>
        Correct letter, correct position
      </div>
      <div className="mb-2">
        <span className="inline-block w-4 h-4 bg-yellow-500 mr-1 rounded-sm"></span>
        Correct letter, wrong position
      </div>
      <div className="mb-2">
        <span className="inline-block w-4 h-4 bg-gray-500 mr-1 rounded-sm"></span>
        Letter not in word
      </div>
      <div className="mt-3 text-xs opacity-75">
        Total words available: {wordCount}
      </div>
    </div>
  );
};

export default Instructions;
