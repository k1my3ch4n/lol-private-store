"use client";

import { useState, Fragment } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameWithPlayers, GameFilter, PlayerStats } from "@/lib/types";
import { calculateGpm, calculateDpm } from "@/lib/utils";

import { LaneIcon } from "./LaneIcon";

interface GameListProps {
  games: GameWithPlayers[];
  filter?: GameFilter;
  stats?: PlayerStats | null;
}

export function GameList({ games, filter, stats }: GameListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const hasPlayerFilter = filter?.summonerName || filter?.champion || filter?.lane;

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
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 필터 조건에 맞는 플레이어들 찾기 (라인 검색 시 여러 명 반환)
  const getMatchedPlayers = (game: GameWithPlayers) => {
    return game.players.filter((p) => {
      const matchSummoner = !filter?.summonerName ||
        p.summonerName.toLowerCase().includes(filter.summonerName.toLowerCase());
      const matchChampion = !filter?.champion ||
        p.champion.toLowerCase().includes(filter.champion.toLowerCase());
      const matchLane = !filter?.lane || p.lane === filter.lane;
      return matchSummoner && matchChampion && matchLane;
    });
  };

  // 플레이어 중심 뷰 (검색 조건이 있을 때)
  if (hasPlayerFilter) {
    return (
      <div className="space-y-4">
        {/* 통계 요약 카드 */}
        {stats && <StatsCard stats={stats} />}

        {/* 개별 게임 목록 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">날짜</TableHead>
                <TableHead className="w-[50px]">결과</TableHead>
                <TableHead className="w-[70px]">챔피언</TableHead>
                <TableHead className="w-[50px]">라인</TableHead>
                <TableHead>소환사명</TableHead>
                <TableHead className="w-[80px]">K/D/A</TableHead>
                <TableHead className="w-[50px] text-right">KDA</TableHead>
                <TableHead className="w-[50px] text-right">GPM</TableHead>
                <TableHead className="w-[50px] text-right">DPM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.flatMap((game) => {
                const matchedPlayers = getMatchedPlayers(game);
                if (matchedPlayers.length === 0) return [];

                const duration = game.gameDurationSeconds || 0;

                return matchedPlayers.map((player) => {
                  const gpm = calculateGpm(player.gold, duration);
                  const dpm = calculateDpm(player.damage, duration);
                  const kda = player.deaths > 0
                    ? ((player.kills + player.assists) / player.deaths).toFixed(1)
                    : (player.kills + player.assists).toString();

                  // 플레이어가 아군(team 1)인지에 따라 승패 결정
                  const isWin = (player.team === 1 && game.result === "승리") ||
                                (player.team === 2 && game.result === "패배");

                  return (
                    <TableRow key={`${game.id}-${player.id}`}>
                      <TableCell className="text-sm">
                        {formatDate(game.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            isWin
                              ? "text-blue-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {isWin ? "승" : "패"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{player.champion}</TableCell>
                      <TableCell><LaneIcon lane={player.lane} size={20} /></TableCell>
                      <TableCell className="text-sm">{player.summonerName}</TableCell>
                      <TableCell className="text-sm">
                        <span className="text-blue-600">{player.kills}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-600">{player.deaths}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-green-600">{player.assists}</span>
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium">
                        {kda}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {gpm}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {dpm}
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  // 게임 중심 뷰 (검색 조건이 없을 때)
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
            <Fragment key={game.id}>
              <TableRow
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
                <TableRow>
                  <TableCell colSpan={4} className="bg-muted/30 p-4">
                    <GameDetail game={game} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function StatsCard({ stats }: { stats: PlayerStats }) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">통계 요약 ({stats.totalGames}게임)</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">
            <span className="text-blue-600">{stats.avgKills}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-600">{stats.avgDeaths}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-green-600">{stats.avgAssists}</span>
          </div>
          <div className="text-xs text-muted-foreground">평균 K/D/A</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.avgKda}</div>
          <div className="text-xs text-muted-foreground">KDA</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.avgGpm}</div>
          <div className="text-xs text-muted-foreground">GPM</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.avgDpm}</div>
          <div className="text-xs text-muted-foreground">DPM</div>
        </div>
      </div>
    </Card>
  );
}

function GameDetail({ game }: { game: GameWithPlayers }) {
  const team1 = game.players.filter((p) => p.team === 1);
  const team2 = game.players.filter((p) => p.team === 2);

  return (
    <div className="space-y-4">
      <TeamTable title="아군" players={team1} duration={game.gameDurationSeconds} />
      <TeamTable title="적군" players={team2} duration={game.gameDurationSeconds} />
    </div>
  );
}

function TeamTable({
  title,
  players,
  duration,
}: {
  title: string;
  players: GameWithPlayers["players"];
  duration: number;
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
            <TableHead className="w-14 text-right">KDA</TableHead>
            <TableHead className="w-14 text-right">GPM</TableHead>
            <TableHead className="w-14 text-right">DPM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const gpm = calculateGpm(player.gold, duration);
            const dpm = calculateDpm(player.damage, duration);
            const kda = player.deaths > 0
              ? ((player.kills + player.assists) / player.deaths).toFixed(1)
              : (player.kills + player.assists).toString();

            return (
              <TableRow key={player.id}>
                <TableCell><LaneIcon lane={player.lane} size={20} /></TableCell>
                <TableCell className="text-sm font-medium">
                  {player.champion}
                </TableCell>
                <TableCell className="text-sm">{player.summonerName}</TableCell>
                <TableCell className="text-sm">
                  <span className="text-blue-600">{player.kills}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-600">{player.deaths}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-green-600">{player.assists}</span>
                </TableCell>
                <TableCell className="text-sm text-right font-medium">
                  {kda}
                </TableCell>
                <TableCell className="text-sm text-right">
                  {gpm}
                </TableCell>
                <TableCell className="text-sm text-right">
                  {dpm}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
