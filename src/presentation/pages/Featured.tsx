import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/AddCircleOutlined';
import { useApiList } from '../hooks/useApiList';
import { MAX_FEATURED_PRODUCTS, productsApi } from '../../infrastructure/api/services';
import { parseApiError } from '../../infrastructure/http/axiosClient';
import type { ApiProduct } from '../../domain/models/api';
import { ListPager, ListState, ListToolbar } from '../components/common/ListToolbar';

const ERROR_TEXT: Record<string, string> = {
  PRODUCT_FEATURED_DUPLICATE: 'Hay un producto repetido en la lista.',
};

export const Featured: React.FC = () => {
  const [selected, setSelected] = useState<ApiProduct[]>([]);
  const [original, setOriginal] = useState<string[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const catalog = useApiList((q) => productsApi.list(q), {}, 12);

  const loadFeatured = useCallback(async () => {
    setLoadingFeatured(true);
    try {
      const items = await productsApi.featured();
      setSelected(items);
      setOriginal(items.map((p) => p.id));
    } catch (e) {
      setError(parseApiError(e).message);
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  useEffect(() => {
    void loadFeatured();
  }, [loadFeatured]);

  const ids = selected.map((p) => p.id);
  const dirty = JSON.stringify(ids) !== JSON.stringify(original);
  const full = selected.length >= MAX_FEATURED_PRODUCTS;

  const add = (p: ApiProduct) => {
    if (full || ids.includes(p.id)) return;
    setSelected((s) => [...s, p]);
  };
  const remove = (id: string) => setSelected((s) => s.filter((p) => p.id !== id));
  const move = (index: number, dir: -1 | 1) =>
    setSelected((s) => {
      const next = [...s];
      const j = index + dir;
      if (j < 0 || j >= next.length) return s;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const items = await productsApi.setFeatured(ids);
      setSelected(items);
      setOriginal(items.map((p) => p.id));
      setSaved(true);
    } catch (e) {
      const err = parseApiError(e);
      setError((err.code && ERROR_TEXT[err.code]) || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ListToolbar
        title="Destacados"
        subtitle={`Productos de la sección "Productos destacados" de la app del comprador. Hasta ${MAX_FEATURED_PRODUCTS}, en el orden mostrado`}
        actions={
          <Button variant="contained" onClick={save} disabled={!dirty || saving}>
            Guardar lista
          </Button>
        }
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Lista actual
            </Typography>
            <Chip size="small" label={`${selected.length}/${MAX_FEATURED_PRODUCTS}`} color={full ? 'warning' : 'default'} />
          </Box>
          {(loadingFeatured || saving) && <LinearProgress />}
          {!loadingFeatured && selected.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              Sin destacados. Agrega productos desde el catálogo.
            </Typography>
          )}
          <List dense>
            {selected.map((p, i) => (
              <ListItem
                key={p.id}
                secondaryAction={
                  <>
                    <IconButton size="small" disabled={i === 0} onClick={() => move(i, -1)}>
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" disabled={i === selected.length - 1} onClick={() => move(i, 1)}>
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => remove(p.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar variant="rounded" src={p.images[0]?.url}>
                    {i + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${i + 1}. ${p.name}`} secondary={`${p.currency} ${p.price}`} />
              </ListItem>
            ))}
          </List>
        </Card>

        <Box>
          <ListToolbar
            title="Catálogo"
            searchPlaceholder="Buscar producto…"
            searchValue={catalog.searchInput}
            onSearchChange={catalog.setSearchInput}
          />
          <ListState loading={catalog.loading} error={catalog.error} empty={(catalog.data?.items.length ?? 0) === 0} />
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <List dense>
              {catalog.data?.items.map((p) => {
                const picked = ids.includes(p.id);
                return (
                  <ListItem
                    key={p.id}
                    secondaryAction={
                      <IconButton size="small" color="primary" disabled={picked || full} onClick={() => add(p)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar variant="rounded" src={p.images[0]?.url} />
                    </ListItemAvatar>
                    <ListItemText primary={p.name} secondary={`${p.currency} ${p.price} · stock ${p.stock}`} />
                  </ListItem>
                );
              })}
            </List>
          </Card>
          {catalog.data && (
            <ListPager total={catalog.data.total} page={catalog.page} pageSize={catalog.pageSize} onChange={catalog.setPage} />
          )}
        </Box>
      </Box>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} message="Destacados actualizados" />
    </>
  );
};
