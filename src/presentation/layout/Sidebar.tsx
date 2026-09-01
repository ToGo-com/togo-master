import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import DashboardIcon from '@mui/icons-material/DashboardTwoTone';
import BusinessIcon from '@mui/icons-material/BusinessTwoTone';
import ReceiptIcon from '@mui/icons-material/ReceiptTwoTone';
import PercentIcon from '@mui/icons-material/PercentTwoTone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import TwoWheelerIcon from '@mui/icons-material/TwoWheelerTwoTone';
import CodeIcon from '@mui/icons-material/CodeTwoTone';
import SecurityIcon from '@mui/icons-material/SecurityTwoTone';

import { useAppStore } from '../../application/store/useAppStore';

const drawerWidth = 240;

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const companies = useAppStore((state) => state.companies);
  const subscriptions = useAppStore((state) => state.subscriptions);
  const drivers = useAppStore((state) => state.drivers);
  const featuredRequests = useAppStore((state) => state.featuredRequests);
  const driverSettlements = useAppStore((state) => state.driverSettlements);

  const badgeCounts = {
    COMPANIES: companies.filter((c) => c.status === 'PENDIENTE_APROBACION').length,
    DRIVERS: drivers.filter((d) => d.documents.some((doc) => doc.status === 'PENDIENTE')).length,
    SUBSCRIPTIONS: subscriptions.filter((s) => s.status === 'EN_MORA' || s.status === 'POR_VENCER').length,
    COMMISSIONS: driverSettlements.filter((s) => s.status === 'PENDIENTE').length,
    MARKETING: featuredRequests.filter((f) => f.status === 'PENDIENTE').length,
  };

  const navItems = [
    {
      group: 'PANEL PRINCIPAL',
      items: [
        { id: '/', label: 'Dashboard', icon: DashboardIcon, badge: 0 },
      ],
    },
    {
      group: 'GOBERNANZA Y COMERCIOS',
      items: [
        { id: '/companies', label: 'Empresas', icon: BusinessIcon, badge: badgeCounts.COMPANIES, badgeColor: '#F49730' },
        { id: '/drivers', label: 'Drivers', icon: TwoWheelerIcon, badge: badgeCounts.DRIVERS, badgeColor: '#f59e0b' },
      ],
    },
    {
      group: 'FINANZAS Y MONETIZACIÓN',
      items: [
        { id: '/subscriptions', label: 'Finanzas', icon: ReceiptIcon, badge: badgeCounts.SUBSCRIPTIONS, badgeColor: '#f43f5e' },
        { id: '/commissions', label: 'Comisiones', icon: PercentIcon, badge: badgeCounts.COMMISSIONS, badgeColor: '#475569' },
      ],
    },
    {
      group: 'CRECIMIENTO Y TRÁFICO',
      items: [
        { id: '/marketing', label: 'Marketing', icon: AutoAwesomeIcon, badge: badgeCounts.MARKETING, badgeColor: '#f59e0b' },
      ],
    },
    {
      group: 'ARQUITECTURA Y DATOS',
      items: [
        { id: '/schema', label: 'Esquema Docs', icon: CodeIcon, badge: 'TS', badgeColor: '#1e293b' },
      ],
    },
  ] as { group: string, items: { id: string, label: string, icon: any, badge?: number | string, badgeColor?: string }[] }[];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'primary.main', color: 'white' }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <img src="/logo_blanco.png" alt="To Go Logo" style={{ width: 250, height: 80, objectFit: 'contain' }} />
      </Box>

      {/* Nav Links */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {navItems.map((group, gIdx) => (
          <Box key={gIdx} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 'bold',
                letterSpacing: 1,
              }}
            >
              {group.group}
            </Typography>
            <List disablePadding sx={{ mt: 1 }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.id;
                const Icon = item.icon;

                return (
                  <ListItemButton
                    key={item.id}
                    onClick={() => {
                      navigate(item.id);
                      onCloseMobile();
                    }}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      bgcolor: isActive ? 'secondary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive ? 'secondary.main' : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'white' : 'rgba(255,255,255,0.7)' }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                          }
                        }
                      }}
                    />
                    {item.badge ? (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 'bold',
                          bgcolor: isActive ? 'rgba(255,255,255,0.25)' : item.badgeColor,
                          color: 'white',
                          border: 'none',
                        }}
                      />
                    ) : null}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Profile Info */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 'bold' }}>
            AD
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Admin Master
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Superuser
              </Typography>
              <SecurityIcon sx={{ fontSize: 12, color: 'secondary.main' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, position: 'static' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
