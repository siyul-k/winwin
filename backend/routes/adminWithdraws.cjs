// ✅ 파일 위치: backend/routes/adminWithdraws.cjs

const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// ✅ 출금 통계 API (필터 적용)
router.get('/stats', (req, res) => {
  const { username, status, startDate, endDate } = req.query;

  let conditions = [];
  let values = [];

  if (username) {
    conditions.push("w.username LIKE ?");
    values.push(`%${username}%`);
  }

  if (status) {
    conditions.push("w.status = ?");
    values.push(status);
  }

  if (startDate && endDate) {
    conditions.push("DATE(w.created_at) BETWEEN ? AND ?");
    values.push(startDate, endDate);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      IFNULL(SUM(CASE WHEN w.status = 'complete' THEN w.actual_amount ELSE 0 END), 0) AS total_withdraw,
      IFNULL(SUM(CASE WHEN w.status = 'complete' AND DATE(w.created_at) = CURDATE() THEN w.actual_amount ELSE 0 END), 0) AS today_withdraw,
      IFNULL(SUM(CASE WHEN w.status = 'complete' AND YEAR(w.created_at) = YEAR(CURDATE()) AND MONTH(w.created_at) = MONTH(CURDATE()) THEN w.actual_amount ELSE 0 END), 0) AS month_withdraw,
      IFNULL(SUM(CASE WHEN w.status = 'complete' AND YEAR(w.created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND MONTH(w.created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) THEN w.actual_amount ELSE 0 END), 0) AS prev_month_withdraw
    FROM withdraw_requests w
    LEFT JOIN members m ON w.username = m.username
    ${whereClause}
  `;

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('❌ 출금 통계 조회 실패:', err);
      return res.status(500).json({ message: '출금 통계 조회 실패' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
