// ✅ 파일 경로: backend/utils/rewardLimit.cjs

const connection = require('../db.cjs');

const COUNTED_TYPES = [
  'referral',
  'sponsor',
  'daily',
  'daily_matching',
  'rank',
  'adjust'
];

// ✅ 수당 지급 가능 금액 계산
async function getAvailableRewardAmount(member_id) {
  try {
    // 1. 회원 정보 조회
    const [memberRows] = await connection.promise().query(
      'SELECT username, recommender FROM members WHERE id = ? AND is_blacklisted = 0',
      [member_id]
    );
    if (memberRows.length === 0) return 0;

    const username = memberRows[0].username;
    const hasRecommender = !!memberRows[0].recommender;

    // 2. 해당 회원의 모든 상품 가져오기 (승인된 것만)
    const [productRows] = await connection.promise().query(
      `SELECT id, pv, type, active FROM purchases 
       WHERE member_id = ? AND status = 'approved'`,
      [member_id]
    );

    let totalLimit = 0;

    for (const row of productRows) {
      const { pv, type, active } = row;

      // Bcode 상품은 비활성화 상태면 정산 대상 제외
      if (type === 'bcode' && active === 0) continue;

      // 기본: 200%, 추천인 있을 경우 250%
      const rate = type === 'normal' && hasRecommender ? 2.5 : 2.0;
      totalLimit += pv * rate;
    }

    // 3. 현재까지 지급된 수당 총액 조회
    const [rewardRows] = await connection.promise().query(
      `SELECT SUM(amount) AS total FROM rewards_log 
       WHERE user_id = ? AND type IN (?)`,
      [username, COUNTED_TYPES]
    );

    const totalRewarded = rewardRows[0].total || 0;
    const available = Math.max(totalLimit - totalRewarded, 0);

    return available;
  } catch (err) {
    console.error('❌ 수당한도 계산 오류:', err);
    return 0;
  }
}

module.exports = { getAvailableRewardAmount };
