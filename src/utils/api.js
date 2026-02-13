const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

export const cleanName = (raw) => raw?.split("\n")[0].split("(")[0].trim();
export const nameToSlug = (name) => encodeURIComponent(cleanName(name || ""));

export const fetchParts = async (category) => {
  try {
    const res = await fetch(`${BASE_URL}/api/parts?category=${category}`, {
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.error(`[fetchParts] API 경로를 찾을 수 없습니다: ${res.status}`);
        throw new Error(`API 경로를 찾을 수 없습니다 (${res.status})`);
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.map((part, i) => ({ id: i + 1, ...part }));
  } catch (e) {
    if (e.name === 'AbortError' || e.message.includes('timeout')) {
      console.error("[fetchParts] 타임아웃:", e);
      throw new Error("서버 응답 시간이 초과되었습니다. 서버가 실행 중인지 확인해주세요.");
    } else if (e.name === 'TypeError' && e.message.includes('Failed to fetch')) {
      console.error("[fetchParts] 연결 실패:", e);
      throw new Error("서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
    }
    console.error("[fetchParts] error:", e);
    throw e; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
  }
};

export const fetchPartDetail = async (category, slugOrName) => {
  try {
    // slugOrName이 이미 인코딩되어 있으면 그대로 사용, 아니면 인코딩
    const encodedName = slugOrName.includes("%") ? slugOrName : encodeURIComponent(slugOrName);
    const res = await fetch(`${BASE_URL}/api/parts/${category}/${encodedName}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    const part = await res.json();
    if (!part || part.error) return null;

    // benchScore를 benchmarkScore.passmarkscore로 매핑
    return {
      ...part,
      benchmarkScore: part.benchmarkScore ?? {
        passmarkscore: part.benchScore || null,
        cinebenchSingle: null,
        cinebenchMulti: null,
        "3dmarkscore": null,
      },
    };
  } catch (e) {
    console.error("[fetchPartDetail] error:", e);
    return null;
  }
};

export const fetchPriceHistory = async (category, slugOrName) => {
  try {
    // slugOrName이 이미 인코딩되어 있으면 그대로 사용, 아니면 인코딩
    const encodedName = slugOrName.includes("%") ? slugOrName : encodeURIComponent(slugOrName);
    const res = await fetch(`${BASE_URL}/api/parts/${category}/${encodedName}/history`);
    const data = await res.json();
    return data.priceHistory || [];
  } catch (e) {
    console.error("[fetchPriceHistory] error:", e);
    return [];
  }
};

export const fetchFullPartData = async (category) => {
  try {
    const parts = await fetchParts(category);
    return parts.map((p) => ({
      ...p,
      benchmarkScore: p.benchmarkScore ?? {
        passmarkscore: p.benchScore || null, // benchScore를 passmarkscore로 매핑
        cinebenchSingle: null,
        cinebenchMulti: null,
        "3dmarkscore": null,
      },
    }));
  } catch (error) {
    console.error(`[fetchFullPartData] ${category} 데이터 로드 실패:`, error);
    throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
  }
};
