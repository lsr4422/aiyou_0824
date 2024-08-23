import React, { useState, useRef } from 'react';
import '../styles/AudioPlayer.css';
import soundButton from '../static/soundButton.png'
import soundButtonStop from '../static/soundButtonStop.png'


const AudioPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null); // 오디오 URL을 저장할 상태
    const audioRef = useRef(null);

    const togglePlayPause = () => {
        if (!audioUrl) return;
        if (playing) {
            audioRef.current.pause(); // stop 대신 pause 사용
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleProgress = () => {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const loadAudio = async () => {
        try {
            const response = await fetch('http://localhost:8000/getsound'); // FastAPI 서버에 요청
            if (!response.ok) {
                throw new Error('오디오 파일을 불러오는 중 오류가 발생했습니다.');
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url); // 오디오 엘리먼트에 사용할 URL 설정
        } catch (error) {
            console.error('오디오 파일을 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <div className="audio-player">
            <div onClick={togglePlayPause}>
                <img
                    src={playing ? soundButtonStop : soundButton}
                    style={{ width: '50px', height: '50px', margin: '7px' }}
                    alt="Sound Button"
                />
            </div>

            {/* <div className="controls"> */}
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="load-audio" onClick={loadAudio}>load sound</button>
            {/* </div> */}
            <audio ref={audioRef} onTimeUpdate={handleProgress}>
                {audioUrl && <source src={audioUrl} type="audio/wav" />}
                브라우저가 오디오 엘리먼트를 지원하지 않습니다.
            </audio>
        </div>
    );
};

export default AudioPlayer;