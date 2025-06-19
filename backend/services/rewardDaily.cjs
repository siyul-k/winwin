// ✅ 파일 경로: backend/services/rewardDaily.cjs

const connection = require('../db.cjs');
const { getAvailableRewardAmount } = require('../utils/rewardLimit.cjs');

async function processDailyRewards() {
  try {
    // 1. 전체 상품 조회 (approved만)
    const [products] = await connection.promise().query(`
      SELECT p.id AS purchase_id, p.member_id, p.pv, p.type, p.active, p.created_at,
             m.username, m.recommender,
             m.rec_1, m.rec_2, m.rec_3, m.rec_4, m.rec_5, m.rec_6, m.rec_7, m.rec_8, m.rec_9, m.rec_10,
             m.rec_11, m.rec_12, m.rec_13, m.rec_14, m.rec_15
      FROM purchases p
      JOIN members m ON p.member_id = m.id
      WHERE p.status = 'approved'
    `);

    for (const product of products) {
      const {
        purchase_id, member_id, pv, type, active,
        username, recommender,
        rec_1, rec_2, rec_3, rec_4, rec_5, rec_6, rec_7, rec_8,
        rec_9, rec_10, rec_11, rec_12, rec_13, rec_14, rec_15
      } = product;

      // ✅ Bcode 비활성화 시 데일리 ❌
      if (type === 'bcode' && active === 0) continue;

      // ✅ 데일리 수당 비율
      const [rateRow] = await connection.promise().query(
        `SELECT rate FROM bonus_config WHERE reward_type = 'daily' LIMIT 1`
      );
      const dailyRate = rateRow[0]?.rate || 0.02;

      const dailyAmount = Math.floor(pv * dailyRate);

      // ✅ 한도 검사
      const available = await getAvailableRewardAmount(member_id);
      if (available < dailyAmount) continue;

      // ✅ 중복 지급 방지
      const [already] = await connection.promise().query(`
        SELECT 1 FROM rewards_log
        WHERE user_id = ? AND type = 'daily' AND source = ? AND DATE(created_at) = CURDATE()
      `, [username, purchase_id]);
      if (already.length > 0) continue;

      // ✅ 데일리 수당 지급
      await connection.promise().query(`
        INSERT INTO rewards_log (user_id, type, source, amount, memo, created_at)
        VALUES (?, 'daily', ?, ?, '데일리수당', NOW())
      `, [username, purchase_id, dailyAmount]);

      // ✅ Bcode는 매칭 발생 ❌
      if (type === 'bcode') continue;

      // ✅ 추천계보 배열
      const recListRaw = [
        rec_1, rec_2, rec_3, rec_4, rec_5, rec_6, rec_7, rec_8,
        rec_9, rec_10, rec_11, rec_12, rec_13, rec_14, rec_15
      ];

      // ✅ 추천 계보에서 블랙리스트, 상품 없는 회원 제외 → 압축된 계보 생성
      const compressedRecList = [];
      for (let i = 0; i < recListRaw.length; i++) {
        const rec = recListRaw[i];
        if (!rec) continue;

        const [rows] = await connection.promise().query(
          `SELECT id, is_blacklisted FROM members WHERE username = ? LIMIT 1`,
          [rec]
        );
        const recUser = rows[0];
        if (!recUser || recUser.is_blacklisted) continue;

        const [hasNormal] = await connection.promise().query(
          `SELECT 1 FROM purchases WHERE member_id = ? AND type = 'normal' AND status = 'approved' LIMIT 1`,
          [recUser.id]
        );
        if (hasNormal.length === 0) continue;

        compressedRecList.push(rec);
      }

      // ✅ 추천한 인원 수로 최대 매칭 대수 계산
      const [refCountRow] = await connection.promise().query(
        `SELECT COUNT(*) AS cnt FROM members WHERE recommender = ?`,
        [username]
      );
      const referralCount = refCountRow[0]?.cnt || 0;

      let maxMatchingLevel = 0;
      if (referralCount >= 5) maxMatchingLevel = 15;
      else if (referralCount === 4) maxMatchingLevel = 10;
      else if (referralCount === 3) maxMatchingLevel = 5;
      else if (referralCount === 2) maxMatchingLevel = 3;
      else if (referralCount === 1) maxMatchingLevel = 1;

      // ✅ 보너스 설정 불러오기
      const [matchConfigs] = await connection.promise().query(
        `SELECT level, rate FROM bonus_config WHERE reward_type = 'daily_matching'`
      );
      const matchRateMap = {};
      for (const conf of matchConfigs) {
        matchRateMap[conf.level] = conf.rate;
      }

      // ✅ 압축된 추천 계보 순서대로 매칭 수당 지급
      for (let i = 0; i < Math.min(maxMatchingLevel, compressedRecList.length); i++) {
        const recUsername = compressedRecList[i];
        const level = i + 1;
        const rate = matchRateMap[level];
        if (!rate) continue;

        const matchAmount = Math.floor(dailyAmount * rate);
        const availableMatch = await getAvailableRewardAmountByUsername(recUsername);
        if (availableMatch < matchAmount) continue;

        await connection.promise().query(`
          INSERT INTO rewards_log (user_id, type, source, amount, memo, created_at)
          VALUES (?, 'daily_matching', ?, ?, ?, NOW())
        `, [
          recUsername,
          purchase_id,
          matchAmount,
          `데일리매칭-${level}대`
        ]);
      }
    }

    console.log('✅ 데일리수당 + 압축 매칭 정산 완료');
  } catch (err) {
    console.error('❌ 데일리 수당 정산 오류:', err);
  }
}

// ✅ 유저이름 기반 한도 계산
async function getAvailableRewardAmountByUsername(username) {
  const [rows] = await connection.promise().query(
    `SELECT id FROM members WHERE username = ?`,
    [username]
  );
  if (rows.length === 0) return 0;

  return await getAvailableRewardAmount(rows[0].id);
}

module.exports = { processDailyRewards };
