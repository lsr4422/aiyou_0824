import React from 'react';
import '../styles/PopupPage.css'; // 팝업 스타일을 위한 CSS 파일 (아래에서 설명)

const PopupPage = ({ isOpen, content, onClose }) => {
    if (!isOpen) return null; // 팝업이 열리지 않으면 아무것도 렌더링하지 않음

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2 className="popup-title">{content.title}</h2>
                <div className='popup-body'>{content.body}</div>
            </div>
        </div>
    );
};

export default PopupPage;
