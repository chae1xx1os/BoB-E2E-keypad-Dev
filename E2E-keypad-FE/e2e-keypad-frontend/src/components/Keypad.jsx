import React, { useEffect, useState } from 'react';
import { fetchKeypadData } from '../services/api';
import '../styles/Keypad.css';

// SHA-256 해시 함수
async function hashInput(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const Keypad = ({ onSubmit = (values) => console.log('Submitted values:', values) }) => {
    const [keypadData, setKeypadData] = useState(null);
    const [inputValues, setInputValues] = useState([]);
    const [hashedValues, setHashedValues] = useState([]);

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

    const handleClick = async (key) => {
        if (key !== "blank" && inputValues.length < 6) {
            const newInputValues = [...inputValues, key];
            setInputValues(newInputValues);

            const hashedKey = await hashInput(key);
            const newHashedValues = [...hashedValues, hashedKey];
            setHashedValues(newHashedValues);

            if (newInputValues.length === 6) {
                alert(`Hashed Input: \n${newHashedValues.join('\n')}`);
                window.location.reload(); // 페이지 새로고침
            }
        }
    };

    const handleDelete = () => {
        setInputValues(inputValues.slice(0, -1)); // 마지막 입력값 삭제
        setHashedValues(hashedValues.slice(0, -1)); // 마지막 해시값 삭제
    };

    const handleClear = () => {
        setInputValues([]); // 모든 입력값 초기화
        setHashedValues([]); // 모든 해시값 초기화
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
