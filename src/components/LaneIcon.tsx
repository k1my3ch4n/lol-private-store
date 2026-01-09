"use client";

import Image from "next/image";

interface LaneIconProps {
  lane: string;
  size?: number;
  className?: string;
}

const laneToIcon: Record<string, string> = {
  "탑": "/icons/icon-position-top.svg",
  "정글": "/icons/icon-position-jungle.svg",
  "미드": "/icons/icon-position-middle.svg",
  "원딜": "/icons/icon-position-bottom.svg",
  "서폿": "/icons/icon-position-utility.svg",
};

export function LaneIcon({ lane, size = 20, className }: LaneIconProps) {
  const iconPath = laneToIcon[lane];

  if (!iconPath) {
    return <span className={className}>{lane}</span>;
  }

  return (
    <Image
      src={iconPath}
      alt={lane}
      width={size}
      height={size}
      className={className}
      title={lane}
    />
  );
}
