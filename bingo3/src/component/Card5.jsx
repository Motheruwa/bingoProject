import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
function Card5() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();
  const generateBingoCard = () => {
    const bingoCard = {
      B: [2, 4, 9, 1, 14],
      I: [16, 23, 17, 26, 20],
      N: [43, 32, 'free', 34, 31],
      G: [47, 58, 51, 59, 57],
      O: [70, 73, 74, 75, 72]
    };

    // Set the center cell as a free space
    bingoCard.N[2] = 'free';

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
        ['B2', 'B4', 'B9', 'B1', 'B14'], // First row (B)
    ['I16', 'I23', 'I17', 'I26', 'I20'], // Second row (I)
    ['N43', 'N32', 'free', 'N34', 'N31'], // Third row (N)
    ['G47', 'G58', 'G51', 'G59', 'G57'], // Fourth row (G)
    ['O70', 'O73', 'O74', 'O75', 'O72'], // Fifth row (O)
    ['B2', 'I23', 'free', 'G59', 'O72'], // Top-left to bottom-right diagonal
    ['O70', 'G58', 'free', 'I26', 'B14'], // Top-right to bottom-left diagonal
    ['B2', 'I16', 'N43', 'G47', 'O70'], // First column
    ['B4', 'I23', 'N32', 'G58', 'O73'], // Second column
    ['B9', 'I17', 'free', 'G51', 'O74'], // Third column
    ['B1', 'I26', 'N34', 'G59', 'O75'], // Fourth column
    ['B14', 'I20', 'N31', 'G57', 'O72'], // Fifth column
    ['B2', 'B14', 'O70', 'O72'] // Corner
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
  winningNumbers.includes('B3') &&
  winningNumbers.includes('O65') &&
  winningNumbers.includes('O67');
  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 5</div>
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
      <button onClick={ handleGoBack} className={styles.good}>Additional</button>
      <button onClick={handleResetAndNavigate} className={styles.add}>New Bingo</button>
      </div>
      
    </div>
  );
}

export default Card5;