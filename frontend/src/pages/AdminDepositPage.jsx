// ✅ 3단계: 입금관리 페이지에 엑셀 다운로드 버튼 추가

// ✅ 파일: frontend/src/pages/AdminDepositPage.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function AdminDepositPage() {
  const [deposits, setDeposits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      setDeposits(data);
    } catch (err) {
      console.error('입금 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (selected.length === 0) return;
    const res = await fetch('/api/admin/deposits/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    });
    const result = await res.json();
    if (result.success) {
      alert(`${result.updatedRows}건 완료 처리됨`);
      fetchDeposits();
      setSelected([]);
    }
  };

  const handleExcelExport = () => {
    window.open('http://localhost:3001/api/admin/deposits/export', '_blank');
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  return (
    <div>
      <Header />
      <div className="p-4">
        <h2>입금 관리</h2>

        <div className="my-2">
          <button onClick={handleComplete} disabled={selected.length === 0}>
            완료처리
          </button>
          <button
            onClick={handleExcelExport}
            style={{ marginLeft: '10px', backgroundColor: 'green', color: '#fff', padding: '5px 10px' }}
          >
            엑셀 다운로드
          </button>
        </div>

        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th></th>
                <th>등록일</th>
                <th>아이디</th>
                <th>은행</th>
                <th>예금주</th>
                <th>금액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      disabled={row.status === 'complete'}
                    />
                  </td>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>{row.username}</td>
                  <td>{row.bank_name}</td>
                  <td>{row.account_holder}</td>
                  <td>{row.amount.toLocaleString()}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
