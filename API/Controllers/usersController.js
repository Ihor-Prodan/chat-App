/* eslint-disable import/extensions */
/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserStatus,
} from '../Models/userModels.js';

const JWT_SECRET = 'mySecret';

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

export const registerUser = async (req, res) => {
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
    await createUser(user);
    res.status(201).send({ activationToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

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

    await updateUserStatus(email, true);

    res.status(200).send({ user, activationToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getMe = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token required');
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    return res.status(401).send('Invalid token');
  }

  try {
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      res.sendStatus(404);

      return;
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
