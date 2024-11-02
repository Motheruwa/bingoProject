import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
function Card33() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const navigate = useNavigate();
  const generateBingoCard = () => {
    const bingoCard = {
      B: [7, 6, 15, 2, 12],
      I: [30, 17, 18, 29, 26],
      N: [45, 44, 'free', 35, 31],
      G: [60, 58, 46, 50, 51],
      O: [73, 62, 69, 66, 65]
    };

    // Set the center cell as a free space
    bingoCard.N[2] = 'free';

    return bingoCard;
  };

  const checkWin = () => {
    const winConditions = [
      ['B7', 'B6', 'B15', 'B2', 'B12'], // First row (B)
      ['I30', 'I17', 'I18', 'I29', 'I26'], // Second row (I)
      ['N45', 'N44', 'free', 'N35', 'N31'], // Third row (N)
      ['G60', 'G58', 'G46', 'G50', 'G51'], // Fourth row (G)
      ['O73', 'O62', 'O69', 'O66', 'O65'], // Fifth row (O)
      ['B7', 'I17', 'free', 'G50', 'O65'], // Top-left to bottom-right diagonal
      ['O73', 'G58', 'free', 'I29', 'B12'], // Top-right to bottom-left diagonal
      ['B7', 'I30', 'N45', 'G60', 'O73'], // First column
      ['B6', 'I17', 'N44', 'G58', 'O62'], // Second column
      ['B15', 'I18', 'free', 'G46', 'O69'], // Third column
      ['B2', 'I29', 'N35', 'G50', 'O66'], // Fourth column
      ['B12', 'I26', 'N31', 'G51', 'O65'], // Fifth column
      ['B7', 'B12', 'O73', 'O65'] // corner
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
  winningNumbers.includes('B7') &&
  winningNumbers.includes('B8') &&
  winningNumbers.includes('O69') &&
  winningNumbers.includes('O68');
  return (
    <div className={styles.container}>
      <div className={styles.cardnumber}>Card Number 33</div>
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

export default Card33;