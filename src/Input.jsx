import React from 'react';

function Input({ id, input, onChange }) {
  return (
    <>
      <input
        type='text'
        className='input'
        value={input[id] ?? ''}
        onChange={(e) => {
          onChange(e, id);
        }}
        name={id}
      />
    </>
  );
}

export default Input;
