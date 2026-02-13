import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function About() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-3">GoodPricePC 소개</h1>
          <p className="text-lg text-slate-300">
            가성비 PC 부품 비교와 AI 추천으로 최적의 조립 PC를 찾아드립니다.
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-slate-800">사이트 목적</CardTitle>
            <CardDescription className="text-slate-600">
              GoodPricePC는 CPU, GPU, 메모리, 메인보드, 저장장치, 케이스, 쿨러, 파워서플라이 등 PC 부품의
              가격과 성능(벤치마크) 데이터를 한곳에서 비교할 수 있도록 제공합니다.
              AI 추천 기능을 통해 예산과 용도에 맞는 부품 구성을 추천받을 수 있습니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-slate-800">제공 기능</CardTitle>
            <CardContent className="pt-0">
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>카테고리별 부품 목록 및 가격·성능 비교</li>
                <li>부품 상세 정보 및 가격 추이</li>
                <li>AI 기반 PC 부품 추천</li>
                <li>실시간 가격 정보 (수집 시점 기준)</li>
              </ul>
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-slate-800">데이터 출처</CardTitle>
            <CardDescription className="text-slate-600">
              성능 데이터는 PassMark, 3DMark, Cinebench 등 공개 벤치마크를 참고하며,
              가격 정보는 수집 시점에 따라 변동될 수 있습니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-slate-800">문의</CardTitle>
            <CardDescription className="text-slate-600">
              서비스 관련 문의나 제안 사항이 있으시면 GitHub 저장소 이슈 또는
              프로젝트 페이지를 통해 연락해 주시면 감사하겠습니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 font-medium transition-colors"
          >
            ← 홈으로
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 font-medium transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
