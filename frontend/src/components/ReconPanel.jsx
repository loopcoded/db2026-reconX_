import React, { useState, useEffect } from 'react';
import { api } from '@services/apiService.js';

export function ReconPanel() {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBreaks = () => {
    setLoading(true);
    api.reconResults()
      .then(res => setBreaks(res || []))
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBreaks();
  }, []);

  const handleRunRecon = async () => {
    setLoading(true);
    try {
      await api.runRecon();
      // Wait a moment for async jobs in a real system, then fetch results
      setTimeout(fetchBreaks, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveBreak(id, 'Resolved manually via UI');
      fetchBreaks(); // refresh
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <section className="recon-panel" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Reconciliation Breaks</h2>
        <button onClick={handleRunRecon} disabled={loading}>
          {loading ? 'Running...' : 'Run Recon Job'}
        </button>
      </div>

      {breaks.length === 0 ? (
        <p>No open breaks found.</p>
      ) : (
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Trade ID</th>
              <th>Discrepancy Type</th>
              <th>Status</th>
              <th>Detected At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {breaks.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.tradeId}</td>
                <td>{b.discrepancyType}</td>
                <td>{b.status}</td>
                <td>{new Date(b.detectedAt).toLocaleString()}</td>
                <td>
                  {b.status === 'OPEN' ? (
                    <button onClick={() => handleResolve(b.id)}>Resolve</button>
                  ) : (
                    <span>{b.resolutionNote || 'Resolved'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
