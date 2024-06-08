import { UserType } from './UserType';

export type ChatType = {
  id: string;
  participants: UserType[];
};
