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

// DB에서 조회한 게임 데이터 (id, createdAt 포함)
export interface GameRecord {
  id: number;
  gameTime: string;
  gameDurationSeconds: number;
  result: string;
  createdAt: string;
}

// DB에서 조회한 플레이어 데이터 (id, gameId 포함)
export interface PlayerRecord extends PlayerData {
  id: number;
  gameId: number;
}

// 게임 + 플레이어 조합 타입
export interface GameWithPlayers extends GameRecord {
  players: PlayerRecord[];
}

// 필터 타입
export interface GameFilter {
  summonerName: string;
  champion: string;
  lane: string;
  result: string;
}

// 통계 요약 타입
export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgKda: number;
  avgGpm: number;
  avgDpm: number;
}
