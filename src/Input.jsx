import React, { forwardRef } from 'react';

const Input = forwardRef(
  ({ id, input, onChange, onKeyDown, isWin, isLose }, inputRef) => {
    return (
      <>
        <input
          type='text'
          className='input'
          value={input[id] || ''}
          onChange={(e) => {
            onChange(e, id);
          }}
          onKeyDown={(e) => onKeyDown(e, id)}
          name={id}
          ref={inputRef}
          disabled={isWin || isLose ? true : false}
        />
      </>
    );
  }
);

export default Input;
