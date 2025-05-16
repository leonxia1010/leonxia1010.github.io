import React from 'react';

function Line({ guess, charLength, isChecked, randomWord }) {
  const tiles = [];
  for (let i = 0; i < charLength; i++) {
    let className = 'tiles ';
    if (isChecked) {
      if (guess[i] === randomWord[i]) {
        className += 'green';
      } else if (randomWord.includes(guess[i])) {
        className += 'yellow';
      } else {
        className += 'grey';
      }
    }

    tiles.push(
      <div className={className} key={i}>
        {guess[i]}
      </div>
    );
  }

  return <div className='line'>{tiles}</div>;
}

export default Line;
