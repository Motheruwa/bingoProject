import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css';
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4';
import Notwin from '../audio/NOTWIN.mp4';

function Card32() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();

  const generateBingoCard = () => {
    const bingoCard = {
      B: [7, 4, 11, 1, 15],
      I: [24, 20, 26, 18, 28],
      N: [36, 44, 'free', 42, 32],
      G: [48, 60, 54, 57, 58],
      O: [73, 75, 68, 71, 64]
    };

    bingoCard.N[2] = 'free'; // Set the center cell as a free space

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
      ['B7', 'B4', 'B11', 'B1', 'B15'], // First row (B)
    ['I24', 'I20', 'I26', 'I18', 'I28'], // Second row (I)
    ['N36', 'N44', 'free', 'N42', 'N32'], // Third row (N)
    ['G48', 'G60', 'G54', 'G57', 'G58'], // Fourth row (G)
    ['O73', 'O75', 'O68', 'O71', 'O64'], // Fifth row (O)
    ['B7', 'I20', 'free', 'G57', 'O64'], // Top-left to bottom-right diagonal
    ['O73', 'G60', 'free', 'I18', 'B15'], // Top-right to bottom-left diagonal
    ['B7', 'I24', 'N36', 'G48', 'O73'], // First column
    ['B4', 'I20', 'N44', 'G60', 'O75'], // Second column
    ['B11', 'I26', 'free', 'G54', 'O68'], // Third column
    ['B1', 'I18', 'N42', 'G57', 'O71'], // Fourth column
    ['B15', 'I28', 'N32', 'G58', 'O64'], // Fifth column
    ['B7', 'B15', 'O73', 'O64'], // Corner
    ];

    const winningLines = [];
    for (const condition of winConditions) {
      if (condition.every(char => calledNumbers.has(char))) {
        winningLines.push(condition);
      }
    }

    if (winningLines.length > 0) {
      const winningNumbers = [...new Set(winningLines.flat())];
      return winningNumbers;
    }

    return [];
  };

  const bingoCard = generateBingoCard();
  const winningNumbers = checkWin();

  const handleResetAndNavigate = () => {
    localStorage.removeItem('calledNumbers');
    localStorage.removeItem('registeredNumbers');
    navigate('/registerdcard');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the history stack
  };

  const audioWin = new Audio(Win);
  const audioNotwin = new Audio(Notwin);

  const playWinSound = () => {
    audioWin.play();
  };

  const playNotwinSound = () => {
    audioNotwin.play();
    audioNotwin.onended = function() {
        handleGoBack();
    };
};

  const isFourCornersWinning =
  winningNumbers.includes('B10') &&
  winningNumbers.includes('B14') &&
  winningNumbers.includes('O73') &&
  winningNumbers.includes('O65');
  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 32</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.B}>B</th>
            <th className={styles.I}>I</th>
            <th className={styles.N}>N</th>
            <th className={styles.G}>G</th>
            <th className={styles.O}>O</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4].map((index) => (
            <tr key={index}>
              {Object.keys(bingoCard).map((letter) => {
                const number = bingoCard[letter][index];
                const isCalled = calledNumbers.has(`${letter}${number}`) || (number === 'free' && calledNumbers.has('free'));
                const isWinningNumber = winningNumbers.includes(`${letter}${number}`) || (number === 'free' && winningNumbers.includes('free'));
                const isCornerWinning = isFourCornersWinning && (letter === 'B' || letter === 'O') && (index === 0 || index === 4);
  
                const cellClassName = isWinningNumber
                  ? isCornerWinning
                    ? styles.cornerwinning
                    : styles.winning
                  : isCalled
                  ? styles.called
                  : '';
                return (
                  <td >
                  <div key={number} className={cellClassName}>
                  {number}
                  </div>
                </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.buttons}>
        <button onClick={playWinSound} className={styles.good}>Good Bingo</button>
        <button onClick={playNotwinSound} className={styles.add}>Not Bingo</button>
        <button onClick={handleGoBack} className={styles.good}>Additional</button>
        <button onClick={handleResetAndNavigate} className={styles.add}>New Bingo</button>
      </div>
    </div>
  );
}

export default Card32;