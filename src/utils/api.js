const BASE_URL = "https://pc-site-backend.onrender.com";

// ✅ 문자열 정제 함수
const cleanQuery = (raw) => raw.split("\n")[0].split("(")[0].trim();

// ✅ CPU 목록 자동 불러오기
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
    const clean = cleanQuery(query);
    const res = await fetch(`${BASE_URL}/api/naver-price?query=${encodeURIComponent(clean)}`);
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

// ✅ CPU 벤치마크 점수 (MongoDB에서 가져옴)
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/cpu/${encodeURIComponent(cleanQuery(cpuName))}`);
    const data = await res.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch (err) {
    console.error("❌ fetchCpuBenchmark 오류:", err);
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ 부품 상세 정보 (이름 기반)
export const fetchPartDetail = async (category, name) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/${category}/${encodeURIComponent(cleanQuery(name))}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ fetchPartDetail 오류:", err);
    return null;
  }
};

// ✅ 가격 히스토리
export const fetchPriceHistory = async (name) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/cpu/${encodeURIComponent(cleanQuery(name))}`);
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

  return await Promise.all(
    parts.map(async (part) => {
      const { price, image } = await fetchNaverPrice(part.name);
      const { review, specSummary } = await fetchGptInfo(part.name, category);

      const benchmarkScore =
        category === "cpu"
          ? await fetchCpuBenchmark(part.name)
          : { singleCore: "-", multiCore: "-" };

      return { ...part, price, image, review, specSummary, benchmarkScore };
    })
  );
};
