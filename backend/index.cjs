// ✅ 1. backend/index.cjs
const express = require('express');
const cors = require('cors');
const connection = require('./db.cjs');

const app = express();
const port = 3001;

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 라우터 등록 (순서 중요)
app.use('/api/admin/notices', require('./routes/adminNotices.cjs'));
app.use('/api/admin/members/export', require('./routes/adminExport.cjs'));
app.use('/api/admin/members', require('./routes/adminMembers.cjs'));
app.use('/api/withdraw', require('./routes/withdraw.cjs'));
app.use('/api/admin/withdraws', require('./routes/adminWithdraws.cjs'));
app.use('/api/admin/deposits/export', require('./routes/depositExport.cjs'));
app.use('/api/admin/deposits', require('./routes/adminDeposits.cjs'));
app.use('/api/admin-login', require('./routes/admin-Login.cjs'));
app.use('/api/signup', require('./routes/signup.cjs'));
app.use('/api/login', require('./routes/login.cjs'));
app.use('/api/lookup', require('./routes/lookup.cjs'));
app.use('/api/points', require('./routes/points.cjs'));

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});

// ✅ DB 연결
connection.connect((err) => {
  if (err) console.error('❌ MySQL 연결 실패:', err);
  else console.log('✅ MySQL 연결 성공!');
});
