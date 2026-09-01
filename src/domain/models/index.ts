/**
 * @file schema.ts
 * @description Master Data Schemas and Type Definitions for the To Go Admin Governance Platform.
 */

export type CompanyStatus = 'ACTIVO' | 'SUSPENDIDO' | 'MORA' | 'PENDIENTE_APROBACION';

export type NavModule =
  | 'DASHBOARD'
  | 'COMPANIES'
  | 'SUBSCRIPTIONS'
  | 'COMMISSIONS'
  | 'DRIVERS'
  | 'MARKETING'
  | 'SCHEMA_DOCS';

export type DocumentType = 'RIF' | 'REGISTRO_MERCANTIL' | 'CEDULA_REPRESENTANTE' | 'PERMISO_SANITARIO' | 'CONTRATO_SERVICIO';
export type DocumentVerificationStatus = 'VERIFICADO' | 'PENDIENTE' | 'RECHAZADO';

export interface LegalDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl?: string;
  status: DocumentVerificationStatus;
  uploadedAt: string;
  verifiedAt?: string;
  notes?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  image: string;
  description?: string;
  salesCount: number;
}

export interface Company {
  id: string;
  code: string;
  legalName: string;
  tradeName: string;
  rif: string;
  status: CompanyStatus;
  registrationDate: string;
  zone: string;
  plan: 'Básico' | 'Pro' | 'Empresarial';
  monthlyFee: number;
  contactEmail: string;
  phone: string;
  address: string;
  category: string;
  logo: string;
  bannerImage?: string;
  rating: number;
  activeOrdersCount: number;
  totalOrdersCount: number;
  metrics: {
    monthlyRevenue: number;
    completionRate: number;
  };
  legalDocuments: LegalDocument[];
  catalog: CatalogProduct[];
  lastPaymentDate?: string;
  nextDueDate?: string;
}

export type SubscriptionStatus = 'AL_DIA' | 'POR_VENCER' | 'EN_MORA' | 'SUSPENDIDO';

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  companyRif: string;
  planName: string;
  monthlyAmount: number;
  dueDate: string;
  lastPaymentDate: string;
  status: SubscriptionStatus;
  daysRemainingOrOverdue: number; // Positive = days left, Negative = days overdue
  billingPeriod: string;
  paymentMethod: 'PAGO_MOVIL' | 'TRANSFERENCIA_BANCARIA' | 'ZELLE' | 'AUTOMATICO_TARJETA';
  invoiceNumber: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  subscriptionId: string;
  companyId: string;
  companyName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'PAGO_MOVIL' | 'TRANSFERENCIA_BANCARIA' | 'ZELLE' | 'AUTOMATICO_TARJETA';
  referenceNumber: string;
  bankOrigin?: string;
  periodCovered: string;
  confirmedBy: string;
  receiptUrl?: string;
  status: 'CONCILIADO' | 'PENDIENTE' | 'RECHAZADO';
}

export type ExpressCommissionType = 'FIXED' | 'PERCENTAGE';

export interface FinancialConfig {
  /** Mode for Express payment fee: Fixed Dollar Amount or Percentage of Order */
  expressCommissionType: ExpressCommissionType;
  /** Fixed dollar fee if expressCommissionType === 'FIXED' (e.g. $1.50) */
  expressFixedAmount: number;
  /** Percentage fee if expressCommissionType === 'PERCENTAGE' (e.g. 5%) */
  expressPercentage: number;
  /** Platform retention percentage from delivery fare (e.g. 20%) */
  deliveryPlatformRetentionPct: number;
  /** Driver share percentage from delivery fare (e.g. 80%) */
  driverLiquidationPct: number;
  /** Base delivery fee charged per base km */
  baseDeliveryFee: number;
  /** Extra fee per km beyond base radius */
  extraKmFee: number;
  /** Minimum payout threshold for driver batch liquidation ($) */
  minimumDriverPayoutThreshold: number;
  /** Auto-suspension threshold in days overdue */
  autoSuspensionDaysThreshold: number;
  lastUpdated: string;
  updatedBy: string;
}

export type DriverStatus = 'ACTIVO' | 'SUSPENDIDO' | 'EN_RUTA' | 'INACTIVO';
export type VehicleType = 'MOTO' | 'BICICLETA' | 'AUTO';

export interface DriverDocument {
  id: string;
  type: 'LICENCIA_CONDUCIR' | 'CARNET_CIRCULACION' | 'SEGURO_RVC' | 'CEDULA_IDENTIDAD' | 'CERTIFICADO_MEDICO';
  documentNumber: string;
  status: DocumentVerificationStatus;
  expiresAt: string;
  fileUrl?: string;
}

export interface Driver {
  id: string;
  code: string;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  plateNumber: string;
  assignedCompanyId?: string; // If dedicated to a store or platform fleet
  assignedCompanyName: string;
  status: DriverStatus;
  rating: number;
  registrationDate: string;
  cityZone: string;
  stats: {
    totalDeliveries: number;
    completionRate: number;
    activeOrdersCount: number;
    pendingLiquidationAmount: number;
    totalEarningsHistorical: number;
  };
  documents: DriverDocument[];
  deliveryHistory: {
    id: string;
    orderId: string;
    date: string;
    companyName: string;
    customerAddress: string;
    deliveryFee: number;
    driverEarning: number;
    platformCut: number;
    expressExtra?: number;
    status: 'COMPLETADO' | 'CANCELADO';
  }[];
}

export interface DriverSettlement {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  period: string;
  totalTrips: number;
  grossDeliveryRevenue: number;
  platformCommissionCut: number;
  netPayableToDriver: number;
  status: 'PENDIENTE' | 'PAGADO' | 'LIQUIDADO' | 'EN_REVISION';
  paymentReference?: string;
  settledAt?: string;
  bankAccount: string;
}

export type BannerStatus = 'ACTIVO' | 'PROGRAMADO' | 'EXPIRADO' | 'PAUSADO';
export type BannerTargetType = 'TIENDA' | 'CATEGORIA' | 'URL_EXTERNA';

export interface BannerPromotion {
  id: string;
  title: string;
  tagline: string;
  imageUrl: string;
  targetType: BannerTargetType;
  targetId: string;
  targetName: string;
  startDate: string;
  endDate: string;
  prioritySlot: number; // 1 = First in carousel
  status: BannerStatus;
  clicksCount: number;
  impressionsCount: number;
  costCharged: number;
  sponsorCompanyName?: string;
}

export type FeaturedRequestStatus = 'APROBADO' | 'PENDIENTE' | 'RECHAZADO' | 'FINALIZADO';

export interface FeaturedProductRequest {
  id: string;
  companyId: string;
  companyName: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  regularPrice: number;
  promotionalPrice?: number;
  requestedSlot: number; // Slot 1, 2, 3, 4, etc.
  feePaid: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: FeaturedRequestStatus;
  requestedAt: string;
  targetImpressions?: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'PAGO_REGISTRADO' | 'EMPRESA_PENDIENTE' | 'MORA_DETECTADA' | 'DRIVER_DOCUMENTO' | 'BANNER_EXPIRA';
  timestamp: string;
  read: boolean;
  actionModule?: string;
  actionId?: string;
}

export interface OperationalMetrics {
  monthlyRevenue: {
    total: number;
    subscriptions: number;
    expressCommissions: number;
    featuredPromotions: number;
    platformDeliveryCut: number;
    growthPercentage: number;
  };
  operationalKPIs: {
    activeCompanies: number;
    pendingCompanies: number;
    activeDrivers: number;
    inProgressOrders: number;
    totalOrdersToday: number;
    overdueSubscriptionsCount: number;
  };
  weeklyRevenueSeries: {
    week: string;
    mensualidades: number;
    comisionesExpress: number;
    destacadosYBanners: number;
    total: number;
  }[];
  userGrowthSeries: {
    month: string;
    compradores: number;
    tiendas: number;
    drivers: number;
  }[];
}
