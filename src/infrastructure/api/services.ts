import { axiosClient } from '../http/axiosClient';
import type {
  ApiCompany,
  ApiCustomer,
  ApiOrder,
  ApiProduct,
  CompanyCategory,
  CompanyInput,
  LoginResponse,
  AuthUser,
  OrderListQuery,
  Paginated,
  PageQuery,
  ProductListQuery,
  PublicQuestionThread,
  SalesSummary,
} from '../../domain/models/api';

/** Quita claves vacías para no mandar `search=` ni `status=` en blanco. */
const clean = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>;

// ---- Auth (M-A26) ----
export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),
  me: () => axiosClient.get<AuthUser>('/auth/me').then((r) => r.data),
  refresh: () =>
    axiosClient.post<{ accessToken: string; expiresIn: string }>('/auth/refresh').then((r) => r.data),
  logout: () => axiosClient.post('/auth/logout').then(() => undefined),
};

// ---- Empresas (M-A34) ----
export const companiesApi = {
  list: (query: PageQuery = {}) =>
    axiosClient.get<Paginated<ApiCompany>>('/companies', { params: clean(query) }).then((r) => r.data),
  get: (id: string) => axiosClient.get<ApiCompany>(`/companies/${id}`).then((r) => r.data),
  create: (input: CompanyInput) => axiosClient.post<ApiCompany>('/companies', input).then((r) => r.data),
  update: (id: string, input: Partial<CompanyInput>) =>
    axiosClient.patch<ApiCompany>(`/companies/${id}`, input).then((r) => r.data),
  remove: (id: string) => axiosClient.delete(`/companies/${id}`).then(() => undefined),
  categories: () => axiosClient.get<CompanyCategory[]>('/company-categories').then((r) => r.data),
};

// ---- Compradores (M-A33) ----
export const customersApi = {
  list: (query: PageQuery = {}) =>
    axiosClient.get<Paginated<ApiCustomer>>('/customers', { params: clean(query) }).then((r) => r.data),
  get: (id: string) => axiosClient.get<ApiCustomer>(`/customers/${id}`).then((r) => r.data),
};

// ---- Pedidos y ventas (M-A36) ----
export const ordersApi = {
  list: (query: OrderListQuery = {}) =>
    axiosClient.get<Paginated<ApiOrder>>('/orders', { params: clean(query) }).then((r) => r.data),
  salesSummary: (query: { companyId?: string; from?: string; to?: string } = {}) =>
    axiosClient.get<SalesSummary>('/admin/sales-summary', { params: clean(query) }).then((r) => r.data),
};

// ---- Catálogo y destacados (M-A35) ----
export const productsApi = {
  list: (query: ProductListQuery = {}) =>
    axiosClient.get<Paginated<ApiProduct>>('/products', { params: clean(query) }).then((r) => r.data),
  featured: () => axiosClient.get<{ items: ApiProduct[] }>('/products/featured').then((r) => r.data.items),
  /** Reemplaza la lista completa y su orden. Máx. 10, sin repetidos, activos. */
  setFeatured: (productIds: string[]) =>
    axiosClient.put<{ items: ApiProduct[] }>('/products/featured', { productIds }).then((r) => r.data.items),
};
export const MAX_FEATURED_PRODUCTS = 10;

// ---- Preguntas (M-A45) ----
export const questionsApi = {
  /** Público: solo hilos ya respondidos. */
  listByProduct: (productId: string, query: { page?: number; pageSize?: number } = {}) =>
    axiosClient
      .get<Paginated<PublicQuestionThread>>(`/products/${productId}/questions`, { params: clean(query) })
      .then((r) => r.data),
  /** Admin: oculta el hilo completo (204, idempotente). */
  hide: (questionId: string) => axiosClient.delete(`/questions/${questionId}`).then(() => undefined),
};
