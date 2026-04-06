import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DeleteConfirm } from "../components/DeleteConfirm";
import { StatusBadge } from "../components/StatusBadge";
import type { JobWithId } from "../hooks/useQueries";
import { useDeleteJob, useGetAllJobs } from "../hooks/useQueries";

const WORK_TYPES = [
  "All Types",
  "Badminton Racket Repair",
  "Badminton Racket Handle",
  "Badminton Racket Restring",
  "Cricket Bat Repair",
  "Cricket Bat Binding",
];

const STATUSES = ["All Status", "Pending", "In Progress", "Completed"];
const SKELETON_IDS = ["a", "b", "c", "d", "e"];

interface Props {
  onNewJob: () => void;
  onViewJob: (job: JobWithId) => void;
  onEditJob: (job: JobWithId) => void;
  onPrintSheet: (job: JobWithId) => void;
}

export function JobsList({
  onNewJob,
  onViewJob,
  onEditJob,
  onPrintSheet,
}: Props) {
  const { data: jobs, isLoading } = useGetAllJobs();
  const deleteJob = useDeleteJob();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<JobWithId | null>(null);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    // Show jobs that are customer type OR have no shopName (legacy jobs before category was added)
    const customerJobs = jobs.filter(
      (j) =>
        j.jobCategory === "customer" ||
        (j.jobCategory !== "shop" && !j.shopName),
    );
    return customerJobs.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        j.shopName.toLowerCase().includes(q) ||
        j.personName.toLowerCase().includes(q) ||
        j.customerMobile.includes(search);
      const matchStatus =
        statusFilter === "All Status" || j.jobStatus === statusFilter;
      const matchType =
        typeFilter === "All Types" || j.typeOfWork === typeFilter;
      const matchFrom = !dateFrom || j.dateOfJob >= dateFrom;
      const matchTo = !dateTo || j.dateOfJob <= dateTo;
      return matchSearch && matchStatus && matchType && matchFrom && matchTo;
    });
  }, [jobs, search, statusFilter, typeFilter, dateFrom, dateTo]);

  // Count of all customer jobs (unfiltered)
  const totalCustomerJobs = useMemo(() => {
    if (!jobs) return 0;
    return jobs.filter(
      (j) =>
        j.jobCategory === "customer" ||
        (j.jobCategory !== "shop" && !j.shopName),
    ).length;
  }, [jobs]);

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "All Status" ||
    typeFilter !== "All Types" ||
    dateFrom !== "" ||
    dateTo !== "";

  function clearFilters() {
    setSearch("");
    setStatusFilter("All Status");
    setTypeFilter("All Types");
    setDateFrom("");
    setDateTo("");
  }

  async function handleDelete() {
    if (!deleteTarget || !deleteTarget._id) return;
    await deleteJob.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6" data-ocid="jobs.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Job Sheets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {filtered.length} of {totalCustomerJobs} jobs
          </p>
        </div>
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
          onClick={onNewJob}
          data-ocid="jobs.primary_button"
        >
          <Plus className="h-4 w-4" />
          Add New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="jobs.search_input"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40" data-ocid="jobs.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-52" data-ocid="jobs.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex items-end gap-2 flex-1">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
                data-ocid="jobs.input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
                data-ocid="jobs.input"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              data-ocid="jobs.secondary_button"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="jobs.loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-14" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="jobs.empty_state"
          >
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="jobs.table">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Pay Mode
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => (
                  <tr
                    key={String(job.createdAt)}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    data-ocid={`jobs.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">{job.personName}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.customerMobile}
                      </div>
                      {job.place && (
                        <div className="text-xs text-muted-foreground">
                          📍 {job.place}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs max-w-[180px] line-clamp-2 block">
                        {job.typeOfWork}
                      </span>
                      {job.modelName && (
                        <span className="text-xs text-muted-foreground">
                          {job.modelName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.jobStatus} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {job.dateOfJob}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs">{job.paymentMode}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold">
                        ₹{job.totalAmount.toLocaleString()}
                      </div>
                      {job.totalAmount - job.advancedAmount > 0 && (
                        <div className="text-xs text-amber-400">
                          Bal: ₹
                          {(
                            job.totalAmount - job.advancedAmount
                          ).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewJob(job)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="View"
                          data-ocid={`jobs.row.item.${i + 1}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintSheet(job)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="Print Job Sheet"
                          data-ocid={`jobs.secondary_button.${i + 1}`}
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditJob(job)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="Edit"
                          data-ocid={`jobs.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          title="Delete"
                          data-ocid={`jobs.delete_button.${i + 1}`}
                        >
                          {deleteJob.isPending &&
                          deleteJob.variables === job._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDelete}
        jobName={deleteTarget?.personName}
      />
    </div>
  );
}
