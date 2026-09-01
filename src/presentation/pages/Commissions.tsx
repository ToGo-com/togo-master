import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Switch, FormControlLabel, InputAdornment, IconButton, LinearProgress
} from '@mui/material';

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useAppStore } from '../../application/store/useAppStore';
import type { AppState } from '../../application/store/useAppStore';
import type { FinancialConfig, DriverSettlement } from '../../domain/models';
import { StatusBadge } from '../components/common/StatusBadge';

export const Commissions: React.FC = () => {
  const config = useAppStore((state: AppState) => state.financialConfig);
  const driverSettlements = useAppStore((state: AppState) => state.driverSettlements);
  const saveFinancialConfig = useAppStore((state: AppState) => state.saveFinancialConfig);
  const settleDriverPayout = useAppStore((state: AppState) => state.settleDriverPayout);

  const [formConfig, setFormConfig] = useState<FinancialConfig>(config);
  
  const [simOrderSubtotal, setSimOrderSubtotal] = useState(25.00);
  const [simDeliveryDistanceKm, setSimDeliveryDistanceKm] = useState(4.5);
  const [simIsExpress, setSimIsExpress] = useState(true);

  const [selectedSettlement, setSelectedSettlement] = useState<DriverSettlement | null>(null);
  const [settlementRef, setSettlementRef] = useState('');

  const expressFeeCalculated = simIsExpress
    ? formConfig.expressCommissionType === 'FIXED'
      ? formConfig.expressFixedAmount
      : (simOrderSubtotal * formConfig.expressPercentage) / 100
    : 0;

  const deliveryGrossFee =
    formConfig.baseDeliveryFee +
    Math.max(0, simDeliveryDistanceKm - 2.0) * formConfig.extraKmFee;

  const platformDeliveryRetention = (deliveryGrossFee * formConfig.deliveryPlatformRetentionPct) / 100;
  const driverDeliveryEarnings = (deliveryGrossFee * formConfig.driverLiquidationPct) / 100;
  const driverTotalEarnings = driverDeliveryEarnings + (simIsExpress ? expressFeeCalculated * 0.5 : 0);
  const platformTotalRevenue = platformDeliveryRetention + (simIsExpress ? expressFeeCalculated * 0.5 : 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFinancialConfig({
      ...formConfig,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSettlement) {
      settleDriverPayout(selectedSettlement.id, settlementRef || `PM-LIQ-${Date.now().toString().slice(-6)}`);
      setSelectedSettlement(null);
      setSettlementRef('');
    }
  };

  const pendingSettlements = driverSettlements.filter((s: DriverSettlement) => s.status === 'PENDIENTE');
  const totalPendingDebt = pendingSettlements.reduce((acc: number, curr: DriverSettlement) => acc + curr.netPayableToDriver, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ background: 'linear-gradient(to right, #1A2D42, #334155)', color: 'white', p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ bgcolor: 'warning.main', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>ARQUITECTURA MONETARIA</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Comisiones Transaccionales To Go</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Configuración Global de Comisiones & Split de Delivery</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Define si el Pago Express se cobra como Monto Fijo ($) o Porcentaje (%), y el porcentaje retenido a los drivers.</Typography>
        </Box>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2, textAlign: 'right', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>Deuda Pendiente con Drivers</Typography>
          <Typography variant="h5" color="warning.light" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>${totalPendingDebt.toFixed(2)} USD</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Box sx={{ bgcolor: 'warning.light', color: 'warning.dark', p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SettingsIcon /></Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Reglas de Tarifas y Comisiones</Typography>
                  <Typography variant="caption" color="text.secondary">Parámetros globales que gobiernan las compras en la app</Typography>
                </Box>
              </Box>

              <form onSubmit={handleSave}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' ,  display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MonetizationOnIcon color="warning" fontSize="small" /> 1. Modelo de Comisión Pago Express
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Selecciona la modalidad para el recargo de envíos prioritarios / express cobrado al comprador:</Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, bgcolor: 'grey.200', p: 0.5, borderRadius: 2, mb: 2 }}>
                      <Button fullWidth variant={formConfig.expressCommissionType === 'PERCENTAGE' ? 'contained' : 'text'} color={formConfig.expressCommissionType === 'PERCENTAGE' ? 'primary' : 'inherit'} sx={{ borderRadius: 1.5, fontWeight: 'bold' }} onClick={() => setFormConfig({ ...formConfig, expressCommissionType: 'PERCENTAGE' })} startIcon={<PercentIcon />}>Porcentaje del Pedido (%)</Button>
                      <Button fullWidth variant={formConfig.expressCommissionType === 'FIXED' ? 'contained' : 'text'} color={formConfig.expressCommissionType === 'FIXED' ? 'primary' : 'inherit'} sx={{ borderRadius: 1.5, fontWeight: 'bold' }} onClick={() => setFormConfig({ ...formConfig, expressCommissionType: 'FIXED' })} startIcon={<AttachMoneyIcon />}>Monto Fijo Plano ($)</Button>
                    </Box>

                    {formConfig.expressCommissionType === 'PERCENTAGE' ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Porcentaje de Comisión Express (% sobre subtotal)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.expressPercentage} onChange={(e) => setFormConfig({ ...formConfig, expressPercentage: parseFloat(e.target.value) || 0 })} slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Ej: Para un pedido de $20, un {formConfig.expressPercentage}% genera un recargo de ${((20 * formConfig.expressPercentage) / 100).toFixed(2)}.</Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Monto Fijo Express ($ USD por pedido)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.expressFixedAmount} onChange={(e) => setFormConfig({ ...formConfig, expressFixedAmount: parseFloat(e.target.value) || 0 })} slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Ej: Cada pedido express suma exactamente ${formConfig.expressFixedAmount.toFixed(2)} USD.</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' ,  display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TwoWheelerIcon color="success" fontSize="small" /> 2. Split de Delivery (Retención vs Pago Driver)
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Retención To Go (%)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.deliveryPlatformRetentionPct} onChange={(e) => { const val = parseFloat(e.target.value) || 0; setFormConfig({ ...formConfig, deliveryPlatformRetentionPct: val, driverLiquidationPct: Math.max(0, 100 - val) }); }} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Liquidación Driver (%)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.driverLiquidationPct} onChange={(e) => { const val = parseFloat(e.target.value) || 0; setFormConfig({ ...formConfig, driverLiquidationPct: val, deliveryPlatformRetentionPct: Math.max(0, 100 - val) }); }} />
                      </Grid>
                    </Grid>

                    <Box sx={{ mb: 3 }}>
                      <LinearProgress variant="determinate" value={formConfig.deliveryPlatformRetentionPct} sx={{ height: 12, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' }, backgroundColor: 'warning.main' }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>To Go: {formConfig.deliveryPlatformRetentionPct}%</Typography>
                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>Driver: {formConfig.driverLiquidationPct}%</Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Tarifa Base de Delivery ($ USD)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.baseDeliveryFee} onChange={(e) => setFormConfig({ ...formConfig, baseDeliveryFee: parseFloat(e.target.value) || 0 })} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Recargo por Km Adicional ($/km)</Typography>
                        <TextField size="small" type="number" fullWidth value={formConfig.extraKmFee} onChange={(e) => setFormConfig({ ...formConfig, extraKmFee: parseFloat(e.target.value) || 0 })} />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>Último cambio: {formConfig.lastUpdated}</Typography>
                    <Button variant="contained" type="submit">Guardar Configuración Global</Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <CalculateIcon color="warning" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Simulador de Pedido en Vivo</Typography>
                  <Typography variant="caption" color="text.secondary">Prueba cómo impactan las comisiones en un ticket real</Typography>
                </Box>
              </Box>

              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">Monto de Compra:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="primary.main">${simOrderSubtotal.toFixed(2)} USD</Typography>
                  </Box>
                  <input type="range" min="5" max="100" step="1" value={simOrderSubtotal} onChange={(e) => setSimOrderSubtotal(parseFloat(e.target.value))} style={{ width: '100%' }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">Distancia de Entrega:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="primary.main">{simDeliveryDistanceKm} km</Typography>
                  </Box>
                  <input type="range" min="1" max="15" step="0.5" value={simDeliveryDistanceKm} onChange={(e) => setSimDeliveryDistanceKm(parseFloat(e.target.value))} style={{ width: '100%' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <FormControlLabel control={<Switch size="small" checked={simIsExpress} onChange={(e) => setSimIsExpress(e.target.checked)} color="warning" />} label={<Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">¿Cliente solicitó Envío Express?</Typography>} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="warning.main">{simIsExpress ? 'EXPRESS ACTIVO' : 'ESTÁNDAR'}</Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal Productos (Comercio):</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }}>${simOrderSubtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Costo Delivery Base ({simDeliveryDistanceKm} km):</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }}>${deliveryGrossFee.toFixed(2)}</Typography>
                </Box>
                {simIsExpress && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'warning.50', p: 1, borderRadius: 1, color: 'warning.dark' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Fee Express ({formConfig.expressCommissionType === 'FIXED' ? 'Fijo' : `${formConfig.expressPercentage}%`}):</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }}>+${expressFeeCalculated.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', pt: 1, mt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Cobrado al Cliente:</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }} color="primary.main">${(simOrderSubtotal + deliveryGrossFee + expressFeeCalculated).toFixed(2)} USD</Typography>
                </Box>
              </Box>

              <Box sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', borderRadius: 2, p: 2, mt: 3 }}>
                <Typography variant="caption" color="success.dark" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>Desglose de Liquidación Instantánea:</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="success.dark">Comercio recibe:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }} color="success.dark">${simOrderSubtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.dark">Driver recibe ({formConfig.driverLiquidationPct}% delivery):</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }} color="success.dark">${driverTotalEarnings.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'success.200', pt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="primary.main">Ganancia To Go (Split + Express):</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }} color="primary.main">${platformTotalRevenue.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Liquidaciones Pendientes a Flota de Drivers</Typography>
            <Typography variant="caption" color="text.secondary">Control de saldos recaudados por To Go pendientes de transferir a los repartidores</Typography>
          </Box>
          <Typography variant="caption" sx={{ bgcolor: 'warning.50', color: 'warning.dark', px: 2, py: 1, borderRadius: 4, border: '1px solid', borderColor: 'warning.200', fontWeight: 'bold' }}>{pendingSettlements.length} pagos pendientes</Typography>
        </CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell>Periodo</TableCell>
                <TableCell>Carreras</TableCell>
                <TableCell>Total Bruto</TableCell>
                <TableCell>Retención To Go</TableCell>
                <TableCell>Neto a Liquidar</TableCell>
                <TableCell>Cuenta Bancaria</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell align="right">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {driverSettlements.map((st: DriverSettlement) => (
                <TableRow key={st.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{st.driverName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{st.driverPhone}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{st.period}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold'  }}>{st.totalTrips} envíos</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>${st.grossDeliveryRevenue.toFixed(2)}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="warning.main" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>${st.platformCommissionCut.toFixed(2)}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="success.main" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>${st.netPayableToDriver.toFixed(2)}</Typography></TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{st.bankAccount}</Typography></TableCell>
                  <TableCell><StatusBadge status={st.status} /></TableCell>
                  <TableCell align="right">
                    {st.status === 'PENDIENTE' ? (
                      <Button size="small" variant="contained" color="success" onClick={() => setSelectedSettlement(st)}>Liquidar Pago</Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>Ref: {st.paymentReference}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <Dialog open={!!selectedSettlement} onClose={() => setSelectedSettlement(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Liquidar Pago a Driver</Typography>
          <IconButton size="small" onClick={() => setSelectedSettlement(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedSettlement && (
            <form id="payout-form" onSubmit={handlePayoutSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{selectedSettlement.driverName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedSettlement.period}</Typography>
                  <Typography variant="h6" color="success.dark" sx={{ fontWeight: 'bold' }}>Monto a Transferir: ${selectedSettlement.netPayableToDriver.toFixed(2)} USD</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>Cuenta: {selectedSettlement.bankAccount}</Typography>
                </Box>
                <TextField label="Nº de Referencia Bancaria / Pago Móvil" required fullWidth size="small" value={settlementRef} onChange={(e) => setSettlementRef(e.target.value)} />
              </Box>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setSelectedSettlement(null)}>Cancelar</Button>
          <Button variant="contained" color="success" type="submit" form="payout-form">Confirmar Liquidación</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
