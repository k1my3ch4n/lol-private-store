import { FC, SVGProps } from "react";
import {
  TopIcon,
  JungleIcon,
  MidIcon,
  BotIcon,
  SupportIcon,
} from "@/assets/icons";

interface LaneIconProps {
  lane: string;
  size?: number;
  className?: string;
}

const laneToIcon: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  "탑": TopIcon,
  "정글": JungleIcon,
  "미드": MidIcon,
  "원딜": BotIcon,
  "서폿": SupportIcon,
};

export function LaneIcon({ lane, size = 20, className }: LaneIconProps) {
  const IconComponent = laneToIcon[lane];

  if (!IconComponent) {
    return <span className={className}>{lane}</span>;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      aria-label={lane}
    />
  );
}
