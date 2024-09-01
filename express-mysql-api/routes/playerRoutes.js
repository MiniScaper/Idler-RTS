const express = require('express');
const router = express.Router();

let players = {}; // Store player data in-memory for now

// Route to create a new player
router.post('/create', (req, res) => {
  const playerId = generatePlayerId();
  const land = generateRandomLand();

  // Initialize player data
  players[playerId] = {
    name: req.body.name || `Player${playerId}`,
    wood: 500,
    stone: 300,
    food: 200,
    gold: 100,
    civilians: 3,
    land: land,
    townCenter: null, // To be set when the Town Center is placed
  };

  res.json({ playerId, playerData: players[playerId] });
});

// Route to place a Town Center
router.post('/place-town-center', (req, res) => {
  const { playerId, position } = req.body;

  if (players[playerId].wood >= 300 && players[playerId].stone >= 100) {
    players[playerId].wood -= 300;
    players[playerId].stone -= 100;
    players[playerId].townCenter = position;

    res.json({ success: true, townCenter: players[playerId].townCenter });
  } else {
    res.json({ success: false, message: 'Not enough resources to place Town Center' });
  }
});

// Route to get player data
router.get('/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const playerData = players[playerId];

  if (playerData) {
    res.json(playerData);
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

// Helper functions
function generatePlayerId() {
  return Math.floor(Math.random() * 10000);
}

function generateRandomLand() {
  return {
    size: Math.floor(Math.random() * 100) + 50,
    terrain: Math.random() > 0.5 ? 'forest' : 'plains',
    resources: {
      wood: Math.floor(Math.random() * 500) + 500,
      stone: Math.floor(Math.random() * 300) + 200,
    },
    coordinates: { x: Math.floor(Math.random() * 1000), y: Math.floor(Math.random() * 1000) }
  };
}

module.exports = router;
