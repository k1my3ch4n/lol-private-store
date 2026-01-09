"use client";

import { GameData, PlayerData } from "@/lib/types";
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

  const team1Players = data.players.filter((p) => p.team === 1);
  const team2Players = data.players.filter((p) => p.team === 2);

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
            startIndex={0}
            onPlayerChange={handlePlayerChange}
          />
        </div>

        {/* 2팀 테이블 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">2팀 (적군)</h3>
          <PlayerTable
            players={team2Players}
            startIndex={5}
            onPlayerChange={handlePlayerChange}
          />
        </div>
      </div>
    </Card>
  );
}

interface PlayerTableProps {
  players: PlayerData[];
  startIndex: number;
  onPlayerChange: (
    index: number,
    field: keyof PlayerData,
    value: string | number | null
  ) => void;
}

function PlayerTable({ players, startIndex, onPlayerChange }: PlayerTableProps) {
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
          {players.map((player, idx) => {
            const actualIndex = startIndex + idx;
            return (
              <TableRow key={actualIndex}>
                <TableCell>
                  <Input
                    value={player.lane}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "lane", e.target.value)
                    }
                    className="w-16 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.level}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "level", parseInt(e.target.value) || 0)
                    }
                    className="w-14 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={player.champion}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "champion", e.target.value)
                    }
                    className="w-24 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={player.summonerName}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "summonerName", e.target.value)
                    }
                    className="w-32 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={player.spell1}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "spell1", e.target.value)
                    }
                    className="w-20 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={player.spell2}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "spell2", e.target.value)
                    }
                    className="w-20 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.kills}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "kills", parseInt(e.target.value) || 0)
                    }
                    className="w-14 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.deaths}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "deaths", parseInt(e.target.value) || 0)
                    }
                    className="w-14 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.assists}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "assists", parseInt(e.target.value) || 0)
                    }
                    className="w-14 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={player.kda ?? ""}
                    onChange={(e) =>
                      onPlayerChange(
                        actualIndex,
                        "kda",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    className="w-16 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.damage}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "damage", parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={player.gold}
                    onChange={(e) =>
                      onPlayerChange(actualIndex, "gold", parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8 text-xs"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
