// ✅ 파일 경로: backend/routes/admin-login.cjs

const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM members WHERE username = ? AND is_admin = TRUE LIMIT 1';
  connection.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB 오류' });
    if (results.length === 0) return res.status(401).json({ message: '권한 없음 또는 아이디 없음' });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호 불일치' });
    }

    res.json({ id: admin.id, username: admin.username, name: admin.name });
  });
});

module.exports = router;
