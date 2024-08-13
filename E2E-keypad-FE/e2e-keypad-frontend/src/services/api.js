// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/keypad';

export const fetchKeypadData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching keypad data:', error);
        throw error;
    }
};
