const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JSONBin API key and base URL
const JSONBIN_API_KEY = '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y'; // Replace with your actual JSONBin API key
const JSONBIN_BASE_URL = 'https://jsonbin.io/app/bins';

app.post('/ratings', async (req, res) => {
    const { movieId, rating } = req.body;

    try {
        const response = await axios.get(`${JSONBIN_BASE_URL}/66f19229ad19ca34f8ab5ec6`, {
            headers: {
                'Content-Type': 'application/json',
                '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y': JSONBIN_API_KEY,
            },
        });

        const data = response.data.record || [];

        // Append new rating
        data.push({ movieId, rating });

        // Save updated data back to JSONBin
        await axios.put(`${JSONBIN_BASE_URL}/66f19229ad19ca34f8ab5ec6`, { record: data }, {
            headers: {
                'Content-Type': 'application/json',
                '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y': JSONBIN_API_KEY,
            },
        });

        res.status(201).json({ movieId, rating });
    } catch (error) {
        res.status(400).json({ error: 'Error saving rating' });
    }
});

app.get('/ratings/:movieId', async (req, res) => {
    const { movieId } = req.params;

    try {
        const response = await axios.get(`${JSONBIN_BASE_URL}/66f19229ad19ca34f8ab5ec6`, {
            headers: {
                'Content-Type': 'application/json',
                '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y': JSONBIN_API_KEY,
            },
        });

        const ratings = response.data.record || [];
        const filteredRatings = ratings.filter(r => r.movieId === movieId);
        const averageRating = filteredRatings.reduce((acc, curr) => acc + curr.rating, 0) / filteredRatings.length || 0;

        res.status(200).json({ averageRating, count: filteredRatings.length });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching ratings' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
