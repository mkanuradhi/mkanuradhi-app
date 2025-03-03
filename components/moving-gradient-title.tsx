import React from 'react';
import "./moving-gradient-title.scss";

interface MovingGradientTitleProps {
  text: string;
}

const MovingGradientTitle: React.FC<MovingGradientTitleProps> = ( {text} ) => {
  return (
    <>
      <div className="moving-gradient-title">
        <h1 className="gradient-text">{text}</h1>
      </div>
    </>
  )
}

export default MovingGradientTitle;