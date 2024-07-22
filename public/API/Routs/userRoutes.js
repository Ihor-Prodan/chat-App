/* eslint-disable import/extensions */
import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserByIdController,
} from '../Controllers/usersController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:id', getUserByIdController);

export default router;
