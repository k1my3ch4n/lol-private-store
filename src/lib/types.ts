// 플레이어 데이터 타입
export interface PlayerData {
  team: number; // 1 또는 2
  lane: string; // 탑/정글/미드/원딜/서폿
  level: number;
  champion: string;
  summonerName: string;
  spell1: string;
  spell2: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number | null;
  damage: number;
  gold: number;
  vision: number | null;
}

// 게임 데이터 타입
export interface GameData {
  gameTime: string; // "27:17"
  result: string; // "승리" 또는 "패배"
  players: PlayerData[];
}

// 추출 결과 타입
export interface ExtractResult {
  success: boolean;
  data?: GameData;
  error?: string;
  rawResponse?: string;
}
