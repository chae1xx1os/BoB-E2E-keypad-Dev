import React from 'react';
import Keypad from './components/Keypad';
import './App.css';

function App() {
    const handleSubmit = (inputValues) => {
        console.log('Submitted values:', inputValues);
        // 여기에서 입력된 값을 백엔드로 전송하는 로직을 추가할 수 있습니다.
    };

    return (
        <div className="App">
            <Keypad onSubmit={handleSubmit} />
        </div>
    );
}

export default App;
