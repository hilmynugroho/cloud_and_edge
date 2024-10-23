const express = require('express')
const app = express()
const port = 3001
const Pool = require('pg').Pool


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testpg',
  password: 'roblox360',
  port: 5432,
});

const taske_table = require('./postgres')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});



// app.get('/', (req, res) => {
//   res.status(200).send('Hello World!');
// })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.get('/', (req, res) => {
  merchant_model.getTask()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/tasktest', (req, res) => {
  merchant_model.createTask(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/tasktest/:id', (req, res) => {
  merchant_model.deleteTask(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.put("/tasktest/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  merchant_model
    .updateTask(id, body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// get tasks
const getTask = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM tasktest", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

//add tasks
const createTask = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "INSERT INTO tasktest (task_name) VALUES ($1) RETURNING *",
      [name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new task has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

//delete task
const deleteTask = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM tasktest WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};
//update task
const updateTask = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "UPDATE tasktest SET task_name = $1, WHERE id = $3 RETURNING *",
      [name, email, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`Merchant updated: ${JSON.stringify(results.rows[0])}`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
module.exports = {
  getTask,
  createTask,
  deleteTask,
  updateTask
};