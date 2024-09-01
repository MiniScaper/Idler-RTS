const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store player data in memory
let players = {};

// Helper to generate unique player IDs
function generatePlayerId() {
  return Math.floor(Math.random() * 10000);
}

// Helper to generate random position
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 1000),
    y: Math.floor(Math.random() * 1000),
  };
}

// API to create a new player
app.post('/api/player/create', (req, res) => {
  const playerId = generatePlayerId();
  
  // Create player with initial resources and 3 villagers
  const initialVillagers = Array.from({ length: 3 }, () => getRandomPosition());
  
  players[playerId] = {
    name: req.body.name || `Player${playerId}`,
    wood: 1000,
    stone: 500,
    food: 100,
    gold: 0,
    villagers: initialVillagers,
    townCenter: null,
  };
  
  res.json({
    playerId,
    playerData: players[playerId],
  });
});

// API to place town center
app.post('/api/player/place-town-center', (req, res) => {
  const { playerId, position } = req.body;

  if (players[playerId]) {
    const player = players[playerId];
    if (player.wood >= 300 && player.stone >= 100) {
      player.townCenter = position;
      player.wood -= 300;
      player.stone -= 100;
      res.json({ success: true, townCenter: position });
    } else {
      res.json({ success: false, message: 'Not enough resources.' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Player not found.' });
  }
});

// API to get player data
app.get('/api/player/:id', (req, res) => {
  const playerId = req.params.id;
  
  if (players[playerId]) {
    res.json({
      playerId: playerId,
      playerData: players[playerId]
    });
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
