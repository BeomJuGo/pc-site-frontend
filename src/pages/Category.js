import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";
import PartCard from "../components/PartCard";

const num = (v) => {
  if (v == null) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v).replace(/[^\d.-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("value");
  const [brandFilter, setBrandFilter] = useState("all");
  const [storageTypeFilter, setStorageTypeFilter] = useState("all");
  const [ddrFilter, setDdrFilter] = useState("all");
  const [chipsetFilter, setChipsetFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFullPartData(category);
        setParts(data);
      } catch (error) {
        console.error(`[Category] ${category} 데이터 로드 실패:`, error);
        setParts([]);
        setError(error.message || "데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, brandFilter, storageTypeFilter, ddrFilter, chipsetFilter]);

  // 메인보드에서 브랜드 필터 변경 시 칩셋 필터 초기화
  useEffect(() => {
    if (category === "motherboard") {
      setChipsetFilter("all");
    }
  }, [brandFilter, category]);

  // 카테고리별 기본 정렬값 설정
  useEffect(() => {
    if (category === "cpu" || category === "gpu") {
      setSortBy("value");
    } else {
      setSortBy("price");
    }
    // 카테고리 변경 시 필터 초기화
    setBrandFilter("all");
    setStorageTypeFilter("all");
    setDdrFilter("all");
    setChipsetFilter("all");
  }, [category]);

  const brandOptions =
    category === "gpu"
      ? ["all", "nvidia", "amd"]
      : category === "cpu"
        ? ["all", "intel", "amd"]
        : category === "motherboard"
        ? ["all", "intel", "amd"]
        : ["all"];

  const storageTypeOptions = category === "storage" ? ["all", "ssd", "hdd"] : [];
  const ddrOptions = category === "memory" ? ["all", "DDR5", "DDR4", "DDR3"] : [];

  // 메인보드 칩셋 옵션 동적 생성
  const chipsetOptions = useMemo(() => {
    if (category !== "motherboard") return [];
    
    const chipsets = new Set();
    parts.forEach((part) => {
      const nm = String(part.name || "").toLowerCase();
      const spec = String(part.spec || "").toLowerCase();
      const chipset = String(part.chipset || "").toLowerCase();
      const combined = nm + " " + spec + " " + chipset;
      
      // Intel 칩셋 패턴
      const intelChipsets = [
        "z790", "z690", "z590", "z490", "z390", "z370", "z270", "z170",
        "b760", "b660", "b560", "b460", "b365", "b360", "b250",
        "h770", "h670", "h610", "h570", "h510", "h470", "h370", "h310",
        "x299", "x99", "x79", "w680", "w580", "w480"
      ];
      
      // AMD 칩셋 패턴
      const amdChipsets = [
        "x670", "x570", "x470", "x370", "x399", "x299",
        "b650", "b550", "b450", "b350", "b550m", "b450m",
        "a620", "a520", "a320", "trx40", "x399"
      ];
      
      // brandFilter에 따라 해당하는 칩셋만 추출
      if (brandFilter === "all" || brandFilter === "intel") {
        intelChipsets.forEach((cs) => {
          if (combined.includes(cs)) {
            chipsets.add(cs.toUpperCase());
          }
        });
      }
      
      if (brandFilter === "all" || brandFilter === "amd") {
        amdChipsets.forEach((cs) => {
          if (combined.includes(cs)) {
            chipsets.add(cs.toUpperCase());
          }
        });
      }
    });
    
    return ["all", ...Array.from(chipsets).sort()];
  }, [category, parts, brandFilter]);

  const filtered = useMemo(() => {
    const perfScore = (p) => {
      // 백엔드에서 직접 저장한 benchScore를 우선 사용
      if ((category === "cpu" || category === "gpu") && p?.benchScore && num(p.benchScore) > 0) {
        return num(p.benchScore);
      }
      
      const bm = p?.benchmarkScore || {};
      if (category === "gpu") {
        const s = num(bm["3dmarkscore"]);
        return s > 0 ? s : num(bm.passmarkscore);
      } else if (category === "cpu") {
        const s = num(bm.cinebenchMulti);
        return s > 0 ? s : num(bm.passmarkscore);
      }
      return 0; // CPU/GPU 외에는 성능 점수 미사용
    };

    const s = search.toLowerCase();
    return parts
      .filter((p) => {
        const nm = String(p.name || "").toLowerCase();
        const nameMatch = nm.includes(s);
        
        // manufacturer 필드를 우선 사용, 없으면 이름에서 확인
        const manufacturer = String(p.manufacturer || "").toLowerCase();
        const brandMatch =
          brandFilter === "all" ||
          (brandFilter === "intel" && (
            manufacturer === "intel" || 
            nm.includes("intel") || 
            nm.includes("인텔") || 
            nm.includes("코어") ||
            (category === "motherboard" && (
              nm.includes("z790") || nm.includes("z690") || nm.includes("z590") ||
              nm.includes("b760") || nm.includes("b660") || nm.includes("b560") ||
              nm.includes("h770") || nm.includes("h670") || nm.includes("h610") ||
              /z\d{3}/i.test(nm) || /b\d{3}/i.test(nm) || /h\d{3}/i.test(nm) ||
              /x299/i.test(nm) || /x99/i.test(nm) || /w\d{3}/i.test(nm)
            ))
          )) ||
          (brandFilter === "amd" && (
            manufacturer === "amd" || 
            nm.includes("amd") || 
            (category === "cpu" && (nm.includes("라이젠") || nm.includes("ryzen"))) ||
            (category === "gpu" && (nm.includes("라데온") || nm.includes("radeon") || /rx\s*\d+/.test(nm))) ||
            (category === "motherboard" && (
              nm.includes("x670") || nm.includes("x570") || nm.includes("x470") ||
              nm.includes("b650") || nm.includes("b550") || nm.includes("b450") ||
              nm.includes("a620") || nm.includes("a520") || nm.includes("a320") ||
              /x\d{3}/i.test(nm) || /b\d{3}/i.test(nm) || /a\d{3}/i.test(nm) ||
              /trx40/i.test(nm) || /x399/i.test(nm)
            )) ||
            nm.includes("rx ")
          )) ||
          (brandFilter === "nvidia" && (manufacturer === "nvidia" || nm.includes("nvidia") || nm.includes("엔비디아") || nm.includes("지포스") || nm.includes("geforce") || /rtx\s*\d+/.test(nm) || /gtx\s*\d+/.test(nm)));

        // 저장장치 타입 필터 (SSD/HDD)
        const storageTypeMatch =
          category !== "storage" ||
          storageTypeFilter === "all" ||
          (storageTypeFilter === "ssd" && (
            nm.includes("ssd") ||
            nm.includes("nvme") ||
            nm.includes("m.2") ||
            nm.includes("m2") ||
            nm.includes("sata ssd") ||
            /ssd/i.test(nm)
          )) ||
          (storageTypeFilter === "hdd" && (
            nm.includes("hdd") ||
            nm.includes("하드") ||
            nm.includes("hard disk") ||
            nm.includes("harddrive") ||
            /hdd/i.test(nm) ||
            (!nm.includes("ssd") && !nm.includes("nvme") && !nm.includes("m.2") && !nm.includes("m2"))
          ));

        // DDR 타입 필터 (메모리)
        const spec = String(p.spec || "").toUpperCase();
        const nameUpper = String(p.name || "").toUpperCase();
        const combined = nameUpper + " " + spec;
        const ddrMatch =
          category !== "memory" ||
          ddrFilter === "all" ||
          combined.includes(ddrFilter.toUpperCase()) ||
          nameUpper.includes(ddrFilter.toUpperCase()) ||
          spec.includes(ddrFilter.toUpperCase());

        // 칩셋 필터 (메인보드)
        const chipset = String(p.chipset || "").toLowerCase();
        const chipsetCombined = nm + " " + spec.toLowerCase() + " " + chipset;
        const chipsetMatch =
          category !== "motherboard" ||
          chipsetFilter === "all" ||
          chipsetCombined.includes(chipsetFilter.toLowerCase()) ||
          nameUpper.includes(chipsetFilter.toUpperCase()) ||
          spec.toLowerCase().includes(chipsetFilter.toLowerCase()) ||
          chipset.includes(chipsetFilter.toLowerCase());

        return nameMatch && brandMatch && storageTypeMatch && ddrMatch && chipsetMatch;
      })
      .sort((a, b) => {
        const aP = num(a.price);
        const bP = num(b.price);
        const aS = perfScore(a);
        const bS = perfScore(b);
        const a3d = num(a.benchmarkScore?.["3dmarkscore"]);
        const b3d = num(b.benchmarkScore?.["3dmarkscore"]);
        const aV = aP > 0 ? aS / aP : 0;
        const bV = bP > 0 ? bS / bP : 0;

        if (sortBy === "price") return aP - bP;
        if (sortBy === "price-desc") return bP - aP;
        if (category === "cpu" && sortBy === "score") return bS - aS;
        if (category === "gpu" && sortBy === "3dmark") return b3d - a3d;
        if ((category === "cpu" || category === "gpu") && sortBy === "value") {
          if (bV !== aV) return bV - aV;
          if (bS !== aS) return bS - aS;
          if (aP !== bP) return aP - bP;
          return String(a.name).localeCompare(String(b.name));
        }
        return String(a.name).localeCompare(String(b.name));
      });
  }, [parts, search, brandFilter, storageTypeFilter, ddrFilter, chipsetFilter, sortBy, category]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  if (loading) return <div className="p-8 text-center text-slate-300">로딩 중...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{category.toUpperCase()}</h2>
        <div className="text-sm text-slate-300">총 {filtered.length.toLocaleString()}개</div>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-red-300 font-semibold mb-1">데이터 로드 실패</h3>
              <p className="text-red-200 text-sm mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchFullPartData(category)
                    .then((data) => {
                      setParts(data);
                      setLoading(false);
                    })
                    .catch((err) => {
                      setError(err.message || "데이터를 불러오는데 실패했습니다.");
                      setLoading(false);
                    });
                }}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                🔄 다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="제품명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-600 bg-slate-800/50 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-[14px] w-64 backdrop-blur-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-slate-600 bg-slate-800/50 text-white rounded-lg px-3 py-2 text-[14px] backdrop-blur-sm"
        >
          {category === "cpu" || category === "gpu" ? (
            <>
              <option value="value">가성비순</option>
              <option value="price">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              {category === "gpu" ? (
                <option value="3dmark">3DMark 점수순</option>
              ) : (
                <option value="score">PassMark/CB 점수순</option>
              )}
              <option value="name">이름순</option>
            </>
          ) : (
            <>
              <option value="price">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="name">이름순</option>
            </>
          )}
        </select>

        {/* 브랜드 필터 */}
        {brandOptions.length > 1 && (
          <div className="flex gap-1">
            {brandOptions.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={[
                  "px-3 py-2 rounded-lg border text-[13px] backdrop-blur-sm",
                  brandFilter === brand
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50",
                ].join(" ")}
              >
                {brand === "all" ? "전체" : brand.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* 저장장치 타입 필터 (SSD/HDD) */}
        {storageTypeOptions.length > 0 && (
          <div className="flex gap-1">
            {storageTypeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setStorageTypeFilter(type)}
                className={[
                  "px-3 py-2 rounded-lg border text-[13px] backdrop-blur-sm",
                  storageTypeFilter === type
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50",
                ].join(" ")}
              >
                {type === "all" ? "전체" : type === "ssd" ? "SSD" : "HDD"}
              </button>
            ))}
          </div>
        )}

        {/* DDR 타입 필터 (메모리) */}
        {ddrOptions.length > 0 && (
          <div className="flex gap-1">
            {ddrOptions.map((ddr) => (
              <button
                key={ddr}
                onClick={() => setDdrFilter(ddr)}
                className={[
                  "px-3 py-2 rounded-lg border text-[13px] backdrop-blur-sm",
                  ddrFilter === ddr
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50",
                ].join(" ")}
              >
                {ddr === "all" ? "전체" : ddr}
              </button>
            ))}
          </div>
        )}

        {/* 칩셋 필터 (메인보드) */}
        {chipsetOptions.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {chipsetOptions.map((chipset) => (
              <button
                key={chipset}
                onClick={() => setChipsetFilter(chipset)}
                className={[
                  "px-3 py-2 rounded-lg border text-[13px] backdrop-blur-sm",
                  chipsetFilter === chipset
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50",
                ].join(" ")}
              >
                {chipset === "all" ? "전체" : chipset}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-slate-700 border border-slate-600 rounded-lg bg-slate-800/30 backdrop-blur-sm">
        {pageItems.map((part) => (
          <PartCard
            key={part.id || part._id || part.name}
            part={part}
            onClick={() => navigate(`/detail/${category}/${encodeURIComponent(part.name)}`)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border border-slate-600 bg-slate-800/50 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-slate-700/50 backdrop-blur-sm"
        >
          이전
        </button>
        <span className="px-4 py-1 text-sm text-slate-300">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border border-slate-600 bg-slate-800/50 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-slate-700/50 backdrop-blur-sm"
        >
          다음
        </button>
      </div>
    </div>
  );
}