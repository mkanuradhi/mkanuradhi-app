import React from 'react';
import "./moving-gradient-title.scss";

interface MovingGradientTitleProps {
  text: string;
  className?: string;
}

const MovingGradientTitle = ({ text, className }: MovingGradientTitleProps) => {
  return (
    <>
      <div className="moving-gradient-title">
        <h1 className={`gradient-text ${className ?? ''}`}>{text}</h1>
      </div>
    </>
  )
}

export default MovingGradientTitle;