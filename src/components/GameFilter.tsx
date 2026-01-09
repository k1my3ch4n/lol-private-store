"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameFilter as GameFilterType } from "@/lib/types";
import { LaneIcon } from "./LaneIcon";

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
  const [isLaneOpen, setIsLaneOpen] = useState(false);
  const laneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (laneRef.current && !laneRef.current.contains(event.target as Node)) {
        setIsLaneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field: keyof GameFilterType, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaneSelect = (lane: string) => {
    handleChange("lane", lane);
    setIsLaneOpen(false);
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

        <div className="w-[130px] relative" ref={laneRef}>
          <label className="block text-sm font-medium mb-1">라인</label>
          <button
            type="button"
            onClick={() => setIsLaneOpen(!isLaneOpen)}
            className="w-full h-9 px-3 border rounded-md bg-background text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {filter.lane ? (
                <>
                  <LaneIcon lane={filter.lane} size={18} />
                  {filter.lane}
                </>
              ) : (
                "전체"
              )}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isLaneOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isLaneOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-md shadow-lg z-10">
              <button
                type="button"
                onClick={() => handleLaneSelect("")}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 ${
                  filter.lane === "" ? "bg-muted" : ""
                }`}
              >
                전체
              </button>
              {LANES.slice(1).map((lane) => (
                <button
                  key={lane}
                  type="button"
                  onClick={() => handleLaneSelect(lane)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 ${
                    filter.lane === lane ? "bg-muted" : ""
                  }`}
                >
                  <LaneIcon lane={lane} size={18} />
                  {lane}
                </button>
              ))}
            </div>
          )}
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
