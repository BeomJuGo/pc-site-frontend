// ✅ src/utils/api.js
const BASE_URL = "https://pc-site-backend.onrender.com";

// ✅ 이름 정제 함수 (줄바꿈 제거 + 괄호 제거)
export const cleanName = (raw) => raw.split("\n")[0].split("(")[0].trim();

// ✅ 부품 목록 불러오기
export const fetchParts = async (category) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/${category}`);
    const data = await res.json();
    return data.map((part, i) => ({ id: i + 1, ...part }));
  } catch (err) {
    console.error("❌ [fetchParts] 부품 목록 오류:", err);
    return [];
  }
};

// ✅ 상세 정보
export const fetchPartDetail = async (category, name) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/parts/${category}/${encodeURIComponent(cleanName(name))}`
    );
    return await res.json();
  } catch (err) {
    console.error("❌ [fetchPartDetail] 상세 정보 오류:", err);
    return null;
  }
};

// ✅ 가격 히스토리
export const fetchPriceHistory = async (name) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/parts/cpu/${encodeURIComponent(cleanName(name))}`
    );
    const data = await res.json();
    return data.priceHistory || [];
  } catch (err) {
    console.error("❌ [fetchPriceHistory] 가격 히스토리 오류:", err);
    return [];
  }
};

// ✅ 전체 부품 정보 (카드 렌더용)
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);
  return parts.map((part) => ({
    ...part,
    benchmarkScore: part.benchmarkScore ?? {
      passmarkscore: "정보 없음",
      cinebenchSingle: "정보 없음",
      cinebenchMulti: "정보 없음",
    },
  }));
};
