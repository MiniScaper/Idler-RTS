const db = require('../config/db');

// Handle GET request
const getItems = (req, res) => {
  const sql = 'SELECT * FROM items'; // Replace 'items' with your actual table
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Handle POST request
const createItem = (req, res) => {
  const { name, description } = req.body;
  const sql = 'INSERT INTO items (name, description) VALUES (?, ?)';
  db.query(sql, [name, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Item created', id: result.insertId });
  });
};

module.exports = { getItems, createItem };
