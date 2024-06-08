/* eslint-disable max-len */
import React from 'react';
import { NavLink } from 'react-router-dom';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Forgot your password?
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Don’t worry, happens to all of us. Enter your email below to recover
          your password
        </p>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
              placeholder="Your email"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
      <NavLink to="/" className="mt-6 text-blue-500 hover:underline">
        Back to login
      </NavLink>
    </div>
  );
};

export default ForgotPassword;
