import { create } from 'zustand';
import type {
  Company,
  CompanyStatus,
  DocumentVerificationStatus,
  Subscription,
  SubscriptionStatus,
  PaymentRecord,
  FinancialConfig,
  DriverSettlement,
  Driver,
  DriverStatus,
  BannerPromotion,
  FeaturedProductRequest,
  AdminNotification,
  NavModule,
} from '../../domain/models';

import {
  initialCompanies,
  initialSubscriptions,
  initialPaymentHistory,
  initialFinancialConfig,
  initialSettlements,
  initialDrivers,
  initialBanners,
  initialFeaturedRequests,
  initialNotifications,
} from '../../infrastructure/repositories/mockData';

export interface AppState {
  // Navigation State
  activeModule: NavModule;
  sidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;

  setActiveModule: (module: NavModule) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;

  // Entities
  companies: Company[];
  subscriptions: Subscription[];
  paymentHistory: PaymentRecord[];
  financialConfig: FinancialConfig;
  driverSettlements: DriverSettlement[];
  drivers: Driver[];
  banners: BannerPromotion[];
  featuredRequests: FeaturedProductRequest[];
  notifications: AdminNotification[];

  // Companies Handlers
  updateCompanyStatus: (companyId: string, newStatus: CompanyStatus) => void;
  verifyCompanyDocument: (companyId: string, documentId: string, newStatus: DocumentVerificationStatus) => void;
  addCompany: (newCompanyData: Partial<Company>) => void;

  // Subscriptions Handlers
  confirmPaymentAndRenew: (
    subscriptionId: string,
    paymentDetails: {
      amount: number;
      paymentMethod: PaymentRecord['paymentMethod'];
      referenceNumber: string;
      bankOrigin: string;
      periodCovered: string;
    }
  ) => void;
  suspendForNonPayment: (subscriptionId: string) => void;
  reactivateSubscription: (subscriptionId: string) => void;

  // Commissions
  saveFinancialConfig: (updatedConfig: FinancialConfig) => void;
  settleDriverPayout: (settlementId: string, paymentReference: string) => void;

  // Marketing
  addBanner: (newBannerData: Omit<BannerPromotion, 'id' | 'clicksCount' | 'impressionsCount'>) => void;
  toggleBannerStatus: (bannerId: string) => void;
  deleteBanner: (bannerId: string) => void;
  updateFeaturedStatus: (requestId: string, status: FeaturedProductRequest['status']) => void;

  // Drivers
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  verifyDriverDocument: (driverId: string, docId: string, status: DocumentVerificationStatus) => void;
  addDriver: (newDriverData: Partial<Driver>) => void;

  // Notifications
  dismissNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'DASHBOARD',
  sidebarCollapsed: false,
  isMobileSidebarOpen: false,

  setActiveModule: (module) => set({ activeModule: module }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setIsMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),

  companies: initialCompanies,
  subscriptions: initialSubscriptions,
  paymentHistory: initialPaymentHistory,
  financialConfig: initialFinancialConfig,
  driverSettlements: initialSettlements,
  drivers: initialDrivers,
  banners: initialBanners,
  featuredRequests: initialFeaturedRequests,
  notifications: initialNotifications,

  updateCompanyStatus: (companyId, newStatus) => {
    set((state) => {
      const updatedCompanies = state.companies.map((c) => (c.id === companyId ? { ...c, status: newStatus } : c));
      let updatedSubscriptions = state.subscriptions;
      if (newStatus === 'SUSPENDIDO') {
        updatedSubscriptions = state.subscriptions.map((s) => (s.companyId === companyId ? { ...s, status: 'SUSPENDIDO' as SubscriptionStatus } : s));
      }
      return { companies: updatedCompanies, subscriptions: updatedSubscriptions };
    });
  },

  verifyCompanyDocument: (companyId, documentId, newStatus) => {
    set((state) => ({
      companies: state.companies.map((c) => {
        if (c.id !== companyId) return c;
        const updatedDocs = c.legalDocuments.map((doc) =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        );
        return { ...c, legalDocuments: updatedDocs };
      }),
    }));
  },

  addCompany: (newCompanyData) => {
    set((state) => {
      const companies = state.companies;
      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        code: `TG-EMP-${String(companies.length + 1).padStart(3, '0')}`,
        legalName: newCompanyData.legalName || 'Nueva Empresa C.A.',
        tradeName: newCompanyData.tradeName || 'Nueva Tienda',
        rif: newCompanyData.rif || 'J-50000000-0',
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
        status: 'PENDIENTE_APROBACION' as CompanyStatus,
        registrationDate: new Date().toISOString().split('T')[0],
        zone: newCompanyData.zone || 'Caracas',
        plan: newCompanyData.plan || 'Pro',
        monthlyFee: newCompanyData.monthlyFee || 49.99,
        contactEmail: newCompanyData.contactEmail || 'contacto@tienda.com',
        phone: newCompanyData.phone || '+58 212-0000000',
        address: newCompanyData.address || 'Av. Principal, Caracas',
        category: newCompanyData.category || 'Restaurantes & Comida',
        rating: 5.0,
        activeOrdersCount: 0,
        totalOrdersCount: 0,
        metrics: { monthlyRevenue: 0, completionRate: 100 },
        legalDocuments: [
          { id: `d-${Date.now()}-1`, name: 'RIF Fiscal Vigente', type: 'RIF', status: 'PENDIENTE', uploadedAt: new Date().toISOString().split('T')[0] },
          { id: `d-${Date.now()}-2`, name: 'Registro Mercantil Folio 1', type: 'REGISTRO_MERCANTIL', status: 'PENDIENTE', uploadedAt: new Date().toISOString().split('T')[0] },
        ],
        catalog: [],
      };

      const newSub: Subscription = {
        id: `sub-${Date.now()}`,
        companyId: newCompany.id,
        companyName: newCompany.tradeName,
        companyRif: newCompany.rif,
        planName: `Plan ${newCompany.plan}`,
        monthlyAmount: newCompany.monthlyFee,
        billingPeriod: 'Septiembre 2026',
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        lastPaymentDate: new Date().toISOString().split('T')[0],
        status: 'AL_DIA' as SubscriptionStatus,
        daysRemainingOrOverdue: 30,
        paymentMethod: 'PAGO_MOVIL',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      };

      return { companies: [newCompany, ...companies], subscriptions: [newSub, ...state.subscriptions] };
    });
  },

  confirmPaymentAndRenew: (subscriptionId, paymentDetails) => {
    set((state) => {
      const targetSub = state.subscriptions.find((s) => s.id === subscriptionId);
      if (!targetSub) return state;

      const nextDueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      const updatedSubscriptions = state.subscriptions.map((s) =>
        s.id === subscriptionId
          ? { ...s, status: 'AL_DIA' as SubscriptionStatus, dueDate: nextDueDate, lastPaymentDate: todayStr, daysRemainingOrOverdue: 30 }
          : s
      );

      const updatedCompanies = state.companies.map((c) =>
        c.id === targetSub.companyId && (c.status === 'MORA' || c.status === 'SUSPENDIDO')
          ? { ...c, status: 'ACTIVO' as CompanyStatus }
          : c
      );

      const newRecord: PaymentRecord = {
        id: `rec-${Date.now()}`,
        subscriptionId,
        companyId: targetSub.companyId,
        companyName: targetSub.companyName,
        amount: paymentDetails.amount,
        paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        paymentMethod: paymentDetails.paymentMethod,
        referenceNumber: paymentDetails.referenceNumber,
        bankOrigin: paymentDetails.bankOrigin,
        status: 'CONCILIADO',
        periodCovered: paymentDetails.periodCovered,
        confirmedBy: 'Admin Master (Master)',
      };

      return {
        subscriptions: updatedSubscriptions,
        companies: updatedCompanies,
        paymentHistory: [newRecord, ...state.paymentHistory],
      };
    });
  },

  suspendForNonPayment: (subscriptionId) => {
    set((state) => {
      const targetSub = state.subscriptions.find((s) => s.id === subscriptionId);
      if (!targetSub) return state;

      return {
        subscriptions: state.subscriptions.map((s) => (s.id === subscriptionId ? { ...s, status: 'SUSPENDIDO' } : s)),
        companies: state.companies.map((c) => (c.id === targetSub.companyId ? { ...c, status: 'SUSPENDIDO' } : c)),
      };
    });
  },

  reactivateSubscription: (subscriptionId) => {
    set((state) => {
      const targetSub = state.subscriptions.find((s) => s.id === subscriptionId);
      if (!targetSub) return state;

      return {
        subscriptions: state.subscriptions.map((s) => (s.id === subscriptionId ? { ...s, status: 'AL_DIA', daysRemainingOrOverdue: 15 } : s)),
        companies: state.companies.map((c) => (c.id === targetSub.companyId ? { ...c, status: 'ACTIVO' } : c)),
      };
    });
  },

  saveFinancialConfig: (updatedConfig) => set({ financialConfig: updatedConfig }),

  settleDriverPayout: (settlementId, paymentReference) => {
    set((state) => ({
      driverSettlements: state.driverSettlements.map((st) =>
        st.id === settlementId ? { ...st, status: 'LIQUIDADO', paymentReference } : st
      ),
    }));
  },

  addBanner: (newBannerData) => {
    set((state) => {
      const newBanner: BannerPromotion = {
        ...newBannerData,
        id: `ban-${Date.now()}`,
        clicksCount: 0,
        impressionsCount: 0,
      };
      return { banners: [newBanner, ...state.banners] };
    });
  },

  toggleBannerStatus: (bannerId) => {
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === bannerId ? { ...b, status: b.status === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO' } : b
      ),
    }));
  },

  deleteBanner: (bannerId) => set((state) => ({ banners: state.banners.filter((b) => b.id !== bannerId) })),

  updateFeaturedStatus: (requestId, status) => {
    set((state) => ({
      featuredRequests: state.featuredRequests.map((f) => (f.id === requestId ? { ...f, status } : f)),
    }));
  },

  updateDriverStatus: (driverId, status) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === driverId ? { ...d, status } : d)),
    }));
  },

  verifyDriverDocument: (driverId, docId, status) => {
    set((state) => ({
      drivers: state.drivers.map((d) => {
        if (d.id !== driverId) return d;
        const updatedDocs = d.documents.map((doc) => (doc.id === docId ? { ...doc, status } : doc));
        return { ...d, documents: updatedDocs };
      }),
    }));
  },

  addDriver: (newDriverData) => {
    set((state) => {
      const newDriver: Driver = {
        id: `drv-${Date.now()}`,
        code: newDriverData.code || `TG-DRV-${state.drivers.length + 101}`,
        fullName: newDriverData.fullName || 'Nuevo Conductor',
        idNumber: newDriverData.idNumber || 'V-00.000.000',
        phone: newDriverData.phone || '+58 412-0000000',
        email: newDriverData.email || 'driver@togo.com',
        avatar: newDriverData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        vehicleType: newDriverData.vehicleType || 'MOTO',
        vehicleModel: newDriverData.vehicleModel || 'Keeway Express 150',
        plateNumber: newDriverData.plateNumber || 'AA1B22C',
        assignedCompanyName: newDriverData.assignedCompanyName || 'Flota To Go Central',
        status: 'ACTIVO',
        rating: 5.0,
        registrationDate: new Date().toISOString().split('T')[0],
        cityZone: newDriverData.cityZone || 'Caracas Este',
        stats: { totalDeliveries: 0, completionRate: 100, activeOrdersCount: 0, pendingLiquidationAmount: 0, totalEarningsHistorical: 0 },
        documents: newDriverData.documents || [],
        deliveryHistory: [],
      };
      return { drivers: [newDriver, ...state.drivers] };
    });
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
}));
