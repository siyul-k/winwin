// ✅ 파일 경로: backend/routes/adminWithdraws.cjs

const express = require('express');
const router = express.Router();
const connection = require('../db.cjs');
const ExcelJS = require('exceljs');

// ✅ 출금 목록 조회
router.get('/', (req, res) => {
  const { username, name, status, startDate, endDate } = req.query;
  const conditions = [];
  const values = [];

  if (username) {
    conditions.push('w.username LIKE ?');
    values.push(`%${username}%`);
  }
  if (name) {
    conditions.push('m.name LIKE ?');
    values.push(`%${name}%`);
  }
  if (status) {
    conditions.push('w.status = ?');
    values.push(status);
  }
  if (startDate && endDate) {
    conditions.push('DATE(w.created_at) BETWEEN ? AND ?');
    values.push(startDate, endDate);
  }

  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const sql = `
    SELECT
      w.id,
      w.username,
      m.name,
      w.type,
      w.status,
      w.amount,
      w.fee,
      w.payout,
      w.bank_name,
      w.account_holder,
      w.account_number,
      w.memo,
      w.created_at
    FROM withdraw_requests w
    LEFT JOIN members m ON w.username = m.username
    ${whereClause}
    ORDER BY w.created_at DESC
  `;

  connection.query(sql, values, (err, rows) => {
    if (err) {
      console.error('❌ 출금 목록 조회 실패:', err);
      return res.status(500).json({ message: '출금 목록 조회 실패' });
    }
    res.json(rows);
  });
});

// ✅ 출금 통계 조회
router.get('/stats', (req, res) => {
  const { username, name, status, startDate, endDate } = req.query;
  const conditions = [];
  const values = [];

  if (username) {
    conditions.push('w.username LIKE ?');
    values.push(`%${username}%`);
  }
  if (name) {
    conditions.push('m.name LIKE ?');
    values.push(`%${name}%`);
  }
  if (status) {
    conditions.push('w.status = ?');
    values.push(status);
  }
  if (startDate && endDate) {
    conditions.push('DATE(w.created_at) BETWEEN ? AND ?');
    values.push(startDate, endDate);
  }

  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const sql = `
    SELECT
      IFNULL(SUM(CASE WHEN w.status = '완료' THEN w.payout ELSE 0 END), 0) AS total,
      IFNULL(SUM(CASE WHEN w.status = '완료' AND DATE(w.created_at) = CURDATE() THEN w.payout ELSE 0 END), 0) AS today,
      IFNULL(SUM(CASE WHEN w.status = '완료' AND MONTH(w.created_at) = MONTH(CURDATE()) THEN w.payout ELSE 0 END), 0) AS thisMonth,
      IFNULL(SUM(CASE WHEN w.status = '완료' AND MONTH(w.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH) THEN w.payout ELSE 0 END), 0) AS lastMonth
    FROM withdraw_requests w
    LEFT JOIN members m ON w.username = m.username
    ${whereClause}
  `;

  connection.query(sql, values, (err, rows) => {
    if (err) {
      console.error('❌ 출금 통계 조회 실패:', err);
      return res.status(500).json({ message: '출금 통계 조회 실패' });
    }
    res.json(rows[0]);
  });
});

// ✅ 출금 완료 처리
router.post('/complete', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ message: 'ID 배열이 필요합니다.' });
  }

  const sql = `UPDATE withdraw_requests SET status = '완료' WHERE id IN (${ids.map(() => '?').join(',')})`;
  connection.query(sql, ids, (err) => {
    if (err) {
      console.error('❌ 출금 완료 처리 실패:', err);
      return res.status(500).json({ message: '출금 완료 처리 실패' });
    }
    res.json({ success: true });
  });
});

// ✅ 출금 취소 처리
router.post('/cancel', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ message: 'ID 배열이 필요합니다.' });
  }

  const sql = `UPDATE withdraw_requests SET status = '취소' WHERE id IN (${ids.map(() => '?').join(',')})`;
  connection.query(sql, ids, (err) => {
    if (err) {
      console.error('❌ 출금 취소 처리 실패:', err);
      return res.status(500).json({ message: '출금 취소 실패' });
    }
    res.json({ success: true });
  });
});

// ✅ 출금 비고 메모 수정
router.post('/update-memo', (req, res) => {
  const { id, memo } = req.body;
  if (!id) return res.status(400).json({ message: 'ID가 필요합니다.' });

  const sql = `UPDATE withdraw_requests SET memo = ? WHERE id = ?`;
  connection.query(sql, [memo, id], (err) => {
    if (err) {
      console.error('❌ 메모 수정 실패:', err);
      return res.status(500).json({ message: '메모 저장 실패' });
    }
    res.json({ success: true });
  });
});

// ✅ 출금 삭제 처리
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM withdraw_requests WHERE id = ?`;
  connection.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ 출금 삭제 실패:', err);
      return res.status(500).json({ message: '출금 삭제 실패' });
    }
    res.json({ success: true });
  });
});

// ✅ 출금 엑셀 다운로드
router.get('/export', (req, res) => {
  const sql = `
    SELECT
      w.id, w.username, m.name,
      w.type, w.status, w.amount, w.fee, w.payout,
      w.bank_name, w.account_holder, w.account_number,
      w.memo, w.created_at
    FROM withdraw_requests w
    LEFT JOIN members m ON w.username = m.username
    ${whereClause}
  `;

  connection.query(sql, async (err, rows) => {
    if (err) {
      console.error('❌ 엑셀 다운로드 실패:', err);
      return res.status(500).json({ message: '엑셀 다운로드 실패' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('출금내역');
      sheet.columns = [
        { header: '아이디', key: 'username', width: 15 },
        { header: '이름', key: 'name', width: 15 },
        { header: '종류', key: 'type', width: 10 },
        { header: '상태', key: 'status', width: 10 },
        { header: '신청금액', key: 'amount', width: 12 },
        { header: '수수료', key: 'fee', width: 10 },
        { header: '출금액', key: 'payout', width: 12 },
        { header: '은행', key: 'bank_name', width: 15 },
        { header: '예금주', key: 'account_holder', width: 15 },
        { header: '계좌번호', key: 'account_number', width: 20 },
        { header: '비고', key: 'memo', width: 20 },
        { header: '등록일', key: 'created_at', width: 20 }
      ];

      rows.forEach((row) => {
        sheet.addRow(row);
      });

      res.setHeader('Content-Disposition', `attachment; filename=withdraws_${Date.now()}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      await workbook.xlsx.write(res);
      res.end();
    } catch (e) {
      console.error('❌ 엑셀 생성 실패:', e);
      res.status(500).json({ message: '엑셀 생성 실패' });
    }
  });
});

module.exports = router;
