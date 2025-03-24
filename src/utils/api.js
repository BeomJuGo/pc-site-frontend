// ✅ 카테고리별 키워드 맵
const keywordMap = {
  cpu: "인텔 AMD CPU",
  gpu: "그래픽카드 GPU",
  memory: "DDR5 메모리",
  mainboard: "메인보드",
  ssd: "SSD 저장장치",
  hdd: "HDD 하드디스크",
};

// ✅ 네이버 가격 및 이미지 가져오기
export const fetchNaverPrice = async (query) => {
  try {
    const res = await fetch(`/api/naver-price?query=${encodeURIComponent(query)}&display=1`);
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

// ✅ GPT 요약 정보
export const fetchGptInfo = async (partName, category) => {
  try {
    const res = await fetch("/api/gpt-info", {
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
    return {
      review: "AI 한줄평 오류",
      specSummary: "사양 요약 오류",
    };
  }
};

// ✅ CPU 벤치마크
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(`/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`);
    const data = await res.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch (err) {
    console.error("❌ fetchCpuBenchmark 오류:", err);
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크 (지원 예정)
export const fetchGpuBenchmark = async () => {
  return { singleCore: "지원 예정", multiCore: "지원 예정" };
};

// ✅ 카테고리별 실시간 부품 리스트
export const fetchParts = async (category) => {
  const keyword = keywordMap[category.toLowerCase()] || category;

  try {
    const res = await fetch(`/api/naver-price?query=${encodeURIComponent(keyword)}&display=10&sort=asc`);
    const data = await res.json();

    const parts = data.items?.map((item, index) => ({
      id: index + 1,
      name: item.title.replace(/<[^>]+>/g, ""), // HTML 태그 제거
      image: item.image,
      price: item.lprice,
      link: item.link,
    })) || [];

    return parts;
  } catch (err) {
    console.error("❌ fetchParts 오류:", err);
    return [];
  }
};

// ✅ 부품 카드용 통합 데이터
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);

  return await Promise.all(
    parts.map(async (part) => {
      const { review, specSummary } = await fetchGptInfo(part.name, category);
      const benchmarkScore =
        category === "cpu"
          ? await fetchCpuBenchmark(part.name)
          : await fetchGpuBenchmark(part.name);

      return { ...part, review, specSummary, benchmarkScore };
    })
  );
};

// ✅ 상세 보기
export const fetchPartDetail = async (category, id) => {
  const data = await fetchFullPartData(category);
  return data.find((d) => d.id.toString() === id.toString());
};

// ✅ 가격 히스토리 (더미)
export const fetchPriceHistory = async () => {
  return [
    { date: "2024-12", price: 560000 },
    { date: "2025-01", price: 570000 },
    { date: "2025-02", price: 545000 },
    { date: "2025-03", price: 552000 },
  ];
};
