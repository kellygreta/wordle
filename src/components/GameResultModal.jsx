import { useEffect, useState } from "react";
import { RotateCcw, Share2, X, Trophy, Target, Zap } from "lucide-react";

const GameResultModal = ({
  isVisible,
  result,
  onClose,
  onRetry,
  theme = "light",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (result?.status === "won") {
        setShowConfetti(true);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, result]);

  if (!isVisible || !result) return null;

  const shareResults = () => {
    const shareText =
      result.status === "won"
        ? `🎉 I solved today's Wordle in ${result.attempts} attempts!`
        : `😢 I couldn't solve today's Wordle. The word was "${result.word}".`;

    if (navigator.share) {
      navigator.share({
        title: "My Wordle Result",
        text: shareText,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText + " " + window.location.href)
        .then(() => {
          // Show a nice toast instead of alert
          const toast = document.createElement("div");
          toast.className =
            "fixed top-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg z-[100] transform transition-all duration-300 bg-correct";
          toast.textContent = "Results copied to clipboard!";
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2000);
        });
    }
  };

  const isWon = result.status === "won";
  const attempts = result.attempts || 0;

  // Performance rating based on attempts
  const getPerformanceRating = () => {
    if (!isWon)
      return { text: "Better luck next time!", colorClass: "text-secondary" };
    if (attempts === 1)
      return { text: "INCREDIBLE!", colorClass: "text-violet-500" };
    if (attempts === 2)
      return { text: "AMAZING!", colorClass: "text-blue-500" };
    if (attempts === 3)
      return { text: "EXCELLENT!", colorClass: "text-correct" };
    if (attempts === 4)
      return { text: "GREAT!", colorClass: "text-yellow-500" };
    if (attempts === 5) return { text: "GOOD!", colorClass: "text-orange-500" };
    return { text: "PHEW!", colorClass: "text-red-500" };
  };

  const performanceRating = getPerformanceRating();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
          isAnimating ? "bg-opacity-60" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: [
                  `rgb(var(--color-correct))`,
                  `rgb(var(--color-primary))`,
                  `rgb(var(--color-present))`,
                  "#EF4444",
                  "#8B5CF6",
                ][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`relative bg-primary rounded-3xl max-w-md w-full overflow-hidden transform transition-all duration-500 ${
            isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
          } ${isWon ? "modal-shadow-win" : "modal-shadow-default"}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full close-btn hover:close-btn transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Gradient Header */}
          <div
            className={`relative px-8 pt-12 pb-8 ${
              isWon ? "gradient-win" : "gradient-lose"
            }`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-white transform rotate-45 scale-150 animate-pulse"></div>
            </div>

            <div className="relative text-center text-white">
              {/* Icon */}
              {isWon && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <Trophy size={64} className="animate-bounce" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                      <Zap size={14} className="text-yellow-800" />
                    </div>
                  </div>
                </div>
              )}
              {/* Title */}
              <h2 className="text-3xl font-bold mb-2">
                {isWon ? "Congratulations!" : "Nice Try!"}
              </h2>
              {/* Performance Rating */}
              {isWon && (
                <div className="mb-2">
                  <span
                    className="text-2xl font-extrabold bg-white bg-opacity-20 px-4 py-2 rounded-full"
                    style={{
                      color:
                        performanceRating.colorClass === "text-violet-500"
                          ? "#8B5CF6"
                          : performanceRating.colorClass === "text-blue-500"
                          ? "#3B82F6"
                          : performanceRating.colorClass === "text-correct"
                          ? "rgb(var(--color-correct))"
                          : performanceRating.colorClass === "text-yellow-500"
                          ? "#EAB308"
                          : performanceRating.colorClass === "text-orange-500"
                          ? "#F97316"
                          : performanceRating.colorClass === "text-red-500"
                          ? "#EF4444"
                          : "white",
                    }}
                  >
                    {performanceRating.text}
                  </span>
                </div>
              )}
              {/* Attempts */}
              {isWon && (
                <p className="text-lg opacity-90">
                  Solved in{" "}
                  <span className="font-bold text-2xl">{attempts}</span> attempt
                  {attempts !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 bg-primary">
            {/* Stats for won games */}
            {isWon && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 stat-card-correct rounded-xl">
                  <div className="text-2xl font-bold text-correct">
                    {attempts}
                  </div>
                  <div className="text-xs text-secondary uppercase tracking-wide">
                    Attempts
                  </div>
                </div>
                <div className="text-center p-3 stat-card-primary rounded-xl">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: `rgb(var(--color-primary))` }}
                  >
                    {Math.round(((6 - attempts + 1) / 6) * 100)}%
                  </div>
                  <div className="text-xs text-secondary uppercase tracking-wide">
                    Efficiency
                  </div>
                </div>
                <div className="text-center p-3 stat-card-present rounded-xl">
                  <div className="text-2xl font-bold text-present">
                    {attempts <= 3
                      ? "S"
                      : attempts <= 4
                      ? "A"
                      : attempts <= 5
                      ? "B"
                      : "C"}
                  </div>
                  <div className="text-xs text-secondary uppercase tracking-wide">
                    Grade
                  </div>
                </div>
              </div>
            )}

            {/* Lost game content */}
            {!isWon && (
              <div className="text-center mb-6 p-4 word-reveal rounded-xl">
                <p className="text-primary mb-2">The word was:</p>
                <div
                  className="text-3xl font-bold px-4 py-2 rounded-lg inline-block tracking-wider"
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.2)",
                    color: "rgb(220, 38, 38)",
                  }}
                >
                  {result.word}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRetry}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isWon ? "btn-win" : "btn-primary"
                }`}
              >
                <RotateCcw className="mr-2" size={18} />
                Play Again
              </button>

              <button
                onClick={shareResults}
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold btn-secondary transition-all duration-300 transform hover:scale-105"
              >
                <Share2 className="mr-2" size={18} />
                Share
              </button>
            </div>

            {/* Fun message */}
            <div className="text-center mt-4">
              <p className="text-sm text-secondary">
                {isWon
                  ? "🎉 Keep up the great work!"
                  : "🎯 Every attempt makes you better!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameResultModal;
