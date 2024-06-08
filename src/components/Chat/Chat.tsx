/* eslint-disable max-len */
import React, { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { UserType } from '../../types/UserType';
import { Message } from '../../types/MessageTypes';

// interface Message {
//   user: UserType;
//   text: string;
//   timestamp: number;
// }

interface Props {
  users: UserType[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  messages: Message[];
}

const Chat: React.FC<Props> = ({ users, setMessages, messages }) => {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const userOne = users[4];
  const currentUser = userOne;

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        user: currentUser,
        text: message,
        timestamp: Date.now(),
        messageId: currentUser.id,
      };

      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setMessage('');
    }
  };

  return (
    <div className="w-2/4 p-4 bg-white flex flex-col h-screen">
      <div className="flex items-center p-2 mb-4 border-b">
        <img
          src={currentUser.avatar}
          alt="Chat Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-2">
          <h2 className="text-lg font-bold">{currentUser.fullName}</h2>
          {currentUser.status && (
            <p className="text-sm text-green-500">Online</p>
          )}
        </div>
      </div>
      <ul className="h-96 overflow-y-auto mb-4 flex-grow flex flex-col-reverse">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`flex mb-2 items-center ${
              msg.messageId === currentUser.id ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.messageId !== currentUser.id && (
              <img
                src={msg.user?.avatar}
                alt={`${msg.user?.fullName}'s avatar`}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.messageId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {msg.text}
              <div
                className={
                  msg.messageId === currentUser.id
                    ? 'text-xs text-right text-wrap text-white'
                    : 'text-xs text-right text-wrap text-gray-500'
                }
              >
                {new Date(msg.timestamp).toLocaleTimeString().slice(0, 5)}
              </div>
            </div>
            {msg.messageId === currentUser.id && (
              <img
                src={msg.user?.avatar}
                alt={`${msg.user?.fullName}'s avatar`}
                className="w-8 h-8 rounded-full ml-2"
              />
            )}
          </li>
        ))}
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
          onSubmit={sendMessage}
          className="flex items-end gap-1 cursor-pointer"
        >
          <input
            type="text"
            className="flex-grow p-2 border rounded-full w-full pl-10"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="30"
            viewBox="0 0 25 30"
            fill="none"
            className="absolute end-[69px] top-1.5 cursor-pointer"
          >
            <path
              d="M17.6862 9.58182L15.8737 7.68054L6.81118 17.1945C6.45426 17.5693 6.17117 18.0144 5.97805 18.5042C5.78493 18.9939 5.68558 19.5188 5.68566 20.0489C5.68575 20.579 5.78526 21.1039 5.97853 21.5936C6.1718 22.0833 6.45504 22.5282 6.81207 22.903C7.1691 23.2778 7.59294 23.575 8.05938 23.7778C8.52582 23.9806 9.02573 24.0849 9.53057 24.0848C10.0354 24.0847 10.5353 23.9802 11.0017 23.7773C11.468 23.5744 11.8918 23.2769 12.2487 22.9021L23.1237 11.485C24.3253 10.2231 25.0002 8.51174 25 6.72736C24.9998 4.94298 24.3246 3.23175 23.1228 1.97012C21.9211 0.708499 20.2912 -0.000175786 18.5918 3.27069e-08C16.8924 0.000175851 15.2627 0.709187 14.0612 1.97106L2.64331 13.9581L2.61831 13.9825C-0.87277 17.6482 -0.87277 23.5883 2.61831 27.2521C6.10939 30.916 11.7665 30.916 15.2576 27.2521L15.2808 27.2259L15.2826 27.2278L23.0773 19.0451L21.2648 17.1438L13.4701 25.3246L13.4469 25.349C12.2507 26.6025 10.6298 27.3065 8.93976 27.3065C7.24975 27.3065 5.62879 26.6025 4.4326 25.349C3.83967 24.725 3.36987 23.9843 3.05012 23.1693C2.73038 22.3544 2.56698 21.4811 2.56931 20.5997C2.57163 19.7183 2.73962 18.846 3.06366 18.0329C3.38769 17.2198 3.86139 16.4818 4.4576 15.8613L4.45581 15.8594L15.8755 3.87234C17.3737 2.29732 19.813 2.29732 21.313 3.87234C22.813 5.44737 22.8112 8.00679 21.313 9.57995L10.438 20.997C10.1946 21.2321 9.87414 21.3593 9.54354 21.3522C9.21293 21.345 8.89775 21.204 8.66381 20.9586C8.42987 20.7132 8.29527 20.3824 8.28813 20.0353C8.28098 19.6881 8.40185 19.3515 8.62547 19.0957L17.688 9.57995L17.6862 9.58182Z"
              fill="#699BF7"
            />
          </svg>
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
