import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { LOL_EXTRACT_PROMPT } from "@/lib/prompts";
import { GameData, ExtractResult } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<ExtractResult>> {
  try {
    const { base64, mimeType } = await request.json();

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { success: false, error: "이미지 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // Gemini API 호출
    const result = await geminiModel.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      { text: LOL_EXTRACT_PROMPT },
    ]);

    const response = result.response;
    const text = response.text();

    // JSON 파싱
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    try {
      const gameData: GameData = JSON.parse(jsonString.trim());

      // 데이터 검증
      if (!gameData.gameTime || !gameData.result || !gameData.players) {
        return NextResponse.json({
          success: false,
          error: "추출된 데이터가 불완전합니다.",
          rawResponse: text,
        });
      }

      if (gameData.players.length !== 10) {
        return NextResponse.json({
          success: false,
          error: `플레이어 수가 올바르지 않습니다. (${gameData.players.length}/10)`,
          rawResponse: text,
        });
      }

      return NextResponse.json({
        success: true,
        data: gameData,
      });
    } catch (parseError) {
      console.error("JSON 파싱 에러:", parseError);
      return NextResponse.json({
        success: false,
        error: "응답을 JSON으로 파싱할 수 없습니다.",
        rawResponse: text,
      });
    }
  } catch (error) {
    console.error("추출 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "데이터 추출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
