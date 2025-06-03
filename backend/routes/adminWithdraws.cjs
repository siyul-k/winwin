const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// 1. 출금신청 목록 조회 (회원 이름 포함)
router.get('/', (req, res) => {
  const sql = `
    SELECT w.id, w.username, m.name, w.amount, w.fee, w.actual_amount, w.status, w.created_at
    FROM withdraw_requests w
    LEFT JOIN members m ON w.username = m.username
    ORDER BY w.created_at DESC
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 출금신청 목록 조회 실패:', err);
      return res.status(500).json({ message: '출금신청 조회 실패' });
    }
    res.json(results);
  });
});

// 2. 출금 완료 처리
router.post('/complete', (req, res) => {
  const { ids } = req.body; // 예: [1, 2, 3]
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: '잘못된 요청' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    UPDATE withdraw_requests
    SET status = 'complete', completed_at = NOW()
    WHERE id IN (${placeholders}) AND status = 'pending'
  `;
  connection.query(sql, ids, (err, result) => {
    if (err) {
      console.error('❌ 출금 완료 처리 실패:', err);
      return res.status(500).json({ message: '완료 처리 실패' });
    }
    res.json({ success: true, updated: result.affectedRows });
  });
});

// 3. 출금 취소 처리
router.post('/cancel', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: '잘못된 요청' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    UPDATE withdraw_requests
    SET status = 'cancel', completed_at = NOW()
    WHERE id IN (${placeholders}) AND status = 'pending'
  `;
  connection.query(sql, ids, (err, result) => {
    if (err) {
      console.error('❌ 출금 취소 실패:', err);
      return res.status(500).json({ message: '취소 실패' });
    }
    res.json({ success: true, cancelled: result.affectedRows });
  });
});

module.exports = router;
