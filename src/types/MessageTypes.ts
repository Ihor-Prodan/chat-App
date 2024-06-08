import { UserType } from './UserType';

export type Message = {
  messageId: string;
  user: UserType;
  text: string;
  timestamp: number;
};
