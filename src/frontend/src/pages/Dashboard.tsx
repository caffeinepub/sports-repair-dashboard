import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import type { JobWithId } from "../hooks/useQueries";
import {
  useGetAllJobs,
  useGetBookingsSummary,
  useGetSummaryStats,
} from "../hooks/useQueries";

interface Props {
  onNavigateJobs: () => void;
  onViewJob: (job: JobWithId) => void;
}

const SKELETON_IDS = ["a", "b", "c", "d", "e"];

export function Dashboard({ onNavigateJobs, onViewJob }: Props) {
  const { isFetching: actorFetching } = useActor();
  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsFetching,
  } = useGetSummaryStats();
  const {
    data: jobs,
    isLoading: jobsLoading,
    isFetching: jobsFetching,
  } = useGetAllJobs();
  const { data: bookingsSummary, isLoading: bookingsSummaryLoading } =
    useGetBookingsSummary();

  // Show loading when actor is initialising or data is being fetched
  const kpiLoading =
    actorFetching || statsLoading || statsFetching || bookingsSummaryLoading;
  const jobListLoading = actorFetching || jobsLoading || jobsFetching;

  const recentJobs = jobs?.slice(0, 6) ?? [];

  return (
    <div className="space-y-8" data-ocid="dashboard.page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's an overview of your sports repair shop today.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="dashboard.section"
      >
        {kpiLoading ? (
          SKELETON_IDS.map((id) => (
            <Skeleton key={id} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Total Jobs"
              value={Number(stats?.totalCount ?? 0)}
              icon={<Briefcase className="h-5 w-5" />}
              tint="blue"
            />
            <KpiCard
              label="Pending"
              value={Number(stats?.pendingCount ?? 0)}
              icon={<Clock className="h-5 w-5" />}
              tint="amber"
            />
            <KpiCard
              label="In Progress"
              value={Number(stats?.inProgressCount ?? 0)}
              icon={<AlertCircle className="h-5 w-5" />}
              tint="purple"
            />
            <KpiCard
              label="Completed"
              value={Number(stats?.completedCount ?? 0)}
              icon={<CheckCircle2 className="h-5 w-5" />}
              tint="green"
            />
            <KpiCard
              label="New Bookings"
              value={Number(bookingsSummary?.pending ?? 0)}
              icon={<CalendarCheck className="h-5 w-5" />}
              tint="amber"
              sub="Pending online bookings"
            />
            <div className="col-span-1 lg:col-span-3">
              <KpiCard
                label="Total Revenue"
                value={`\u20b9 ${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                icon={<TrendingUp className="h-5 w-5" />}
                tint="green"
                sub="Total amount across all completed jobs"
              />
            </div>
          </>
        )}
      </div>

      {/* Recent Jobs */}
      <div data-ocid="dashboard.section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent Job Sheets</h2>
          <button
            type="button"
            onClick={onNavigateJobs}
            className="text-sm text-primary font-medium hover:underline"
            data-ocid="dashboard.link"
          >
            View all →
          </button>
        </div>
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {jobListLoading ? (
            <div className="p-4 space-y-3">
              {SKELETON_IDS.slice(0, 4).map((id) => (
                <Skeleton key={id} className="h-10" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div
              className="p-10 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.empty_state"
            >
              {jobs === undefined ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground/50" />
                  Loading your jobs... please wait.
                </>
              ) : (
                "No jobs yet. Create your first job sheet!"
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Shop / Person
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job, i) => (
                    <tr
                      key={String(job.createdAt)}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                      data-ocid={`dashboard.row.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{job.shopName}</div>
                        <div className="text-xs text-muted-foreground">
                          {job.personName}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs">{job.typeOfWork}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.jobStatus} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {job.dateOfJob}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{job.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onViewJob(job)}
                          className="text-primary text-xs font-medium hover:underline"
                          data-ocid="dashboard.link"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
