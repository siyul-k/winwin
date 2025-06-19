// ✅ 파일 위치: backend/routes/rewardsTotal.cjs
const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');

router.get('/:username', (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT IFNULL(SUM(amount), 0) AS total_reward
    FROM rewards_log
    WHERE user_id = ?
  `;

  connection.query(sql, [username], (err, rows) => {
    if (err) {
      console.error("❌ 수당 합산 오류:", err);
      return res.status(500).json({ error: 'DB 오류', details: err });
    }

    res.json(rows[0]);
  });
});

module.exports = router;
