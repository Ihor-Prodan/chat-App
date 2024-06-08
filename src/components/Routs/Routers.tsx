import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from '../../App';
import SignUp from '../Sing-up/Sing-Up';
import Login from '../Login/Login';
import { NotFoundPage } from '../Not-found/Not-found-page';
import ForgotPassword from '../Forgot-password/Forgot-password';
import { UserType } from '../../types/UserType';
import { useLocalStorage } from '../../LocalStorege/Local';

export const Root: React.FC = () => {
  const [users, setUsers] = useLocalStorage<UserType[]>('users', []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/chat" element={<App users={users} />} />
        <Route path="/sing-up" element={<SignUp setUsers={setUsers} />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-passw" element={<ForgotPassword />} />
        {/* <Route
            path="/phones"
            element={
              <Products type={ProductType.phones} title="Mobile phone" />
            } */}
        {/* /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};
