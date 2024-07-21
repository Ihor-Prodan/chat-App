/* eslint-disable @typescript-eslint/indent */
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
  const [messageCounters, setMessageCounters] = useLocalStorage<
    Record<string, number>
  >('messageCounters', {});

  useEffect(() => {
    const newSocket = io('http://localhost:3005');

    setSocket(newSocket);

    newSocket.on('message', (newMessage: Message) => {
      if (
        !messages.some(message => message.messageId === newMessage.messageId)
      ) {
        setMessages(prev => [...prev, newMessage]);

        if (
          (newMessage.userId !== currentUser?.id &&
            newMessage.receiverId === currentUser?.id) ||
          (newMessage.userId === selectedUser?.id &&
            newMessage.receiverId === currentUser?.id)
        ) {
          setMessageCounters(prevCounters => ({
            ...prevCounters,
            [newMessage.userId]: (prevCounters[newMessage.userId] || 0) + 1,
          }));
        }

        if (
          (newMessage.userId === currentUser?.id &&
            newMessage.receiverId === selectedUser?.id) ||
          (newMessage.userId === selectedUser?.id &&
            newMessage.receiverId === currentUser?.id)
        ) {
          setChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage],
          }));
        }
      }
    });

    getAllMesages().then(res => {
      setMessages(res);
      const filteredMessages = res.filter(
        message =>
          (message.userId === currentUser?.id &&
            message.receiverId === selectedUser?.id) ||
          (message.userId === selectedUser?.id &&
            message.receiverId === currentUser?.id),
      );

      setChat(prev => ({
        ...prev,
        messages: filteredMessages,
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, selectedUser, messageCounters]);

  const handleSendMessage = (message: Message) => {
    if (socket) {
      socket.emit('message', JSON.stringify(message));
    }
  };

  return (
    <div className="App flex h-screen">
      <Messages
        users={users}
        currentUser={currentUser}
        messages={messages}
        setSelectedUser={setSelectedUser}
        messageCounters={messageCounters}
        setMessageCounters={setMessageCounters}
      />
      {currentUser && selectedUser && (
        <Chat
          setMessages={setMessages}
          users={users}
          sendMessage={handleSendMessage}
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
        setMessageCounters={setMessageCounters}
      />
    </div>
  );
};

export default App;
