import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType<SvgIconProps>;
  iconBgColor?: string;
  iconColor?: string;
  change?: { value: string; isPositive: boolean };
  onClick?: () => void;
  accentBorder?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'primary.light',
  iconColor = 'primary.main',
  change,
  onClick,
  accentBorder = false,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: accentBorder ? 'secondary.main' : 'divider',
        transition: 'all 0.2s',
        '&:hover': onClick ? { borderColor: 'primary.main', boxShadow: 2 } : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: iconBgColor,
            color: iconColor,
          }}
        >
          <Icon />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {change && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: change.isPositive ? 'success.light' : 'error.light',
              color: change.isPositive ? 'success.dark' : 'error.dark',
            }}
          >
            {change.value}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
};
