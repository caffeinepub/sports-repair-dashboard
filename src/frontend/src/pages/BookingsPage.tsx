import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import {
  useGetAllBookings,
  useGetBookingsSummary,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const SKELETON_IDS = ["a", "b", "c", "d", "e", "f"];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
          Pending
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
          Confirmed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/30">
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BookingsPage() {
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: summary, isLoading: summaryLoading } = useGetBookingsSummary();
  const updateStatus = useUpdateBookingStatus();

  const sorted = [...(bookings ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="space-y-8" data-ocid="bookings.page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Customer Bookings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage and track online repair bookings from customers.
        </p>
      </div>

      {/* KPI Summary */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        data-ocid="bookings.section"
      >
        {summaryLoading ? (
          SKELETON_IDS.map((id) => (
            <Skeleton key={id} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Total"
              value={Number(summary?.total ?? 0)}
              icon={<CalendarCheck className="h-5 w-5" />}
              tint="blue"
            />
            <KpiCard
              label="Pending"
              value={Number(summary?.pending ?? 0)}
              icon={<Clock className="h-5 w-5" />}
              tint="amber"
            />
            <KpiCard
              label="Confirmed"
              value={Number(summary?.confirmed ?? 0)}
              icon={<CalendarClock className="h-5 w-5" />}
              tint="blue"
            />
            <KpiCard
              label="In Progress"
              value={Number(summary?.inProgress ?? 0)}
              icon={<CalendarCheck className="h-5 w-5" />}
              tint="purple"
            />
            <KpiCard
              label="Completed"
              value={Number(summary?.completed ?? 0)}
              icon={<CheckCircle2 className="h-5 w-5" />}
              tint="green"
            />
            <KpiCard
              label="Cancelled"
              value={Number(summary?.cancelled ?? 0)}
              icon={<XCircle className="h-5 w-5" />}
              tint="purple"
            />
          </>
        )}
      </div>

      {/* Bookings Table */}
      <div
        className="bg-card rounded-xl shadow-sm overflow-hidden"
        data-ocid="bookings.table"
      >
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">All Bookings</h2>
        </div>
        {bookingsLoading ? (
          <div className="p-4 space-y-3" data-ocid="bookings.loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-12" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="p-12 text-center text-muted-foreground text-sm"
            data-ocid="bookings.empty_state"
          >
            No bookings yet. Customers can book repairs from the public website.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Sr.</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Equipment
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Preferred Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((booking, i) => (
                  <TableRow
                    key={String(booking.id)}
                    data-ocid={`bookings.row.item.${i + 1}`}
                  >
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-primary">
                      #{String(booking.id).padStart(4, "0")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.customerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.customerMobile}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{booking.serviceType}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {booking.equipmentDetails || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {formatDate(booking.preferredDate)}
                    </TableCell>
                    <TableCell>{statusBadge(booking.bookingStatus)}</TableCell>
                    <TableCell>
                      <select
                        data-ocid={`bookings.select.${i + 1}`}
                        value={booking.bookingStatus}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: booking.id,
                            status: e.target.value,
                          })
                        }
                        className="text-xs rounded-md border border-border bg-background px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
