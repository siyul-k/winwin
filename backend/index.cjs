// ✅ 파일 위치: backend/index.cjs
const express = require('express');
const cors = require('cors');
const connection = require('./db.cjs');

const app = express();
const port = 3001;

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 관리자용 설정
app.use('/api/reward-config',      require('./routes/rewardConfig.cjs'));

// ✅ 관리자용 라우터
app.use('/api/admin/rewards',          require('./routes/adminRewards.cjs'));
app.use('/api/admin/notices',          require('./routes/adminNotices.cjs'));
app.use('/api/admin/members/export',   require('./routes/adminExport.cjs'));
app.use('/api/admin/members/stats',    require('./routes/adminMemberStats.cjs'));
app.use('/api/admin/members',          require('./routes/adminMembers.cjs')); // 여기 안에 POST /recommender 포함
app.use('/api/admin/deposits/export',  require('./routes/depositExport.cjs'));
app.use('/api/admin/deposits',         require('./routes/adminDeposits.cjs'));
app.use('/api/admin/withdraws',        require('./routes/adminWithdraws.cjs'));
app.use('/api/withdraw/check', require('./routes/withdrawCheck.cjs'));
app.use('/api/admin/bcode',            require('./routes/adminBcode.cjs'));
app.use('/api/admin/centers',          require('./routes/adminCenters.cjs'));
app.use('/api/admin/settings', require('./routes/adminSettings.cjs'));


// ✅ 조직도 API
app.use('/api/tree',                   require('./routes/tree.cjs'));

app.use('/api/settings', require('./routes/settings.cjs'));

// ✅ 인증/회원 관련
app.use('/api/signup',                 require('./routes/signup.cjs'));
app.use('/api/login',                  require('./routes/login.cjs'));
app.use('/api/admin-login',            require('./routes/admin-Login.cjs'));
app.use('/api/check-user',             require('./routes/check-user.cjs'));
app.use('/api/members',                require('./routes/members.cjs'));

// ✅ Lookup API (센터장/추천인/후원인 이름 조회)
app.use('/api/lookup',                 require('./routes/lookup.cjs'));

// ✅ 입출금 요청
app.use('/api/deposit',                require('./routes/deposit.cjs'));
app.use('/api/withdraw',               require('./routes/withdraw.cjs'));
app.use('/api/withdraw/available', require('./routes/withdrawAvailable.cjs'));


// ✅ 사용자 대시보드용 통계
app.use('/api/withdraw-total',         require('./routes/withdrawStats.cjs'));
app.use('/api/withdrawable-points',    require('./routes/withdrawablePoints.cjs'));
app.use('/api/rewards-total',          require('./routes/rewardsTotal.cjs'));
app.use('/api/purchase-points',        require('./routes/purchasePoints.cjs'));
app.use('/api/members/rank',           require('./routes/rank.cjs'));
app.use('/api/members/referrals',      require('./routes/referrals.cjs'));
app.use('/api/deposit-total',          require('./routes/depositTotal.cjs'));

// ✅ 공지사항 (회원용)
app.use('/api/rewards',                require('./routes/rewards.cjs'));
app.use('/api/notices',                require('./routes/publicNotices.cjs'));

// ✅ 상품 관련
app.use('/api/admin/products', require('./routes/adminProducts.cjs'));
app.use('/api/admin/code-give', require('./routes/adminCodeGive.cjs'));
app.use('/api/product',                require('./routes/product.cjs'));
app.use('/api/purchase',               require('./routes/productPurchase.cjs'));
app.use('/api/purchase-history',       require('./routes/purchase-history.cjs'));
app.use('/api/packages',               require('./routes/packages.cjs'));

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});

// ✅ DB 연결
connection.connect(err => {
  if (err) console.error('❌ MySQL 연결 실패:', err);
  else console.log('✅ MySQL 연결 성공!');
});

// ✅ 데일리 수당 스케줄러 실행
require('./jobs/dailyRewardJob.cjs');
