const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

// 센터장 이름 조회
router.get('/center', (req, res) => {
  const { center } = req.query;
  const sql = 'SELECT name FROM members WHERE center = ? LIMIT 1';

  connection.query(sql, [center], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB 오류' });
    if (results.length === 0) return res.status(404).json({ message: '센터장 없음' });

    res.json({ name: results[0].name });
  });
});

// 추천인 이름 조회
router.get('/recommender', (req, res) => {
  const { username } = req.query;
  const sql = 'SELECT name FROM members WHERE username = ? LIMIT 1';

  connection.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB 오류' });
    if (results.length === 0) return res.status(404).json({ message: '추천인 없음' });

    res.json({ name: results[0].name });
  });
});

// 후원인 이름 조회
router.get('/sponsor', (req, res) => {
  const { username } = req.query;
  const sql = 'SELECT name FROM members WHERE username = ? LIMIT 1';

  connection.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB 오류' });
    if (results.length === 0) return res.status(404).json({ message: '후원인 없음' });

    res.json({ name: results[0].name });
  });
});

module.exports = router;
