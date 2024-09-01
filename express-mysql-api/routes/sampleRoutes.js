const express = require('express');
const { getItems, createItem } = require('../controllers/sampleController');
const router = express.Router();

// GET route
router.get('/', getItems);

// POST route
router.post('/', createItem);

module.exports = router;
