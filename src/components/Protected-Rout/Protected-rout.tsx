import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserType } from '../../types/UserType';

const ProtectedRoute: React.FC<{ currentUser: UserType | null }> = ({
  currentUser,
}) => {
  return currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
