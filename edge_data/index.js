const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize the app
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'edge_data',
  password: 'roblox360',
  port: 5432,
});

// Route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  const { task_text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (task_text) VALUES ($1) RETURNING *',
      [task_text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to update task status
// app.put('/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const result = await pool.query(
//       'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
//       [status, id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
