import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from '../../App';
import SignUp from '../Sing-up/Sing-Up';
import Login from '../Login/Login';
import { NotFoundPage } from '../Not-found/Not-found-page';
import ForgotPassword from '../Forgot-password/Forgot-password';
import { UserType } from '../../types/UserType';
import { useLocalStorage } from '../../LocalStorege/Local';
import ProtectedRoute from '../Protected-Rout/Protected-rout';

export const Root: React.FC = () => {
  const [users, setUsers] = useLocalStorage<UserType[]>('users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<UserType | null>(
    'currentUser',
    null,
  );

  // const token = localStorage.getItem('activationToken');

  return (
    <HashRouter>
      <Routes>
        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route
            path="/chat"
            element={
              <App
                users={users}
                currentUser={currentUser}
                setUsers={setUsers}
              />
            }
          />
        </Route>

        <Route path="/sign-up" element={<SignUp setUsers={setUsers} />} />
        <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/forgot-passw" element={<ForgotPassword />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};
