/* eslint-disable import/extensions */
import express from 'express';
import {
  createMessageController,
  getMessagesController,
  deleteMessageController,
} from '../Controllers/messageControllers.js';

const router = express.Router();

router.post('/', createMessageController);
router.get('/', getMessagesController);
router.delete('/:messageId', deleteMessageController);

export default router;
