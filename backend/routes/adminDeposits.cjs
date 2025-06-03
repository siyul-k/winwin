// ✅ backend/routes/adminDeposits.cjs

const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const ExcelJS = require('exceljs'); // ✅ 추가

// ✅ 1. 입금 목록 조회
router.get('/', (req, res) => {
  const sql = `SELECT * FROM deposit_requests ORDER BY created_at DESC`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 입금 목록 조회 실패:', err);
      return res.status(500).json({ message: '입금 내역 조회 실패' });
    }
    res.json(results);
  });
});

// ✅ 2. 입금 완료 처리
router.post('/complete', (req, res) => {
  const { ids } = req.body; // [1, 2, 3]

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: '잘못된 요청 형식' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    UPDATE deposit_requests
    SET status = 'complete', completed_at = NOW()
    WHERE id IN (${placeholders}) AND status = 'pending'
  `;

  connection.query(sql, ids, (err, result) => {
    if (err) {
      console.error('❌ 입금 완료 처리 실패:', err);
      return res.status(500).json({ message: '처리 실패' });
    }
    res.json({ success: true, updatedRows: result.affectedRows });
  });
});

// ✅ 3. 입금 엑셀 다운로드
router.get('/export', async (req, res) => {
  const sql = `
    SELECT id, username, bank_name, account_holder, amount, status, created_at
    FROM deposit_requests
    ORDER BY created_at DESC
  `;

  connection.query(sql, async (err, results) => {
    if (err) {
      console.error('❌ 엑셀 다운로드 쿼리 실패:', err);
      return res.status(500).json({ message: '엑셀 다운로드 실패' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('입금내역');

      // ✅ 엑셀 헤더 정의
      sheet.columns = [
        { header: '번호', key: 'id', width: 10 },
        { header: '아이디', key: 'username', width: 15 },
        { header: '은행', key: 'bank_name', width: 15 },
        { header: '예금주', key: 'account_holder', width: 15 },
        { header: '금액', key: 'amount', width: 15 },
        { header: '상태', key: 'status', width: 12 },
        { header: '등록일', key: 'created_at', width: 20 },
      ];

      // ✅ 데이터 추가
      results.forEach((row) => {
        sheet.addRow(row);
      });

      // ✅ 파일 응답 헤더
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=deposit_requests_${Date.now()}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('❌ 엑셀 생성 실패:', error);
      res.status(500).json({ message: '엑셀 생성 오류' });
    }
  });
});

module.exports = router;
