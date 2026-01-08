import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { GameRecord, PlayerRecord, GameWithPlayers, PlayerStats } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const summonerName = searchParams.get("summonerName") || "";
    const champion = searchParams.get("champion") || "";
    const lane = searchParams.get("lane") || "";
    const result = searchParams.get("result") || "";

    const hasFilter = summonerName || champion || lane;

    // 필터 조건에 맞는 게임 ID 조회
    let gameIdsQuery = `
      SELECT DISTINCT g.id
      FROM "Game" g
      JOIN "Player" p ON g.id = p."gameId"
      WHERE 1=1
    `;
    const params: string[] = [];
    let paramIndex = 1;

    if (summonerName) {
      gameIdsQuery += ` AND p."summonerName" ILIKE $${paramIndex}`;
      params.push(`%${summonerName}%`);
      paramIndex++;
    }

    if (champion) {
      gameIdsQuery += ` AND p."champion" ILIKE $${paramIndex}`;
      params.push(`%${champion}%`);
      paramIndex++;
    }

    if (lane) {
      gameIdsQuery += ` AND p."lane" = $${paramIndex}`;
      params.push(lane);
      paramIndex++;
    }

    if (result) {
      gameIdsQuery += ` AND g."result" = $${paramIndex}`;
      params.push(result);
      paramIndex++;
    }

    gameIdsQuery += ` ORDER BY g.id DESC`;

    const gameIdResults = await query<{ id: number }>(gameIdsQuery, params);
    const gameIds = gameIdResults.map((r) => r.id);

    if (gameIds.length === 0) {
      return NextResponse.json({ success: true, stats: null, data: [] });
    }

    // 게임 정보 조회 (gameDurationSeconds 포함)
    const gamesQuery = `
      SELECT id, "gameTime", "gameDurationSeconds", result, "createdAt"
      FROM "Game"
      WHERE id = ANY($1)
      ORDER BY "createdAt" DESC
    `;
    const games = await query<GameRecord>(gamesQuery, [gameIds]);

    // 플레이어 정보 조회
    const playersQuery = `
      SELECT id, "gameId", team, lane, level, champion, "summonerName",
             spell1, spell2, kills, deaths, assists, kda, damage, gold, vision
      FROM "Player"
      WHERE "gameId" = ANY($1)
      ORDER BY "gameId", team, id
    `;
    const players = await query<PlayerRecord>(playersQuery, [gameIds]);

    // 게임별로 플레이어 그룹화
    const gamesWithPlayers: GameWithPlayers[] = games.map((game) => ({
      ...game,
      players: players.filter((p) => p.gameId === game.id),
    }));

    // 통계 계산 (필터가 있을 때만)
    let stats: PlayerStats | null = null;
    if (hasFilter) {
      stats = calculateStats(gamesWithPlayers, { summonerName, champion, lane });
    }

    return NextResponse.json({ success: true, stats, data: gamesWithPlayers });
  } catch (error) {
    console.error("게임 목록 조회 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "게임 목록 조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

function calculateStats(
  games: GameWithPlayers[],
  filter: { summonerName: string; champion: string; lane: string }
): PlayerStats {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalGold = 0;
  let totalDamage = 0;
  let totalDurationSeconds = 0;
  let playerCount = 0;

  for (const game of games) {
    // 모든 매칭 플레이어 찾기 (라인 검색 시 여러 명 가능)
    const matchedPlayers = game.players.filter((p) => {
      const matchSummoner = !filter.summonerName ||
        p.summonerName.toLowerCase().includes(filter.summonerName.toLowerCase());
      const matchChampion = !filter.champion ||
        p.champion.toLowerCase().includes(filter.champion.toLowerCase());
      const matchLane = !filter.lane || p.lane === filter.lane;
      return matchSummoner && matchChampion && matchLane;
    });

    for (const player of matchedPlayers) {
      totalKills += player.kills;
      totalDeaths += player.deaths;
      totalAssists += player.assists;
      totalGold += player.gold;
      totalDamage += player.damage;
      totalDurationSeconds += game.gameDurationSeconds || 0;
      playerCount++;
    }
  }

  const totalMinutes = totalDurationSeconds / 60;

  return {
    totalGames: playerCount,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalKills,
    totalDeaths,
    totalAssists,
    avgKills: playerCount > 0 ? Math.round((totalKills / playerCount) * 10) / 10 : 0,
    avgDeaths: playerCount > 0 ? Math.round((totalDeaths / playerCount) * 10) / 10 : 0,
    avgAssists: playerCount > 0 ? Math.round((totalAssists / playerCount) * 10) / 10 : 0,
    avgKda: totalDeaths > 0
      ? Math.round(((totalKills + totalAssists) / totalDeaths) * 10) / 10
      : totalKills + totalAssists,
    avgGpm: totalMinutes > 0 ? Math.round(totalGold / totalMinutes) : 0,
    avgDpm: totalMinutes > 0 ? Math.round(totalDamage / totalMinutes) : 0,
  };
}
