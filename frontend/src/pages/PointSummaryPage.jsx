// ✅ 파일 위치: src/pages/PointSummaryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PointSummaryPage() {
  const [rewards, setRewards] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardRes, purchaseRes] = await Promise.all([
          axios.get(`/api/rewards?username=${currentUser.username}`),
          axios.get(`/api/purchase-history?username=${currentUser.username}`)
        ]);
        setRewards(rewardRes.data || []);
        setPackages(purchaseRes.data || []);
      } catch (err) {
        console.error("❌ 수당 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sumByType = (type) =>
    rewards
      .filter((r) => r.type === type)
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const total = rewards.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const sumCenterTotal = () =>
    rewards
      .filter((r) => r.type === "center_fee" || r.type === "center_recommend")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const sumExcludingCenter = () =>
    rewards
      .filter(
        (r) => r.type !== "center_fee" && r.type !== "center_recommend"
      )
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const calculateLimit = () => {
    let limit = 0;

    packages.forEach((pkg) => {
      const pv = Number(pkg.pv || 0);
      if (pkg.type === "normal") {
        const hasReferral = packages.some(
          (p) => p.recommender === currentUser.username && p.type === "normal"
        );
        limit += pv * (hasReferral ? 2.5 : 2);
      } else if (pkg.type === "bcode") {
        limit += pv; // bcode = 100%
      }
    });

    return limit;
  };

  const rewardNames = {
    daily: "데일리",
    daily_matching: "매칭",
    referral: "추천",
    sponsor: "후원",
    rank: "직급"
  };

  const sumByDate = () => {
    const grouped = {};
    rewards.forEach((r) => {
      const date = r.created_at?.slice(0, 10);
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += Number(r.amount || 0);
    });

    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };

  const limit = calculateLimit();
  const received = sumExcludingCenter();
  const percent = limit > 0 ? Math.min(received / limit * 100, 100) : 0;

  return (
    <div className="p-4 md:p-6">
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          {/* ✅ 수당한도 막대그래프 */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <div className="mb-2 text-sm text-gray-700 font-semibold">
              수당 한도 달성률 (센터 제외)
            </div>
            <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-blue-500 text-white text-sm font-bold text-center"
                style={{ width: `${percent}%`, lineHeight: "1.5rem" }}
              >
                {percent.toFixed(2)}%
              </div>
            </div>
            <div className="text-xs text-right text-gray-500 mt-1">
              현재까지 누적 포인트: {received.toLocaleString()} P / 한도 {limit.toLocaleString()} P
            </div>
          </div>

          {/* ✅ 총 수령 포인트 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-sm">
            <div className="bg-white shadow p-4 rounded border text-center col-span-2 md:col-span-4">
              <div className="text-gray-500 mb-1">총 수령 포인트</div>
              <div className="text-2xl font-bold text-green-700">{total.toLocaleString()}</div>
            </div>

            {/* ✅ 항목별 요약 */}
            {Object.keys(rewardNames).map((key) => (
              <div key={key} className="bg-white shadow p-4 rounded border text-center">
                <div className="text-gray-500 mb-1">{rewardNames[key]}</div>
                <div className="font-semibold">{sumByType(key).toLocaleString()}</div>
              </div>
            ))}

            {/* ✅ 센터(센터피 + 센터추천) */}
            <div className="bg-white shadow p-4 rounded border text-center">
              <div className="text-gray-500 mb-1">센터</div>
              <div className="font-semibold">{sumCenterTotal().toLocaleString()}</div>
            </div>
          </div>

          {/* ✅ 일자별 합계 테이블 */}
          <div>
            <h2 className="text-lg font-bold mb-2">📅 일자별 수당 합계</h2>
            <table className="w-full text-sm border text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">날짜</th>
                  <th className="border px-3 py-2">합계</th>
                </tr>
              </thead>
              <tbody>
                {sumByDate().length > 0 ? (
                  sumByDate().map(([date, total], idx) => (
                    <tr key={idx}>
                      <td className="border px-3 py-2">{date}</td>
                      <td className="border px-3 py-2 text-center">{total.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">수당 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
