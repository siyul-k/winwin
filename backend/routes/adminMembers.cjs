const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const bcrypt = require('bcrypt');

// ✅ 회원 정보 수정
router.put('/:id', async (req, res) => {
  const { name, phone, center, recommender, bank_name, account_holder, account_number, password } = req.body;
  const { id } = req.params;

  try {
    // 업데이트할 필드만 추림
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (phone) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (center) {
      fields.push('center = ?');
      values.push(center);
    }
    if (recommender) {
      fields.push('recommender = ?');
      values.push(recommender);
    }
    if (bank_name) {
      fields.push('bank_name = ?');
      values.push(bank_name);
    }
    if (account_holder) {
      fields.push('account_holder = ?');
      values.push(account_holder);
    }
    if (account_number) {
      fields.push('account_number = ?');
      values.push(account_number);
    }

    // 비밀번호가 있을 경우 bcrypt 암호화 후 업데이트
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    // 업데이트할 필드가 없을 경우
    if (fields.length === 0) {
      return res.status(400).json({ error: '수정할 항목이 없습니다.' });
    }

    const sql = `UPDATE members SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    connection.query(sql, values, (err) => {
      if (err) {
        console.error('❌ 회원 수정 실패:', err);
        return res.status(500).json({ error: '회원 수정 실패' });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error('❌ 서버 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;