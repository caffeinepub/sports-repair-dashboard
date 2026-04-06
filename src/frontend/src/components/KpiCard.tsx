import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  tint: "blue" | "green" | "amber" | "purple";
  sub?: string;
}

// Icon and value accent colors that pop on dark backgrounds
const tintMap = {
  blue: {
    bg: "kpi-blue",
    iconBg: "bg-cyan-500/20",
    iconText: "text-cyan-400",
    valueText: "text-cyan-300",
  },
  green: {
    bg: "kpi-green",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
    valueText: "text-emerald-300",
  },
  amber: {
    bg: "kpi-amber",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
    valueText: "text-amber-300",
  },
  purple: {
    bg: "kpi-purple",
    iconBg: "bg-violet-500/20",
    iconText: "text-violet-400",
    valueText: "text-violet-300",
  },
};

export function KpiCard({ label, value, icon, tint, sub }: Props) {
  const t = tintMap[tint];
  return (
    <div
      className={`rounded-xl ${t.bg} shadow-card p-5 flex items-center gap-4 border border-white/5`}
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
