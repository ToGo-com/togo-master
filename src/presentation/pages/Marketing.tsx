import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, IconButton, Tabs, Tab, MenuItem, Select
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useAppStore } from '../../application/store/useAppStore';
import type { BannerPromotion } from '../../domain/models';
import { StatusBadge } from '../components/common/StatusBadge';

export const Marketing: React.FC = () => {
  const banners = useAppStore((state: any) => state.banners);
  const featuredRequests = useAppStore((state: any) => state.featuredRequests);
  const companies = useAppStore((state: any) => state.companies);
  const addBannerPromotion = useAppStore((state: any) => state.addBanner);
  const toggleBannerStatus = useAppStore((state: any) => state.toggleBannerStatus);
  const deleteBannerPromotion = useAppStore((state: any) => state.deleteBanner);
  const updateFeaturedProductStatus = useAppStore((state: any) => state.updateFeaturedStatus);

  const [activeTab, setActiveTab] = useState<'BANNERS' | 'FEATURED'>('BANNERS');
  const [showNewBannerModal, setShowNewBannerModal] = useState(false);
  
  const [bannerForm, setBannerForm] = useState(() => ({
    title: '',
    tagline: '',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80',
    targetType: 'TIENDA' as BannerPromotion['targetType'],
    targetId: companies[0]?.id || '',
    targetName: companies[0]?.tradeName || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    prioritySlot: banners.length + 1,
    status: 'ACTIVO' as BannerPromotion['status'],
    costCharged: 50.00,
    sponsorCompanyName: companies[0]?.tradeName || '',
  }));

  const [carouselIndex, setCarouselIndex] = useState(0);
  const activeBanners = banners.filter((b: any) => b.status === 'ACTIVO');

  const handleNextBanner = () => {
    if (activeBanners.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrevBanner = () => {
    if (activeBanners.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleCreateBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBannerPromotion(bannerForm as Omit<BannerPromotion, 'id' | 'clicksCount' | 'impressionsCount'>);
    setShowNewBannerModal(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', pt: 1, px: 2, borderRadius: '8px 8px 0 0' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ '& .MuiTabs-indicator': { bgcolor: 'warning.main', height: 3 } }}>
          <Tab value="BANNERS" icon={<ImageIcon fontSize="small" />} iconPosition="start" label={`Gestión de Banners Publicitarios (${banners.length})`} sx={{ fontWeight: 'bold', textTransform: 'none', color: activeTab === 'BANNERS' ? 'text.primary' : 'text.secondary', '&.Mui-selected': { color: 'text.primary', bgcolor: 'grey.50' } }} />
          <Tab value="FEATURED" icon={<AutoAwesomeIcon fontSize="small" color="warning" />} iconPosition="start" label={`Solicitudes de Productos Destacados (${featuredRequests.length})`} sx={{ fontWeight: 'bold', textTransform: 'none', color: activeTab === 'FEATURED' ? 'text.primary' : 'text.secondary', '&.Mui-selected': { color: 'text.primary', bgcolor: 'grey.50' } }} />
        </Tabs>
      </Box>

      {activeTab === 'BANNERS' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Banners Promocionales (Carrusel App Compradores)</Typography>
              <Typography variant="body2" color="text.secondary">Espacios publicitarios contratados por marcas para destacar en el Home de To Go</Typography>
            </Box>
            <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => setShowNewBannerModal(true)}>Nuevo Banner Promocional</Button>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'primary.50' }}>
                      <TableRow>
                        <TableCell>Banner / Patrocinante</TableCell>
                        <TableCell>Redirección</TableCell>
                        <TableCell>Vigencia</TableCell>
                        <TableCell>Prioridad (Slot)</TableCell>
                        <TableCell>Estatus</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {banners.map((b: any) => (
                        <TableRow key={b.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <img src={b.imageUrl} alt={b.title} style={{ width: 56, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{b.title}</Typography>
                                <Typography variant="caption" color="text.secondary">Patrocina: <b>{b.sponsorCompanyName || b.targetName}</b></Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>{b.targetType}: {b.targetName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{b.startDate} al {b.endDate}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12 }}>{b.prioritySlot}</Box>
                          </TableCell>
                          <TableCell><StatusBadge status={b.status} /></TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => toggleBannerStatus(b.id)} color={b.status === 'ACTIVO' ? 'warning' : 'success'}>
                              {b.status === 'ACTIVO' ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteBannerPromotion(b.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ bgcolor: '#0F172A', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'grey.800', pb: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <SmartphoneIcon color="warning" fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Vista Previa: App Compradores</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ bgcolor: 'success.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold', opacity: 0.8, fontSize: 10 }}>EN VIVO</Typography>
                  </Box>

                  {activeBanners.length === 0 ? (
                    <Typography variant="body2" color="grey.500" sx={{ textAlign: 'center', py: 4 }}>No hay banners activos para mostrar en el carrusel móvil.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '16/9', border: '1px solid', borderColor: 'grey.800' }}>
                        <img src={activeBanners[carouselIndex]?.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' ,  textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>Slot {activeBanners[carouselIndex]?.prioritySlot} • Promocionado</Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' ,  textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{activeBanners[carouselIndex]?.title}</Typography>
                          <Typography variant="caption" color="grey.300" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{activeBanners[carouselIndex]?.tagline}</Typography>
                        </Box>
                        <IconButton size="small" onClick={handlePrevBanner} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={handleNextBanner} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronRightIcon fontSize="small" /></IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {activeBanners.map((_: any, i: number) => (
                          <Box key={i} onClick={() => setCarouselIndex(i)} sx={{ height: 6, borderRadius: 3, cursor: 'pointer', transition: 'all 0.3s', width: carouselIndex === i ? 20 : 6, bgcolor: carouselIndex === i ? 'warning.main' : 'grey.600' }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
                <CardContent sx={{ borderTop: 1, borderColor: 'grey.800', pt: 2 }}>
                  <Typography variant="caption" color="grey.500" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="success" fontSize="small" /> +31,200 visualizaciones estimadas por carrusel activo este mes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 'FEATURED' && (
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Solicitudes de Tiendas para Destacar Productos</Typography>
              <Typography variant="caption" color="text.secondary">Asignación de posiciones fijas (Slots) en la sección "Recomendados To Go"</Typography>
            </Box>
          </CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.50' }}>
                <TableRow>
                  <TableCell>Producto / Comercio</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio Regular / Promo</TableCell>
                  <TableCell>Slot Asignado</TableCell>
                  <TableCell>Tarifa Pagada</TableCell>
                  <TableCell>Periodo</TableCell>
                  <TableCell>Estatus</TableCell>
                  <TableCell align="right">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featuredRequests.map((fr: any) => (
                  <TableRow key={fr.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <img src={fr.productImage} alt={fr.productName} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{fr.productName}</Typography>
                          <Typography variant="caption" color="text.secondary">{fr.companyName}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2">{fr.category}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>${fr.regularPrice.toFixed(2)}</Typography>
                      {fr.promotionalPrice && <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block' }}>Promo: ${fr.promotionalPrice.toFixed(2)}</Typography>}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontFamily: 'monospace', fontWeight: 'bold' }}>Slot #{fr.requestedSlot}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="success.dark" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>${fr.feePaid.toFixed(2)} USD</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{fr.startDate} al {fr.endDate} ({fr.durationDays} días)</Typography></TableCell>
                    <TableCell><StatusBadge status={fr.status} /></TableCell>
                    <TableCell align="right">
                      {fr.status === 'PENDIENTE' ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button size="small" variant="contained" color="success" onClick={() => updateFeaturedProductStatus(fr.id, 'APROBADO')}>Aprobar Slot</Button>
                          <Button size="small" variant="text" color="error" onClick={() => updateFeaturedProductStatus(fr.id, 'RECHAZADO')}>Rechazar</Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Gestionado</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      <Dialog open={showNewBannerModal} onClose={() => setShowNewBannerModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Crear Nuevo Banner Promocional</Typography>
          <IconButton size="small" onClick={() => setShowNewBannerModal(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form id="new-banner-form" onSubmit={handleCreateBannerSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField label="Título del Banner" required fullWidth size="small" placeholder="Ej. ¡Promo 2x1 en Pizzas Familiares!" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} />
              <TextField label="Subtítulo / Tagline" fullWidth size="small" placeholder="Ej. Exclusivo por esta semana en To Go" value={bannerForm.tagline} onChange={(e) => setBannerForm({ ...bannerForm, tagline: e.target.value })} />
              <TextField label="URL de la Imagen Promocional" type="url" required fullWidth size="small" value={bannerForm.imageUrl} onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} />
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Select size="small" fullWidth value={bannerForm.targetType} onChange={(e) => setBannerForm({ ...bannerForm, targetType: e.target.value as BannerPromotion['targetType'] })}>
                    <MenuItem value="TIENDA">Tienda Específica</MenuItem>
                    <MenuItem value="CATEGORIA">Categoría Global</MenuItem>
                    <MenuItem value="URL_EXTERNA">Enlace Externo</MenuItem>
                  </Select>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Select size="small" fullWidth value={bannerForm.targetId} onChange={(e) => {
                    const sel = companies.find((c: any) => c.id === e.target.value);
                    setBannerForm({ ...bannerForm, targetId: e.target.value, targetName: sel?.tradeName || '', sponsorCompanyName: sel?.tradeName || '' });
                  }}>
                    {companies.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.tradeName}</MenuItem>)}
                  </Select>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField label="Fecha Inicio" type="date" required fullWidth size="small" slotProps={{ inputLabel: { shrink: true } }} value={bannerForm.startDate} onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label="Fecha Fin" type="date" required fullWidth size="small" slotProps={{ inputLabel: { shrink: true } }} value={bannerForm.endDate} onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField label="Posición en Carrusel (Slot)" type="number" slotProps={{ htmlInput: { min: 1, max: 10 } }} fullWidth size="small" value={bannerForm.prioritySlot} onChange={(e) => setBannerForm({ ...bannerForm, prioritySlot: parseInt(e.target.value) || 1 })} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label="Costo Facturado ($ USD)" type="number" fullWidth size="small" value={bannerForm.costCharged} onChange={(e) => setBannerForm({ ...bannerForm, costCharged: parseFloat(e.target.value) || 0 })} />
                </Grid>
              </Grid>
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setShowNewBannerModal(false)}>Cancelar</Button>
          <Button variant="contained" color="warning" type="submit" form="new-banner-form">Guardar y Activar Banner</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
