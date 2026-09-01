import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, InputAdornment, Card, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Tabs, Tab, IconButton, Grid, Divider
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Security';

import { useAppStore } from '../../application/store/useAppStore';
import type { Company } from '../../domain/models';
import { StatusBadge } from '../components/common/StatusBadge';

export const Companies: React.FC = () => {
  const companies = useAppStore((state: any) => state.companies);
  const updateCompanyStatus = useAppStore((state: any) => state.updateCompanyStatus);
  const verifyCompanyDocument = useAppStore((state: any) => state.verifyCompanyDocument);
  const addCompany = useAppStore((state: any) => state.addCompany);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    tradeName: '', legalName: '', rif: '', zone: 'Chacao / Altamira',
    plan: 'Pro' as 'Básico' | 'Pro' | 'Empresarial', monthlyFee: 49.99,
    contactEmail: '', phone: '', address: '', category: 'Restaurante / Comida Rápida',
  });

  const uniqueZones = useMemo(() => Array.from(new Set(companies.map((c: any) => c.zone))), [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c: any) => {
      const matchesSearch = c.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesZone = zoneFilter === 'ALL' || c.zone === zoneFilter;
      const matchesPlan = planFilter === 'ALL' || c.plan === planFilter;
      return matchesSearch && matchesStatus && matchesZone && matchesPlan;
    });
  }, [companies, searchTerm, statusFilter, zoneFilter, planFilter]);

  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCompany(newCompanyForm);
    setShowNewCompanyModal(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gobernanza de Empresas y Tiendas (M-P11)</Typography>
          <Typography variant="body2" color="text.secondary">{filteredCompanies.length} de {companies.length} empresas registradas.</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setShowNewCompanyModal(true)}>Registrar Nueva Empresa</Button>
      </Box>

      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField fullWidth size="small" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Select fullWidth size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">Todos los Estatus</MenuItem>
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="PENDIENTE_APROBACION">Pendiente Aprobación (KYC)</MenuItem>
              <MenuItem value="MORA">En Mora</MenuItem>
              <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Select fullWidth size="small" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
              <MenuItem value="ALL">Todas las Zonas</MenuItem>
              {uniqueZones.map((zone: any) => <MenuItem key={zone as string} value={zone as string}>{zone as string}</MenuItem>)}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Select fullWidth size="small" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <MenuItem value="ALL">Todos los Planes</MenuItem>
              <MenuItem value="Básico">Básico ($29.99)</MenuItem>
              <MenuItem value="Pro">Pro ($49.99)</MenuItem>
              <MenuItem value="Empresarial">Empresarial ($89.99)</MenuItem>
            </Select>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pt: 2, borderTop: '1px solid divider', flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">Filtro Rápido:</Typography>
          <Chip label={`Todas (${companies.length})`} onClick={() => setStatusFilter('ALL')} color={statusFilter === 'ALL' ? 'primary' : 'default'} size="small" />
          <Chip label={`Pendientes KYC (${companies.filter((c: any) => c.status === 'PENDIENTE_APROBACION').length})`} onClick={() => setStatusFilter('PENDIENTE_APROBACION')} color={statusFilter === 'PENDIENTE_APROBACION' ? 'warning' : 'default'} size="small" />
          <Chip label={`En Mora (${companies.filter((c: any) => c.status === 'MORA').length})`} onClick={() => setStatusFilter('MORA')} color={statusFilter === 'MORA' ? 'error' : 'default'} size="small" />
          <Chip label={`Activas (${companies.filter((c: any) => c.status === 'ACTIVO').length})`} onClick={() => setStatusFilter('ACTIVO')} color={statusFilter === 'ACTIVO' ? 'success' : 'default'} size="small" />
        </Box>
      </Card>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Empresa / RIF</TableCell>
                <TableCell>Zona</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No hay resultados</TableCell></TableRow>
              ) : (
                filteredCompanies.map((comp: any) => (
                  <TableRow key={comp.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={comp.logo} variant="rounded" sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comp.tradeName}</Typography>
                            <Chip label={comp.code} size="small" sx={{ height: 16, fontSize: 9 }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">{comp.rif} • {comp.legalName}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <MapIcon fontSize="small" /> <Typography variant="caption">{comp.zone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={comp.category} size="small" sx={{ bgcolor: 'grey.100' }} /></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comp.plan}</Typography>
                      <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'bold' }}>${comp.monthlyFee}/mes</Typography>
                    </TableCell>
                    <TableCell><StatusBadge status={comp.status} /></TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" onClick={() => { setSelectedCompany(comp); setActiveTab(0); }}>Detalle</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <Dialog open={!!selectedCompany} onClose={() => setSelectedCompany(null)} maxWidth="md" fullWidth>
        {selectedCompany && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedCompany.logo} variant="rounded" sx={{ width: 56, height: 56, border: '2px solid rgba(255,255,255,0.2)' }} />
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                    <Chip label={selectedCompany.code} size="small" sx={{ bgcolor: 'secondary.main', color: 'white', height: 20, fontSize: 10, fontWeight: 'bold' }} />
                    <StatusBadge status={selectedCompany.status} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{selectedCompany.tradeName}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{selectedCompany.rif} • {selectedCompany.legalName}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedCompany(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)} sx={{ px: 2 }}>
                <Tab icon={<BusinessIcon fontSize="small" />} iconPosition="start" label="Info General y Acciones" sx={{ textTransform: 'none', fontWeight: 'bold' }} />
                <Tab icon={<ShoppingBagIcon fontSize="small" />} iconPosition="start" label={`Catálogo (${selectedCompany.catalog.length})`} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
                <Tab icon={<DescriptionIcon fontSize="small" />} iconPosition="start" label={`Documentos KYC (${selectedCompany.legalDocuments.length})`} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
              </Tabs>
            </Box>

            <DialogContent sx={{ p: 3, bgcolor: 'background.default', minHeight: 400 }}>
              {activeTab === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Gobernanza Administrativa</Typography>
                        <Typography variant="caption" color="text.secondary">Estatus actual: <b>{selectedCompany.status}</b></Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedCompany.status !== 'ACTIVO' && (
                          <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => updateCompanyStatus(selectedCompany.id, 'ACTIVO')}>Aprobar / Reactivar</Button>
                        )}
                        {selectedCompany.status !== 'SUSPENDIDO' && (
                          <Button variant="contained" sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.900' } }} size="small" startIcon={<CancelIcon />} onClick={() => updateCompanyStatus(selectedCompany.id, 'SUSPENDIDO')}>Suspender</Button>
                        )}
                        <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => { if(confirm('¿Eliminar?')) setSelectedCompany(null); }}>Eliminar</Button>
                      </Box>
                    </CardContent>
                  </Card>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Card variant="outlined" sx={{ height: '100%' }}><CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }} gutterBottom>Información de Contacto</Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}><EmailIcon fontSize="small" color="action"/> <b>Email:</b> {selectedCompany.contactEmail}</Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}><PhoneIcon fontSize="small" color="action"/> <b>Teléfono:</b> {selectedCompany.phone}</Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}><MapIcon fontSize="small" color="action"/> <b>Dirección:</b> {selectedCompany.address}</Typography>
                      </CardContent></Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Card variant="outlined" sx={{ height: '100%' }}><CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }} gutterBottom>Suscripción y Finanzas</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Typography variant="body2" color="text.secondary">Plan:</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedCompany.plan}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Typography variant="body2" color="text.secondary">Tarifa:</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }} color="secondary.main">${selectedCompany.monthlyFee}/mes</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Typography variant="body2" color="text.secondary">Último Pago:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{selectedCompany.lastPaymentDate || 'N/A'}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Typography variant="body2" color="text.secondary">Vencimiento:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedCompany.nextDueDate || 'Pendiente'}</Typography></Box>
                      </CardContent></Card>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}><Card variant="outlined" sx={{ bgcolor: 'grey.50', textAlign: 'center', p: 2 }}><Typography variant="caption" color="text.secondary">Facturación Mes</Typography><Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedCompany.metrics?.monthlyRevenue.toFixed(2)}</Typography></Card></Grid>
                    <Grid size={{ xs: 4 }}><Card variant="outlined" sx={{ bgcolor: 'grey.50', textAlign: 'center', p: 2 }}><Typography variant="caption" color="text.secondary">Cumplimiento</Typography><Typography variant="h6" sx={{ fontWeight: 'bold' }} color="success.main">{selectedCompany.metrics?.completionRate}%</Typography></Card></Grid>
                    <Grid size={{ xs: 4 }}><Card variant="outlined" sx={{ bgcolor: 'grey.50', textAlign: 'center', p: 2 }}><Typography variant="caption" color="text.secondary">Calificación</Typography><Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}><StarIcon fontSize="small" /> {selectedCompany.rating}</Typography></Card></Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  {selectedCompany.catalog.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>Sin productos en catálogo.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {selectedCompany.catalog.map((prod: any) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.id}>
                          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box component="img" src={prod.image} alt={prod.name} sx={{ width: '100%', height: 120, objectFit: 'cover' }} />
                            <CardContent sx={{ flexGrow: 1, p: 1.5, pb: '12px !important', display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Chip label={prod.category} size="small" sx={{ fontSize: 10, height: 20 }} />
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }} color={prod.isAvailable ? 'success.main' : 'text.secondary'}>{prod.isAvailable ? 'Disponible' : 'Agotado'}</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }} noWrap>{prod.name}</Typography>
                              <Divider sx={{ my: 'auto' }} />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="secondary.main">${prod.price.toFixed(2)}</Typography>
                                <Typography variant="caption" color="text.secondary">Stock: {prod.stock}</Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card sx={{ bgcolor: 'info.light', border: '1px solid', borderColor: 'info.main', color: 'info.dark', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon /> <Typography variant="body2">Verifica la autenticidad de los documentos mercantiles y sanitarios.</Typography>
                    </Box>
                  </Card>
                  {selectedCompany.legalDocuments.map((doc: any) => (
                    <Card key={doc.id} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}><DescriptionIcon color="action" /></Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{doc.name}</Typography>
                            <StatusBadge status={doc.status} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">Tipo: <b>{doc.type}</b> • Subido: {doc.uploadedAt}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {doc.status !== 'VERIFICADO' && <Button size="small" variant="contained" color="success" onClick={() => verifyCompanyDocument(selectedCompany.id, doc.id, 'VERIFICADO')}>Aprobar</Button>}
                        {doc.status !== 'RECHAZADO' && <Button size="small" variant="outlined" color="error" onClick={() => verifyCompanyDocument(selectedCompany.id, doc.id, 'RECHAZADO')}>Rechazar</Button>}
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog open={showNewCompanyModal} onClose={() => setShowNewCompanyModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Registrar Nueva Empresa</DialogTitle>
        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <form id="new-company-form" onSubmit={handleCreateCompanySubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Nombre Comercial" required size="small" value={newCompanyForm.tradeName} onChange={e => setNewCompanyForm({...newCompanyForm, tradeName: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Razón Social" required size="small" value={newCompanyForm.legalName} onChange={e => setNewCompanyForm({...newCompanyForm, legalName: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="RIF Fiscal" required size="small" value={newCompanyForm.rif} onChange={e => setNewCompanyForm({...newCompanyForm, rif: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Zona de Operación" required size="small" value={newCompanyForm.zone} onChange={e => setNewCompanyForm({...newCompanyForm, zone: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Select fullWidth size="small" value={newCompanyForm.plan} onChange={e => {
                  const plan = e.target.value as 'Básico' | 'Pro' | 'Empresarial';
                  const fees = { 'Básico': 29.99, 'Pro': 49.99, 'Empresarial': 89.99 };
                  setNewCompanyForm({...newCompanyForm, plan, monthlyFee: fees[plan]});
                }}>
                  <MenuItem value="Básico">Básico ($29.99/mes)</MenuItem>
                  <MenuItem value="Pro">Pro ($49.99/mes)</MenuItem>
                  <MenuItem value="Empresarial">Empresarial ($89.99/mes)</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Categoría" size="small" value={newCompanyForm.category} onChange={e => setNewCompanyForm({...newCompanyForm, category: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email de Contacto" type="email" required size="small" value={newCompanyForm.contactEmail} onChange={e => setNewCompanyForm({...newCompanyForm, contactEmail: e.target.value})} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Teléfono" required size="small" value={newCompanyForm.phone} onChange={e => setNewCompanyForm({...newCompanyForm, phone: e.target.value})} /></Grid>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Dirección Física" required size="small" value={newCompanyForm.address} onChange={e => setNewCompanyForm({...newCompanyForm, address: e.target.value})} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setShowNewCompanyModal(false)}>Cancelar</Button>
          <Button type="submit" form="new-company-form" variant="contained" color="primary">Guardar y Enviar a KYC</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
