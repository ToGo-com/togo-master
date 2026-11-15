import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchParams } from 'react-router-dom';
import { useApiList } from '../hooks/useApiList';
import { companiesApi, ordersApi } from '../../infrastructure/api/services';
import { ORDER_STATUSES, type ApiCompany, type ApiOrder, type OrderStatus } from '../../domain/models/api';
import { ListPager, ListState, ListToolbar } from '../components/common/ListToolbar';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'En preparación',
  ready_to_ship: 'Listo para despachar',
  shipped: 'Enviado',
  completed: 'Completado',
  rejected: 'Rechazado',
};

const STATUS_COLOR: Record<OrderStatus, 'default' | 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  pending: 'warning',
  preparing: 'info',
  ready_to_ship: 'primary',
  shipped: 'primary',
  completed: 'success',
  rejected: 'error',
};

const usd = (n: number) => `$${n.toFixed(2)}`;
const bs = (n: number | null) => (n === null ? '—' : `Bs ${n.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`);

const OrderRow: React.FC<{ order: ApiOrder }> = ({ order }) => {
  const [open, setOpen] = useState(false);
  const buyer = order.customer
    ? [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || '—'
    : '—';

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 40 }}>
          <IconButton size="small" onClick={() => setOpen((o) => !o)}>
            <ExpandMoreIcon fontSize="small" sx={{ transform: open ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 700 }}>{order.orderNumber}</TableCell>
        <TableCell>{order.company?.legalName ?? '—'}</TableCell>
        <TableCell>{buyer}</TableCell>
        <TableCell>
          <Chip size="small" label={STATUS_LABEL[order.status]} color={STATUS_COLOR[order.status]} />
        </TableCell>
        <TableCell align="right">{usd(order.total)}</TableCell>
        <TableCell align="right">{bs(order.totalBs)}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleString('es-VE')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ p: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
              <Box>
                <Typography variant="subtitle2">Productos</Typography>
                {order.items.map((i) => (
                  <Typography key={i.id} variant="body2">
                    {i.quantity} × {i.productName} — {usd(i.subtotal)}
                  </Typography>
                ))}
                {order.exchangeRate !== null && (
                  <Typography variant="caption" color="text.secondary">
                    Tasa: {order.exchangeRate} Bs/USD
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2">Entrega</Typography>
                {order.delivery ? (
                  <Typography variant="body2">
                    {order.delivery.referenceName}: {order.delivery.detailedAddress}, {order.delivery.city},{' '}
                    {order.delivery.state}
                    <br />
                    Tel. {order.delivery.contactPhone}
                  </Typography>
                ) : (
                  <Typography variant="body2">—</Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Comprador: {buyer}
                  {order.customer?.phone ? ` · ${order.customer.phone}` : ''}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Driver y envío</Typography>
                <Typography variant="body2">
                  {order.driver ? `${order.driver.name} · ${order.driver.phone} · ${order.driver.licensePlate}` : 'Sin driver asignado'}
                </Typography>
                {order.carrierName && (
                  <Typography variant="body2">
                    {order.carrierName} · guía {order.trackingNumber ?? '—'}
                  </Typography>
                )}
                {order.rejectionReason && (
                  <Typography variant="body2" color="error">
                    Motivo de rechazo: {order.rejectionReason}
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const Orders: React.FC = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [companyId, setCompanyId] = useState(params.get('companyId') ?? '');
  const [customerId, setCustomerId] = useState(params.get('customerId') ?? '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [companies, setCompanies] = useState<ApiCompany[]>([]);

  useEffect(() => {
    companiesApi.list({ pageSize: 100 }).then((r) => setCompanies(r.items)).catch(() => undefined);
  }, []);

  const list = useApiList(
    (q) => ordersApi.list(q),
    { status, companyId, customerId, from, to },
  );
  const items = list.data?.items ?? [];

  return (
    <>
      <ListToolbar
        title="Pedidos"
        subtitle="Pedidos de todas las empresas. Busca por número (ej. TG-0012)"
        searchPlaceholder="Número de pedido…"
        searchValue={list.searchInput}
        onSearchChange={list.setSearchInput}
        filters={
          <>
            <TextField select size="small" label="Estado" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')} sx={{ minWidth: 190 }}>
              <MenuItem value="">Todos</MenuItem>
              {ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </MenuItem>
              ))}
            </TextField>
            <TextField select size="small" label="Empresa" value={companyId} onChange={(e) => setCompanyId(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="">Todas</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.legalName}
                </MenuItem>
              ))}
            </TextField>
            <TextField size="small" type="date" label="Desde" value={from} onChange={(e) => setFrom(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField size="small" type="date" label="Hasta" value={to} onChange={(e) => setTo(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            {customerId && (
              <Chip label="Filtrado por comprador" onDelete={() => setCustomerId('')} color="primary" />
            )}
          </>
        }
      />
      <ListState loading={list.loading} error={list.error} empty={items.length === 0} />
      {items.length > 0 && (
        <Card sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Pedido</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Comprador</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Total USD</TableCell>
                <TableCell align="right">Total Bs</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {list.data && (
        <ListPager total={list.data.total} page={list.page} pageSize={list.pageSize} onChange={list.setPage} />
      )}
    </>
  );
};
