/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import {
  createMessage,
  getMessages,
  deleteMessage,
} from '../Models/messageModels.js';

const messageSchema = Joi.object({
  userId: Joi.string(),
  receiverId: Joi.string(),
  text: Joi.string().required(),
  messageId: Joi.string(),
  timestamp: Joi.date(),
});

export const createMessageController = async (req, res) => {
  const { error } = messageSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error.details[0].message);
  }

  const { userId, text, timestamp, receiverId } = req.body;
  const messageId = uuidv4();
  const newMessage = { messageId, userId, text, timestamp, receiverId };

  try {
    await createMessage(newMessage);
    res.status(201).send(newMessage);
  } catch (err) {
    console.error('Error inserting message', err);
    res.status(500).send('Internal Server Error');
  }
};

export const getMessagesController = async (req, res) => {
  try {
    const messages = await getMessages();

    res.send(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteMessageController = async (req, res) => {
  const { messageId } = req.params;

  try {
    const rowCount = await deleteMessage(messageId);

    if (rowCount === 0) {
      return res.status(404).send('Message not found');
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
