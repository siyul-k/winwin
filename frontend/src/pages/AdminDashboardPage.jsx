// ✅ 3. frontend/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import MemberFilterForm from '../components/MemberFilterForm';
import MemberTable from '../components/MemberTable';

export default function AdminDashboardPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const limit = 10;

  const fetchMembers = async (page = 1, appliedFilters = filters) => {
    setLoading(true);
    const params = new URLSearchParams({ ...appliedFilters, page, limit }).toString();
    try {
      const res = await fetch(`/api/admin/members?${params}`);
      const result = await res.json();
      setMembers(result.data);
      setTotal(result.total);
      setPage(result.page);
    } catch (err) {
      console.error('회원 목록 조회 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(1);
  }, []);

  const handleSearch = (newFilters, isExport = false) => {
    setFilters(newFilters);
    if (isExport) {
      const params = new URLSearchParams({ ...newFilters, page: 1, limit: 9999 }).toString();
      const url = `/api/admin/members/export?${params}`;
      console.log('📦 엑셀 다운로드 URL:', url);
      window.open(url, '_blank');
    } else {
      fetchMembers(1, newFilters);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <Header />
      <SummaryCards />
      <MemberFilterForm onSearch={handleSearch} />

      {loading ? <p>로딩 중...</p> : <MemberTable data={members} />}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchMembers(i + 1)}
            style={{
              margin: '0 4px',
              padding: '6px 10px',
              backgroundColor: page === i + 1 ? '#4f46e5' : '#eee',
              color: page === i + 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
