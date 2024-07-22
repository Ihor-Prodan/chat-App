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

export const createMessage = async message => {
  await client.query(
    'INSERT INTO messages ("messageId", "userId", "receiverId", "text", "timestamp") VALUES ($1, $2, $3, $4, $5)',
    [
      message.messageId,
      message.userId,
      message.receiverId,
      message.text,
      new Date(message.timestamp),
    ],
  );
};

export const getMessages = async () => {
  const result = await client.query('SELECT * FROM messages');

  return result.rows;
};

export const deleteMessage = async messageId => {
  const result = await client.query(
    'DELETE FROM messages WHERE "messageId" = $1',
    [messageId],
  );

  return result.rowCount;
};
