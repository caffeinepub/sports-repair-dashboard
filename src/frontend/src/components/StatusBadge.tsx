interface Props {
  status: string;
}

export function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    "In Progress": "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    Completed:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  };
  const cls =
    styles[status] ??
    "bg-slate-500/20 text-slate-300 border border-slate-500/30";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}
