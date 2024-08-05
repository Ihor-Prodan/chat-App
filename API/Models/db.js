/* eslint-disable no-console */
import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

export default client;
