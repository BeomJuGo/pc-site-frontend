const BASE_URL = "https://pc-site-backend.onrender.com";

// ✅ 이름 정제 함수: 줄바꿈 제거 + 괄호 제거
const cleanName = (raw) => raw.split("\n")[0].split("(")[0].trim();

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
    const clean = cleanName(query);
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

// ✅ 부품 상세 정보 (정제된 이름 기준)
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

// ✅ 가격 히스토리
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

  return await Promise.all(
    parts.map(async (part) => {
      const clean = cleanName(part.name);
      const { price, image } = await fetchNaverPrice(clean);

      return {
        ...part,
        price,
        image,
        review: part.review || "한줄평 없음",
        specSummary: part.specSummary || "사양 없음",
        benchmarkScore: part.benchmarkScore || {
          singleCore: "-",
          multiCore: "-",
        },
      };
    })
  );
};
