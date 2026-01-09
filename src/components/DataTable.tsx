"use client";

import { GameData, PlayerData, calculateKda } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LANE_ORDER = ["탑", "정글", "미드", "원딜", "서폿"];

function getLaneIndex(lane: string): number {
  const index = LANE_ORDER.indexOf(lane);
  return index === -1 ? 999 : index;
}

interface DataTableProps {
  data: GameData;
  onChange: (data: GameData) => void;
}

export function DataTable({ data, onChange }: DataTableProps) {
  const handleGameChange = (field: keyof GameData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePlayerChange = (
    index: number,
    field: keyof PlayerData,
    value: string | number | null
  ) => {
    const newPlayers = [...data.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    onChange({ ...data, players: newPlayers });
  };

  // 원본 인덱스를 포함하여 라인 순서대로 정렬
  const team1Players = data.players
    .map((p, idx) => ({ player: p, originalIndex: idx }))
    .filter((item) => item.player.team === 1)
    .sort((a, b) => getLaneIndex(a.player.lane) - getLaneIndex(b.player.lane));

  const team2Players = data.players
    .map((p, idx) => ({ player: p, originalIndex: idx }))
    .filter((item) => item.player.team === 2)
    .sort((a, b) => getLaneIndex(a.player.lane) - getLaneIndex(b.player.lane));

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 게임 정보 */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">게임 시간:</span>
            <Input
              value={data.gameTime}
              onChange={(e) => handleGameChange("gameTime", e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">결과:</span>
            <select
              value={data.result}
              onChange={(e) => handleGameChange("result", e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="승리">승리</option>
              <option value="패배">패배</option>
            </select>
          </div>
        </div>

        {/* 1팀 테이블 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">1팀 (아군)</h3>
          <PlayerTable
            players={team1Players}
            onPlayerChange={handlePlayerChange}
          />
        </div>

        {/* 2팀 테이블 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">2팀 (적군)</h3>
          <PlayerTable
            players={team2Players}
            onPlayerChange={handlePlayerChange}
          />
        </div>
      </div>
    </Card>
  );
}

interface PlayerWithIndex {
  player: PlayerData;
  originalIndex: number;
}

interface PlayerTableProps {
  players: PlayerWithIndex[];
  onPlayerChange: (
    index: number,
    field: keyof PlayerData,
    value: string | number | null
  ) => void;
}

function PlayerTable({ players, onPlayerChange }: PlayerTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">라인</TableHead>
            <TableHead className="w-14">Lv</TableHead>
            <TableHead>챔피언</TableHead>
            <TableHead>소환사명</TableHead>
            <TableHead className="w-20">스펠1</TableHead>
            <TableHead className="w-20">스펠2</TableHead>
            <TableHead className="w-14">K</TableHead>
            <TableHead className="w-14">D</TableHead>
            <TableHead className="w-14">A</TableHead>
            <TableHead className="w-16">KDA</TableHead>
            <TableHead className="w-20">피해량</TableHead>
            <TableHead className="w-20">골드</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map(({ player, originalIndex }) => (
            <TableRow key={originalIndex}>
              <TableCell>
                <Input
                  value={player.lane}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "lane", e.target.value)
                  }
                  className="w-16 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.level}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "level", parseInt(e.target.value) || 0)
                  }
                  className="w-14 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={player.champion}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "champion", e.target.value)
                  }
                  className="w-24 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={player.summonerName}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "summonerName", e.target.value)
                  }
                  className="w-32 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={player.lane === "정글" ? "강타" : player.spell1}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "spell1", e.target.value)
                  }
                  readOnly={player.lane === "정글"}
                  className={`w-20 h-8 text-xs ${player.lane === "정글" ? "bg-muted" : ""}`}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={player.lane === "정글" && player.spell2 === "강타" ? "" : player.spell2}
                  onChange={(e) => {
                    if (player.lane === "정글" && e.target.value === "강타") return;
                    onPlayerChange(originalIndex, "spell2", e.target.value);
                  }}
                  className="w-20 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.kills}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "kills", parseInt(e.target.value) || 0)
                  }
                  className="w-14 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.deaths}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "deaths", parseInt(e.target.value) || 0)
                  }
                  className="w-14 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.assists}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "assists", parseInt(e.target.value) || 0)
                  }
                  className="w-14 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <span className="text-xs px-2">
                  {calculateKda(player.kills, player.deaths, player.assists).toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.damage}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "damage", parseInt(e.target.value) || 0)
                  }
                  className="w-20 h-8 text-xs"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={player.gold}
                  onChange={(e) =>
                    onPlayerChange(originalIndex, "gold", parseInt(e.target.value) || 0)
                  }
                  className="w-20 h-8 text-xs"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
