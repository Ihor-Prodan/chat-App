/* eslint-disable max-len */
import React from 'react';
import { NavLink } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-cover bg-center">
      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.52876 3.52851C5.78911 3.26816 6.21122 3.26816 6.47157 3.52851L10.4716 7.52851C10.7319 7.78886 10.7319 8.21097 10.4716 8.47132L6.47157 12.4713C6.21122 12.7317 5.78911 12.7317 5.52876 12.4713C5.26841 12.211 5.26841 11.7889 5.52876 11.5285L9.05735 7.99992L5.52876 4.47132C5.26841 4.21097 5.26841 3.78886 5.52876 3.52851Z"
            fill="#0F0F11"
          />
        </svg>
        <NavLink to="/">
          <span className="text-blue-500 hover:underline">Back</span>
        </NavLink>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Page not found</h1>
    </section>
  );
};
