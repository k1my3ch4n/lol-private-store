import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Player 먼저 삭제 (외래키 제약)
    await client.query('DELETE FROM "Player"');
    await client.query('DELETE FROM "Game"');

    // 시퀀스 리셋
    await client.query('ALTER SEQUENCE "Game_id_seq" RESTART WITH 1');
    await client.query('ALTER SEQUENCE "Player_id_seq" RESTART WITH 1');

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "DB가 초기화되었습니다.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("DB 초기화 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "DB 초기화에 실패했습니다.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
