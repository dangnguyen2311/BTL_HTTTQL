import React, { useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [type, setType] = useState('revenue');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [data, setData] = useState(null);

  const fetchReport = async () => {
    const res = await axios.get(`http://localhost:3001/api/reports/${type}`, {
      params: { start, end },
    });
    setData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thống kê báo cáo</h2>
      <label>Từ ngày: </label>
      <input type="date" value={start} onChange={e => setStart(e.target.value)} />
      <label>Đến ngày: </label>
      <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="revenue">Doanh thu</option>
        <option value="cost">Chi phí</option>
        <option value="satisfaction">Tỉ lệ hài lòng</option>
      </select>
      <button onClick={fetchReport}>Xem</button>

      {data && (
        <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: 10 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ReportPage;
