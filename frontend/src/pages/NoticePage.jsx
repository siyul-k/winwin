// ✅ 파일 위치: src/pages/NoticePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/admin/notices');
      setNotices(res.data);
    } catch (err) {
      console.error('공지사항 불러오기 실패', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      if (editId) {
        await axios.put(`/api/admin/notices/${editId}`, form);
      } else {
        await axios.post('/api/admin/notices', form);
      }
      setForm({ title: '', content: '' });
      setEditId(null);
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      alert('저장 실패');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/admin/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleEdit = (notice) => {
    setForm({ title: notice.title, content: notice.content });
    setEditId(notice.id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">📢 공지사항목록</h2>

      <div className="flex justify-end mb-2">
        <button
          onClick={() => { setShowModal(true); setForm({ title: '', content: '' }); setEditId(null); }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          공지추가
        </button>
      </div>

      <table className="w-full bg-white border rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">등록일</th>
            <th className="px-4 py-2 text-left">제목</th>
            <th className="px-4 py-2 text-left">작성자</th>
            <th className="px-4 py-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="px-4 py-2">{new Date(n.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2">{n.title}</td>
              <td className="px-4 py-2">{n.writer || '관리자'}</td>
              <td className="px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(n)} className="bg-blue-500 text-white px-2 py-1 rounded">수정</button>
                <button onClick={() => handleDelete(n.id)} className="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
              </td>
            </tr>
          ))}
          {notices.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">등록된 공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editId ? '공지수정' : '공지추가'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="제목"
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={5}
                placeholder="내용"
                className="w-full border p-2 rounded mb-3 resize-none"
              />
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">저장</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticePage;
