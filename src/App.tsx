/* eslint-disable max-len */
import React from 'react';
import Chat from './components/Chat/Chat';
import './style.index.css';
import { Messages } from './components/Mesegges/Mesegges';
import { User } from './components/User/User';
// import userFoto from './components/Mesegges/img/user.png';
// import user2 from './components/Mesegges/img/user2.png';
// import { v4 as uuidv4 } from 'uuid';
import { UserType } from './types/UserType';
import { useLocalStorage } from './LocalStorege/Local';
import { Message } from './types/MessageTypes';

interface Props {
  users: UserType[];
}

// const user = {
//   firstName: 'David',
//   lastName: 'Peters',
//   avatar: userFoto,
//   position: 'Senior Developer',
//   id: uuidv4(),
//   email: 'david@example.com',
//   status: true,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// const userTwo = {
//   firstName: 'Dianne',
//   lastName: 'Jhonson',
//   avatar: user2,
//   position: 'Junior Developer',
//   id: uuidv4(),
//   email: 'di@example.com',
//   status: true,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// const exampleChat = {
//   id: user.id && userTwo.id,
//   participants: [
//     {
//       id: uuidv4(),
//       firstName: 'David',
//       lastName: 'Peters',
//       avatar: userFoto,
//       position: 'Senior Developer',
//       email: 'david@example.com',
//       status: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       firstName: 'Dianne',
//       lastName: 'Jhonson',
//       avatar: user2,
//       position: 'Junior Developer',
//       id: uuidv4(),
//       email: 'di@example.com',
//       status: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ],
// };

export const App: React.FC<Props> = ({ users }) => {
  const [messages, setMessages] = useLocalStorage<Message[]>('users', []);

  return (
    <div className="App flex h-screen">
      <Messages users={users} messages={messages} />
      <Chat users={users} setMessages={setMessages} messages={messages} />
      <User users={users} />
    </div>
  );
};

export default App;
