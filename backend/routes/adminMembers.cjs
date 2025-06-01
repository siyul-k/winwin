// backend/routes/adminMembers.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

router.get('/', (req, res) => {
  const sql = `
    SELECT id, username, name, phone, center, recommender, sponsor, created_at
    FROM members ORDER BY id DESC
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 회원 목록 조회 실패:', err);
      return res.status(500).json({ message: '회원 목록 조회 실패' });
    }
    res.json(results);
  });
});

module.exports = router;
