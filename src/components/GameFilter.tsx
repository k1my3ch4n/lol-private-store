"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameFilter as GameFilterType } from "@/lib/types";

interface GameFilterProps {
  onSearch: (filter: GameFilterType) => void;
  isLoading?: boolean;
}

const LANES = ["", "탑", "정글", "미드", "원딜", "서폿"];

export function GameFilter({ onSearch, isLoading }: GameFilterProps) {
  const [filter, setFilter] = useState<GameFilterType>({
    summonerName: "",
    champion: "",
    lane: "",
    result: "",
  });

  const handleChange = (field: keyof GameFilterType, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filter);
  };

  const handleReset = () => {
    const emptyFilter: GameFilterType = {
      summonerName: "",
      champion: "",
      lane: "",
      result: "",
    };
    setFilter(emptyFilter);
    onSearch(emptyFilter);
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium mb-1">소환사명</label>
          <Input
            placeholder="소환사명 검색"
            value={filter.summonerName}
            onChange={(e) => handleChange("summonerName", e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium mb-1">챔피언</label>
          <Input
            placeholder="챔피언 검색"
            value={filter.champion}
            onChange={(e) => handleChange("champion", e.target.value)}
          />
        </div>

        <div className="w-[120px]">
          <label className="block text-sm font-medium mb-1">라인</label>
          <select
            value={filter.lane}
            onChange={(e) => handleChange("lane", e.target.value)}
            className="w-full h-9 px-3 border rounded-md bg-background text-sm"
          >
            <option value="">전체</option>
            {LANES.slice(1).map((lane) => (
              <option key={lane} value={lane}>
                {lane}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "검색 중..." : "검색"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            초기화
          </Button>
        </div>
      </form>
    </Card>
  );
}
