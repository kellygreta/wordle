import React from "react";

const Board = ({ board, getCellClass }) => {
  return (
    <div className="mb-6 flex flex-col items-center">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 mb-2">
          {row.map((cell, colIndex) => (
            <div key={colIndex} className={getCellClass(rowIndex, colIndex)}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
