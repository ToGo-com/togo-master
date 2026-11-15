/**
 * Tipos del contrato real de la API (api.togo-ve.com).
 * Fuente: vault M-A26, M-A33, M-A34, M-A35, M-A36, M-A45, M-A47.
 * Solo campos documentados; nada inventado.
 */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ---- Auth (M-A26) ----
export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'internal' | 'admin' | 'driver';
  firstName?: string | null;
  lastName?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  user: AuthUser;
}

// ---- Empresa (M-A34) ----
export interface ApiCompany {
  id: string;
  rif: string;
  legalName: string;
  fiscalAddress: string;
  phone: string;
  email: string;
  companyCategoryId: string | null;
  files: string[];
  lat?: number | null;
  lng?: number | null;
  whatsapp?: string | null;
  paymentGatewayActive: boolean;
  averageRating: number | null;
  createdAt: string;
}

export interface CompanyInput {
  rif: string;
  legalName: string;
  fiscalAddress: string;
  phone: string;
  email: string;
  companyCategoryId?: string;
  files?: string[];
  lat?: number;
  lng?: number;
  whatsapp?: string;
  paymentGatewayActive?: boolean;
}

export interface CompanyCategory {
  id: string;
  name: string;
}

// ---- Comprador (M-A33) ----
export interface ApiCustomer {
  id: string;
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  documentType: 'national_id' | 'passport' | null;
  documentNumber: string | null;
  phone: string | null;
  profileComplete?: boolean;
}

// ---- Pedido (M-A36) ----
export type OrderStatus = 'pending' | 'preparing' | 'ready_to_ship' | 'shipped' | 'completed' | 'rejected';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'preparing',
  'ready_to_ship',
  'shipped',
  'completed',
  'rejected',
];

export interface ApiOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  variationId: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  companyId: string;
  company: { id: string; legalName: string; logoUrl: string | null } | null;
  addressId: string;
  status: OrderStatus;
  rejectionReason: string | null;
  carrierName: string | null;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
  total: number;
  exchangeRate: number | null;
  totalBs: number | null;
  createdAt: string;
  items: ApiOrderItem[];
  customer: {
    firstName: string | null;
    lastName: string | null;
    documentType: string | null;
    documentNumber: string | null;
    phone: string | null;
  } | null;
  delivery: {
    referenceName: string;
    state: string;
    city: string;
    detailedAddress: string;
    contactPhone: string;
  } | null;
  driverId: string | null;
  driver: { id: string; name: string; phone: string; licensePlate: string } | null;
}

export interface OrderListQuery extends PageQuery {
  companyId?: string;
  customerId?: string;
  status?: OrderStatus | '';
  from?: string;
  to?: string;
}

export interface SalesBucket {
  orders: number;
  totalUsd: number;
  totalBs: number;
}

export interface SalesSummary {
  from: string | null;
  to: string | null;
  companyId: string | null;
  completed: SalesBucket;
  inProgress: SalesBucket;
  rejected: SalesBucket;
  byStatus: (SalesBucket & { status: OrderStatus })[];
  topCompanies: (SalesBucket & { companyId: string; legalName: string })[];
}

// ---- Catálogo (M-A35) ----
export interface ApiProduct {
  id: string;
  companyId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'VES';
  stock: number;
  active: boolean;
  images: { id: string; url: string; position: number }[];
  variations?: { id: string; type: string; value: string }[];
  averageRating?: number | null;
  reviewCount?: number;
}

export interface ProductListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  companyId?: string;
}

// ---- Preguntas (M-A45) ----
export interface QuestionMessage {
  id: string;
  sender: 'customer' | 'store';
  text: string;
  createdAt: string;
}

export interface PublicQuestionThread {
  id: string;
  askerName: string;
  createdAt: string;
  messages: QuestionMessage[];
}
