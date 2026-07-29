// TICKET-ADV116 — useTradeStream() — SSE subscription returning live trades.
import { useState, useEffect } from 'react';

export function useTradeStream(url = '/api/v1/trades/stream') {
  const [trades, setTrades] = useState([]);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const sse = new EventSource(url);
    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);
    sse.onmessage = (e) => {
      try {
        const trade = JSON.parse(e.data);
        setTrades(prev => [trade, ...prev].slice(0, 200));
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };
    return () => {
      sse.close();
      setConnected(false);
    };
  }, [url]);

  return { trades, isConnected };
}
