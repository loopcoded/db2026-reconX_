import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@context/ThemeContext.jsx';
import { AuthContext }   from '@context/AuthContext.jsx';
import Dashboard         from './Dashboard.jsx';

const trades = [
  { id: 1, tradeRef: 'TRD-2026-0001', instrument: 'SAP.DE', quantity: 100, price: 250, status: 'MATCHED'   },
  { id: 2, tradeRef: 'TRD-2026-0002', instrument: 'SAP.DE', quantity: 50,  price: 251, status: 'UNMATCHED' },
];

function renderWithProviders(ui) {
  const user = { email: 'trader@db.com', role: 'TRADER' };
  return render(
    <AuthContext.Provider value={{ user, isLoading: false }}>
      <ThemeProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

// Note: since Dashboard doesn't accept trades as props (it fetches via useTradeStream),
// our RTL test would normally need to mock the hook or network.
// For this ticket's scope (based on the guide), we will stub out the hook or pass it as prop if modified.
// Wait, the guide says: renderWithProviders(<Dashboard trades={trades} />);
// However, Dashboard.jsx does not take trades as props! It uses useTradeStream().
// Let's modify Dashboard.jsx to accept trades as a prop for testing, or mock useTradeStream.
// Since the guide says `<Dashboard trades={trades} />`, let's see if Dashboard.jsx accepts it.
// Wait, I will just write the test as instructed by the guide. But I need to mock useTradeStream if it doesn't take props.
// Let's mock the hook using vi.mock.

import * as useTradeStreamModule from '@hooks/useTradeStream.js';

vi.mock('@hooks/useTradeStream.js', () => ({
  useTradeStream: vi.fn()
}));

vi.mock('@services/apiService.js', () => ({
  api: {
    reconResults: vi.fn().mockResolvedValue([]),
    runRecon: vi.fn().mockResolvedValue({}),
    resolveBreak: vi.fn().mockResolvedValue({})
  }
}));

describe('<Dashboard />', () => {
  it('shows summary cards', () => {
    // Mock the hook return value
    vi.mocked(useTradeStreamModule.useTradeStream).mockReturnValue({
      trades,
      isConnected: true
    });

    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('heading', { name: /portfolio value/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /matched/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /open breaks/i })).toBeInTheDocument();
    // 100 * 250 + 50 * 251 = 37550
    expect(screen.getByText(/37,550/)).toBeInTheDocument();
  });

  it('opens the trade stream with an authenticated fetch instead of EventSource', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"id": 7, "tradeRef": "TRD-2026-0007", "status": "MATCHED", "quantity": 10, "price": 100}\n\n'));
          controller.close();
        }
      })
    });
    const eventSourceSpy = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('EventSource', eventSourceSpy);

    const { useTradeStream: realUseTradeStream } = await vi.importActual('@hooks/useTradeStream.js');

    function StreamProbe() {
      const { trades } = realUseTradeStream();
      return <div>{trades.length}</div>;
    }

    render(
      <AuthContext.Provider value={{ user: { token: 'jwt-123', role: 'TRADER' }, login: () => {}, logout: () => {} }}>
        <StreamProbe />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/trades/stream'),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer jwt-123' })
        })
      );
      expect(eventSourceSpy).not.toHaveBeenCalled();
    });
  });
});
