import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { GameData } from "@/lib/types";
import { gameTimeToSeconds } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const gameData: GameData = await request.json();

    // 데이터 검증
    if (!gameData.gameTime || !gameData.result || !gameData.players) {
      return NextResponse.json(
        { success: false, error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    if (gameData.players.length !== 10) {
      return NextResponse.json(
        { success: false, error: `플레이어 수가 올바르지 않습니다. (${gameData.players.length}/10)` },
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    await client.query("BEGIN");

    // 게임 시간 초 단위 변환
    const gameDurationSeconds = gameTimeToSeconds(gameData.gameTime);

    // Game 저장
    const gameResult = await client.query(
      `INSERT INTO "Game" ("gameTime", "gameDurationSeconds", "result", "createdAt")
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [gameData.gameTime, gameDurationSeconds, gameData.result]
    );

    const gameId = gameResult.rows[0].id;

    // Players 저장
    for (const player of gameData.players) {
      await client.query(
        `INSERT INTO "Player"
         ("gameId", "team", "lane", "level", "champion", "summonerName",
          "spell1", "spell2", "kills", "deaths", "assists", "kda",
          "damage", "gold", "vision")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          gameId,
          player.team,
          player.lane,
          player.level,
          player.champion,
          player.summonerName,
          player.spell1,
          player.spell2,
          player.kills,
          player.deaths,
          player.assists,
          player.kda,
          player.damage,
          player.gold,
          player.vision,
        ]
      );
    }

    // 트랜잭션 커밋
    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      data: { id: gameId, gameTime: gameData.gameTime, result: gameData.result },
    });
  } catch (error) {
    // 롤백
    await client.query("ROLLBACK");
    console.error("저장 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "데이터 저장에 실패했습니다.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
