import React, { useEffect, useState } from 'react';
import { fetchKeypadData } from '../services/api';
import '../styles/Keypad.css';

const Keypad = ({ onSubmit = (values) => console.log('Submitted values:', values) }) => {
    const [keypadData, setKeypadData] = useState(null);
    const [inputValues, setInputValues] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchKeypadData();
                setKeypadData(data);
            } catch (error) {
                console.error('Error fetching keypad data:', error);
            }
        };
        getData();
    }, []);

    const handleClick = (key) => {
        if (key !== "blank" && inputValues.length < 6) {
            const newInputValues = [...inputValues, key];
            setInputValues(newInputValues);

            if (newInputValues.length === 6) {
                alert(`SUCCESS - ${newInputValues.join(', ')}`);
                window.location.reload(); // 페이지 새로고침
            }
        }
    };

    const handleDelete = () => {
        setInputValues(inputValues.slice(0, -1)); // 마지막 입력값 삭제
    };

    const handleClear = () => {
        setInputValues([]); // 모든 입력값 초기화
    };

    const { layout } = keypadData || {};

    if (!keypadData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="keypad-container">
            <div className="input-display">
                {[...Array(6)].map((_, index) => (
                    <span key={index} className={`input-dot ${index < inputValues.length ? 'filled' : ''}`}></span>
                ))}
            </div>
            <div className="keypad">
                {layout.map((key, index) => (
                    <button
                        key={index}
                        className={`keypad-button ${key === 'blank' ? 'blank' : ''}`}
                        onClick={() => handleClick(key)}
                        style={{
                            backgroundImage: key !== "blank" ? `url(/images/${key}.png)` : 'none',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                    />
                ))}
            </div>
            <div className="keypad-controls">
                <button className="control-button" onClick={handleClear}>
                    <span role="img" aria-label="clear">🗑️</span> 전체 삭제
                </button>
                <button className="control-button" onClick={handleDelete}>
                    <span role="img" aria-label="delete">⬅️</span> 지우기
                </button>
            </div>
        </div>
    );
};

export default Keypad;
