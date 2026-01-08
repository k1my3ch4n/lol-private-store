"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GameFilter } from "@/components/GameFilter";
import { GameList } from "@/components/GameList";
import { GameWithPlayers, GameFilter as GameFilterType, PlayerStats } from "@/lib/types";

export default function GamesPage() {
  const [games, setGames] = useState<GameWithPlayers[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<GameFilterType>({
    summonerName: "",
    champion: "",
    lane: "",
    result: "",
  });

  const fetchGames = async (filter?: GameFilterType) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filter?.summonerName) params.set("summonerName", filter.summonerName);
      if (filter?.champion) params.set("champion", filter.champion);
      if (filter?.lane) params.set("lane", filter.lane);
      if (filter?.result) params.set("result", filter.result);

      const response = await fetch(`/api/games?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setGames(result.data);
        setStats(result.stats || null);
      } else {
        setError(result.error || "데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("조회 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSearch = (filter: GameFilterType) => {
    setCurrentFilter(filter);
    fetchGames(filter);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">게임 기록 조회</h1>
              <p className="text-muted-foreground mt-2">
                저장된 게임 기록을 검색하고 확인하세요
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              새 게임 등록
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          <GameFilter onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              로딩 중...
            </div>
          ) : (
            <GameList games={games} filter={currentFilter} stats={stats} />
          )}
        </main>
      </div>
    </div>
  );
}
