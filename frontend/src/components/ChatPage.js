import '../styles/ChatPage.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import Popup from './PopupPage';

const ChatPage = () => {

    const [isToggled, setIsToggled] = useState(false);
    const [inputText, setInputText] = useState(''); // 입력 텍스트 상태


    const [generatedTexts, setGeneratedTexts] = useState([]); // 생성된 텍스트 상태 (배열)
    const [generatedZips, setGeneratedZips] = useState([]);

    const [selectedTypeButton, setSelectedTypeButton] = useState(null); // Type 행에서 선택된 버튼 상태
    const [selectedGenreButton, setSelectedGenreButton] = useState(null); // Genre 행에서 선택된 버튼 상태
    const [genreButtons, setGenreButtons] = useState([]); // 표시할 genre button 목록 업데이트
    const [typeButton, setTypeButton] = useState(null); // selected 된 Type 내용
    const [genreButton, setGenreButton] = useState(null); //selected 된 Genre 내용

    const [isLoading, setIsLoading] = useState(false);

    const [fileNames, setFileNames] = useState([]);//zip 파일 이름 저장





    const handleToggle = () => {
        setIsToggled(!isToggled);
        setInputText('');
        setGenreButtons([]);
        setSelectedGenreButton(null);
        setSelectedTypeButton(null);
        setTypeButton(null);
        setGenreButton(null);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleGenerate = async () => {
        // 선택된 Type 버튼과 Genre 버튼의 label이 있는지 확인
        const selectedTypeLabel = typeButton;
        const selectedGenreLabel = genreButton;

        // 조건: Text Input이 비어있지 않거나 두 버튼이 모두 선택된 경우에만 처리
        if (inputText.trim() || (selectedTypeLabel && selectedGenreLabel)) {

            setIsLoading(true);

            let combinedText = '';
            let postText = ''

            // 두 버튼이 모두 선택된 경우: 선택된 Type과 Genre의 내용을 결합
            if (selectedTypeLabel && selectedGenreLabel) {
                console.log(1)
                console.log(selectedGenreLabel)
                postText = selectedGenreLabel.charAt(0).toLowerCase() + selectedGenreLabel.slice(1);
                postText = postText.replace('/', 'and').replace('R&B', 'rhythm and blues').replace(' and Hardstyle', '')
                postText = `${selectedTypeLabel}_${postText}`
                combinedText = `${selectedTypeLabel} / ${selectedGenreLabel}`;
            } else {
                // 두 버튼이 선택되지 않은 경우: Input Text만 추가
                combinedText = inputText.trim();
                postText = inputText.trim();
            }
            console.log(combinedText)
            console.log(postText)

            try {
                // FormData 객체 생성 및 데이터 추가
                const formData = new FormData();
                formData.append('text', postText);
                // 서버에 POST 요청을 보내고 파일을 생성합니다.
                const response = await axios.post('/generate-file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'blob',
                });
                setGeneratedZips([...generatedZips, response.data])
                console.log('load file data finish')

                //파일명 저장
                const contentDisposition = response.headers['content-disposition'];
                let defaultFilename = "default_filename.zip";
                if (contentDisposition) {
                    const matches = contentDisposition.match(/filename="?(.+?)"?$/);
                    if (matches && matches.length > 1) {
                        defaultFilename = matches[1]; // 파일 이름 추출
                    }
                }
                setFileNames(prev => [...prev, defaultFilename]); // 파일 이름 배열 업데이트


                setIsLoading(false);
                // 새로운 텍스트를 배열에 추가

                setGeneratedTexts([...generatedTexts, combinedText]);

                // input 초기화
                // setInputText('');
                // setGenreButtons([]);
                // setSelectedGenreButton(null);
                // setSelectedTypeButton(null);
                // setTypeButton(null);
                // setGenreButton(null);
            } catch (error) {
                // 예상치 못한 에러가 발생한 경우
                alert('An unexpected error occurred: ' + error);
            } finally {
                setIsLoading(false);
                // setGeneratedTexts([...generatedTexts, combinedText]);

                // input 초기화
                setInputText('');
                setGenreButtons([]);
                setSelectedGenreButton(null);
                setSelectedTypeButton(null);
                setTypeButton(null);
                setGenreButton(null);
            }
        }
    };



    //type, genre 버튼 클릭 핸들러

    const handleTypeButtonClick = (label, index) => {
        setSelectedTypeButton(index); // Type 버튼 선택
        setTypeButton(label)
        // 클릭된 버튼에 따라 아래 버튼의 내용을 변경합니다.
        switch (label) {
            case "Bass":
                setGenreButtons(["Drum and Bass", "Dubstep", "Hardcore / Hardstyle", "Hip-Hop R&B", "Bass House", "Synthwave", "Techno", "Trap", "Midtempo", "Breakbeat / Breaks", "ALL"]);
                break;
            case "Keys":
                setGenreButtons(["Cinematic", "Hip-Hop R&B", "House", "Synthwave", "ALL"]);
                break;
            case "Lead":
                setGenreButtons(["Drum and Bass", "Hardcore / Hardstyle", "Hip-Hop R&B", "House", "Synthwave", "Techno", "Trance", "ALL"]);
                break;
            case "Pad":
                setGenreButtons(["Cinematic", "Ambient", "Drum and Bass", "All"]);
                break;
            case "Atmosphere":
                setGenreButtons(["Cinematic", "Ambient", "All"]);
                break;
            // 추가 케이스를 필요에 따라 설정
            default:
                setGenreButtons(["All"]);
                break;
        }
        setGenreButton(null);
        setSelectedGenreButton(null);
    };

    const handleGenreButtonClick = (label, index) => {
        setSelectedGenreButton(index); // Genre 버튼 선택
        setGenreButton(label)
    };







    const handleDownload = (fileData, fileName) => {
        if (!fileData) {
            console.error('No file data available');
            return;
        }; // Check if there's any file data
        // 파일을 다운로드합니다.
        const url = window.URL.createObjectURL(new Blob([fileData]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };





    // popup 창
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState({ title: '', body: '' });

    const handleOpenPopup = (content) => {
        setPopupContent(content);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };














    return (
        <div className="chat-page">
            <div className='menu-box'>
                <h2 className='menu' onClick={() => handleOpenPopup({
                    title: 'Requirements',
                    body:
                        <div>
                            <p>We specialize in creating Vital presets.</p>
                            <br></br>
                            <p>To utilize these presets, <span style={{ color: 'red' }}><strong>you will need to install the Vital synthesizer</strong></span>, which is available for free.</p>
                            <p>(https://vital.audio/)</p>
                            <br></br>
                            <p>This software is essential for accessing and using the custom sound designs we provide.</p>
                            <br></br>
                            <p>Make sure to install Vital to fully explore the potential of our presets in your music production.</p>
                        </div>
                })}>
                    Requirements
                </h2>
                <h2 className='menu' onClick={() => handleOpenPopup({
                    title: 'How to use',
                    body:
                        <div>
                            <p>1-1.</p>
                            <p><strong>[Prompt Mode]</strong></p>
                            <p>Write the feeling or emotion you want to express and click ‘Generate’.</p>
                            <p>Note: <span style={{ color: 'red' }}><strong>This may not work well if the prompt is too specific or technical.</strong></span> In that case, try using <span style={{ color: '#8a2be2' }}><strong>“Advanced Mode”</strong></span> instead.</p>
                            <p>1-2. <strong>[Advanced Mode]</strong></p>
                            <p>Choose [Genre] & [Sound Type] you want to create and click ‘Generate’.</p>
                            <br></br>
                            <p>2. Unzip the downloaded zip file into your […/Vital/User/Presets] folder.</p>
                            <p>3. In Vital, run ‘Browse Presets’ and select [User/Presets] directory in the preset browser.</p>
                            <p>4. If you don’t have an external MIDI controller, you can use the A, S, D, F … keys to play.</p>
                            <p>(Use Z and X keys to transpose octaves.)</p>
                        </div>
                })}>
                    How to use
                </h2>

                <h2 className='menu' onClick={() => handleOpenPopup({
                    title: 'Troubleshooting',
                    body:
                        <div>
                            <p>Q. The generated preset’s sound is too quiet/not producing any sound.</p>
                            <p>- Try adjusting the following values:</p>
                            <ul>
                                <li>Master volume at the top right of the Vital UI</li>
                                <li>Decay/release from Env1</li>
                                <li>Equalizer in Effects section</li>
                                <li>On/Off Osc 1~3 and Smp (sample)</li>
                                <li>Osc 1~3 and sample level</li>
                                <li>Osc 1~3 Transpose</li>
                                <li>Adjust distortion in the FX section</li>
                            </ul>
                            <p>Q. The generated preset is producing a noise-like sound.</p>
                            <p>A. Try adjusting the sample level.</p>
                            <p><strong>Additional Tips</strong></p>
                            <ul>
                                <li>Try adjusting Macro1,2,3,4</li>
                                <li>Try turning on/off OSC1~3 and sample</li>
                                <li>Try changing LFO shapes</li>
                                <li>Try turning on/off each module in FX section</li>
                            </ul>
                            <p style={{ color: 'red' }}><strong>In very rare cases, an AI model may generate an invalid preset.<br></br> In this case, try creating a new preset with the same content.</strong></p>

                        </div>
                })}>
                    Troubleshooting
                </h2>

                <Popup isOpen={isPopupOpen} content={popupContent} onClose={handleClosePopup} />
            </div>
            {!isLoading ? (
                <div className="prompt-box">
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="toggle"
                            className="toggle-input"
                            checked={isToggled}
                            onChange={handleToggle}
                        />
                        <label htmlFor="toggle" className="toggle-label">
                            <span className="toggle-ball"></span>
                        </label>
                        <span className="prompt-label">
                            {isToggled ? "Advanced Mode" : "Prompt Mode"}
                        </span>
                    </div>
                    {isToggled ? (
                        <div className="advanced-mode">
                            <div className="buttons-row">
                                {["Bass", "Keys", "Lead", "Pad", "Atmosphere", "Chord", "Drums", "Fx", "Pluck", "Seq", "Synth", "Others", "Reese", "Sub", "Drone"].map((label, index) => (
                                    <React.Fragment key={index}>
                                        <button
                                            className={`mode-button pink ${selectedTypeButton === index ? 'selected' : ''}`}
                                            onClick={() => handleTypeButtonClick(label, index)}
                                        >
                                            {label}
                                        </button>
                                        {index === 2 && <div style={{ flexBasis: '100%', height: 0 }} />}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="buttons-row">
                                {genreButtons.map((label, index) => (
                                    <button
                                        key={index}
                                        className={`mode-button blue ${selectedGenreButton === index ? 'selected' : ''}`}
                                        onClick={() => handleGenreButtonClick(label, index)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <textarea
                            className="prompt-textarea"
                            placeholder="Describe the type of sound you would like to create"
                            value={inputText}
                            onChange={handleInputChange}
                        ></textarea>
                    )}

                    <button className="generate-button" onClick={handleGenerate}>
                        Generate
                    </button>
                </div>

            ) : (
                <div className="prompt-box">
                    <h2>Now we are generating</h2>
                    <div className="spinner"></div>
                </div>
            )
            }

            {/* HISTORY CONTAINER */}
            <div className="generated-output-container">
                {generatedTexts.slice().reverse().map((text, index) => (
                    <div key={index} className="generated-output">
                        <ul><li><h3>History {generatedTexts.length - 1 - index}</h3></li></ul>

                        <p style={{ marginBottom: '10px' }}>{text}</p>
                        <button className="download-button" onClick={() => handleDownload(generatedZips[generatedZips.length - 1 - index], fileNames[fileNames.length - 1 - index])}>
                            Download
                        </button>
                    </div>
                ))}
            </div>
            {/* <AudioPlayer /> */}
        </div>
    );
};

export default ChatPage;
