import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
  let label = status;

  switch (status) {
    case 'ACTIVO':
    case 'AL_DIA':
    case 'LIQUIDADO':
    case 'PAGADO':
    case 'APROBADO':
      color = 'success';
      label = status.replace('_', ' ');
      break;
    case 'PENDIENTE_APROBACION':
    case 'PENDIENTE':
    case 'EN_REVISION':
    case 'POR_VENCER':
      color = 'warning';
      label = status.replace('_', ' ');
      break;
    case 'SUSPENDIDO':
    case 'MORA':
    case 'EN_MORA':
    case 'RECHAZADO':
      color = 'error';
      label = status.replace('_', ' ');
      break;
    case 'PAUSADO':
      color = 'default';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip
      label={label}
      size={size}
      color={color}
      sx={{
        fontWeight: 'bold',
        fontSize: size === 'small' ? 10 : 12,
        height: size === 'small' ? 20 : 24,
      }}
    />
  );
};
