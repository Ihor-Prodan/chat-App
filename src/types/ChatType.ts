import { Message } from './MessageTypes';

export type ChatType = {
  id: string;
  userOneId: string;
  userTwoId: string;
  messages: Message[];
};
