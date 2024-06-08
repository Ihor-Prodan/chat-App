/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const { Client } = require('pg');

const app = express();
const PORT = 3005;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '123412341234',
  database: 'postgres',
});

client
  .connect()
  .then(() => {
    console.log('Connected to the database');

    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        fullName VARCHAR(511) NOT NULL,
        avatar TEXT,
        email VARCHAR(255) UNIQUE NOT NULL,
        status BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phoneNumber VARCHAR(20),
        password TEXT NOT NULL,
        termsAccepted BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        userId UUID REFERENCES users(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    client
      .query(createTablesQuery)
      .then(() => {
        console.log('Tables created successfully');
      })
      .catch(err => {
        console.error('Error creating tables', err.stack);
      });
  })
  .catch(err => console.error('Connection error', err.stack));

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = result.rows[0];

    if (!user) {
      res.sendStatus(404);

      return;
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', async (req, res) => {
  const {
    firstName,
    lastName,
    avatar,
    email,
    phoneNumber,
    password,
    termsAccepted,
  } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.sendStatus(422);

    return;
  }

  const fullName = `${firstName} ${lastName}`;
  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();
  const status = false;

  const user = {
    id,
    firstName,
    lastName,
    fullName,
    avatar,
    email,
    status,
    createdAt,
    updatedAt,
    phoneNumber,
    password,
    termsAccepted,
  };

  try {
    await client.query(
      'INSERT INTO users (id, firstName, lastName, fullName, avatar, email, status, createdAt, updatedAt, phoneNumber, password, termsAccepted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        user.id,
        user.firstName,
        user.lastName,
        user.fullName,
        user.avatar,
        user.email,
        user.status,
        user.createdAt,
        user.updatedAt,
        user.phoneNumber,
        user.password,
        user.termsAccepted,
      ],
    );
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/messages', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM messages');

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/messages', async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    res.sendStatus(422);

    return;
  }

  const id = uuidv4();
  const timestamp = new Date();

  const message = {
    id,
    userId,
    text,
    timestamp,
  };

  try {
    await client.query(
      'INSERT INTO messages (id, userId, text, timestamp) VALUES ($1, $2, $3, $4)',
      [message.id, message.userId, message.text, message.timestamp],
    );
    res.status(201).send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
