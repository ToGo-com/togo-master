import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { useAppStore } from '../../application/store/useAppStore';
import type { AdminNotification } from '../../domain/models';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = useAppStore((state) => state.notifications);
  const dismissNotification = useAppStore((state) => state.dismissNotification);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Resumen Operativo', subtitle: 'Métricas clave de facturación mensual, actividad en vivo y KPIs operativos.' };
      case '/companies':
        return { title: 'Control de Empresas (M-P11)', subtitle: 'Gobernanza centralizada de comercios, validación de documentos KYC y catálogo.' };
      case '/subscriptions':
        return { title: 'Finanzas: Mensualidades (M-P13)', subtitle: 'Control del modelo de suscripción, panel de vencimientos y conciliación de pagos.' };
      case '/commissions':
        return { title: 'Finanzas: Comisiones & Liquidaciones', subtitle: 'Configuración global de Comisión Express, Split de Delivery y liquidación a flota.' };
      case '/marketing':
        return { title: 'Marketing: Banners & Destacados', subtitle: 'Gestión de espacios publicitarios, carrusel de inicio y monetización de slots.' };
      case '/drivers':
        return { title: 'Gestión de Drivers (M-P10)', subtitle: 'Control global de la flota motorizada, revisión de documentos legales y balance.' };
      case '/schema':
        return { title: 'Arquitectura & Esquema de Datos', subtitle: 'Especificación de modelos TypeScript, DTOs y propuesta de contratos de API.' };
      default:
        return { title: 'Panel de Administración', subtitle: 'To Go Master Platform' };
    }
  };

  const currentInfo = getPageInfo(location.pathname);

  const getNotifIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'EMPRESA_PENDIENTE':
        return <WarningIcon sx={{ fontSize: 16, color: 'secondary.main' }} />;
      case 'MORA_DETECTADA':
        return <WarningIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'PAGO_REGISTRADO':
        return <ReceiptIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'BANNER_EXPIRA':
        return <AutoAwesomeIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      default:
        return <CheckCircleIcon sx={{ fontSize: 16, color: 'info.main' }} />;
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onOpenMobileSidebar}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {currentInfo.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleOpenMenu} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={unreadCount} color="error" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            slotProps={{ paper: { sx: { width: 360, maxHeight: 400, mt: 1, boxShadow: 3 } } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Centro de Notificaciones</Typography>
                <Typography variant="caption" color="text.secondary">{unreadCount} alerta(s) pendientes</Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(244, 151, 48, 0.1)', color: 'secondary.main', px: 1, py: 0.5, borderRadius: 1, fontSize: 10, fontWeight: 'bold' }}>
                To Go Hub
              </Box>
            </Box>

            {notifications.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Sin notificaciones nuevas</Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.id}
                  onClick={() => {
                    dismissNotification(notif.id);
                    handleCloseMenu();
                  }}
                  sx={{ py: 1.5, px: 2, bgcolor: notif.read ? 'transparent' : 'rgba(244, 151, 48, 0.05)', alignItems: 'flex-start', gap: 1.5 }}
                >
                  <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', display: 'flex' }}>
                    {getNotifIcon(notif.type)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                        {notif.timestamp}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {notif.message}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AssessmentIcon sx={{ color: 'secondary.main' }} />}
            onClick={() => navigate('/companies')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Nuevo Reporte
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
