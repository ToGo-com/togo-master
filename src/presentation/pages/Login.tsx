import React, { useState } from 'react';
import { Alert, Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../application/store/useAuthStore';

export const Login: React.FC = () => {
  const { status, login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (status === 'authenticated') return <Navigate to="/" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void login(email.trim(), password);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'primary.main', p: 2 }}>
      <Card component="form" onSubmit={submit} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src="/logo_blanco.png" alt="To Go" style={{ height: 56, filter: 'invert(1)' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, textAlign: 'center' }}>
          Panel de administración
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Ingresa con tu cuenta de administrador
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoComplete="username"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoComplete="current-password"
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading || !email || !password}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
        </Button>
      </Card>
    </Box>
  );
};
