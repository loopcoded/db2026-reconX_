// React.memo on <TradeRow />
import React from 'react';

function TradeRowImpl({ trade, onClick }) {
  return (
    <>
      <span onClick={onClick} style={{cursor: 'pointer'}}>{trade.tradeRef}</span>
      <span onClick={onClick} style={{cursor: 'pointer'}}>{trade.instrumentSymbol}</span>
      <span onClick={onClick} style={{cursor: 'pointer'}}>{trade.quantity}</span>
      <span onClick={onClick} style={{cursor: 'pointer'}}>{trade.price}</span>
      <span onClick={onClick} style={{cursor: 'pointer'}} className={`status-pill status-${trade.status?.toLowerCase()}`}>{trade.status}</span>
    </>
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
