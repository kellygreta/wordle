import { Award, RotateCcw, Share2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const GameResultModal = ({ isVisible, result, onClose, onRetry }) => {
  const { theme } = useTheme();

  if (!isVisible || !result) return null;

  const shareResults = () => {
    const shareText =
      result.status === "won"
        ? `I solved today's Wordle in ${result.attempts} attempts! 🎉`
        : `I couldn’t solve today's Wordle. The word was "${result.word}". 😢`;

    if (navigator.share) {
      navigator.share({
        title: "My Wordle Result",
        text: shareText,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText + " " + window.location.href)
        .then(() => alert("Results copied to clipboard!"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full animate-in zoom-in duration-300"
        style={{ backgroundColor: "rgb(var(--bg-primary))" }}
      >
        <div className="text-center mb-6">
          <Award
            className={`mx-auto mb-4 ${
              theme === "light" ? "text-green-500" : "text-green-400"
            }`}
            size={48}
          />
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "rgb(var(--color-primary))" }}
          >
            {result.status === "won" ? "You Win! 🎉" : "Game Over 😢"}
          </h2>
          {result.status === "lost" && (
            <p
              className="text-lg"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              The word was{" "}
              <span className="font-bold text-red-500">{result.word}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center px-6 py-3 rounded-full font-semibold transition-colors"
            style={{
              backgroundColor: "rgb(var(--color-primary))",
              color: "white",
            }}
          >
            <RotateCcw className="mr-2" size={16} />
            New Game
          </button>

          <button
            onClick={shareResults}
            className="flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-colors"
            style={{
              borderColor: "rgb(var(--color-primary))",
              color: "rgb(var(--color-primary))",
            }}
          >
            <Share2 className="mr-2" size={16} />
            Share
          </button>

          <button
            onClick={onClose}
            className="flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-colors"
            style={{
              borderColor: "rgb(var(--color-secondary))",
              color: "rgb(var(--text-primary))",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
