import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
function Card48() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();
  const generateBingoCard = () => {
    const bingoCard = {
      B: [5, 9, 15, 14, 6],
      I: [19, 24, 29, 17, 25],
      N: [40, 33, 'free', 45, 34],
      G: [60, 57, 49, 58, 56],
      O: [75, 66, 64, 69, 73]
    };

    // Set the center cell as a free space
    bingoCard.N[2] = 'free';

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
      ['B5', 'B9', 'B15', 'B14', 'B6'], // First row (B)
      ['I19', 'I24', 'I29', 'I17', 'I25'], // Second row (I)
      ['N40', 'N33', 'free', 'N45', 'N34'], // Third row (N)
      ['G60', 'G57', 'G49', 'G58', 'G56'], // Fourth row (G)
      ['O75', 'O66', 'O64', 'O69', 'O73'], // Fifth row (O)
      ['B5', 'I24', 'free', 'G58', 'O73'], // Top-left to bottom-right diagonal
      ['O75', 'G57', 'free', 'I17', 'B6'], // Top-right to bottom-left diagonal
      ['B5', 'I19', 'N40', 'G60', 'O75'], // First column
      ['B9', 'I24', 'N33', 'G57', 'O66'], // Second column
      ['B15', 'I29', 'free', 'G49', 'O64'], // Third column
      ['B14', 'I17', 'N45', 'G58', 'O69'], // Fourth column
      ['B6', 'I25', 'N34', 'G56', 'O73'], // Fifth column
      ['B5', 'B6', 'O75', 'O73'], // corner
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
  winningNumbers.includes('B6') &&
  winningNumbers.includes('O61') &&
  winningNumbers.includes('O67');

  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 48</div>
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

export default Card48;