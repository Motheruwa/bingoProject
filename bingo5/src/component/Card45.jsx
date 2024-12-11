import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
function Card45() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();
  const generateBingoCard = () => {
    const bingoCard = {
      B: [4, 2, 7, 11, 1],
      I: [18, 27, 30, 26, 19],
      N: [33, 35, 'free', 38, 42],
      G: [52, 50, 60, 47, 48],
      O: [73, 66, 64, 72, 65]
    };

    // Set the center cell as a free space
    bingoCard.N[2] = 'free';

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
      ['B4', 'B2', 'B7', 'B11', 'B1'], // First row (B)
      ['I18', 'I27', 'I30', 'I26', 'I19'], // Second row (I)
      ['N33', 'N35', 'free', 'N38', 'N42'], // Third row (N)
      ['G52', 'G50', 'G60', 'G47', 'G48'], // Fourth row (G)
      ['O73', 'O66', 'O64', 'O72', 'O65'], // Fifth row (O)
      ['B4', 'I27', 'free', 'G47', 'O65'], // Top-left to bottom-right diagonal
      ['O73', 'G50', 'free', 'I26', 'B1'], // Top-right to bottom-left diagonal
      ['B4', 'I18', 'N33', 'G52', 'O73'], // First column
      ['B2', 'I27', 'N35', 'G50', 'O66'], // Second column
      ['B7', 'I30', 'free', 'G60', 'O64'], // Third column
      ['B11', 'I26', 'N38', 'G47', 'O72'], // Fourth column
      ['B1', 'I19', 'N42', 'G48', 'O65'], // Fifth column
      ['B4', 'B1', 'O73', 'O65'], 
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
  winningNumbers.includes('B9') &&
  winningNumbers.includes('B8') &&
  winningNumbers.includes('O70') &&
  winningNumbers.includes('O69');

  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 45</div>
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

export default Card45;