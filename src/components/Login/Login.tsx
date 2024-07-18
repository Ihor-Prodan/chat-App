/* eslint-disable max-len */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserType } from '../../types/UserType';
import { loginUser } from '../fetchAPI/fetch';

interface Props {
  setCurrentUser: Dispatch<SetStateAction<UserType | null>>;
}

export const Login: React.FC<Props> = ({ setCurrentUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user, activationToken } = await loginUser(email, password);

      localStorage.setItem('activationToken', activationToken);
      setCurrentUser(user);

      if (activationToken) {
        navigate('/chat');
      } else {
        setError(
          'Authentication failed. Please check your email and password.',
        );
      }
    } catch (err) {
      setError('Authentication failed. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <p className="text-center text-gray-600 mb-8">
          Login to access your account
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3"
            >
              👁️
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <NavLink to={'/forgot-passw'} className="text-red-500">
              Forgot Password
            </NavLink>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <NavLink to="/sign-up" className="text-blue-500">
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
