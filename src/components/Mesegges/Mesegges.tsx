/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
/* eslint-disable max-len */
/* eslint-disable max-len */
import React, { Dispatch, SetStateAction } from 'react';
import { UserType } from '../../types/UserType';
import { Message } from '../../types/MessageTypes';
import { NavLink } from 'react-router-dom';

interface UserProps {
  users: UserType[];
  currentUser: UserType | null;
  messages: Message[];
  setSelectedUser: Dispatch<SetStateAction<UserType | null>>;
  messageCounters: Record<string, number>;
  setMessageCounters: Dispatch<SetStateAction<Record<string, number>>>;
}

export const Messages: React.FC<UserProps> = ({
  users,
  currentUser,
  messages,
  setSelectedUser,
  messageCounters,
  setMessageCounters,
}) => {
  const maxMessageLength = 25;

  const userMessages = messages.reduce(
    (acc, message) => {
      if (message.receiverId === currentUser?.id) {
        if (!acc[message.userId]) {
          // eslint-disable-next-line no-param-reassign
          acc[message.userId] = [];
        }

        acc[message.userId].push(message);
      }

      return acc;
    },
    {} as Record<string, Message[]>,
  );

  const resetMessageCounter = (userId: string) => {
    setMessageCounters((prevCounters: any) => {
      const newCounters = { ...prevCounters, [userId]: 0 };

      return newCounters;
    });
  };

  const openMessages = (userId: string) => {
    resetMessageCounter(userId);
    const selectedUser = users.find(u => u.id === userId);

    if (selectedUser) {
      setSelectedUser(selectedUser);
    }
  };

  const userMessageList = Object.keys(userMessages)
    .map(userId => {
      const user = users.find(u => u.id === userId);

      if (!user) {
        return null;
      }

      const userMessagesArray = userMessages[userId];
      const lastMessage = userMessagesArray[userMessagesArray.length - 1].text;

      return {
        user,
        lastMessage,
        timestamp: userMessagesArray[userMessagesArray.length - 1].timestamp,
      };
    })
    .filter(Boolean);

  return (
    <section className="w-1/4 p-4 bg-gray-100">
      {currentUser && (
        <div className="flex items-center p-2">
          <img
            src={currentUser.avatar}
            alt="user"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-2">
            <h2 className="text-lg font-bold">{currentUser.fullName}</h2>
          </div>
        </div>
      )}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute bottom-8 left-3"
        >
          <path
            d="M23.3672 21.7529L15.7588 14.1445C16.9395 12.6182 17.5781 10.752 17.5781 8.78906C17.5781 6.43945 16.6611 4.23633 15.0029 2.5752C13.3447 0.914062 11.1357 0 8.78906 0C6.44238 0 4.2334 0.916992 2.5752 2.5752C0.914062 4.2334 0 6.43945 0 8.78906C0 11.1357 0.916992 13.3447 2.5752 15.0029C4.2334 16.6641 6.43945 17.5781 8.78906 17.5781C10.752 17.5781 12.6152 16.9395 14.1416 15.7617L21.75 23.3672C21.7723 23.3895 21.7988 23.4072 21.828 23.4193C21.8571 23.4314 21.8884 23.4376 21.9199 23.4376C21.9515 23.4376 21.9827 23.4314 22.0119 23.4193C22.041 23.4072 22.0675 23.3895 22.0898 23.3672L23.3672 22.0928C23.3895 22.0705 23.4072 22.044 23.4193 22.0148C23.4314 21.9857 23.4376 21.9544 23.4376 21.9228C23.4376 21.8913 23.4314 21.86 23.4193 21.8309C23.4072 21.8017 23.3895 21.7752 23.3672 21.7529ZM13.4297 13.4297C12.1875 14.6689 10.541 15.3516 8.78906 15.3516C7.03711 15.3516 5.39062 14.6689 4.14844 13.4297C2.90918 12.1875 2.22656 10.541 2.22656 8.78906C2.22656 7.03711 2.90918 5.3877 4.14844 4.14844C5.39062 2.90918 7.03711 2.22656 8.78906 2.22656C10.541 2.22656 12.1904 2.90625 13.4297 4.14844C14.6689 5.39062 15.3516 7.03711 15.3516 8.78906C15.3516 10.541 14.6689 12.1904 13.4297 13.4297Z"
            fill="#CDCDCD"
          />
        </svg>
        <input
          type="text"
          placeholder="Search Here..."
          className="w-full p-2 mt-4 mb-6 border rounded-full pl-11"
        />
      </div>
      <ul>
        {userMessageList.map((contact, ind) => {
          if (!contact) {
            return null;
          }

          const truncatedMessage =
            contact.lastMessage.length > maxMessageLength
              ? `${contact.lastMessage.substring(0, maxMessageLength)}...`
              : contact.lastMessage;

          return (
            <NavLink to={'/chat'} key={ind}>
              <li
                onClick={() => openMessages(contact.user.id)}
                className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-xl"
              >
                <img
                  src={contact.user.avatar}
                  alt="Contact Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2 w-full relative">
                  <div className="flex flex-row justify-between w-full">
                    <h3 className="text-sm font-bold">{`${contact.user.firstName} ${contact.user.lastName}`}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.timestamp).toString().slice(16, 21)}
                    </p>
                  </div>
                  <div className="flex flex-row relative items-center mt-1">
                    <div className="max-w-40">
                      <div className="flex-grow max-w-full">
                        <p className="text-xs text-gray-500">
                          {truncatedMessage}
                        </p>
                      </div>
                    </div>
                    <div className="w-6">
                      {messageCounters[contact.user.id] > 0 && (
                        <div className="h-4 w-4 bg-sky-400 rounded-full flex items-center justify-center ml-2 absolute right-0 bottom-0">
                          <p className="text-xs text-white">
                            {messageCounters[contact.user.id]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            </NavLink>
          );
        })}
      </ul>
    </section>
  );
};

export default Messages;
