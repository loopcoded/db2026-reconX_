// TICKET-ADV116 — useTradeStream() — SSE subscription returning live trades.
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext.jsx';

export function useTradeStream(url = '/api/v1/trades/stream') {
  const [trades, setTrades] = useState([]);
  const [isConnected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;
    
    // Fetch initial trades
    let active = true;
    fetch('/api/v1/trades?size=100', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (active && data && data.items) {
          setTrades(data.items);
        }
      })
      .catch(err => console.error(err));

    const sseUrl = new URL(url, window.location.origin);
    sseUrl.searchParams.append('token', user.token);
    
    const sse = new EventSource(sseUrl.toString());
    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);
    sse.onmessage = (e) => {
      try {
        const trade = JSON.parse(e.data);
        setTrades(prev => [trade, ...prev].slice(0, 200));
      } catch {
        // console.error('Failed to parse SSE data', _err);
      }
    };
    return () => {
      active = false;
      sse.close();
      setConnected(false);
    };
  }, [url, user]);

  return { trades, isConnected };
}
