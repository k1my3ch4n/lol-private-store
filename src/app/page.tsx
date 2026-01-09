import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">
          LoL 사설 게임
          <br />
          데이터 아카이브
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          게임 결과 스크린샷에서 <span className="text-primary">AI</span>로 데이터를 추출하고,
          <br />
          저장된 기록을 검색하고 통계를 확인하세요.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            게임 등록
          </Link>
          <Link
            href="/games"
            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-lg"
          >
            기록 조회
          </Link>
        </div>
      </div>
    </div>
  );
}
