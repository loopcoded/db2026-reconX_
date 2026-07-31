// React.memo on <TradeRow />
import React from 'react';

function TradeRowImpl({ trade, onClick }) {
  return (
    <div className="trade-row-impl" onClick={onClick}>
      <span>{trade.tradeRef}</span>
      <span>{trade.symbol}</span>
      <span>{trade.qty}</span>
      <span>{trade.price}</span>
      <span className={`status-pill status-${trade.status?.toLowerCase()}`}>{trade.status}</span>
    </div>
  );
}

function areEqual(prev, next) {
  return (
    prev.trade.id === next.trade.id &&
    prev.trade.status === next.trade.status &&
    prev.trade.price === next.trade.price &&
    prev.onClick === next.onClick
  );
}

export const TradeRow = React.memo(TradeRowImpl, areEqual);
