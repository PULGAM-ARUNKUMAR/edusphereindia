import { Trophy, Award } from "lucide-react";

export function NirfBadge({ rank }: { rank: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
      <Trophy className="h-3 w-3" />
      #{rank} NIRF
    </span>
  );
}

export function NaacBadge({ grade }: { grade: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
      <Award className="h-3 w-3" />
      NAAC {grade}
    </span>
  );
}