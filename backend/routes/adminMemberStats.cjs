// ✅ 파일 위치: backend/routes/adminMemberStats.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// ✅ 관리자 회원 통계 조회
router.get('/', (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM members) AS total,
      (SELECT COUNT(*) FROM members WHERE DATE(created_at) = CURDATE()) AS today,
      (SELECT COUNT(*) FROM members WHERE is_blacklisted = 1) AS blacklist,
      (SELECT COUNT(*) FROM members WHERE is_center = 1) AS center
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 관리자 통계 조회 실패:', err);
      return res.status(500).json({ error: 'DB 조회 실패' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
