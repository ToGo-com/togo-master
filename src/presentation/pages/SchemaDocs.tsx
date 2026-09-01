import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton, Tooltip } from '@mui/material';

// Icons
import StorageIcon from '@mui/icons-material/Storage';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export const SchemaDocs: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const schemaSnippets = {
    company: `// 1. GOBERNANZA DE EMPRESAS / TIENDAS (M-P11)
export type CompanyStatus = 'ACTIVO' | 'SUSPENDIDO' | 'MORA' | 'PENDIENTE_APROBACION';

export interface Company {
  id: string;                    // UUID
  code: string;                  // 'TG-EMP-001'
  legalName: string;             // 'Gourmet Burgers C.A.'
  tradeName: string;             // 'Burger House Gourmet'
  rif: string;                   // 'J-40982314-1'
  status: CompanyStatus;
  registrationDate: string;      // ISO Date
  zone: string;                  // 'Las Mercedes / Baruta'
  plan: 'Básico' | 'Pro' | 'Empresarial';
  monthlyFee: number;            // e.g. 49.99 USD
  contactEmail: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  legalDocuments: LegalDocument[];
  catalog: CatalogProduct[];
}`,
    financial: `// 2. FINANZAS: MENSUALIDADES Y COMISIONES (M-P13)
export type SubscriptionStatus = 'AL_DIA' | 'POR_VENCER' | 'EN_MORA' | 'SUSPENDIDO';
export type ExpressCommissionType = 'FIXED' | 'PERCENTAGE';

export interface FinancialConfig {
  /** Mode: Fixed Dollar ($) or Percentage (%) of Order */
  expressCommissionType: ExpressCommissionType;
  expressFixedAmount: number;             // e.g. 1.50 USD
  expressPercentage: number;              // e.g. 4.5%
  deliveryPlatformRetentionPct: number;  // e.g. 20% (To Go cut)
  driverLiquidationPct: number;          // e.g. 80% (Driver pay)
  baseDeliveryFee: number;               // Base delivery fare ($)
  extraKmFee: number;                    // Additional $/km fee
}

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  planName: string;
  monthlyAmount: number;
  dueDate: string;
  status: SubscriptionStatus;
  paymentMethod: 'PAGO_MOVIL' | 'TRANSFERENCIA_BANCARIA' | 'ZELLE';
}`,
    driver: `// 3. GESTIÓN DE DRIVERS Y FLOTA (M-P10)
export type DriverStatus = 'ACTIVO' | 'SUSPENDIDO' | 'EN_RUTA' | 'INACTIVO';
export type VehicleType = 'MOTO' | 'BICICLETA' | 'AUTO';

export interface Driver {
  id: string;
  code: string;                  // 'TG-DRV-101'
  fullName: string;
  idNumber: string;              // 'V-24.891.042'
  phone: string;
  vehicleType: VehicleType;
  plateNumber: string;
  assignedCompanyName: string;   // 'Flota To Go Central' or Store
  status: DriverStatus;
  rating: number;
  documents: DriverDocument[];   // Licencia, Seguro, Carnet
  stats: {
    totalDeliveries: number;
    pendingLiquidationAmount: number;
  };
}`,
    marketing: `// 4. MARKETING: BANNERS Y PRODUCTOS DESTACADOS
export interface BannerPromotion {
  id: string;
  title: string;
  imageUrl: string;
  targetType: 'TIENDA' | 'CATEGORIA' | 'URL_EXTERNA';
  targetId: string;
  startDate: string;
  endDate: string;
  prioritySlot: number;          // Slot 1, Slot 2...
  status: 'ACTIVO' | 'PROGRAMADO' | 'EXPIRADO' | 'PAUSADO';
  costCharged: number;
}

export interface FeaturedProductRequest {
  id: string;
  companyId: string;
  productId: string;
  requestedSlot: number;         // 1..4
  feePaid: number;
  startDate: string;
  endDate: string;
  status: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
}`,
  };

  const renderSnippetCard = (title: string, code: string, id: string) => (
    <Card sx={{ bgcolor: '#1A2D42', color: 'grey.100', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'grey.700', pb: 1, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'warning.main' }}>{title}</Typography>
          <Tooltip title={copiedSection === id ? 'Copiado' : 'Copiar'}>
            <IconButton size="small" onClick={() => copyToClipboard(code, id)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              {copiedSection === id ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box component="pre" sx={{ margin: 0, overflowX: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, flexGrow: 1 }}>
          <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'grey.300', fontFamily: 'monospace' }}>
            {code}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <StorageIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Esquema de Datos Propuesto (Data Schema & Architecture)</Typography>
              <Typography variant="body2" color="text.secondary">Estructura tipada en TypeScript para la gobernanza centralizada de To Go Master.</Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {[
              { title: 'M-P11 Empresas', desc: 'KYC, Catálogos, Estatus' },
              { title: 'M-P13 Mensualidades', desc: 'Suscripciones y Conciliación' },
              { title: 'Comisiones & Split', desc: 'Fijo / % Express & Flota' },
              { title: 'M-P10 Drivers & Banners', desc: 'Flota y Monetización' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>{renderSnippetCard("schema/company.types.ts (M-P11)", schemaSnippets.company, "comp")}</Grid>
        <Grid size={{ xs: 12, lg: 6 }}>{renderSnippetCard("schema/financial.types.ts (M-P13)", schemaSnippets.financial, "fin")}</Grid>
        <Grid size={{ xs: 12, lg: 6 }}>{renderSnippetCard("schema/drivers.types.ts (M-P10)", schemaSnippets.driver, "drv")}</Grid>
        <Grid size={{ xs: 12, lg: 6 }}>{renderSnippetCard("schema/marketing.types.ts", schemaSnippets.marketing, "mkt")}</Grid>
      </Grid>
    </Box>
  );
};
