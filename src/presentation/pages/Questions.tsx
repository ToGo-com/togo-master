import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
  Typography,
} from '@mui/material';
import { useApiList } from '../hooks/useApiList';
import { productsApi, questionsApi } from '../../infrastructure/api/services';
import { parseApiError } from '../../infrastructure/http/axiosClient';
import type { ApiProduct, Paginated, PublicQuestionThread } from '../../domain/models/api';
import { ListPager, ListState, ListToolbar } from '../components/common/ListToolbar';

/**
 * Moderación de preguntas. La API solo expone para el admin `DELETE /questions/:id`;
 * los hilos se leen por producto con el endpoint público (solo los ya respondidos).
 */
export const Questions: React.FC = () => {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [threads, setThreads] = useState<Paginated<PublicQuestionThread> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toHide, setToHide] = useState<PublicQuestionThread | null>(null);
  const [done, setDone] = useState(false);

  const catalog = useApiList((q) => productsApi.list(q), {}, 10);

  const loadThreads = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      setThreads(await questionsApi.listByProduct(product.id, { page, pageSize: 10 }));
    } catch (e) {
      setError(parseApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [product, page]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  const hide = async () => {
    if (!toHide) return;
    try {
      await questionsApi.hide(toHide.id);
      setToHide(null);
      setDone(true);
      void loadThreads();
    } catch (e) {
      setToHide(null);
      setError(parseApiError(e).message);
    }
  };

  return (
    <>
      <ListToolbar
        title="Moderar preguntas"
        subtitle="Elige un producto y oculta los hilos inapropiados. Ocultar quita el hilo completo para todos"
      />
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' } }}>
        <Box>
          <ListToolbar
            title="Productos"
            searchPlaceholder="Buscar producto…"
            searchValue={catalog.searchInput}
            onSearchChange={catalog.setSearchInput}
          />
          <ListState loading={catalog.loading} error={catalog.error} empty={(catalog.data?.items.length ?? 0) === 0} />
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <List dense>
              {catalog.data?.items.map((p) => (
                <ListItemButton
                  key={p.id}
                  selected={product?.id === p.id}
                  onClick={() => {
                    setProduct(p);
                    setPage(1);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={p.images[0]?.url} />
                  </ListItemAvatar>
                  <ListItemText primary={p.name} />
                </ListItemButton>
              ))}
            </List>
          </Card>
          {catalog.data && (
            <ListPager total={catalog.data.total} page={catalog.page} pageSize={catalog.pageSize} onChange={catalog.setPage} />
          )}
        </Box>

        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {!product ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              Selecciona un producto para ver sus preguntas.
            </Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {product.name}
              </Typography>
              <ListState loading={loading} error={null} empty={(threads?.items.length ?? 0) === 0} />
              {threads?.items.map((t) => (
                <Card key={t.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t.askerName} · {new Date(t.createdAt).toLocaleDateString('es-VE')}
                    </Typography>
                    <Button size="small" color="error" onClick={() => setToHide(t)}>
                      Ocultar hilo
                    </Button>
                  </Box>
                  {t.messages.map((m) => (
                    <Typography key={m.id} variant="body2" sx={{ mb: 0.5 }}>
                      <b>{m.sender === 'customer' ? 'Comprador' : 'Tienda'}:</b> {m.text}
                    </Typography>
                  ))}
                </Card>
              ))}
              {threads && (
                <ListPager total={threads.total} page={page} pageSize={threads.pageSize} onChange={setPage} />
              )}
              <Typography variant="caption" color="text.secondary">
                Solo se listan hilos que la tienda ya respondió (limitación del endpoint público).
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={!!toHide} onClose={() => setToHide(null)}>
        <DialogTitle>¿Ocultar este hilo?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deja de verse para todos y ya no admite mensajes. No se puede deshacer desde el panel.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToHide(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={hide}>
            Ocultar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={done} autoHideDuration={3000} onClose={() => setDone(false)} message="Hilo oculto" />
    </>
  );
};
