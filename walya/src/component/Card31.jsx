import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/Card.module.css'; // Import the CSS module for styling
import { useNavigate } from 'react-router-dom';
import Win from '../audio/WIN.mp4'
import Notwin from '../audio/NOTWIN.mp4'
import Replay from './Replay';
function Card31() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calledNumbers = new Set(JSON.parse(params.get('calledNumbers')));
  const [animateCurrent, setAnimateCurrent] = useState(false);
        const [currentNumber, setCurrentNumber] = useState("");
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
        B: [5, 9, 4, 3, 6],
        I: [16, 23, 26, 20, 25],
        N: [35, 42, 'free', 45, 44],
        G: [49, 60, 56, 50, 54],
        O: [70, 68, 73, 61, 74]
      };
  
      // Set the center cell as a free space
      bingoCard.N[2] = 'free';
  
      return bingoCard;
    };
  
    const checkWin = () => {
      const winConditions = [
        ['B5', 'B9', 'B4', 'B3', 'B6'], // First row (B)
        ['I16', 'I23', 'I26', 'I20', 'I25'], // Second row (I)
        ['N35', 'N42', 'free', 'N45', 'N44'], // Third row (N)
        ['G49', 'G60', 'G56', 'G50', 'G54'], // Fourth row (G)
        ['O70', 'O68', 'O73', 'O61', 'O74'], // Fifth row (O)
        ['B5', 'I23', 'free', 'G50', 'O74'], // Top-left to bottom-right diagonal
        ['O70', 'G60', 'free', 'I20', 'B6'], // Top-right to bottom-left diagonal
        ['B5', 'I16', 'N35', 'G49', 'O70'], // First column
        ['B9', 'I23', 'N42', 'G60', 'O68'], // Second column
        ['B4', 'I26', 'free', 'G56', 'O73'], // Third column
        ['B3', 'I20', 'N45', 'G50', 'O61'], // Fourth column
        ['B6', 'I25', 'N44', 'G54', 'O74']  // Fifth column
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
    winningNumbers.includes('B9') &&
    winningNumbers.includes('B10') &&
    winningNumbers.includes('O63') &&
    winningNumbers.includes('O66');
  return (
    <div className={styles.container}>
      <Replay/>

                 <div className={styles.current11}>
                   <div
                     className={`${styles.current} ${
                       animateCurrent ? styles.animated : ""
                     }`}
                   >
                     <h3>{currentNumber}</h3>
                   </div>
                 </div>
                 <div className={styles.cont}>
                   <div className={styles.cardnumber}>Card Number 31</div>
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
                             const isCalled =
                               calledNumbers.has(`${letter}${number}`) ||
                               (number === "free" && calledNumbers.has("free"));
                             const isWinningNumber =
                               winningNumbers.includes(`${letter}${number}`) ||
                               (number === "free" && winningNumbers.includes("free"));
                             const isCornerWinning =
                               isFourCornersWinning &&
                               (letter === "B" || letter === "O") &&
                               (index === 0 || index === 4);
           
                             const cellClassName = isWinningNumber
                               ? isCornerWinning
                                 ? styles.cornerwinning
                                 : styles.winning
                               : isCalled
                               ? styles.called
                               : "";
                             return (
                               <td>
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
                     <button onClick={playWinSound} className={styles.good}>
                       Good Bingo
                     </button>
                     <button onClick={playNotwinSound} className={styles.add}>
                       Not Bingo
                     </button>
                     <button onClick={handleGoBack} className={styles.good}>
                       Additional
                     </button>
                     <button onClick={handleResetAndNavigate} className={styles.add}>
                       New Bingo
                     </button>
                   </div>
                 </div>
               </div>
  );
}

export default Card31;