import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 게임 시간 "27:17" → 초 단위 변환
export function gameTimeToSeconds(gameTime: string): number {
  const parts = gameTime.split(":");
  if (parts.length !== 2) return 0;
  const [minutes, seconds] = parts.map(Number);
  return minutes * 60 + seconds;
}

// GPM (Gold Per Minute) 계산
export function calculateGpm(gold: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Math.round(gold / (durationSeconds / 60));
}

// DPM (Damage Per Minute) 계산
export function calculateDpm(damage: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Math.round(damage / (durationSeconds / 60));
}
