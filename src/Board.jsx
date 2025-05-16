import { useEffect, useRef, useState, forwardRef } from 'react';
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

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(API_URL);
      const word = await response.json(API_URL);
      const selectedWord = word[Math.floor(Math.random() * word.length)];
      setRandomWord(selectedWord);
    };

    fetchWords();
    initializeInput();
  }, []);

  useEffect(() => {
    initializeInput();
  }, [currentGuesses]);

  useEffect(() => {
    if (!isWin) return;
    alert('You win');
  }, [isWin]);

  const handleInput = (e, index) => {
    if (currentGuesses > guesses.length - 1 || isWin) return;
    const newInputChar = e.target.value.trim().slice(-1).toUpperCase();
    const inputCopy = [...input];
    inputCopy[index] = newInputChar;
    console.log(inputCopy);
    setInput(inputCopy);
    setGuesses((prev) => {
      const copy = [...prev];
      copy[currentGuesses] = inputCopy;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rowValue = guesses[currentGuesses];
    if (!rowValue || rowValue.length < charLength || rowValue.includes(''))
      return;
    setCurrentGuesses((prev) => prev + 1);
    if (rowValue.join('') === randomWord) setIsWin(true);
  };

  const initializeInput = () => {
    const inputArray = [];
    for (let i = 0; i < charLength; i++) {
      inputArray.push('');
    }
    setInput(inputArray);
  };

  const handleReset = () => {
    setCurrentGuesses(0);
    setGuesses(Array(6).fill(null));
    setRandomWord('');
    setInput([]);
    setIsWin(false);
  };

  return (
    <div>
      {guesses.map((guess, index) => {
        return (
          <Line
            guess={guess ?? ''}
            charLength={charLength}
            key={index}
            isChecked={currentGuesses > index ? true : false}
            randomWord={randomWord}
          />
        );
      })}
      <form className='input-container' onSubmit={handleSubmit}>
        {Array(charLength)
          .fill(null)
          .map((_, index) => (
            <Input
              key={index}
              id={index}
              input={input}
              onChange={handleInput}
            />
          ))}
        <button type='submit'> submit</button>
        {isWin && (
          <button type='click' onClick={handleReset}>
            {' '}
            reset
          </button>
        )}
      </form>
    </div>
  );
}
