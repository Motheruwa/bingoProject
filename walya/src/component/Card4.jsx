import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
import Replay from './Replay';
function Card4() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const [animateCurrent, setAnimateCurrent] = useState(false);
      const [currentNumber, setCurrentNumber] = useState('');
      useEffect(() => {
        if (calledNumbers.size > 0) {
          setCurrentNumber(Array.from(calledNumbers).pop());
        }
        // eslint-disable-next-line
      }, []);
    
      useEffect(() => {
        setAnimateCurrent(true);
        
        
        const timeout = setTimeout(() => {
          setAnimateCurrent(false);
        }, 2000); // Duration of the 'current' animation
        
        return () => clearTimeout(timeout);
        }, [currentNumber]);
  const navigate = useNavigate();
  const generateBingoCard = () => {
      const bingoCard = {
        B: [6, 13, 7, 3, 12],
        I: [20, 25, 23, 16, 19],
        N: [38, 43, 'free', 32, 31],
        G: [51, 56, 48, 47, 52],
        O: [66, 69, 74, 68, 62]
      };
  
      // Set the center cell as a free space
      bingoCard.N[2] = 'free';
      return bingoCard;
    };
  
    const checkWin = () => {
      const winConditions = [
        ['B6', 'B13', 'B7', 'B3', 'B12'], // First row (B)
        ['I20', 'I25', 'I23', 'I16', 'I19'], // Second row (I)
        ['N38', 'N43', 'free', 'N32', 'N31'], // Third row (N)
        ['G51', 'G56', 'G48', 'G47', 'G52'], // Fourth row (G)
        ['O66', 'O69', 'O74', 'O68', 'O62'], // Fifth row (O)
        ['B6', 'I25', 'free', 'G47', 'O62'], // Top-left to bottom-right diagonal
        ['O66', 'G56', 'free', 'I16', 'B12'], // Top-right to bottom-left diagonal
        ['B6', 'I20', 'N38', 'G51', 'O66'], // First column
        ['B13', 'I25', 'N43', 'G56', 'O69'], // Second column
        ['B7', 'I23', 'free', 'G48', 'O74'], // Third column
        ['B3', 'I16', 'N32', 'G47', 'O68'], // Fourth column
        ['B12', 'I19', 'N31', 'G52', 'O62']  // Fifth column
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
      localStorage.removeItem('sequenceIndex');
  
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
    winningNumbers.includes('B3') &&
    winningNumbers.includes('B9') &&
    winningNumbers.includes('O69') &&
    winningNumbers.includes('O63');
  return (
     <div className={styles.container}>
      <Replay/>
              <div className={styles.current11}>
                  <div className={`${styles.current} ${animateCurrent ? styles.animated : ''}`}>
                    <h3>{currentNumber}</h3>
                  </div>
                </div>
                <div className={styles.cont}>
                <div className={styles.cardnumber}>Card Number 4</div>
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
              
              
            </div>
  );
}

export default Card4;