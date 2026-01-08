import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { GameRecord, PlayerRecord, GameWithPlayers } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const summonerName = searchParams.get("summonerName") || "";
    const champion = searchParams.get("champion") || "";
    const lane = searchParams.get("lane") || "";
    const result = searchParams.get("result") || "";

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
      return NextResponse.json({ success: true, data: [] });
    }

    // 게임 정보 조회
    const gamesQuery = `
      SELECT id, "gameTime", result, "createdAt"
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

    return NextResponse.json({ success: true, data: gamesWithPlayers });
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
