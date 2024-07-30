import axios from 'axios';
import { UserType } from '../../types/UserType';
import { Message } from '../../types/MessageTypes';

axios.defaults.baseURL = 'http://localhost:3005/';

export function getAllUsers(): Promise<UserType[]> {
  return axios.get('/users').then((res: { data: UserType[] }) => res.data);
}

export function getAllMesages(): Promise<Message[]> {
  return axios.get('/messages').then((res: { data: Message[] }) => res.data);
}

export async function getOneUser(userId: string): Promise<UserType> {
  const response = await axios.get(`/users/${userId}`);

  return response.data;
}

export async function removeUser(userId: string): Promise<string> {
  const response = await axios.delete(`/users/${userId}`);

  return response.statusText;
}

export async function deleteMessage(messageId: string): Promise<string> {
  const response = await axios.delete(`/messages/${messageId}`);

  return response.status.toString();
}

export async function addNewUser(newUser: {
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  id: string;
  email: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string;
  password: string;
  termsAccepted: boolean;
}): Promise<UserType> {
  const response = await axios.post('/users', newUser);

  return response.data;
}

export async function addNewMessage(newMessage: {
  messageId: string;
  userId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}): Promise<Message> {
  const response = await axios.post('/messages', newMessage);

  return response.data;
}

export async function updateUser(user: UserType): Promise<UserType> {
  const { firstName, lastName, avatar, id } = user;
  const response = await axios.put(`/users/${id}`, {
    firstName,
    lastName,
    avatar,
  });

  return response.data;
}

export const loginUser = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3005/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();

  return data;
};

export async function updateMessage(message: Message): Promise<Message> {
  const { messageId, text, timestamp } = message;
  const response = await axios.put(`/messages/${messageId}`, {
    text,
    timestamp,
  });

  return response.data;
}
