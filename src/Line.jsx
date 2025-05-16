import React, { forwardRef } from 'react';
const Line = forwardRef(({ guess, charLength }, lineRef) => {
  const tiles = [];
  for (let i = 0; i < charLength; i++) {
    tiles.push(
      <div className='tiles' key={i}>
        {guess[i]}
      </div>
    );
  }

  return (
    <div className='line' ref={lineRef}>
      {tiles}
    </div>
  );
});

export default Line;
