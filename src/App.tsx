import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './presentation/theme';

import { MainLayout } from './presentation/layout/MainLayout';
import { RequireAuth } from './presentation/components/common/RequireAuth';
import { useAuthStore } from './application/store/useAuthStore';
import { Login } from './presentation/pages/Login';
import { Dashboard } from './presentation/pages/Dashboard';
import { Companies } from './presentation/pages/Companies';
import { Subscriptions } from './presentation/pages/Subscriptions';
import { Commissions } from './presentation/pages/Commissions';
import { Marketing } from './presentation/pages/Marketing';
import { Drivers } from './presentation/pages/Drivers';
import { CompaniesAdmin } from './presentation/pages/CompaniesAdmin';
import { Customers } from './presentation/pages/Customers';
import { Orders } from './presentation/pages/Orders';
import { Sales } from './presentation/pages/Sales';
import { Featured } from './presentation/pages/Featured';
import { Questions } from './presentation/pages/Questions';

const App: React.FC = () => {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="companies" element={<Companies />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="commissions" element={<Commissions />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="empresas" element={<CompaniesAdmin />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="sales" element={<Sales />} />
              <Route path="featured" element={<Featured />} />
              <Route path="questions" element={<Questions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
