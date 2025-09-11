import { useState } from "react";

export default function Etc() {
  const [selected, setSelected] = useState("all");
  const options = ["all", "monitor", "keyboard", "mouse", "speaker"];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">기타기기</h2>
      <div className="flex gap-2 mb-6">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
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
      <div className="text-slate-500 text-sm">
        아직 데이터가 준비되지 않았습니다.
      </div>
    </div>
  );
}
