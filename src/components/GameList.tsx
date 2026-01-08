"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameWithPlayers } from "@/lib/types";

interface GameListProps {
  games: GameWithPlayers[];
}

export function GameList({ games }: GameListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (games.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        검색 결과가 없습니다.
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getTeamSummary = (game: GameWithPlayers, team: number) => {
    const teamPlayers = game.players.filter((p) => p.team === team);
    return teamPlayers
      .map((p) => `${p.summonerName}(${p.champion})`)
      .join(", ");
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">날짜</TableHead>
            <TableHead className="w-[80px]">게임시간</TableHead>
            <TableHead className="w-[60px]">결과</TableHead>
            <TableHead>아군</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <>
              <TableRow
                key={game.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  setExpandedId(expandedId === game.id ? null : game.id)
                }
              >
                <TableCell className="font-medium">
                  {formatDate(game.createdAt)}
                </TableCell>
                <TableCell>{game.gameTime}</TableCell>
                <TableCell>
                  <span
                    className={
                      game.result === "승리"
                        ? "text-blue-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {game.result}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {getTeamSummary(game, 1)}
                </TableCell>
              </TableRow>

              {expandedId === game.id && (
                <TableRow key={`${game.id}-detail`}>
                  <TableCell colSpan={4} className="bg-muted/30 p-4">
                    <GameDetail game={game} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function GameDetail({ game }: { game: GameWithPlayers }) {
  const team1 = game.players.filter((p) => p.team === 1);
  const team2 = game.players.filter((p) => p.team === 2);

  return (
    <div className="space-y-4">
      <TeamTable title="아군" players={team1} />
      <TeamTable title="적군" players={team2} />
    </div>
  );
}

function TeamTable({
  title,
  players,
}: {
  title: string;
  players: GameWithPlayers["players"];
}) {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">라인</TableHead>
            <TableHead className="w-20">챔피언</TableHead>
            <TableHead>소환사명</TableHead>
            <TableHead className="w-20">K/D/A</TableHead>
            <TableHead className="w-16 text-right">피해량</TableHead>
            <TableHead className="w-16 text-right">골드</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="text-sm">{player.lane}</TableCell>
              <TableCell className="text-sm font-medium">
                {player.champion}
              </TableCell>
              <TableCell className="text-sm">{player.summonerName}</TableCell>
              <TableCell className="text-sm">
                {player.kills}/{player.deaths}/{player.assists}
              </TableCell>
              <TableCell className="text-sm text-right">
                {player.damage.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-right">
                {player.gold.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
