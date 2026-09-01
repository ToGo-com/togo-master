import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Select, MenuItem, InputAdornment, IconButton, Avatar
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { useAppStore } from '../../application/store/useAppStore';
import type { Driver } from '../../domain/models';
import { StatusBadge } from '../components/common/StatusBadge';

export const Drivers: React.FC = () => {
  const drivers = useAppStore((state) => state.drivers);
  const companies = useAppStore((state) => state.companies);
  const updateDriverStatus = useAppStore((state) => state.updateDriverStatus);
  const verifyDriverDocument = useAppStore((state) => state.verifyDriverDocument);
  const addDriver = useAppStore((state) => state.addDriver);

  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showNewDriverModal, setShowNewDriverModal] = useState(false);

  const [newDriverForm, setNewDriverForm] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    vehicleType: 'MOTO' as Driver['vehicleType'],
    vehicleModel: 'Empire Keeway 150cc',
    plateNumber: '',
    assignedCompanyName: 'Flota To Go Central (Multi-tienda)',
    cityZone: 'Caracas Este / Chacao / Baruta',
  });

  const filteredDrivers = drivers.filter((drv) => {
    const matchesSearch =
      drv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drv.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drv.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drv.assignedCompanyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle = vehicleFilter === 'ALL' || drv.vehicleType === vehicleFilter;
    const matchesStatus = statusFilter === 'ALL' || drv.status === statusFilter;

    return matchesSearch && matchesVehicle && matchesStatus;
  });

  const getVehicleIcon = (type: Driver['vehicleType']) => {
    switch (type) {
      case 'MOTO': return <TwoWheelerIcon fontSize="small" color="warning" />;
      case 'BICICLETA': return <TwoWheelerIcon fontSize="small" color="success" />;
      case 'AUTO': return <DirectionsCarIcon fontSize="small" color="info" />;
      default: return <TwoWheelerIcon fontSize="small" />;
    }
  };

  const handleCreateDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({
      ...newDriverForm,
      code: `TG-DRV-${100 + drivers.length + 1}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVO',
      rating: 5.0,
      registrationDate: new Date().toISOString().split('T')[0],
      stats: {
        totalDeliveries: 0,
        completionRate: 100,
        activeOrdersCount: 0,
        pendingLiquidationAmount: 0,
        totalEarningsHistorical: 0,
      },
      documents: [
        { id: `dd-${Date.now()}-1`, type: 'LICENCIA_CONDUCIR', documentNumber: 'LIC-PENDIENTE', status: 'PENDIENTE', expiresAt: '2028-12-31' },
        { id: `dd-${Date.now()}-2`, type: 'CARNET_CIRCULACION', documentNumber: 'INTT-PENDIENTE', status: 'PENDIENTE', expiresAt: '2028-12-31' },
      ],
      deliveryHistory: [],
    });
    setShowNewDriverModal(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gobernanza de Flota y Repartidores (M-P10)</Typography>
          <Typography variant="body2" color="text.secondary">{filteredDrivers.length} drivers registrados en la plataforma To Go.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowNewDriverModal(true)}>Registrar Nuevo Driver</Button>
      </Box>

      <Card>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar por nombre, cédula o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />
          <Select size="small" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value="ALL">Todos los Vehículos</MenuItem>
            <MenuItem value="MOTO">Motos</MenuItem>
            <MenuItem value="BICICLETA">Bicicletas</MenuItem>
            <MenuItem value="AUTO">Autos</MenuItem>
          </Select>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value="ALL">Todos los Estatus</MenuItem>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="EN_RUTA">En Ruta</MenuItem>
            <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Driver / Cédula</TableCell>
                <TableCell>Vehículo & Placa</TableCell>
                <TableCell>Empresa / Asignación</TableCell>
                <TableCell>Zona / Entregas</TableCell>
                <TableCell>Balance Pendiente</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell align="right">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((drv) => (
                <TableRow key={drv.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar src={drv.avatar} alt={drv.fullName} variant="rounded" />
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{drv.fullName}</Typography>
                          <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 0.5, borderRadius: 1, fontFamily: 'monospace' }}>{drv.code}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{drv.idNumber} • {drv.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {getVehicleIcon(drv.vehicleType)}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{drv.vehicleType}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{drv.vehicleModel} ({drv.plateNumber})</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 'medium' }}>{drv.assignedCompanyName}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="body2">{drv.cityZone}</Typography>
                    <Typography variant="caption" color="text.secondary">{drv.stats.totalDeliveries} viajes • {drv.rating} ★</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>${drv.stats.pendingLiquidationAmount.toFixed(2)} USD</Typography></TableCell>
                  <TableCell><StatusBadge status={drv.status} /></TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" onClick={() => setSelectedDriver(drv)}>Ver Perfil</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <Dialog open={!!selectedDriver} onClose={() => setSelectedDriver(null)} maxWidth="md" fullWidth>
        {selectedDriver && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={selectedDriver.avatar} sx={{ width: 64, height: 64, border: '2px solid rgba(255,255,255,0.2)' }} variant="rounded" />
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ bgcolor: 'warning.main', px: 1, py: 0.25, borderRadius: 1, fontWeight: 'bold' }}>{selectedDriver.code}</Typography>
                    <StatusBadge status={selectedDriver.status} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{selectedDriver.fullName}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontFamily: 'monospace' }}>{selectedDriver.idNumber} • {selectedDriver.phone}</Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={() => setSelectedDriver(null)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Estatus de Operación</Typography>
                    <Typography variant="body2" color="text.secondary">Habilitación para recibir pedidos en tiempo real</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedDriver.status !== 'ACTIVO' && (
                      <Button variant="contained" color="success" onClick={() => { updateDriverStatus(selectedDriver.id, 'ACTIVO'); setSelectedDriver({ ...selectedDriver, status: 'ACTIVO' }); }}>Habilitar Driver</Button>
                    )}
                    {selectedDriver.status !== 'SUSPENDIDO' && (
                      <Button variant="contained" color="error" onClick={() => { updateDriverStatus(selectedDriver.id, 'SUSPENDIDO'); setSelectedDriver({ ...selectedDriver, status: 'SUSPENDIDO' }); }}>Suspender</Button>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' ,  borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Documentos Legales y Vehiculares (KYC)</Typography>
                  <Grid container spacing={2}>
                    {selectedDriver.documents.map((doc) => (
                      <Grid size={{ xs: 12, md: 6 }} key={doc.id}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:last-child': { pb: 2 } }}>
                            <Box>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{doc.type}</Typography>
                                <StatusBadge status={doc.status} />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', mt: 0.5, display: 'block' }}>Nº: {doc.documentNumber} • Vence: {doc.expiresAt}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {doc.status !== 'VERIFICADO' && (
                                <IconButton size="small" color="success" sx={{ bgcolor: 'success.50' }} onClick={() => verifyDriverDocument(selectedDriver.id, doc.id, 'VERIFICADO')}><CheckIcon fontSize="small" /></IconButton>
                              )}
                              {doc.status !== 'RECHAZADO' && (
                                <IconButton size="small" color="error" sx={{ bgcolor: 'error.50' }} onClick={() => verifyDriverDocument(selectedDriver.id, doc.id, 'RECHAZADO')}><ClearIcon fontSize="small" /></IconButton>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' ,  borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Historial Reciente de Entregas y Comisiones Ganadas</Typography>
                  {selectedDriver.deliveryHistory.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>Sin carreras recientes registradas en el turno actual.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedDriver.deliveryHistory.map((dh) => (
                        <Box key={dh.id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{dh.orderId}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{dh.date}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">De: <b>{dh.companyName}</b> → {dh.customerAddress}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', fontFamily: 'monospace' }}>
                            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>+${dh.driverEarning.toFixed(2)}</Typography>
                            <Typography variant="caption" color="text.secondary">To Go Cut: ${dh.platformCut.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog open={showNewDriverModal} onClose={() => setShowNewDriverModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Registrar Nuevo Conductor</Typography>
          <IconButton size="small" onClick={() => setShowNewDriverModal(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form id="new-driver-form" onSubmit={handleCreateDriverSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 6 }}>
                <TextField label="Nombre Completo" required fullWidth size="small" placeholder="Ej. José Daniel Pérez" value={newDriverForm.fullName} onChange={(e) => setNewDriverForm({ ...newDriverForm, fullName: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="Cédula de Identidad" required fullWidth size="small" placeholder="V-25.123.456" value={newDriverForm.idNumber} onChange={(e) => setNewDriverForm({ ...newDriverForm, idNumber: e.target.value })} />
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <TextField label="Teléfono / WhatsApp" required fullWidth size="small" placeholder="+58 414-1234567" value={newDriverForm.phone} onChange={(e) => setNewDriverForm({ ...newDriverForm, phone: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Select size="small" fullWidth value={newDriverForm.vehicleType} onChange={(e) => setNewDriverForm({ ...newDriverForm, vehicleType: e.target.value as Driver['vehicleType'] })}>
                  <MenuItem value="MOTO">Motocicleta</MenuItem>
                  <MenuItem value="BICICLETA">Bicicleta</MenuItem>
                  <MenuItem value="AUTO">Automóvil</MenuItem>
                </Select>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <TextField label="Modelo del Vehículo" fullWidth size="small" placeholder="Ej. Empire Keeway Express 150" value={newDriverForm.vehicleModel} onChange={(e) => setNewDriverForm({ ...newDriverForm, vehicleModel: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="Placa Vehicular" fullWidth size="small" placeholder="Ej. AB1C23D" value={newDriverForm.plateNumber} onChange={(e) => setNewDriverForm({ ...newDriverForm, plateNumber: e.target.value })} slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }} />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Select size="small" fullWidth value={newDriverForm.assignedCompanyName} onChange={(e) => setNewDriverForm({ ...newDriverForm, assignedCompanyName: e.target.value })}>
                  <MenuItem value="Flota To Go Central (Multi-tienda)">Flota To Go Central (Multi-tienda)</MenuItem>
                  {companies.map((c) => (
                    <MenuItem key={c.id} value={`${c.tradeName} (Exclusivo)`}>{c.tradeName} (Exclusivo)</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setShowNewDriverModal(false)}>Cancelar</Button>
          <Button variant="contained" type="submit" form="new-driver-form">Guardar Conductor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
