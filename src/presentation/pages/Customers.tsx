import React from 'react';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApiList } from '../hooks/useApiList';
import { customersApi } from '../../infrastructure/api/services';
import { ListPager, ListState, ListToolbar } from '../components/common/ListToolbar';

const DOC_LABEL: Record<string, string> = { national_id: 'Cédula', passport: 'Pasaporte' };

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const list = useApiList((q) => customersApi.list(q));
  const items = list.data?.items ?? [];

  return (
    <>
      <ListToolbar
        title="Compradores"
        subtitle="Soporte: busca por nombre, documento, teléfono o correo"
        searchPlaceholder="Buscar comprador…"
        searchValue={list.searchInput}
        onSearchChange={list.setSearchInput}
      />
      <ListState loading={list.loading} error={list.error} empty={items.length === 0} />
      {items.length > 0 && (
        <Card sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}</TableCell>
                  <TableCell>{c.email ?? '—'}</TableCell>
                  <TableCell>
                    {c.documentNumber ? `${DOC_LABEL[c.documentType ?? ''] ?? ''} ${c.documentNumber}`.trim() : '—'}
                  </TableCell>
                  <TableCell>{c.phone ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => navigate(`/orders?customerId=${c.id}`)}>
                      Ver pedidos
                    </Button>
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
    </>
  );
};
