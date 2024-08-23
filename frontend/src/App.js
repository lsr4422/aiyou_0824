import React, { useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ChagPage from './components/ChatPage';
function App() {
  const targetRef = useRef(null);

  const startBtnClick = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <div className="App">
      <Header startBtnClick={startBtnClick} />
      <div ref={targetRef}>
        <ChagPage/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
