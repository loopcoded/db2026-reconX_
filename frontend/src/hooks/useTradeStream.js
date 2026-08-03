// TICKET-ADV116 — useTradeStream() — authenticated SSE subscription returning live trades.
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext.jsx';

export function useTradeStream(url = '/api/v1/trades/stream') {
  const [trades, setTrades] = useState([]);
  const [isConnected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;

    let active = true;

    fetch('/api/v1/trades?size=100', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (active && data && data.items) {
          setTrades(data.items);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    let didCancel = false;

    const openStream = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'text/event-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body for SSE stream');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        setConnected(true);

        while (!didCancel) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? '';

          for (const frame of frames) {
            const dataLine = frame.split(/\r?\n/).find((line) => line.startsWith('data:'));
            if (!dataLine) continue;

            const payload = dataLine.replace(/^data:\s*/, '').trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const trade = JSON.parse(payload);
              if (active) {
                setTrades((prev) => [trade, ...prev].slice(0, 200));
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('Failed to parse SSE data', err);
            }
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Trade stream error', err);
        if (!didCancel) {
          setConnected(false);
        }
      }
    };

    openStream();

    return () => {
      active = false;
      didCancel = true;
      setConnected(false);
    };
  }, [url, user]);

  return { trades, isConnected };
}
