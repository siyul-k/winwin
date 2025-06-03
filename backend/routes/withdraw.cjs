// ✅ backend/routes/withdraw.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// ✅ 1. 회원 출금 신청 (POST)
router.post('/', (req, res) => {
  const { user_id, name, bank_name, account_holder, account_number, amount } = req.body;

  if (!user_id || !name || !bank_name || !account_holder || !account_number || !amount) {
    return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
  }

  const sql = `
    INSERT INTO withdraw_requests
    (user_id, name, bank_name, account_holder, account_number, amount, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
  `;

  connection.query(
    sql,
    [user_id, name, bank_name, account_holder, account_number, amount],
    (err, result) => {
      if (err) {
        console.error('❌ 출금 신청 실패:', err);
        return res.status(500).json({ message: '출금 신청 실패' });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// ✅ 2. 관리자 출금 목록 조회 (GET)
router.get('/', (req, res) => {
  const sql = `
    SELECT * FROM withdraw_requests
    ORDER BY created_at DESC
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 출금 목록 조회 실패:', err);
      return res.status(500).json({ message: '출금 목록 조회 실패' });
    }
    res.json(results);
  });
});

// ✅ 3. 관리자 출금 완료 처리 (POST)
router.post('/complete', (req, res) => {
  const { ids } = req.body; // [1, 2, 3]
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: '잘못된 요청 형식' });
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
      return res.status(500).json({ message: '처리 실패' });
    }
    res.json({ success: true, updatedRows: result.affectedRows });
  });
});

// ✅ 4. 관리자 출금 취소 처리 (POST)
router.post('/cancel', (req, res) => {
  const { ids } = req.body; // [1, 2, 3]
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: '잘못된 요청 형식' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    UPDATE withdraw_requests
    SET status = 'cancelled', cancelled_at = NOW()
    WHERE id IN (${placeholders}) AND status = 'pending'
  `;

  connection.query(sql, ids, (err, result) => {
    if (err) {
      console.error('❌ 출금 취소 실패:', err);
      return res.status(500).json({ message: '취소 실패' });
    }
    res.json({ success: true, updatedRows: result.affectedRows });
  });
});

module.exports = router;
