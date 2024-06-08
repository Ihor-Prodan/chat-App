/* eslint-disable max-len */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <p className="text-center text-gray-600 mb-8">
          Login to access your account
        </p>
        <form>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3"
            >
              👁️
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <NavLink to={'/forgot-passw'} className="text-red-500">
              Forgot Password
            </NavLink>
          </div>
          <NavLink to={'/chat'}>
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </NavLink>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <NavLink to="/sing-up" className="text-blue-500">
                Sign up
              </NavLink>
            </p>
          </div>
        </form>
        <div className="flex items-center justify-between mt-8">
          <hr className="w-1/2 border-t border-gray-300" />
          <span className="text-gray-500"></span>
          <hr className="w-1/2 border-t border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Login;
