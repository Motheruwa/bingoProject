import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
function Card34() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();
  const generateBingoCard = () => {
    const bingoCard = {
      B: [1, 14, 9, 13, 8],
      I: [27, 20, 30, 17, 21],
      N: [37, 35, 'free', 43, 33],
      G: [48, 50, 60, 51, 47],
      O: [73, 63, 72, 66, 64]
    };

    // Set the center cell as a free space
    bingoCard.N[2] = 'free';

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
      ['B1', 'B14', 'B9', 'B13', 'B8'], // First row (B)
      ['I27', 'I20', 'I30', 'I17', 'I21'], // Second row (I)
      ['N37', 'N35', 'free', 'N43', 'N33'], // Third row (N)
      ['G48', 'G50', 'G60', 'G51', 'G47'], // Fourth row (G)
      ['O73', 'O63', 'O72', 'O66', 'O64'], // Fifth row (O)
      ['B1', 'I20', 'free', 'G51', 'O64'], // Top-left to bottom-right diagonal
      ['O73', 'G50', 'free', 'I17', 'B8'], // Top-right to bottom-left diagonal
      ['B1', 'I27', 'N37', 'G48', 'O73'], // First column
      ['B14', 'I20', 'N35', 'G50', 'O63'], // Second column
      ['B9', 'I30', 'free', 'G60', 'O72'], // Third column
      ['B13', 'I17', 'N43', 'G51', 'O66'], // Fourth column
      ['B8', 'I21', 'N33', 'G47', 'O64'], // Fifth column
      ['B1', 'B8', 'O73', 'O64'], // corner
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
  winningNumbers.includes('B4') &&
  winningNumbers.includes('B3') &&
  winningNumbers.includes('O70') &&
  winningNumbers.includes('O73');
  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 34</div>
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

export default Card34;