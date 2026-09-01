import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './presentation/theme';

import { MainLayout } from './presentation/layout/MainLayout';
import { Dashboard } from './presentation/pages/Dashboard';
import { Companies } from './presentation/pages/Companies';
import { Subscriptions } from './presentation/pages/Subscriptions';
import { Commissions } from './presentation/pages/Commissions';
import { Marketing } from './presentation/pages/Marketing';
import { Drivers } from './presentation/pages/Drivers';
import { SchemaDocs } from './presentation/pages/SchemaDocs';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="schema" element={<SchemaDocs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
