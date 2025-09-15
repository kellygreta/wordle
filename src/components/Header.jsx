const Header = () => {
  return (
    <div className="text-center mb-6">
      <h1
        className="text-4xl font-bold mb-2"
        style={{
          color: `rgb(var(--text-primary))`,
        }}
      >
        WORDLE
      </h1>
      <div
        className="text-sm"
        style={{
          color: `rgb(var(--text-secondary))`,
        }}
      >
        Guess the 5-letter word in 6 tries!
      </div>
    </div>
  );
};

export default Header;
