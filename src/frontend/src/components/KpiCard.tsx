import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  tint: "blue" | "green" | "amber" | "purple";
  sub?: string;
}

const tintMap = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    valueText: "text-blue-800",
  },
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    valueText: "text-green-800",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    valueText: "text-amber-800",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    valueText: "text-purple-800",
  },
};

export function KpiCard({ label, value, icon, tint, sub }: Props) {
  const t = tintMap[tint];
  return (
    <div
      className={`rounded-xl ${t.bg} shadow-card p-5 flex items-center gap-4`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${t.iconBg} ${t.iconText} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-2xl font-bold ${t.valueText} leading-tight`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
