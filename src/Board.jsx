import { useEffect, useRef, useState } from 'react';
import './App.css';
import Line from './Line';
import Input from './Input';

const API_URL = '/api/words';
const charLength = 5;

export default function Board() {
  const [randomWord, setRandomWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [input, setInput] = useState([]);
  const [currentGuesses, setCurrentGuesses] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetCount, setResetCount] = useState(0);

  const lineRef = useRef([]);
  const inputRef = useRef([]);
  const formRef = useRef(null);

  // Fetch data after loading
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(API_URL);
      const word = await response.json(API_URL);
      const selectedWord = word[Math.floor(Math.random() * word.length)];
      setRandomWord(selectedWord);
    };

    fetchWords();
    initializeInput();
  }, [resetCount]);

  // When currentGuesses changes initialize loading and reset input focus
  useEffect(() => {
    initializeInput();
  }, [currentGuesses]);

  // when input changes, current guesses changes
  useEffect(() => {
    if (currentGuesses > guesses.length - 1) return;
    const guessesCopy = [...guesses];
    guessesCopy[currentGuesses] = input;
    setGuesses(guessesCopy);
  }, [input]);

  // handle input value
  const handleInput = (e, index) => {
    // Check if is game Lose
    setErrorMessage(null);
    if (currentGuesses > guesses.length - 1) return;
    const newInputChar = e.target.value.trim().slice(-1).toUpperCase();
    // Verify if it is english char
    const charCode = newInputChar.charCodeAt();
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122)
    ) {
      setErrorMessage('Please enter english alphabet.');
      return;
    }

    // add style and update input state
    const inputCopy = [...input];

    // add style to certain input based on value
    if (newInputChar) {
      inputRef.current[index < charLength - 1 ? index + 1 : index].focus();
      inputRef.current[index].classList.add('valid');
    } else if (!newInputChar) {
      inputRef.current[index].classList.remove('valid');
    }

    inputCopy[index] = newInputChar;
    setInput(inputCopy);
  };

  const handleKeyDown = (e, index) => {
    setErrorMessage('');
    if (e.key === 'Backspace') {
      const inputCopy = [...input];
      if (e.target.value) {
        inputCopy[index] = '';
        inputRef.current[index].classList.remove('valid');
        setInput(inputCopy);
        return;
      } else if (index > 0) {
        e.preventDefault();
        inputRef.current[index > 0 ? index - 1 : 0].focus();
      }
    } else if (e.key === 'ArrowRight') {
      inputRef.current[index < charLength - 1 ? index + 1 : index].focus();
    } else if (e.key === 'ArrowLeft') {
      inputRef.current[index > 0 ? index - 1 : 0].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rowValue = guesses[currentGuesses].join('').trim();
    if (!rowValue || rowValue.length < charLength) {
      setErrorMessage('Please enter 5 letters before submit.');
      return;
    }
    checkAnswers();
    if (currentGuesses >= guesses.length - 1) {
      setIsLose(true);
      return;
    }

    if (rowValue === randomWord) {
      setIsWin(true);
      return;
    }

    setCurrentGuesses((prev) => prev + 1);
  };

  const initializeInput = () => {
    const inputArray = [];
    for (let i = 0; i < charLength; i++) {
      inputArray.push('');
    }
    inputRef.current.forEach((element) => {
      element.classList.remove('valid');
    });
    inputRef.current[0].focus();
    setInput(inputArray);
  };

  const checkAnswers = () => {
    const currentLine = lineRef.current[currentGuesses];
    for (let i = 0; i < charLength; i++) {
      let className = 'tiles ';
      if (guesses[currentGuesses][i] === randomWord[i]) {
        className += 'green';
        currentLine.children[i].className = className;
      } else if (randomWord.includes(guesses[currentGuesses][i])) {
        className += 'yellow';
        currentLine.children[i].className = className;
      } else {
        className += 'grey';
        currentLine.children[i].className = className;
      }
    }
  };

  const reset = () => {
    setResetCount((prev) => prev + 1);
    setIsLose(false);
    setIsWin(false);
    setCurrentGuesses(0);
    setGuesses(Array(6).fill(null));
    lineRef.current.forEach((line) => {
      [...line.children].forEach((tile) => (tile.classList = 'tiles'));
    });
  };

  const resultMap = {
    win: { content: 'You Win!', className: 'win' },
    lose: { content: 'Game Lose', className: 'lose' },
  };

  const resultKey = isWin ? 'win' : isLose ? 'lose' : null;

  return (
    <>
      {resultKey && (
        <div className='result'>{resultMap[resultKey].content}</div>
      )}
      <div className='main-container'>
        <h1 className='game-title'>Wordle Game</h1>
        <p className='game-rule'>Guess the word in 6 tries.</p>
        <p className='game-answer'>
          {`Answer: `}
          {isLose || isWin ? (
            <strong className='random-word'>{randomWord}</strong>
          ) : (
            '??????'
          )}
        </p>

        {guesses.map((guess, index) => {
          return (
            <Line
              guess={guess ?? ''}
              charLength={charLength}
              key={index}
              randomWord={randomWord}
              ref={(el) => (lineRef.current[index] = el)}
            />
          );
        })}
        <form className='form' onSubmit={handleSubmit} ref={formRef}>
          {errorMessage && <p className='error'>{errorMessage}</p>}
          <div className='input-container'>
            {Array(charLength)
              .fill('')
              .map((_, index) => (
                <Input
                  key={index}
                  id={index}
                  input={input}
                  onChange={handleInput}
                  ref={(el) => (inputRef.current[index] = el)}
                  onKeyDown={handleKeyDown}
                  isWin={isWin}
                  isLose={isLose}
                />
              ))}
          </div>
          {!isLose && !isWin && (
            <button type='submit' className='button'>
              SUBMIT
            </button>
          )}
          {(isLose || isWin) && (
            <button type='click' className='button' onClick={reset}>
              Play Again
            </button>
          )}
        </form>
      </div>

      {resultKey && (
        <div className='result'>{resultMap[resultKey].content}</div>
      )}
    </>
  );
}
