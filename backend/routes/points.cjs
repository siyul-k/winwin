const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const ExcelJS = require('exceljs');

// ✅ 포인트 합계 조회
router.get('/total/:member_id', (req, res) => {
  const member_id = req.params.member_id;
  const sql = `SELECT IFNULL(SUM(point), 0) AS total_points FROM member_points WHERE member_id = ?`;
  connection.query(sql, [member_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error', details: err });
    res.json(rows[0]);
  });
});

// ✅ 포인트 보정 추가 + 수당 로그 기록
router.post('/adjust', (req, res) => {
  const { member_id, point, type, description } = req.body;

  const insertPoint = `
    INSERT INTO member_points (member_id, point, type, description)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(insertPoint, [member_id, point, type, description], async (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error', details: err });

    try {
      // 보정 수당 로그도 남기기
      const [userRows] = await connection.promise().query(
        `SELECT username FROM members WHERE id = ?`,
        [member_id]
      );

      if (userRows.length > 0) {
        const username = userRows[0].username;

        const insertLog = `
          INSERT INTO rewards_log (user_id, type, source, amount, memo, created_at)
          VALUES (?, 'adjust', ?, ?, ?, NOW())
        `;

        await connection.promise().query(insertLog, [
          username,
          results.insertId, // source
          point,
          description || '포인트 보정'
        ]);
      }

      res.json({ success: true, inserted_id: results.insertId });
    } catch (logErr) {
      console.error('❌ 보정 수당 로그 기록 실패:', logErr);
      res.status(500).json({ error: '보정은 완료, 로그 기록 실패' });
    }
  });
});

// ✅ 포인트 이력 조회
router.get('/history/:member_id', (req, res) => {
  const member_id = req.params.member_id;
  const sql = `
    SELECT id, point, description, created_at
    FROM member_points
    WHERE member_id = ?
    ORDER BY created_at DESC
  `;
  connection.query(sql, [member_id], (err, rows) => {
    if (err) return res.status(500).json({ error: '조회 실패', details: err });
    res.json(rows);
  });
});

// ✅ 포인트 보정 삭제
router.delete('/delete/:id', (req, res) => {
  const pointId = req.params.id;

  const sql = 'DELETE FROM member_points WHERE id = ?';
  connection.query(sql, [pointId], (err, result) => {
    if (err) return res.status(500).json({ error: '삭제 실패', details: err });
    res.json({ success: true, deleted: result.affectedRows });
  });
});

// ✅ 포인트 엑셀 다운로드
router.get('/export/:member_id', async (req, res) => {
  const member_id = req.params.member_id;
  const sql = `
    SELECT id, point, type, description, created_at
    FROM member_points
    WHERE member_id = ?
    ORDER BY created_at DESC
  `;
  connection.query(sql, [member_id], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error', details: err });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Point History');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '포인트', key: 'point', width: 15 },
      { header: '유형', key: 'type', width: 15 },
      { header: '설명', key: 'description', width: 30 },
      { header: '일시', key: 'created_at', width: 25 }
    ];

    rows.forEach(row => sheet.addRow(row));

    const filename = `points_${member_id}_${new Date().toISOString().slice(0,10).replace(/-/g, '')}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;
