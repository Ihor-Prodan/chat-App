import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Chat from './components/Chat/Chat';
import './style.index.css';
import { User } from './components/User/User';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from './types/UserType';
import { Message } from './types/MessageTypes';
import { ChatType } from './types/ChatType';
import { io, Socket } from 'socket.io-client';
import { useLocalStorage } from './LocalStorege/Local';
import { Messages } from './components/Mesegges/Mesegges';
import { getAllMesages } from './components/fetchAPI/fetch';

interface Props {
  users: UserType[];
  currentUser: UserType | null;
  setUsers: Dispatch<SetStateAction<UserType[]>>;
}

export const App: React.FC<Props> = ({ users, currentUser, setUsers }) => {
  const [selectedUser, setSelectedUser] = useLocalStorage<UserType | null>(
    'selectUser',
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<ChatType>({
    id: uuidv4(),
    userOneId: currentUser?.id ?? '',
    userTwoId: selectedUser?.id ?? '',
    messages: [],
  });

  // eslint-disable-next-line no-console
  console.log('isInCurrentChat', messages);

  useEffect(() => {
    const newSocket = io('http://localhost:3005');

    setSocket(newSocket);

    newSocket.on('message', (newMessage: Message) => {
      if (
        !chat.messages.some(
          message => message.messageId === newMessage.messageId,
        )
      ) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      }
    });

    getAllMesages().then(res => {
      setMessages(res);
      const filteredMessages = res.filter(
        message =>
          message.userId === chat.userOneId ||
          message.userId === chat.userTwoId,
      );

      setChat(prev => ({
        ...prev,
        messages: filteredMessages,
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, selectedUser]);

  const handleSendMessage = (message: Message) => {
    if (socket) {
      socket.emit('message', JSON.stringify(message));

      const isInCurrentChat =
        (message.userId === currentUser?.id &&
          message.userId === selectedUser?.id) ||
        (message.userId === selectedUser?.id &&
          message.userId === currentUser?.id);

      if (isInCurrentChat) {
        if (!chat.messages.some(msg => msg.messageId === message.messageId)) {
          setChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, message],
          }));
        }
      }
    }
  };

  return (
    <div className="App flex h-screen">
      <Messages users={users} currentUser={currentUser} chat={chat} />
      {currentUser && (
        <Chat
          users={users}
          setMessages={setMessages}
          sendMessage={handleSendMessage}
          setChat={setChat}
          chat={chat}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
      )}
      <User
        users={users}
        setUsers={setUsers}
        currentUser={currentUser}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default React.memo(App);
