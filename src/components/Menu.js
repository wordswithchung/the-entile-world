import React, { useState } from 'react';
import './Menu.scss';

export const Menu = ({ onClickHandler }) => {
  const [isOpen, toggleMenu] = useState(false);
  const clickity = (level) => {
    toggleMenu(false);
    onClickHandler(level);
  }
  return (
    <div className="MenuComponent">
      <span role="img" aria-label="hamburger" onClick={() => toggleMenu(!isOpen)}>🍔</span>
      { isOpen && (
        <div className="MenuComponent-menu">
          Start new game:
          <div className="buttons">
            <button onClick={() => clickity(1) && toggleMenu(false)}>EASY</button>
            <button onClick={() => clickity(2)}>MEDIUM</button>
            <button onClick={() => clickity(3)}>HARD</button>
          </div>
        </div> 
      ) }
    </div>
  )
  
}