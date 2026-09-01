import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, InputAdornment, Card, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Tabs, Tab, IconButton, Grid, Chip
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AlarmIcon from '@mui/icons-material/Alarm';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { useAppStore } from '../../application/store/useAppStore';
import type { Subscription, PaymentRecord } from '../../domain/models';
import { StatusBadge } from '../components/common/StatusBadge';

const generateReference = () => `PM-${Math.floor(100000 + Math.random() * 900000)}`;

export const Subscriptions: React.FC = () => {
  const subscriptions = useAppStore((state) => state.subscriptions);
  const paymentHistory = useAppStore((state) => state.paymentHistory);
  const confirmPaymentAndRenew = useAppStore((state) => state.confirmPaymentAndRenew);
  const suspendForNonPayment = useAppStore((state) => state.suspendForNonPayment);
  const reactivateSubscription = useAppStore((state) => state.reactivateSubscription);

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [paymentModalSub, setPaymentModalSub] = useState<Subscription | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'PAGO_MOVIL' as PaymentRecord['paymentMethod'],
    referenceNumber: '',
    bankOrigin: 'Banesco Banco Universal',
    periodCovered: 'Septiembre 2026',
  });

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.companyRif.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

  const totalMonthlyProjected = useMemo(() => subscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0), [subscriptions]);
  const totalOverdueCount = useMemo(() => subscriptions.filter((s) => s.status === 'EN_MORA').length, [subscriptions]);
  const totalDueSoonCount = useMemo(() => subscriptions.filter((s) => s.status === 'POR_VENCER').length, [subscriptions]);

  const handleOpenPaymentModal = (sub: Subscription) => {
    setPaymentModalSub(sub);
    setPaymentForm({
      amount: sub.monthlyAmount,
      paymentMethod: 'PAGO_MOVIL',
      referenceNumber: generateReference(),
      bankOrigin: 'Banesco Banco Universal',
      periodCovered: 'Septiembre 2026',
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentModalSub) {
      confirmPaymentAndRenew(paymentModalSub.id, paymentForm);
      setPaymentModalSub(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Finanzas: Mensualidades (M-P13)</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Recurrencia Proyectada</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${totalMonthlyProjected.toFixed(2)} USD</Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>Suscripciones de Comercios</Typography>
              </Box>
              <Box sx={{ bgcolor: 'info.light', p: 1, borderRadius: 1, color: 'info.main' }}>
                <ReceiptLongIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Tiendas Próximas a Vencer</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="warning.main">{totalDueSoonCount} comercios</Typography>
                <Typography variant="caption" color="text.secondary">En ventana de 3 a 5 días</Typography>
              </Box>
              <Box sx={{ bgcolor: 'warning.light', p: 1, borderRadius: 1, color: 'warning.main' }}>
                <AlarmIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Tiendas en Mora Crítica</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="error.main">{totalOverdueCount} comercios</Typography>
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>Requieren suspensión</Typography>
              </Box>
              <Box sx={{ bgcolor: 'error.light', p: 1, borderRadius: 1, color: 'error.main' }}>
                <ErrorOutlineIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<CalendarTodayIcon fontSize="small" />} iconPosition="start" label={`Panel de Vencimientos y Mora (${subscriptions.length})`} />
          <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label={`Historial Financiero Conciliado (${paymentHistory.length})`} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField variant="outlined" size="small" placeholder="Buscar por comercio, RIF o factura..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) } }} sx={{ minWidth: 300 }} />
            <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">Todos los Estados</MenuItem>
              <MenuItem value="AL_DIA">Al Día</MenuItem>
              <MenuItem value="POR_VENCER">Por Vencer</MenuItem>
              <MenuItem value="EN_MORA">En Mora</MenuItem>
              <MenuItem value="SUSPENDIDO">Suspendidos</MenuItem>
            </Select>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Empresa / Factura</TableCell>
                  <TableCell>Plan y Monto</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell>Días / Estatus</TableCell>
                  <TableCell>Método Habitual</TableCell>
                  <TableCell align="right">Acciones Rápidas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id} hover sx={{ bgcolor: sub.status === 'EN_MORA' ? 'error.50' : sub.status === 'POR_VENCER' ? 'warning.50' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sub.companyName}</Typography>
                      <Typography variant="caption" color="text.secondary">{sub.companyRif} • {sub.invoiceNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{sub.planName}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="primary.main">${sub.monthlyAmount.toFixed(2)} USD</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sub.dueDate}</Typography>
                      <Typography variant="caption" color="text.secondary">Último: {sub.lastPaymentDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sub.status} />
                      <Typography variant="caption" color={sub.daysRemainingOrOverdue < 0 ? 'error.main' : 'text.secondary'} sx={{ display: 'block', fontWeight: sub.daysRemainingOrOverdue < 0 ? 'bold' : 'normal' }}>
                        {sub.daysRemainingOrOverdue < 0 ? `${Math.abs(sub.daysRemainingOrOverdue)} días vencido` : `Quedan ${sub.daysRemainingOrOverdue} días`}
                      </Typography>
                    </TableCell>
                    <TableCell><Chip size="small" label={sub.paymentMethod} sx={{ bgcolor: 'grey.100' }} /></TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button size="small" variant="contained" color="warning" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleOpenPaymentModal(sub)}>Confirmar Pago</Button>
                        {sub.status === 'EN_MORA' && (
                          <Button size="small" variant="outlined" color="error" onClick={() => { if(confirm(`¿Suspender ${sub.companyName}?`)) suspendForNonPayment(sub.id); }}>Suspender</Button>
                        )}
                        {sub.status === 'SUSPENDIDO' && (
                          <Button size="small" variant="outlined" color="success" onClick={() => reactivateSubscription(sub.id)}>Reactivar</Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {activeTab === 1 && (
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>Comprobantes de Pago y Renovaciones Registradas</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Comercio</TableCell>
                  <TableCell>Monto Cobrado</TableCell>
                  <TableCell>Fecha / Hora</TableCell>
                  <TableCell>Método & Banco</TableCell>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Periodo Cubierto</TableCell>
                  <TableCell>Conciliado Por</TableCell>
                  <TableCell>Estatus</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((rec) => (
                  <TableRow key={rec.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{rec.companyName}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }} color="success.main">${rec.amount.toFixed(2)} USD</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{rec.paymentDate}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{rec.paymentMethod}</Typography>
                      <Typography variant="caption" color="text.secondary">{rec.bankOrigin}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{rec.referenceNumber}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{rec.periodCovered}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{rec.confirmedBy}</Typography></TableCell>
                    <TableCell><StatusBadge status={rec.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      <Dialog open={!!paymentModalSub} onClose={() => setPaymentModalSub(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Registrar Pago de Mensualidad</Typography>
          <IconButton size="small" onClick={() => setPaymentModalSub(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {paymentModalSub && (
            <form id="payment-form" onSubmit={handlePaymentSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{paymentModalSub.companyName}</Typography>
                  <Typography variant="caption" color="text.secondary">Plan: {paymentModalSub.planName} • RIF: {paymentModalSub.companyRif}</Typography>
                </Box>
                <TextField label="Monto a Conciliar ($ USD)" required fullWidth type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })} size="small" />
                <Select label="Método de Pago" fullWidth size="small" value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as PaymentRecord['paymentMethod'] })}>
                  <MenuItem value="PAGO_MOVIL">Pago Móvil Interbancario</MenuItem>
                  <MenuItem value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria Nacional</MenuItem>
                  <MenuItem value="ZELLE">Zelle / Transferencia Internacional</MenuItem>
                  <MenuItem value="AUTOMATICO_TARJETA">Cobro Automático en Tarjeta</MenuItem>
                </Select>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}><TextField label="Nº de Referencia" required fullWidth size="small" value={paymentForm.referenceNumber} onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField label="Banco Origen" required fullWidth size="small" value={paymentForm.bankOrigin} onChange={(e) => setPaymentForm({ ...paymentForm, bankOrigin: e.target.value })} /></Grid>
                </Grid>
                <TextField label="Periodo Facturado" required fullWidth size="small" value={paymentForm.periodCovered} onChange={(e) => setPaymentForm({ ...paymentForm, periodCovered: e.target.value })} />
              </Box>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setPaymentModalSub(null)}>Cancelar</Button>
          <Button variant="contained" color="warning" type="submit" form="payment-form">Confirmar Pago y Renovar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
