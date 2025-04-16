const BASE_URL = "https://pc-site-backend.onrender.com";

// ✅ 이름 정제 함수
const cleanName = (raw) => raw.split("\n")[0].split("(")[0].trim();

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

export const fetchPartDetail = async (category, name) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts/${category}/${encodeURIComponent(cleanName(name))}`);
    return await res.json();
  } catch (err) {
    console.error("❌ fetchPartDetail 오류:", err);
    return null;
  }
};

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

export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);
  return parts.map((part) => ({
    ...part,
    benchmarkScore: part.benchmarkScore || {
      passmarkscore: "-",
      cinebenchSingle: "-",
      cinebenchMulti: "-",
    },
  }));
};
