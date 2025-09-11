import { useMemo, useState } from "react";
import PartCard from "../components/PartCard";

export default function Etc() {
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const options = ["all", "monitor", "keyboard", "mouse", "speaker"];

  const mockData = useMemo(
    () => [
      { id: 1, type: "monitor", name: "27\" IPS 모니터 144Hz", price: 249000, category: "etc", review: "색감 우수, 게이밍 겸용" },
      { id: 2, type: "monitor", name: "24\" VA 모니터 75Hz", price: 129000, category: "etc", review: "사무용 가성비" },
      { id: 3, type: "monitor", name: "34\" 울트라와이드 100Hz", price: 599000, category: "etc", review: "멀티태스킹 최적" },
      { id: 4, type: "keyboard", name: "텐키리스 기계식 키보드(적축)", price: 89000, category: "etc", review: "정갈한 타건감" },
      { id: 5, type: "keyboard", name: "무선 키보드 마우스 세트", price: 39000, category: "etc", review: "사무용 무선 세트" },
      { id: 6, type: "mouse", name: "무선 마우스 2.4G/BT 듀얼", price: 29000, category: "etc", review: "휴대성 우수" },
      { id: 7, type: "mouse", name: "게이밍 마우스 8버튼", price: 49000, category: "etc", review: "감도 조절 지원" },
      { id: 8, type: "speaker", name: "2채널 데스크톱 스피커", price: 35000, category: "etc", review: "작은 공간용" },
      { id: 9, type: "speaker", name: "북셀프 스피커 앰프 포함", price: 159000, category: "etc", review: "음악 감상 입문" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return mockData
      .filter((it) => (selected === "all" ? true : it.type === selected))
      .filter((it) => it.name.toLowerCase().includes(s))
      .sort((a, b) => {
        if (sortBy === "name") return String(a.name).localeCompare(String(b.name));
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
        return 0;
      });
  }, [mockData, selected, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">기타기기</h2>

      <div className="flex gap-2 mb-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setSelected(opt);
              setCurrentPage(1);
            }}
            className={[
              "px-4 py-2 rounded-lg border text-sm",
              selected === opt
                ? "border-slate-800 text-slate-900"
                : "border-slate-300 text-slate-600 hover:border-slate-400",
            ].join(" ")}
          >
            {opt === "all"
              ? "전체"
              : opt === "monitor"
              ? "모니터"
              : opt === "keyboard"
              ? "키보드"
              : opt === "mouse"
              ? "마우스"
              : "스피커"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="제품명 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-[14px] w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-[14px]"
        >
          <option value="name">이름순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
          <option value="popularity">인기순</option>
        </select>
        <div className="text-sm text-slate-500">총 {filtered.length.toLocaleString()}개</div>
      </div>

      <div className="divide-y divide-slate-200 border rounded-lg bg-white">
        {pageItems.length === 0 ? (
          <div className="px-3 py-4 text-slate-500 text-sm">조건에 맞는 제품이 없습니다.</div>
        ) : (
          pageItems.map((item) => (
            <PartCard key={item.id} part={item} onClick={() => {}} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
        >
          이전
        </button>
        <span className="px-4 py-1 text-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </div>
  );
}
