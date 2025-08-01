// src/utils/api.js
const BASE_URL = "https://pc-site-backend.onrender.com";

// 이름 정제 함수(생략)

// 부품 목록 불러오기(생략)

// 상세 정보(생략)

// ✅ 가격 히스토리: category 인자를 추가하고 new API 사용
export const fetchPriceHistory = async (category, name) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/parts/${category}/${encodeURIComponent(cleanName(name))}/history`
    );
    const data = await res.json();
    return data.priceHistory || [];
  } catch (err) {
    console.error("❌ [fetchPriceHistory] 가격 히스토리 오류:", err);
    return [];
  }
};

// 전체 부품 정보(생략)
