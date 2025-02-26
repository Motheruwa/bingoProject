import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
import Replay from './Replay';
function Card10() {
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
        B: [2, 6, 7, 10, 1],
        I: [20, 29, 27, 21, 25],
        N: [41, 39, 'free', 36, 37],
        G: [48, 46, 55, 60, 49],
        O: [75, 68, 63, 61, 67]
      };
  
      // Set the center cell as a free space
      bingoCard.N[2] = 'free';
  
      return bingoCard;
    };
  
    const checkWin = () => {
      const winConditions = [
        ['B2', 'B6', 'B7', 'B10', 'B1'], // First row (B)
        ['I20', 'I29', 'I27', 'I21', 'I25'], // Second row (I)
        ['N41', 'N39', 'free', 'N36', 'N37'], // Third row (N)
        ['G48', 'G46', 'G55', 'G60', 'G49'], // Fourth row (G)
        ['O75', 'O68', 'O63', 'O61', 'O67'], // Fifth row (O)
        ['B2', 'I29', 'free', 'G60', 'O67'], // Top-left to bottom-right diagonal
        ['O75', 'G46', 'free', 'I21', 'B1'], // Top-right to bottom-left diagonal
        ['B2', 'I20', 'N41', 'G48', 'O75'], // First column
        ['B6', 'I29', 'N39', 'G46', 'O68'], // Second column
        ['B7', 'I27', 'free', 'G55', 'O63'], // Third column
        ['B10', 'I21', 'N36', 'G60', 'O61'], // Fourth column
        ['B1', 'I25', 'N37', 'G49', 'O67']  // Fifth column
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
    winningNumbers.includes('B11') &&
    winningNumbers.includes('B6') &&
    winningNumbers.includes('O75') &&
    winningNumbers.includes('O61');
  return (
    <div className={styles.container}>
      <Replay/>
                          <div className={styles.current11}>
                              <div className={`${styles.current} ${animateCurrent ? styles.animated : ''}`}>
                                <h3>{currentNumber}</h3>
                              </div>
                            </div>
                            <div className={styles.cont}>
                            <div className={styles.cardnumber}>Card Number 10</div>
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

export default Card10;