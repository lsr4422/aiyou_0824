import React  from 'react';
import { useEffect, useRef } from 'react';
import '../styles/Header.css';
import anime from "animejs";

const Header = ({ startBtnClick }) => {
  const textRef = useRef(null);
  useEffect(() => {
    const textWrapper = textRef.current;
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );
  
    anime.timeline({ loop: false })
      .add({
        targets: '.letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 500,
        delay: (el, i) => 50 * (i + 1),
      });
  }, []);
  




  return (
    <header className="header">
      <h1 className='letter'  ref={textRef}>The Only Sound for Your Music</h1>
      <p className='letter'  ref={textRef}>Text-to-Synth Preset Generator</p>
      <button className="custom-button" onClick={startBtnClick}>
            Get Started
      </button>
      
  
    </header>
  );
};

export default Header;
