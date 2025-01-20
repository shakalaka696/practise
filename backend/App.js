const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: '#4SO18cs087',  
  database: 'chat_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// API to get chat messages
app.get('/messages', (req, res) => {
  const { sender, receiver } = req.query;

  db.query('SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)', 
  [sender, receiver, receiver, sender], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

// API to send a new message
app.post('/messages', (req, res) => {
  const { sender, receiver, message } = req.body;

  db.query('INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', 
  [sender, receiver, message], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to send message');
    }
    res.status(201).send('Message sent');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
