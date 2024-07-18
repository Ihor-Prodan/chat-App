/* eslint-disable max-len */
/* eslint-disable max-len */
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { UserType } from '../../types/UserType';
import { getAllUsers } from '../fetchAPI/fetch';
import { NavLink } from 'react-router-dom';

interface Props {
  currentUser: UserType | null;
  users: UserType[];
  setUsers: Dispatch<SetStateAction<UserType[]>>;
  setSelectedUser: Dispatch<SetStateAction<UserType | null>>;
  selectedUser: UserType | null;
}

export const User: React.FC<Props> = ({
  currentUser,
  users,
  setUsers,
  selectedUser,
  setSelectedUser,
}) => {
  const [dropdown, setIsDropdow] = useState(false);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, [currentUser, selectedUser]);

  const dropdownHandler = () => {
    setIsDropdow(prev => !prev);
  };

  const handleSelectUser = (id: string) => {
    const selectUser = users.find(item => item.id === id);

    setSelectedUser(selectUser || null);
    setIsDropdow(false);
  };

  return (
    <section className="w-1/4 p-4 bg-gray-100 flex flex-col items-center">
      {selectedUser && (
        <>
          <img
            src={selectedUser?.avatar}
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full mb-4"
          />
          <h2 className="text-lg font-bold">{selectedUser?.fullName}</h2>
        </>
      )}
      {selectedUser && (
        <div className="flex w-full justify-around mb-4">
          <button className="w-1/3 p-2 bg-blue-500 text-white rounded-lg hover:opacity-50">
            Chat
          </button>
          <button className="w-1/3 p-2 bg-blue-500 text-white rounded-lg hover:opacity-50">
            Video Call
          </button>
        </div>
      )}

      <button
        onClick={dropdownHandler}
        id="dropdownUsersButton"
        data-dropdown-toggle="dropdownUsers"
        data-dropdown-placement="bottom"
        className="text-white bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 outline-transpanent font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        type="button"
      >
        View Friends
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {dropdown && (
        <div
          id="dropdownUsers"
          className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700 mt-1"
        >
          <ul
            className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownUsersButton"
          >
            {users.map(
              user =>
                user.id !== currentUser?.id && (
                  <li key={user.id} onClick={() => handleSelectUser(user.id)}>
                    <NavLink
                      to={'/chat'}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <img
                        className="w-6 h-6 me-2 rounded-full"
                        src={user.avatar}
                        alt={`${user.fullName} avatar`}
                      />
                      {user.fullName}
                    </NavLink>
                  </li>
                ),
            )}
          </ul>
          <a
            href="#"
            className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
            </svg>
            Add new friend
          </a>
        </div>
      )}
    </section>
  );
};
