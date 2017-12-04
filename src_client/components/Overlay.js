import React from 'react';

const Overlay = (props) => {
  return (
    <div className={props.isLoading ? 'overlay' : 'overlay d-none'}>
      <img src="/img/load.gif" alt="" />
    </div>
  );
}

export default Overlay;