import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

// Icons
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import ZapTwoToneIcon from '@mui/icons-material/OfflineBoltTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import TrendingUpTwoToneIcon from '@mui/icons-material/TrendingUpTwoTone';

import { useAppStore } from '../../application/store/useAppStore';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Data from store
  const companies = useAppStore((state) => state.companies);
  const subscriptions = useAppStore((state) => state.subscriptions);
  const metrics = {
    monthlyRevenue: {
      total: 12500,
      subscriptions: 6000,
      expressCommissions: 3500,
      featuredPromotions: 1500,
      platformDeliveryCut: 1500,
      growthPercentage: 15,
    },
    operationalKPIs: {
      activeCompanies: 150,
      activeDrivers: 45,
      inProgressOrders: 12,
    },
    weeklyRevenueSeries: [
      { week: 'Semana 1', mensualidades: 1500, comisionesExpress: 800, destacadosYBanners: 300 },
      { week: 'Semana 2', mensualidades: 1600, comisionesExpress: 850, destacadosYBanners: 350 },
      { week: 'Semana 3', mensualidades: 1400, comisionesExpress: 900, destacadosYBanners: 400 },
      { week: 'Semana 4', mensualidades: 1500, comisionesExpress: 950, destacadosYBanners: 450 },
    ],
    userGrowthSeries: [
      { month: 'Mayo', compradores: 5000, tiendas: 100, drivers: 30 },
      { month: 'Junio', compradores: 6000, tiendas: 120, drivers: 35 },
      { month: 'Julio', compradores: 7500, tiendas: 135, drivers: 40 },
      { month: 'Agosto', compradores: 9000, tiendas: 150, drivers: 45 },
    ],
  };

  const overdueSubscriptions = subscriptions.filter((s) => s.status === 'EN_MORA');
  const pendingCompanies = companies.filter((c) => c.status === 'PENDIENTE_APROBACION');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Banner Alert */}
      {(pendingCompanies.length > 0 || overdueSubscriptions.length > 0) && (
        <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', boxShadow: 0, border: '1px solid', borderColor: 'warning.main' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: '16px !important', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningTwoToneIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Atención Requerida en Plataforma Master</Typography>
                <Typography variant="body2">
                  Hay {pendingCompanies.length} empresa(s) pendiente(s) de revisión legal (KYC) y {overdueSubscriptions.length} comercio(s) con suscripción vencida en mora.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {pendingCompanies.length > 0 && (
                <Button variant="contained" color="primary" size="small" onClick={() => navigate('/companies')}>
                  Revisar Empresas ({pendingCompanies.length})
                </Button>
              )}
              {overdueSubscriptions.length > 0 && (
                <Button variant="contained" color="secondary" size="small" onClick={() => navigate('/subscriptions')}>
                  Ver Moras ({overdueSubscriptions.length})
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 1. Primary Revenue Master Card */}
      <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: 0, top: 0, transform: 'translate(20%, -20%)', width: 300, height: 300, bgcolor: 'secondary.main', opacity: 0.1, borderRadius: '50%', filter: 'blur(50px)' }} />

        <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>Ingresos del Mes</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Agosto 2026</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                ${metrics.monthlyRevenue.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                <Typography component="span" variant="body1" sx={{ ml: 1, opacity: 0.7 }}>USD Facturados</Typography>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'success.dark', color: "#fff", px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 'bold' }}>
                <TrendingUpTwoToneIcon fontSize="small" sx={{ color: "#fff" }} /> +{metrics.monthlyRevenue.growthPercentage}% vs Julio
              </Typography>
              <Button variant="outlined" color="inherit" size="small" onClick={() => navigate('/commissions')}>Configurar Tarifas</Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {[
              { label: 'Mensualidades (M-P13)', value: metrics.monthlyRevenue.subscriptions, percent: 48, icon: ReceiptTwoToneIcon, color: '#F49730' },
              { label: 'Comisiones Express', value: metrics.monthlyRevenue.expressCommissions, percent: 28, icon: ZapTwoToneIcon, color: '#facc15' },
              { label: 'Banners & Destacados', value: metrics.monthlyRevenue.featuredPromotions, percent: 12, icon: AutoAwesomeTwoToneIcon, color: '#38bdf8' },
              { label: 'Retención Delivery', value: metrics.monthlyRevenue.platformDeliveryCut, percent: 12, icon: TwoWheelerTwoToneIcon, color: '#34d399' },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, opacity: 0.7 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><item.icon sx={{ fontSize: 16, color: item.color }} /> {item.label}</Typography>
                    <Typography variant="caption" sx={{ color: item.color }}>{item.percent}%</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 2. Operational KPIs Grid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Empresas Activas" value={metrics.operationalKPIs.activeCompanies} subtitle="Comercios vendiendo en la app" icon={BusinessTwoToneIcon} iconBgColor="#fff" onClick={() => navigate('/companies')} change={{ value: '+4 este mes', isPositive: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Nuevas por Aprobar" value={pendingCompanies.length} subtitle="Requieren validación legal KYC" icon={WarningTwoToneIcon} iconBgColor="#fff" iconColor={pendingCompanies.length > 0 ? 'warning.main' : 'grey.400'} accentBorder={pendingCompanies.length > 0} onClick={() => navigate('/companies')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Drivers Activos" value={metrics.operationalKPIs.activeDrivers} subtitle="Flota motorizada disponible" icon={TwoWheelerTwoToneIcon} iconBgColor="#fff" iconColor="success.main" onClick={() => navigate('/drivers')} change={{ value: '+8 drivers', isPositive: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pedidos en Curso" value={metrics.operationalKPIs.inProgressOrders} subtitle="342 completados hoy" icon={ShoppingBagTwoToneIcon} iconBgColor="#fff" iconColor="secondary.main" change={{ value: 'Tiempo prom. 28 min', isPositive: true }} />
        </Grid>
      </Grid>

      {/* 3. Fast Charts: Weekly Revenue & User Growth */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Composición de Ingresos Semanales</Typography>
              <Typography variant="caption" color="text.secondary">Mensualidades vs Comisiones Express vs Promociones ($ USD)</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.weeklyRevenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="mensualidades" stackId="a" fill="#1A2D42" name="Mensualidades" />
                  <Bar dataKey="comisionesExpress" stackId="a" fill="#F49730" name="Comisiones Express" />
                  <Bar dataKey="destacadosYBanners" stackId="a" fill="#38BDF8" name="Destacados" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Crecimiento del Ecosistema To Go</Typography>
              <Typography variant="caption" color="text.secondary">Evolución de Compradores, Tiendas Registradas y Drivers</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.userGrowthSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="compradores" stroke="#F49730" fill="#F49730" fillOpacity={0.3} name="Compradores Activos" />
                  <Area type="monotone" dataKey="tiendas" stroke="#1A2D42" fill="#1A2D42" fillOpacity={0.3} name="Tiendas" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Quick Governance Feed */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Últimas Empresas Registradas</Typography>
                <Typography variant="caption" color="text.secondary">Control de onboarding y estado legal de tiendas</Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/companies')}>Ver todas</Button>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Empresa / Comercio</TableCell>
                    <TableCell>Zona</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Estatus</TableCell>
                    <TableCell align="right">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.slice(0, 4).map((comp) => (
                    <TableRow key={comp.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={comp.logo} variant="rounded" />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comp.tradeName}</Typography>
                            <Typography variant="caption" color="text.secondary">{comp.rif}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{comp.zone}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comp.plan}</Typography>
                        <Typography variant="caption" color="text.secondary">${comp.monthlyFee}/mes</Typography>
                      </TableCell>
                      <TableCell><StatusBadge status={comp.status} /></TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => navigate('/companies')}>Detalle</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Accesos Directos</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>Operaciones frecuentes de gobernanza</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
              <Button variant="outlined" color="inherit" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, textAlign: 'left' }} startIcon={<ReceiptTwoToneIcon color="success" />} onClick={() => navigate('/subscriptions')}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Conciliar Pago de Mensualidad</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'none' }}>Registrar pago móvil o Zelle</Typography>
                </Box>
              </Button>
              <Button variant="outlined" color="inherit" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, textAlign: 'left' }} startIcon={<ZapTwoToneIcon color="warning" />} onClick={() => navigate('/commissions')}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ajustar Comisión Express</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'none' }}>Monto fijo ($) o Porcentaje (%)</Typography>
                </Box>
              </Button>
              <Button variant="outlined" color="inherit" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, textAlign: 'left' }} startIcon={<AutoAwesomeTwoToneIcon color="info" />} onClick={() => navigate('/marketing')}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Publicar Banner Promocional</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'none' }}>Carrusel de App Compradores</Typography>
                </Box>
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
