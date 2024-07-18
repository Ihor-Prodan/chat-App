/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable no-console */
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3005;

const JWT_SECRET = 'mySecret';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

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
        "id" UUID PRIMARY KEY,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        "fullName" VARCHAR(511) NOT NULL,
        "avatar" TEXT,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "status" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "phoneNumber" VARCHAR(20),
        "password" TEXT NOT NULL,
        "termsAccepted" BOOLEAN DEFAULT false,
        "activationToken" TEXT
      );

      CREATE TABLE IF NOT EXISTS messages (
        "messageId" UUID PRIMARY KEY,
        "userId" UUID REFERENCES users(id),
        "receiverId" UUID REFERENCES users(id),
        "text" TEXT NOT NULL,
        "timestamp" TIMESTAMP NOT NULL
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

const userSchema = Joi.object({
  id: Joi.string(),
  firstName: Joi.string().max(255).required(),
  lastName: Joi.string().max(255).required(),
  fullName: Joi.string().max(511).required(),
  avatar: Joi.string().optional(),
  email: Joi.string().email().min(6).max(255).required(),
  phoneNumber: Joi.string().min(12).max(20).optional(),
  password: Joi.string().min(6).max(255).required(),
  termsAccepted: Joi.boolean().required(),
  status: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const messageSchema = Joi.object({
  userId: Joi.string(),
  receiverId: Joi.string(),
  text: Joi.string().required(),
  messageId: Joi.string(),
  timestamp: Joi.date(),
});

app.post('/register', async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error.details.message);
  }

  const {
    firstName,
    lastName,
    avatar,
    email,
    phoneNumber,
    password,
    termsAccepted,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

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
    password: hashedPassword,
    termsAccepted,
    activationToken,
  };

  try {
    await client.query(
      'INSERT INTO users ("id", "firstName", "lastName", "fullName", "avatar", "email", "status", "createdAt", "updatedAt", "phoneNumber", "password", "termsAccepted", "activationToken") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
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
        user.activationToken,
      ],
    );
    res.status(201).send({ activationToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error.details.message);
  }

  const { email, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const activationToken = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).send({ user, activationToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('server', token);

  if (!token) {
    return res.status(401).send('Access token required');
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).send('Invalid token');
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      decoded.email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

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
  console.log('body', req.body);
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error.details.message);
  }

  const {
    firstName,
    lastName,
    avatar,
    email,
    phoneNumber,
    password,
    termsAccepted,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

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
    password: hashedPassword,
    termsAccepted,
  };

  console.log('post', user);

  try {
    await client.query(
      'INSERT INTO users ("id", "firstName", "lastName", "fullName", "avatar", "email", "status", "createdAt", "updatedAt", "phoneNumber", "password", "termsAccepted") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
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

app.delete('/messages/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM messages WHERE "messageId" = $1',
      [messageId],
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Message not found');
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('message', async message => {
    const parsedMessage = JSON.parse(message);
    const { userId, text, timestamp, receiverId } = parsedMessage;
    const messageId = uuidv4();
    const newMessage = { messageId, userId, text, timestamp, receiverId };

    const { error } = messageSchema.validate(newMessage);

    if (error) {
      return res.status(422).send(error.details[0].message);
    }

    try {
      await client.query(
        'INSERT INTO messages ("messageId", "userId", "receiverId", "text", "timestamp") VALUES ($1, $2, $3, $4, $5)',
        [
          newMessage.messageId,
          newMessage.userId,
          newMessage.receiverId,
          newMessage.text,
          new Date(newMessage.timestamp),
        ],
      );
      io.emit('message', newMessage);
    } catch (err) {
      console.error('Error inserting message', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
