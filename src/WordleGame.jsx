import React, { useState, useEffect, useCallback } from "react";
import { WORD_LIST } from "./wordlist";
import Header from "./components/Header";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import NewGameButton from "./components/NewGameButton";
import Instructions from "./components/Instructions";
import { useTheme } from "./context/ThemeContext"; // <-- use the global theme
import GameResultModal from "./components/GameResultModal";

const ROWS = 6;
const COLS = 5;

const WordleGame = () => {
  const { theme } = useTheme(); // get the current theme
  const [targetWord, setTargetWord] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [board, setBoard] = useState(
    Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(""))
  );
  const [gameState, setGameState] = useState("playing"); // 'playing', 'won', 'lost'
  const [letterStates, setLetterStates] = useState({});

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setCurrentRow(0);
    setCurrentCol(0);
    setBoard(
      Array(ROWS)
        .fill()
        .map(() => Array(COLS).fill(""))
    );
    setGameState("playing");
    setLetterStates({});
  };

  const getCellState = (row, col) => {
    if (row > currentRow) return "empty";
    if (row === currentRow) return "current";

    const letter = board[row][col];
    const targetLetter = targetWord[col];

    if (letter === targetLetter) return "correct";
    if (targetWord.includes(letter)) return "present";
    return "absent";
  };

  const updateLetterStates = (row) => {
    const newLetterStates = { ...letterStates };
    const guess = board[row];

    for (let col = 0; col < COLS; col++) {
      const letter = guess[col];
      if (!letter) continue;

      let state = "absent";
      if (targetWord[col] === letter) {
        state = "correct";
      } else if (targetWord.includes(letter)) {
        state = "present";
      }

      // upgrade logic: absent < present < correct
      if (
        !newLetterStates[letter] ||
        (newLetterStates[letter] === "absent" && state !== "absent") ||
        (newLetterStates[letter] === "present" && state === "correct")
      ) {
        newLetterStates[letter] = state;
      }
    }

    setLetterStates(newLetterStates);
  };

  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);

  const submitWord = useCallback(() => {
    if (currentCol !== COLS) {
      alert("Not enough letters!");
      return;
    }

    const currentWord = board[currentRow].join("");

    if (!WORD_LIST.includes(currentWord)) {
      alert("Not in word list!");
      return;
    }

    updateLetterStates(currentRow);

    if (currentWord === targetWord) {
      setGameState("won");
      setResult({ status: "won", attempts: currentRow + 1 });
      setShowModal(true);
    } else if (currentRow === ROWS - 1) {
      setGameState("lost");
      setResult({ status: "lost", word: targetWord });
      setShowModal(true);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  }, [currentRow, currentCol, board, targetWord]);

  const handleKeyPress = useCallback(
    (key) => {
      if (gameState !== "playing") return;

      if (key === "ENTER") {
        submitWord();
      } else if (key === "BACKSPACE") {
        if (currentCol > 0) {
          const newBoard = [...board];
          newBoard[currentRow][currentCol - 1] = "";
          setBoard(newBoard);
          setCurrentCol(currentCol - 1);
        }
      } else if (key.match(/^[A-Z]$/) && currentCol < COLS) {
        const newBoard = [...board];
        newBoard[currentRow][currentCol] = key;
        setBoard(newBoard);
        setCurrentCol(currentCol + 1);
      }
    },
    [gameState, currentRow, currentCol, board, submitWord]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || key.match(/^[A-Z]$/)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const getCellClass = (row, col) => {
    const state = getCellState(row, col);
    const hasLetter = board[row][col] !== "";

    let baseClass =
      "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ";

    if (state === "correct") {
      baseClass += " bg-correct text-white";
    } else if (state === "present") {
      baseClass += " bg-present text-white";
    } else if (state === "absent") {
      baseClass += " bg-absent text-white";
    } else if (hasLetter) {
      baseClass += theme === "dark" ? " bg-dark" : " bg-light";
    } else {
      baseClass += theme === "dark" ? " bg-dark" : " bg-light";
    }

    return baseClass;
  };

  const getKeyClass = (key) => {
    const state = letterStates[key];
    let baseClass =
      "px-3 py-4 m-1 rounded font-bold cursor-pointer transition-all duration-300 select-none ";
    if (key === "ENTER" || key === "BACKSPACE") baseClass += "px-6 text-sm ";
    if (gameState !== "playing") baseClass += "opacity-75 cursor-not-allowed ";

    if (state === "correct") {
      baseClass += " bg-correct text-white";
    } else if (state === "present") {
      baseClass += " bg-present text-white";
    } else if (state === "absent") {
      baseClass += " bg-absent text-white";
    } else {
      baseClass += theme === "dark" ? " bg-dark" : " bg-light";
    }

    return baseClass;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } flex flex-col items-center justify-center p-4`}
    >
      <div className="max-w-md w-full">
        <Header />

        <Board board={board} getCellClass={getCellClass} />

        <Keyboard
          rows={keyboardRows}
          handleKeyPress={handleKeyPress}
          getKeyClass={getKeyClass}
          gameState={gameState}
        />

        <NewGameButton resetGame={resetGame} />

        <Instructions theme={theme} wordCount={WORD_LIST.length} />
      </div>
      <GameResultModal
        isVisible={showModal}
        result={result}
        onClose={() => setShowModal(false)}
        onRetry={() => {
          resetGame();
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default WordleGame;
