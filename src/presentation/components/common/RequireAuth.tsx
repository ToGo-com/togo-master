import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../application/store/useAuthStore';

export const RequireAuth: React.FC = () => {
  const status = useAuthStore((s) => s.status);

  if (status === 'checking') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return <Outlet />;
};
