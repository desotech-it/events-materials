const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// --- SECURITY ---
const ADMIN_API_KEY = 'deso-dino-secret-2026';

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SCORES_FILE = path.join(__dirname, 'data', 'scores.json');

// Middleware di protezione per l'area admin
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === ADMIN_API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }
};

// Helper to read JSON
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading file:', filePath, err);
    return [];
  }
};

// Helper to write JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing file:', filePath, err);
  }
};

// --- PUBLIC API ENDPOINTS ---

// Register User (Nome, Cognome, Nickname, Email)
app.post('/api/register', (req, res) => {
  const { firstName, lastName, nickname, email } = req.body;
  
  if (!firstName || !lastName || !nickname || !email) {
    return res.status(400).json({ error: 'All fields are required (First Name, Last Name, Nickname, Email).' });
  }

  let users = readData(USERS_FILE);
  const existingUser = users.find(u => u.email === email);
  const userData = { 
    firstName, 
    lastName, 
    nickname, 
    email, 
    createdAt: new Date().toISOString() 
  };
  
  if (!existingUser) {
    users.push(userData);
  } else {
    // Aggiorna i dati se l'email esiste già
    const index = users.findIndex(u => u.email === email);
    users[index] = userData;
  }
  
  writeData(USERS_FILE, users);
  res.status(200).json({ message: 'User registered successfully', nickname });
});

// Submit Score (Usa il nickname per la classifica)
app.post('/api/scores', (req, res) => {
  const { username, score } = req.body; // 'username' qui è il nickname del giocatore
  if (!username || score === undefined) {
    return res.status(400).json({ error: 'Nickname and Score are required.' });
  }

  let scores = readData(SCORES_FILE);
  const scoreEntry = { username, score: parseInt(score), date: new Date().toISOString() };
  scores.push(scoreEntry);
  writeData(SCORES_FILE, scores);

  res.status(200).json({ message: 'Score submitted successfully' });
});

// Get Leaderboard (Top 10)
app.get('/api/leaderboard', (req, res) => {
  let scores = readData(SCORES_FILE);
  const sortedScores = scores.sort((a, b) => b.score - a.score);
  const topScores = [];
  const seenUsers = new Set();
  
  for (const entry of sortedScores) {
    if (!seenUsers.has(entry.username)) {
      topScores.push(entry);
      seenUsers.add(entry.username);
    }
    if (topScores.length === 10) break;
  }

  res.status(200).json(topScores);
});

// --- ADMIN API ENDPOINTS (PROTETTI) ---

app.get('/api/admin/users', adminAuth, (req, res) => {
  const users = readData(USERS_FILE);
  res.status(200).json(users);
});

app.get('/api/admin/scores', adminAuth, (req, res) => {
  const scores = readData(SCORES_FILE);
  res.status(200).json(scores);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
