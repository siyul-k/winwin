// ✅ 파일 위치: backend/routes/adminNotices.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// ✅ 공지사항 목록 조회
router.get('/', (req, res) => {
  const sql = 'SELECT id, title, content, created_at, writer FROM notices ORDER BY created_at DESC';
  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB 조회 실패' });
    res.json(rows);
  });
});

// ✅ 공지사항 등록
router.post('/', (req, res) => {
  const { title, content } = req.body;
  const sql = 'INSERT INTO notices (title, content, created_at, writer) VALUES (?, ?, NOW(), "관리자")';
  connection.query(sql, [title, content], (err, result) => {
    if (err) return res.status(500).json({ error: '공지 등록 실패' });
    res.json({ success: true, id: result.insertId });
  });
});

// ✅ 공지사항 삭제
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM notices WHERE id = ?';
  connection.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: '삭제 실패' });
    res.json({ success: true });
  });
});

// ✅ 공지사항 수정
router.put('/:id', (req, res) => {
  const { title, content } = req.body;
  const sql = 'UPDATE notices SET title = ?, content = ? WHERE id = ?';
  connection.query(sql, [title, content, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: '수정 실패' });
    res.json({ success: true });
  });
});

module.exports = router;
