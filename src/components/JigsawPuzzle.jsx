import React, { useState, useEffect } from "react";

// Icon for closing the quiz modal
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Icon for a correct answer
const CheckIcon = () => (
  <svg
    className="w-24 h-24 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

// Animated Celebration SVG for the completion screen
const CelebrationIcon = () => (
  <svg className="w-40 h-40" viewBox="0 0 100 100">
    {/* Trophy  */}
    <g className="animate-trophy-pop-in">
      <path
        d="M30,75 C30,85 35,90 50,90 C65,90 70,85 70,75 L70,55 L30,55 L30,75 Z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2"
      />
      <path d="M50,90 L50,95 L45,100 L55,100 L50,95" fill="#B8860B" />
      <path
        d="M30,55 C20,55 20,40 30,40"
        fill="none"
        stroke="#FFD700"
        strokeWidth="4"
      />
      <path
        d="M70,55 C80,55 80,40 70,40"
        fill="none"
        stroke="#FFD700"
        strokeWidth="4"
      />
      <ellipse
        cx="50"
        cy="35"
        rx="25"
        ry="15"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2"
      />
    </g>
    {/* Stars */}
    <g className="animate-stars-burst">
      <path
        d="M15 15 l5 5 l-5 5 l-5 -5 z"
        fill="#FFC700"
        className="star star-1"
      />
      <path
        d="M85 15 l5 5 l-5 5 l-5 -5 z"
        fill="#FFC700"
        className="star star-2"
      />
      <path
        d="M20 80 l5 5 l-5 5 l-5 -5 z"
        fill="#FFC700"
        className="star star-3"
      />
      <path
        d="M80 80 l5 5 l-5 5 l-5 -5 z"
        fill="#FFC700"
        className="star star-4"
      />
      <path
        d="M50 5 l5 5 l-5 5 l-5 -5 z"
        fill="#FFC700"
        className="star star-5"
      />
    </g>
  </svg>
);

// Screen to display upon puzzle completion
const CompletionScreen = ({ imageUrl, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg text-center animate-scale-in-up relative z-10 flex flex-col items-center">
        <CelebrationIcon />
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 mt-2 mb-3">
          Congratulations!
        </h2>
        <p className="text-gray-600 mb-6 text-xl">
          You've successfully revealed the hidden image!
        </p>
        <div className="rounded-lg overflow-hidden shadow-lg mb-6 border-4 border-white">
          <img
            src={imageUrl}
            alt="Completed puzzle"
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-bold py-4 px-10 rounded-lg hover:from-amber-600 hover:to-yellow-500 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-110 text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

// Represents a single tile in the jigsaw puzzle
const Tile = ({ tile, onTileClick }) => {
  const { id, isRevealed, position, imageUrl } = tile;

  const revealedStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "200% 200%",
    backgroundPosition: position,
  };

  return (
    <div
      className={`relative aspect-square w-full h-full cursor-pointer rounded-xl shadow-lg transition-transform duration-700 ease-in-out preserve-3d group ${
        isRevealed ? "rotate-y-180" : ""
      }`}
      onClick={() => !isRevealed && onTileClick(id)}
      aria-label="Puzzle Tile"
      role="button"
      tabIndex={isRevealed ? -1 : 0}
    >
      {/* Front of the tile (visible initially) */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center rounded-xl backface-hidden transition-transform duration-300 group-hover:scale-105 border-2 border-white/30">
        <span className="text-6xl font-bold text-white animate-subtle-pulse">
          ?
        </span>
      </div>
      {/* Back of the tile (visible after reveal) */}
      <div
        className="absolute inset-0 bg-gray-200 rounded-xl backface-hidden rotate-y-180 border-2 border-white"
        style={revealedStyle}
      ></div>
    </div>
  );
};

// Modal for displaying the quiz question
const QuizModal = ({ question, onClose, onSubmit, isVisible }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setIsCorrect(false);
        setIsShaking(false);
      }, 300);
    }
  }, [isVisible]);

  const handleOptionClick = (option) => {
    if (isCorrect) return;

    if (option === question.answer) {
      setIsCorrect(true);
      setTimeout(() => {
        onSubmit();
      }, 1500);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-scale-in-up transition-transform duration-500 ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        {isCorrect ? (
          <div className="flex flex-col items-center justify-center h-48 animate-fade-in">
            <CheckIcon />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Correct!</h2>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors hover:rotate-90 duration-300"
              aria-label="Close quiz"
            >
              <XIcon />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              {question.text}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-5 rounded-lg hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform hover:scale-105 text-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// The main Jigsaw Puzzle component
export default function JigsawPuzzle() {
  const puzzleImages = [
    "https://images.unsplash.com/photo-1480714378408-67cf0d136b95?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559234994-a8a56c7d686b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1974&auto=format&fit=crop",
  ];

  const getInitialTiles = (imageUrl) => [
    {
      id: 1,
      isRevealed: false,
      position: "0% 0%",
      imageUrl: imageUrl,
      question: {
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
      },
    },
    {
      id: 2,
      isRevealed: false,
      position: "100% 0%",
      imageUrl: imageUrl,
      question: {
        text: "Which planet is the Red Planet?",
        options: ["Jupiter", "Mars", "Venus", "Saturn"],
        answer: "Mars",
      },
    },
    {
      id: 3,
      isRevealed: false,
      position: "0% 100%",
      imageUrl: imageUrl,
      question: {
        text: "What is the largest ocean?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: "Pacific",
      },
    },
    {
      id: 4,
      isRevealed: false,
      position: "100% 100%",
      imageUrl: imageUrl,
      question: {
        text: "Who wrote 'Romeo and Juliet'?",
        options: ["Dickens", "Shakespeare", "Twain", "Austen"],
        answer: "Shakespeare",
      },
    },
  ];

  const [currentImage, setCurrentImage] = useState(puzzleImages[0]);
  const [tiles, setTiles] = useState([]);
  const [activeTileId, setActiveTileId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startNewPuzzle = () => {
    const newImageIndex = Math.floor(Math.random() * puzzleImages.length);
    const newImage = puzzleImages[newImageIndex];
    setCurrentImage(newImage);
    setTiles(getInitialTiles(newImage));
    setIsComplete(false);
  };

  useEffect(() => {
    startNewPuzzle();
  }, []);

  useEffect(() => {
    if (tiles.length > 0 && tiles.every((tile) => tile.isRevealed)) {
      setTimeout(() => setIsComplete(true), 800);
    }
  }, [tiles]);

  const handleTileClick = (id) => {
    setActiveTileId(id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCorrectAnswer = () => {
    setTiles((prevTiles) =>
      prevTiles.map((tile) =>
        tile.id === activeTileId ? { ...tile, isRevealed: true } : tile
      )
    );
    handleCloseModal();
  };

  const activeQuestion = tiles.find(
    (tile) => tile.id === activeTileId
  )?.question;

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-pattern">
      <style>{`
          .bg-pattern {
            background-color: #e2e8f0;
            background-image: radial-gradient(#a7b2c1 0.5px, transparent 0.5px), radial-gradient(#a7b2c1 0.5px, #e2e8f0 0.5px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
          }
          .preserve-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
          .perspective-1000 { perspective: 1000px; }
          @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          @keyframes scale-in-up {
              0% { opacity: 0; transform: scale(0.9) translateY(20px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-scale-in-up { animation: scale-in-up 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
          @keyframes subtle-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
          }
          .animate-subtle-pulse { animation: subtle-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
              40%, 60% { transform: translate3d(4px, 0, 0); }
          }
          .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
          
          /* Celebration SVG animations */
          @keyframes trophy-pop-in {
              0% { transform: scale(0); opacity: 0; }
              60% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-trophy-pop-in { animation: trophy-pop-in 0.8s ease-out forwards; transform-origin: center bottom; }
          
          @keyframes stars-burst {
              0% { transform: scale(0); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
          }
          .animate-stars-burst { animation: stars-burst 1s ease-out forwards 0.5s; }
          .animate-stars-burst .star { transform-origin: center; }
      `}</style>
      <div className="w-full max-w-5xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-10 text-center border border-white/50">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 mb-2">
          Jigsaw Challenge
        </h1>
        <p className="text-gray-700 mb-8 text-xl">
          Answer the questions to reveal the hidden image!
        </p>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[95vw] max-w-[900px] aspect-square perspective-1000 mx-auto">
          {tiles.map((tile) => (
            <Tile key={tile.id} tile={tile} onTileClick={handleTileClick} />
          ))}
        </div>
      </div>

      {isComplete && (
        <CompletionScreen imageUrl={currentImage} onReset={startNewPuzzle} />
      )}

      {activeQuestion && (
        <QuizModal
          question={activeQuestion}
          onClose={handleCloseModal}
          onSubmit={handleCorrectAnswer}
          isVisible={isModalVisible}
        />
      )}
    </div>
  );
}
