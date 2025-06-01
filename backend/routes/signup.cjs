const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const {
    username, password, name, phone, center, recommender, sponsor
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO members (username, password, name, phone, center, recommender, sponsor)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [username, hashedPassword, name, phone, center, recommender, sponsor];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ 회원가입 쿼리 실패:', err);
        return res.status(500).json({ message: '회원가입 실패' });
      }
      res.status(201).json({ message: '회원가입 성공', id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
