import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 공지 목록 불러오기
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/notices');

      if (Array.isArray(res.data)) {
        setNotices(res.data);
      } else {
        console.warn('📛 응답이 배열이 아닙니다:', res.data);
        setNotices([]);
      }
    } catch (err) {
      console.error('공지 목록 불러오기 실패:', err);
      alert('공지 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 공지 작성
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    try {
      await axios.post('/api/admin/notices', { title, content });
      setTitle('');
      setContent('');
      alert('✅ 공지가 성공적으로 등록되었습니다.');
      fetchNotices();
    } catch (err) {
      console.error('공지 작성 실패:', err);
      alert('공지 작성에 실패했습니다.');
    }
  };

  // 공지 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 공지를 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/admin/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error('공지 삭제 실패:', err);
      alert('공지 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">공지사항</h2>

      {/* 공지 작성 폼 */}
      <form onSubmit={handleCreate} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">제목</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">내용</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          공지 등록
        </button>
      </form>

      {/* 공지 목록 테이블 */}
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">제목</th>
              <th className="border px-3 py-2">작성일</th>
              <th className="border px-3 py-2">동작</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id}>
                <td className="border px-3 py-2">{notice.id}</td>
                <td className="border px-3 py-2">{notice.title}</td>
                <td className="border px-3 py-2">
                  {new Date(notice.created_at).toLocaleString('ko-KR')}
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  등록된 공지가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
