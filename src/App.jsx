import React, { useState, useEffect } from "react";
import Board from "./components/board";
import initializeDeck from "./deck";

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [dimension, setDimension] = useState(400);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    resizeBoard();
    setCards(initializeDeck());
  }, []);

  useEffect(() => {
    preloadImages();
  }, cards);

  useEffect(() => {
    const resizeListener = window.addEventListener("resize", resizeBoard);

    return () => window.removeEventListener("resize", resizeListener);
  });

  const preloadImages = () =>
    cards.map(card => {
      const src = `/img/${card.type}.png`;
      return (new Image().src = src);
    });

  const resizeBoard = () => {
    setDimension(
      Math.min(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      )
    );
  };

  const sameCardClickedTwice = id => flipped.includes(id);

  const isMatch = id => {
    const clickedCard = cards.find(card => card.id === id);
    const flippedCard = cards.find(card => flipped[0] === card.id);
    return flippedCard.type === clickedCard.type;
  };

  const resetCards = () => {
    setFlipped([]);
    setDisabled(false);
  };

  const handleClick = id => {
    setDisabled(true);
    if (flipped.length === 0) {
      setFlipped(flipped => [...flipped, id]);
      setDisabled(false);
    } else {
      if (sameCardClickedTwice(flipped, id)) return;
      setFlipped(flipped => [...flipped, id]);
      if (isMatch(id)) {
        setSolved([...solved, ...flipped, id]);
        resetCards();
      } else {
        setTimeout(resetCards, 2000);
      }
    }
  };

  return (
    <div>
      <h1>Память</h1>
      <h2>Вспоминайте где какие карты. Задача: открыть попарно. Удачи!</h2>
      {/* <h2>Задача: открыть попарно. Удачи!</h2> */}

      <Board
        dimension={dimension}
        cards={cards}
        flipped={flipped}
        handleClick={handleClick}
        disabled={disabled}
        solved={solved}
      />
    </div>
  );
}
