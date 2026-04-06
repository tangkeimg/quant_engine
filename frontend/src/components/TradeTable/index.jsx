function TradeTable({ trades = [] }) {
  if (!trades.length) {
    return <div style={{ padding: 16 }}>暂无交易记录</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>序号</th>
            <th style={thStyle}>日期</th>
            <th style={thStyle}>操作</th>
            <th style={thStyle}>价格</th>
            <th style={thStyle}>数量</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((item, index) => (
            <tr key={`${item.date}-${item.action}-${index}`}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{item.date}</td>
              <td
                style={{
                  ...tdStyle,
                  color: item.action === 'buy' ? '#16a34a' : '#dc2626',
                  fontWeight: 700,
                }}
              >
                {item.action === 'buy' ? '买入' : '卖出'}
              </td>
              <td style={tdStyle}>{item.price}</td>
              <td style={tdStyle}>{item.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 10px',
  borderBottom: '1px solid #e5e7eb',
  fontWeight: 700,
};

const tdStyle = {
  padding: '12px 10px',
  borderBottom: '1px solid #f1f5f9',
};

export default TradeTable;