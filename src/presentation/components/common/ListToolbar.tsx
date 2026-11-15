import React from 'react';
import { Alert, Box, InputAdornment, LinearProgress, Pagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchTwoTone';

interface ListToolbarProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
}

export const ListToolbar: React.FC<ListToolbarProps> = ({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actions,
  filters,
}) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
    {(onSearchChange || filters) && (
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {onSearchChange && (
          <TextField
            size="small"
            placeholder={searchPlaceholder ?? 'Buscar…'}
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ minWidth: 280 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        {filters}
      </Box>
    )}
  </Box>
);

export const ListState: React.FC<{ loading: boolean; error: string | null; empty: boolean }> = ({
  loading,
  error,
  empty,
}) => (
  <>
    {loading && <LinearProgress sx={{ mb: 1 }} />}
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}
    {!loading && !error && empty && (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        Sin resultados.
      </Typography>
    )}
  </>
);

export const ListPager: React.FC<{
  total: number;
  page: number;
  pageSize: number;
  onChange: (p: number) => void;
}> = ({ total, page, pageSize, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {total} en total
      </Typography>
      {pages > 1 && <Pagination count={pages} page={page} onChange={(_, p) => onChange(p)} size="small" />}
    </Box>
  );
};
