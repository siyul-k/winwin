// ✅ 파일 위치: backend/routes/rank.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

router.get('/:username', (req, res) => {
  const { username } = req.params;
  const sql = 'SELECT rank FROM members WHERE username = ? LIMIT 1';
  connection.query(sql, [username], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB 오류', details: err });
    if (rows.length === 0) return res.status(404).json({ error: '회원 없음' });
    res.json(rows[0]);
  });
});


module.exports = router;
