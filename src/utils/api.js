// ✅ src/utils/api.js

const BASE_URL = "https://pc-site-backend.onrender.com"; // 너의 백엔드 주소

// ✅ CPU 목록 자동 불러오기 (이전의 하드코딩 제거)
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

// ✅ 네이버 가격 + 이미지 가져오기
export const fetchNaverPrice = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/api/naver-price?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const item = data.items?.[0];
    return {
      price: item?.lprice || "가격 정보 없음",
      image: item?.image || "",
    };
  } catch (err) {
    console.error("❌ fetchNaverPrice 오류:", err);
    return { price: "가격 정보 오류", image: "" };
  }
};

// ✅ GPT API
export const fetchGptInfo = async (partName, category) => {
  try {
    const res = await fetch(`${BASE_URL}/api/gpt-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName, category }),
    });
    const data = await res.json();
    return {
      review: data.review || "한줄평 없음",
      specSummary: data.specSummary || "사양 없음",
    };
  } catch (err) {
    console.error("❌ fetchGptInfo 오류:", err);
    return { review: "AI 한줄평 오류", specSummary: "사양 요약 오류" };
  }
};

// ✅ CPU 벤치마크 점수
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(`${BASE_URL}/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`);
    const data = await res.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch (err) {
    console.error("❌ fetchCpuBenchmark 오류:", err);
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ 상세 부품 정보
export const fetchPartDetail = async (category, id) => {
  const data = await fetchParts(category);
  return data.find((d) => d.id.toString() === id.toString());
};

// ✅ 가격 추이 (더미)
export const fetchPriceHistory = async () => {
  return [
    { date: "2024-12", price: 560000 },
    { date: "2025-01", price: 570000 },
    { date: "2025-02", price: 545000 },
    { date: "2025-03", price: 552000 },
  ];
};
