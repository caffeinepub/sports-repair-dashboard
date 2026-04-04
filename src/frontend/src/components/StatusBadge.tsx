interface Props {
  status: string;
}

export function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
    Completed: "bg-green-50 text-green-700 border border-green-200",
  };
  const cls =
    styles[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}
