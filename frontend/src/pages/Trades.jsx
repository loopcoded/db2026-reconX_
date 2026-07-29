// TICKET-ADV114 — Compound DataTable.
// TICKET-ADV117 — useDebouncedSearch.
import React, { useState } from 'react';
import { withAuth } from '@components/withAuth.jsx';
import DataTable from '@components/DataTable.jsx';
import { useDebouncedSearch } from '@hooks/useDebouncedSearch.js';
import { api } from '@services/apiService.js';

function Trades() {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedSearch(search, 300);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ items: [], totalPages: 0 });

  React.useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: page.toString(), size: '20' });
    if (debounced) params.append('status', debounced);
    
    api.listTrades(params)
      .then(res => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setData({ items: [], totalPages: 0 });
      });
    
    return () => { active = false; };
  }, [page, debounced]);

  return (
    <section>
      <h2>Trades</h2>
      <input
        aria-label="Filter by status"
        placeholder="status filter (PENDING/MATCHED/…)"
        value={search}
        onChange={(e) => setSearch(e.target.value.toUpperCase())}
      />
      <DataTable>
        <DataTable.Header columns={[
          { key: 'tradeRef', label: 'Ref' },
          { key: 'symbol',   label: 'Symbol' },
          { key: 'qty',      label: 'Qty' },
          { key: 'price',    label: 'Price' },
          { key: 'status',   label: 'Status' },
        ]} />
        <DataTable.Body 
          rows={data.items}
          render={(row) => (
            <React.Fragment>
              <span>{row.tradeRef}</span>
              <span>{row.instrument?.symbol || row.symbol}</span>
              <span>{row.quantity}</span>
              <span>{row.price}</span>
              <span>{row.status}</span>
            </React.Fragment>
          )} 
        />
        <DataTable.Pagination
          page={page}
          totalPages={Math.max(1, data.totalPages)}
          onChange={setPage}
        />
      </DataTable>
    </section>
  );
}

export default withAuth(Trades);
