/* eslint-disable max-len */
import React, { Dispatch, SetStateAction, useState } from 'react';
import defaultAvatar from './img/Avatar-Profile-No-Background.png';
import { UserType } from '../../types/UserType';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  setUsers: Dispatch<SetStateAction<UserType[]>>;
}

export const SignUp: React.FC<Props> = ({ setUsers }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');

      return;
    }

    if (firstName.trim() === '') {
      setError(true);
    }

    const validValues =
      firstName && lastName && password && phoneNumber && email;

    if (!validValues || validValues.trim() === '') {
      setError(true);

      return;
    }

    const user: UserType = {
      id: uuidv4(),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      password,
      termsAccepted,
      avatar: defaultAvatar,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers(prevUsers => [...prevUsers, user]);

    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setPhoneNumber('');
    setTermsAccepted(false);

    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign up</h2>
        <p className="text-center text-gray-600 mb-8">
          Let&apos;s get you all set up so you can access your personal account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className={
                error
                  ? 'w-full p-3 border rounded-lg border-red-700 focus:outline-none'
                  : 'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              }
            />
            <input
              required
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              required
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          <div className="mb-4 relative">
            <input
              required
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-3"
            >
              👁️
            </button>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                required
                type="checkbox"
                className="form-checkbox text-blue-500"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">
                I agree to all the{' '}
                <a href="#" className="text-blue-500">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-500">
                  Privacy Policies
                </a>
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Create account
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-blue-500">
                Login
              </a>
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

export default SignUp;
