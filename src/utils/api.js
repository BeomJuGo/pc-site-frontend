const BASE_URL = "https://pc-site-backend.onrender.com";

// ✅ 이름 정제 함수: 줄바꿈 제거 + 괄호 제거
const cleanName = (raw) => raw.split("\n")[0].split("(")[0].trim();

// ✅ CPU/부품 전체 목록 가져오기 (예: /api/parts/cpu)
export const fetchParts = async (category) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/${category}`);
    const data = await res.json();
    return data.map((part, i) => ({ id: i + 1, ...part }));
  } catch (err) {
    console.error("❌ fetchParts 오류:", err);
    return [];
  }
};

// ✅ 부품 상세 정보 (벤치마크, 요약, 가격 히스토리 포함)
export const fetchPartDetail = async (category, name) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/${category}/${encodeURIComponent(cleanName(name))}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ fetchPartDetail 오류:", err);
    return null;
  }
};

// ✅ 가격 히스토리만 따로 가져오기 (그래프용)
export const fetchPriceHistory = async (name) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/cpu/${encodeURIComponent(cleanName(name))}`);
    const data = await res.json();
    return data.priceHistory || [];
  } catch (err) {
    console.error("❌ fetchPriceHistory 오류:", err);
    return [];
  }
};

// ✅ 부품 전체 데이터 통합 (카드용)
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);

  return parts.map((part, i) => ({
    ...part,
    id: i + 1,
    price: part.priceHistory?.[part.priceHistory.length - 1]?.price || 0,
    image: part.image || "", // 추후 이미지 크롤링 필요시 여기에 적용
    review: part.review || "한줄평 없음",
    specSummary: part.specSummary || "사양 정보 없음",
    benchmarkScore: part.benchmarkScore || { singleCore: "-", multiCore: "-" },
  }));
};
