const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let comments = []; // In-memory comments, replace with a database in production

// Endpoint to fetch comments
app.get('/api/comments', (req, res) => {
    res.json(comments);
});

// Endpoint to submit a comment
app.post('/api/comments', (req, res) => {
    comments.push(req.body); // Add new comment
    res.status(201).send(); // Respond back
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});