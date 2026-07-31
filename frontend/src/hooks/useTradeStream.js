// TICKET-ADV116 — useTradeStream() — SSE subscription returning live trades.
import { useState, useEffect } from 'react';

export function useTradeStream(url = '/api/v1/trades/stream') {
  const [trades, setTrades] = useState([]);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const sse = new EventSource(url);
    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);
    sse.onmessage = (e) => {https://github.com/loopcoded/db2026-reconX_/pull/77/conflict?name=frontend%252Fsrc%252Fhooks%252FuseTradeStream.js&ancestor_oid=bb93bbf8cb7af67f88111c76fe4892f80a1e3ff6&base_oid=f905f9a4882e8e54e06c5a91f8c86eb929efe2b2&head_oid=b2846d7b62397dcc49e4588278f99fb19eb3e9e9
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
