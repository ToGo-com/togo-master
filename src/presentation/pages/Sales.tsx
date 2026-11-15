import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  LinearProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/PaidTwoTone';
import HourglassIcon from '@mui/icons-material/HourglassTopTwoTone';
import CancelIcon from '@mui/icons-material/CancelTwoTone';
import { StatCard } from '../components/common/StatCard';
import { ListToolbar } from '../components/common/ListToolbar';
import { companiesApi, ordersApi } from '../../infrastructure/api/services';
import { parseApiError } from '../../infrastructure/http/axiosClient';
import type { ApiCompany, SalesSummary } from '../../domain/models/api';
import { STATUS_LABEL } from './Orders';

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const bs = (n: number) => `Bs ${n.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;

export const Sales: React.FC = () => {
  const [companyId, setCompanyId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [companies, setCompanies] = useState<ApiCompany[]>([]);
  const [data, setData] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    companiesApi.list({ pageSize: 100 }).then((r) => setCompanies(r.items)).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    ordersApi
      .salesSummary({ companyId, from, to })
      .then((r) => !cancelled && setData(r))
      .catch((e) => {
        if (cancelled) return;
        const err = parseApiError(e);
        setError(err.code === 'ORDER_INVALID_DATE_RANGE' ? '"Desde" no puede ser posterior a "Hasta".' : err.message);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [companyId, from, to]);

  return (
    <>
      <ListToolbar
        title="Ventas"
        subtitle="Resumen global. Las fechas filtran por creación del pedido"
        filters={
          <>
            <TextField select size="small" label="Empresa" value={companyId} onChange={(e) => setCompanyId(e.target.value)} sx={{ minWidth: 220 }}>
              <MenuItem value="">Todas</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.legalName}
                </MenuItem>
              ))}
            </TextField>
            <TextField size="small" type="date" label="Desde" value={from} onChange={(e) => setFrom(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField size="small" type="date" label="Hasta" value={to} onChange={(e) => setTo(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          </>
        }
      />
      {loading && <LinearProgress sx={{ mb: 1 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {data && !error && (
        <>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 3 }}>
            <StatCard title="Vendido (completados)" value={usd(data.completed.totalUsd)} subtitle={`${data.completed.orders} pedidos · ${bs(data.completed.totalBs)}`} icon={PaidIcon} iconBgColor="#dcfce7" iconColor="#16a34a" />
            <StatCard title="En curso" value={usd(data.inProgress.totalUsd)} subtitle={`${data.inProgress.orders} pedidos · ${bs(data.inProgress.totalBs)}`} icon={HourglassIcon} iconBgColor="#fef3c7" iconColor="#d97706" />
            <StatCard title="Rechazados" value={usd(data.rejected.totalUsd)} subtitle={`${data.rejected.orders} pedidos · ${bs(data.rejected.totalBs)}`} icon={CancelIcon} iconBgColor="#fee2e2" iconColor="#dc2626" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            El total en Bs suma solo pedidos que guardaron su tasa (anteriores al 2026-11-08 no la tienen).
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, p: 2 }}>
                Por estado
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Pedidos</TableCell>
                    <TableCell align="right">USD</TableCell>
                    <TableCell align="right">Bs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.byStatus.map((s) => (
                    <TableRow key={s.status}>
                      <TableCell>{STATUS_LABEL[s.status]}</TableCell>
                      <TableCell align="right">{s.orders}</TableCell>
                      <TableCell align="right">{usd(s.totalUsd)}</TableCell>
                      <TableCell align="right">{bs(s.totalBs)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, p: 2 }}>
                Top 5 tiendas (completados)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tienda</TableCell>
                    <TableCell align="right">Pedidos</TableCell>
                    <TableCell align="right">USD</TableCell>
                    <TableCell align="right">Bs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topCompanies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Sin ventas completadas
                      </TableCell>
                    </TableRow>
                  )}
                  {data.topCompanies.map((c) => (
                    <TableRow key={c.companyId}>
                      <TableCell>{c.legalName}</TableCell>
                      <TableCell align="right">{c.orders}</TableCell>
                      <TableCell align="right">{usd(c.totalUsd)}</TableCell>
                      <TableCell align="right">{bs(c.totalBs)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Box>
        </>
      )}
    </>
  );
};
