const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize the app
const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Specify allowed methods
  allowedHeaders: 'Content-Type',  // Specify allowed headers
}));
app.use(bodyParser.json());
// app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'edge_data',
  password: 'roblox360',
  port: 5432,
});

// Define a GET route for the root
app.get('/', (req, res) => {
  res.send('Server is running');
});

// GET route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    return res.status(200).json(result.rows); // Send all tasks to the frontend
  } catch (err) {
    console.error('Error fetching tasks from database:', err);
    return res.status(500).json({ error: 'An error occurred while fetching tasks' });
  }
});

// POST route for tasks (with DB interaction)
app.post('/tasks', async (req, res) => {
  const { task } = req.body; // Access the task field, not tasks

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  try {
    // Insert the task into the database
    const result = await pool.query('INSERT INTO tasks (task) VALUES ($1) RETURNING *', [task]);

    // Send a success response with the inserted task
    return res.status(201).json({ message: 'Task added successfully', task: result.rows[0] });
  } catch (err) {
    console.error('Error saving task to database:', err);
    return res.status(500).json({ error: 'An error occurred while saving the task' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
