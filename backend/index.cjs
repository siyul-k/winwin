const express = require('express');
const cors = require('cors');
const connection = require('./db.cjs');

const app = express();
const port = 3001;

// ✅ 미들웨어 등록
app.use(cors());
app.use(express.json());

// ✅ 라우터 등록
const signupRouter = require('./routes/signup.cjs');
const loginRouter = require('./routes/login.cjs');
const lookupRouter = require('./routes/lookup.cjs');
const adminLoginRouter = require('./routes/admin-Login.cjs');
const adminMembersRouter = require('./routes/adminMembers.cjs');

app.use('/api/admin/members', adminMembersRouter);
app.use('/api/admin-login', adminLoginRouter);
app.use('/api/signup', signupRouter);   // 회원가입
app.use('/api/login', loginRouter);     // 로그인
app.use('/api/lookup', lookupRouter);   // 센터/추천인/후원인 이름 조회

// ✅ 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});

// ✅ MySQL 연결 확인
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});
