/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import userRouter from './Routs/userRoutes.js';
import messageRouter from './Routs/messageRoutes.js';

const app = express();

const { Client } = pg;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/messages', messageRouter);

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

    return client.query(createTablesQuery);
  })
  .then(() => {
    console.log('Tables created successfully');
  })
  .catch(err => {
    console.error(
      'Error creating tables or connecting to the database',
      err.stack,
    );
  });

export default app;
