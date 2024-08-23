import React from 'react';
import '../styles/Footer.css'; // CSS 파일을 import
import logo from '../static/logo_nobackground.png'

const Footer = () => {
  return (
    <footer className="footer">
      <img src={logo} alt="Footer Logo" style={{ width: '220px'}} />
    </footer>
  );
};

export default Footer;
