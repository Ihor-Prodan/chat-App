/* eslint-disable max-len */
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '123412341234',
  database: 'postgres',
});

await client.connect();

export const createUser = async user => {
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
};

export const getUserByEmail = async email => {
  const result = await client.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  return result.rows[0];
};

export const getUserById = async id => {
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);

  return result.rows[0];
};

export const updateUserStatus = async (email, status) => {
  await client.query('UPDATE users SET status = $1 WHERE email = $2', [
    status,
    email,
  ]);
};
