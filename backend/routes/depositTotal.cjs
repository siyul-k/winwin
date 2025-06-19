// ✅ 파일 경로: backend/routes/depositTotal.cjs

const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

router.get('/:username', (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT IFNULL(SUM(amount), 0) AS total_deposit
    FROM member_points
    WHERE username = ? 
      AND type = 'add'
      AND reason LIKE '입금%'
  `;

  connection.query(sql, [username], (err, rows) => {
    if (err) {
      console.error('❌ 총 입금액 조회 실패:', err);
      return res.status(500).json({ error: '총 입금액 조회 오류' });
    }

    res.json({ total_deposit: rows[0].total_deposit || 0 });
  });
});

module.exports = router;
