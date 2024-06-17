/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { UserType } from '../../types/UserType';
import { Message } from '../../types/MessageTypes';
import { ChatType } from '../../types/ChatType';
import { addNewMessage } from '../fetchAPI/fetch';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  users: UserType[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendMessage: (message: Message) => void;
  setChat: Dispatch<React.SetStateAction<ChatType>>;
  chat: ChatType;
  currentUser: UserType;
  selectedUser: UserType | null;
}

const Chat: React.FC<Props> = ({
  setMessages,
  sendMessage,
  chat,
  setChat,
  currentUser,
  selectedUser,
}) => {
  const [message, setMessage] = useState<string>('');

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() && selectedUser) {
      const newMessage: Message = {
        messageId: uuidv4(),
        userId: currentUser.id,
        text: message,
        timestamp: Date.now(),
      };

      try {
        const savedMessage = await addNewMessage(newMessage);

        setMessages(prevMessages => [savedMessage, ...prevMessages]);
        sendMessage(savedMessage);
        setMessage('');

        setChat(prevChat => ({
          ...prevChat,
          messages: [savedMessage, ...prevChat.messages],
        }));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="w-2/4 p-4 bg-white flex flex-col h-screen">
      {selectedUser && (
        <div className="flex items-center p-2 mb-4 border-b">
          <img
            src={selectedUser.avatar}
            alt="Chat Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-2">
            <h2 className="text-lg font-bold">{selectedUser.fullName}</h2>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      )}

      <ul className="h-96 overflow-y-auto mb-4 flex-grow flex flex-col-reverse">
        {chat.messages.map((msg, index) => {
          const messageUser =
            msg.userId === currentUser.id ? currentUser : selectedUser;

          return (
            <li
              key={index}
              className={`flex mb-2 items-center ${
                msg.userId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.userId !== currentUser.id && messageUser && (
                <img
                  src={messageUser.avatar}
                  alt={`${messageUser.fullName}'s avatar`}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.userId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.text}
                <div
                  className={`text-xs text-right text-wrap ${
                    msg.userId === currentUser.id
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString().slice(0, 5)}
                </div>
              </div>
              {msg.userId === currentUser.id && (
                <img
                  src={currentUser.avatar}
                  alt={`${currentUser.fullName}'s avatar`}
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex-row w-full pb-4 h-18 items-center relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="31"
          viewBox="0 0 20 31"
          fill="none"
          className="absolute top-1 left-3 w-5 h-8 cursor-pointer"
        >
          <path
            d="M1 12.5938C1.26522 12.5938 1.51957 12.6958 1.70711 12.8775C1.89464 13.0592 2 13.3056 2 13.5625V15.5C2 17.5554 2.84285 19.5267 4.34315 20.9801C5.84344 22.4335 7.87827 23.25 10 23.25C12.1217 23.25 14.1566 22.4335 15.6569 20.9801C17.1571 19.5267 18 17.5554 18 15.5V13.5625C18 13.3056 18.1054 13.0592 18.2929 12.8775C18.4804 12.6958 18.7348 12.5938 19 12.5938C19.2652 12.5938 19.5196 12.6958 19.7071 12.8775C19.8946 13.0592 20 13.3056 20 13.5625V15.5C20 17.9016 19.0792 20.2176 17.4162 21.9986C15.7533 23.7797 13.4666 24.8989 11 25.1391V29.0625H17C17.2652 29.0625 17.5196 29.1646 17.7071 29.3462C17.8946 29.5279 18 29.7743 18 30.0312C18 30.2882 17.8946 30.5346 17.7071 30.7163C17.5196 30.8979 17.2652 31 17 31H3C2.73478 31 2.48043 30.8979 2.29289 30.7163C2.10536 30.5346 2 30.2882 2 30.0312C2 29.7743 2.10536 29.5279 2.29289 29.3462C2.48043 29.1646 2.73478 29.0625 3 29.0625H9V25.1391C6.53337 24.8989 4.24675 23.7797 2.58376 21.9986C0.920768 20.2176 -3.11433e-05 17.9016 7.90012e-10 15.5V13.5625C7.90012e-10 13.3056 0.105357 13.0592 0.292893 12.8775C0.48043 12.6958 0.734784 12.5938 1 12.5938Z"
            fill="#699BF7"
          />
          <path
            d="M14 15.5C14 16.5277 13.5786 17.5133 12.8284 18.24C12.0783 18.9667 11.0609 19.375 10 19.375C8.93913 19.375 7.92172 18.9667 7.17157 18.24C6.42143 17.5133 6 16.5277 6 15.5V5.8125C6 4.78479 6.42143 3.79916 7.17157 3.07246C7.92172 2.34576 8.93913 1.9375 10 1.9375C11.0609 1.9375 12.0783 2.34576 12.8284 3.07246C13.5786 3.79916 14 4.78479 14 5.8125V15.5ZM10 0C8.4087 0 6.88258 0.612387 5.75736 1.70244C4.63214 2.7925 4 4.27093 4 5.8125V15.5C4 17.0416 4.63214 18.52 5.75736 19.6101C6.88258 20.7001 8.4087 21.3125 10 21.3125C11.5913 21.3125 13.1174 20.7001 14.2426 19.6101C15.3679 18.52 16 17.0416 16 15.5V5.8125C16 4.27093 15.3679 2.7925 14.2426 1.70244C13.1174 0.612387 11.5913 0 10 0V0Z"
            fill="#699BF7"
          />
        </svg>
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-1 cursor-pointer w-full"
        >
          <input
            type="text"
            className="flex-grow p-2 border rounded-full w-full pl-10"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
