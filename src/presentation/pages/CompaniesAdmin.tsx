import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useNavigate } from 'react-router-dom';
import { useApiList } from '../hooks/useApiList';
import { companiesApi } from '../../infrastructure/api/services';
import { parseApiError } from '../../infrastructure/http/axiosClient';
import type { ApiCompany, CompanyCategory, CompanyInput } from '../../domain/models/api';
import { ListPager, ListState, ListToolbar } from '../components/common/ListToolbar';

const EMPTY: CompanyInput = { rif: '', legalName: '', fiscalAddress: '', phone: '', email: '' };

const ERROR_TEXT: Record<string, string> = {
  COMPANY_RIF_ALREADY_REGISTERED: 'Ya existe una empresa con ese RIF.',
  COMPANY_CATEGORY_NOT_FOUND: 'El rubro elegido no existe.',
  COMPANY_NOT_FOUND: 'La empresa ya no existe.',
};

export const CompaniesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const list = useApiList((q) => companiesApi.list(q));
  const items = list.data?.items ?? [];

  const [categories, setCategories] = useState<CompanyCategory[]>([]);
  const [editing, setEditing] = useState<ApiCompany | 'new' | null>(null);
  const [form, setForm] = useState<CompanyInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ApiCompany | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    companiesApi.categories().then(setCategories).catch(() => undefined);
  }, []);

  const openForm = (c: ApiCompany | 'new') => {
    setEditing(c);
    setFormError(null);
    setForm(
      c === 'new'
        ? EMPTY
        : {
            rif: c.rif,
            legalName: c.legalName,
            fiscalAddress: c.fiscalAddress,
            phone: c.phone,
            email: c.email,
            companyCategoryId: c.companyCategoryId ?? undefined,
            whatsapp: c.whatsapp ?? undefined,
            paymentGatewayActive: c.paymentGatewayActive,
          },
    );
  };

  const set = <K extends keyof CompanyInput>(k: K, v: CompanyInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    setFormError(null);
    const payload: CompanyInput = {
      ...form,
      companyCategoryId: form.companyCategoryId || undefined,
      whatsapp: form.whatsapp || undefined,
    };
    try {
      if (editing === 'new') await companiesApi.create(payload);
      else if (editing) await companiesApi.update(editing.id, payload);
      setToast(editing === 'new' ? 'Empresa creada' : 'Empresa actualizada');
      setEditing(null);
      list.reload();
    } catch (e) {
      const err = parseApiError(e);
      setFormError((err.code && ERROR_TEXT[err.code]) || err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await companiesApi.remove(toDelete.id);
      setToast('Empresa eliminada');
      list.reload();
    } catch (e) {
      const err = parseApiError(e);
      setToast((err.code && ERROR_TEXT[err.code]) || err.message);
    } finally {
      setToDelete(null);
    }
  };

  const valid = form.rif && form.legalName && form.fiscalAddress && form.phone && form.email;

  return (
    <>
      <ListToolbar
        title="Empresas (API)"
        subtitle="Datos reales: busca por razón social, RIF o correo"
        searchPlaceholder="Buscar empresa…"
        searchValue={list.searchInput}
        onSearchChange={list.setSearchInput}
        actions={
          <Button variant="contained" onClick={() => openForm('new')}>
            Nueva empresa
          </Button>
        }
      />
      <ListState loading={list.loading} error={list.error} empty={items.length === 0} />
      {items.length > 0 && (
        <Card sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Razón social</TableCell>
                <TableCell>RIF</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Alta</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{c.legalName}</TableCell>
                  <TableCell>{c.rif}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.averageRating ?? '—'}</TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString('es-VE')}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton size="small" title="Ver pedidos" onClick={() => navigate(`/orders?companyId=${c.id}`)}>
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Editar" onClick={() => openForm(c)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Eliminar" onClick={() => setToDelete(c)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {list.data && (
        <ListPager total={list.data.total} page={list.page} pageSize={list.pageSize} onChange={list.setPage} />
      )}

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editing === 'new' ? 'Nueva empresa' : 'Editar empresa'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Box sx={{ display: 'grid', gap: 2, pt: 1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField label="RIF" required value={form.rif} onChange={(e) => set('rif', e.target.value)} />
            <TextField label="Razón social" required value={form.legalName} onChange={(e) => set('legalName', e.target.value)} />
            <TextField label="Correo" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
            <TextField label="Teléfono" required value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <TextField label="Dirección fiscal" required value={form.fiscalAddress} onChange={(e) => set('fiscalAddress', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} />
            <TextField select label="Rubro" value={form.companyCategoryId ?? ''} onChange={(e) => set('companyCategoryId', e.target.value || undefined)}>
              <MenuItem value="">Sin rubro</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="WhatsApp" value={form.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} />
            <FormControlLabel
              control={<Switch checked={!!form.paymentGatewayActive} onChange={(e) => set('paymentGatewayActive', e.target.checked)} />}
              label="Pasarela de pago activa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancelar</Button>
          <Button variant="contained" onClick={submit} disabled={!valid || saving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>¿Eliminar {toDelete?.legalName}?</DialogTitle>
        <DialogContent>
          <DialogContentText>Es un borrado lógico: la empresa deja de aparecer en la API.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)} message={toast} />
    </>
  );
};
