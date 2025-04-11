// ✅ 부품 리스트 (카테고리별 더미 데이터)
export const fetchParts = async (category) => {
  const data = {
    cpu: [
      { id: 1, name: "Intel Core i5-14600K" },
      { id: 2, name: "Intel Core i9-14900K" },
    ],
    gpu: [
      { id: 1, name: "NVIDIA RTX 4070" },
      { id: 2, name: "AMD RX 7900XT" },
      { id: 3, name: "NVIDIA RTX 4060 Ti" },
    ],
  };
  return data[category] || [];
};

// ✅ 네이버 가격 및 이미지 가져오기 (API 실패 대비)
export const fetchNaverPrice = async (query) => {
  try {
    const res = await fetch(`https://pc-site-backend-docker.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const item = data.items?.[0];
    return {
      price: item?.lprice || "가격 정보 없음",
      image: item?.image || "https://via.placeholder.com/150", // 더미 이미지
    };
  } catch (err) {
    console.error("❌ fetchNaverPrice 오류:", err);
    return { price: "가격 정보 없음", image: "https://via.placeholder.com/150" };
  }
};

// ✅ GPT 기반 한줄평 + 주요 사양 요약 가져오기 (API 실패 대비)
export const fetchGptInfo = async (partName, category) => {
  try {
    const res = await fetch("https://pc-site-backend-docker.onrender.com/api/gpt-info", {
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
      review: "한줄평 없음",
      specSummary: "사양 없음",
    };
  }
};

// ✅ CPU 벤치마크 점수
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(
      `https://pc-site-backend-docker.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`
    );
    const data = await res.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch (err) {
    console.error("❌ fetchCpuBenchmark 오류:", err);
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크 점수 (더미 점수)
export const fetchGpuBenchmark = async () => {
  return {
    score: Math.floor(Math.random() * 10000) + 5000, // 5000~15000 랜덤 점수
  };
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
          : await fetchGpuBenchmark();

      return { ...part, price, image, review, specSummary, benchmarkScore };
    })
  );
};

// ✅ 부품 상세 정보
export const fetchPartDetail = async (category, id) => {
  const data = await fetchFullPartData(category);
  return data.find((d) => d.id.toString() === id.toString());
};

// ✅ 가격 히스토리 (더미 데이터)
export const fetchPriceHistory = async (partName) => {
  try {
    const res = await fetch(`https://pc-site-backend-docker.onrender.com/api/price-history?partName=${encodeURIComponent(partName)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ fetchPriceHistory 오류:", err);
    return [];
  }
};
