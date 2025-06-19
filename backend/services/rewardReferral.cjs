// ✅ 파일 경로: backend/services/rewardReferral.cjs

const connection = require('../db.cjs');
const { getAvailableRewardAmount } = require('../utils/rewardLimit.cjs');

async function processReferralRewards() {
  try {
    // 1. 오늘 구매한 상품 중 센터피 정산된 적 없는 건 조회
    const [rows] = await connection.promise().query(`
      SELECT p.id AS purchase_id, p.member_id, p.pv, p.type, m.username, m.center
      FROM purchases p
      JOIN members m ON p.member_id = m.id
      WHERE p.status = 'approved'
        AND NOT EXISTS (
          SELECT 1 FROM rewards_log 
          WHERE source = p.id AND type IN ('center', 'center_recommend')
        )
    `);

    for (const row of rows) {
      const {
        purchase_id, member_id, pv, type,
        username, center
      } = row;

      // ✅ 센터피/센터추천피는 normal 상품일 때만 발생
      if (type !== 'normal') continue;

      // ✅ 한도 검사: 한도가 1원이라도 있어야 전액 지급 가능
      const available = await getAvailableRewardAmount(member_id);
      if (available <= 0) continue;

      // ✅ 센터명 기준으로 센터장/센터추천자 조회
      if (center) {
        const [centerRows] = await connection.promise().query(
          `SELECT center_owner, center_recommender FROM centers WHERE center_name = ?`,
          [center]
        );

        if (centerRows.length > 0) {
          const { center_owner, center_recommender } = centerRows[0];

          // ✅ 센터장에게 센터피 지급 (4%)
          if (center_owner) {
            const centerAmount = Math.floor(pv * 0.04);
            await connection.promise().query(`
              INSERT INTO rewards_log (user_id, type, source, amount, memo, created_at)
              VALUES (?, 'center', ?, ?, '센터피', NOW())
            `, [center_owner, purchase_id, centerAmount]);
          }

          // ✅ 센터추천자에게 센터추천피 지급 (1%)
          if (center_owner && center_recommender) {
            const recommendAmount = Math.floor(pv * 0.01);
            await connection.promise().query(`
              INSERT INTO rewards_log (user_id, type, source, amount, memo, created_at)
              VALUES (?, 'center_recommend', ?, ?, '센터추천피', NOW())
            `, [center_recommender, purchase_id, recommendAmount]);
          }
        }
      }
    }

    console.log(`✅ 센터피/센터추천피 정산 완료 (${rows.length}건)`);
  } catch (err) {
    console.error('❌ 센터피 정산 실패:', err);
  }
}

module.exports = { processReferralRewards };
