import React from "react";

export default function PartCard({ part, onClick }) {
  if (!part) return null;

  const name = String(part.name || "");
  const priceNum = Number(part.price);
  const priceText = Number.isFinite(priceNum) ? `${priceNum.toLocaleString()}원` : "가격 정보 없음";
  
  // benchScore를 우선 사용, 없으면 benchmarkScore에서 가져오기
  const benchScore = part?.benchScore || part?.benchmarkScore?.passmarkscore;
  const mark3d = part?.benchmarkScore?.["3dmarkscore"];
  const subScore =
    mark3d != null
      ? `3DMark ${Number(mark3d).toLocaleString()}`
      : benchScore != null
        ? `PassMark ${Number(benchScore).toLocaleString()}`
        : null;

  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer border border-slate-200 rounded-lg px-4 py-5 hover:bg-slate-50 transition bg-white shadow-sm"
    >
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 flex-shrink-0 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
          {part.image && !part.image.includes('noImg') && !part.image.includes('noData') ? (
            <img 
              src={part.image} 
              alt={name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                // 이미지 로드 실패 시 플레이스홀더 표시
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <span className="text-xs text-slate-400">NO IMAGE</span>
          )}
          <span className="text-xs text-slate-400 hidden">NO IMAGE</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 break-words leading-snug">{name}</h3>
          {part.review && (
            <p className="mt-2 text-sm text-slate-600 break-words leading-relaxed">{part.review}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-xl font-bold text-slate-900">{priceText}</div>
          {subScore && <div className="text-sm text-slate-500 font-medium">{subScore}</div>}
        </div>
      </div>
    </div>
  );
}
