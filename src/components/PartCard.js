import React from "react";

/**
 * 리스트형 상품 카드 (실제 커머스 형태)
 * - 좌: 썸네일
 * - 중: 제품명 + 핵심 스펙 2~3줄 + (선택) 설명 캡션
 * - 우: 가격(굵게/크게) + 보조지표(벤치마크/가성비)
 *
 * 기능 추가 없음: onClick으로 상세 이동 등은 부모에서 주입
 */
export default function PartCard({
  part,
  onClick,
  compact = false, // Recommend 등 좁은 컨텍스트일 때 true
}) {
  if (!part) return null;

  const name = String(part.name || "");
  const priceNum = Number(part.price);
  const priceText = Number.isFinite(priceNum)
    ? `${priceNum.toLocaleString()}원`
    : "가격 정보 없음";

  // 보조 지표(카테고리에 맞춰 간결하게)
  const passmark = part?.benchmarkScore?.passmarkscore;
  const cineMulti = part?.benchmarkScore?.cinebenchMulti;
  const mark3d = part?.benchmarkScore?.["3dmarkscore"];

  const subScore =
    mark3d != null
      ? `3DMark ${Number(mark3d).toLocaleString()}`
      : passmark != null
      ? `PassMark ${Number(passmark).toLocaleString()}`
      : null;

  // 핵심 스펙 요약(있으면 최대 2~3줄로 짧게)
  const specLines = [];
  if (part?.specSummary) {
    // 줄바꿈 기준 최대 3줄만 노출
    const lines = String(part.specSummary)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    specLines.push(...lines);
  }

  return (
    <div
      role="button"
      onClick={onClick}
      className={[
        "w-full",
        "cursor-pointer",
        "bg-white",
        "border border-slate-200",
        "rounded-xl",
        "transition",
        "hover:shadow-sm hover:border-slate-300",
        compact ? "p-3" : "p-4",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        {/* 좌측 썸네일 */}
        <div
          className={[
            "flex-shrink-0",
            "w-16 h-16 sm:w-20 sm:h-20",
            "rounded-lg",
            "bg-slate-50",
            "border border-slate-200",
            "overflow-hidden",
            "flex items-center justify-center",
          ].join(" ")}
        >
          {part.image ? (
            <img
              src={part.image}
              alt={name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-slate-400">NO IMAGE</span>
          )}
        </div>

        {/* 중앙 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 truncate">
            {name}
          </h3>

          {specLines.length > 0 && (
            <ul className="mt-1 text-[13px] sm:text-[14px] text-slate-600 space-y-0.5">
              {specLines.map((line, idx) => (
                <li key={idx} className="truncate">{line}</li>
              ))}
            </ul>
          )}

          {part.review && (
            <p className="mt-1 text-[12px] sm:text-[13px] text-slate-500 line-clamp-1">
              {part.review}
            </p>
          )}
        </div>

        {/* 우측 가격/보조지표 */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[16px] sm:text-[18px] font-bold text-slate-900">
            {priceText}
          </div>
          {subScore && (
            <div className="text-[12px] sm:text-[13px] text-slate-500">
              {subScore}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
