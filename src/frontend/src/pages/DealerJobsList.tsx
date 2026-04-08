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
  Building2,
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
  onNewDealerJob: () => void;
  onViewJob: (job: JobWithId) => void;
  onEditJob: (job: JobWithId) => void;
  onPrintSheet: (job: JobWithId) => void;
}

export function DealerJobsList({
  onNewDealerJob,
  onViewJob,
  onEditJob,
  onPrintSheet,
}: Props) {
  const { data: allJobs, isLoading } = useGetAllJobs();
  const deleteJob = useDeleteJob();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dealerFilter, setDealerFilter] = useState("All Dealers");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<JobWithId | null>(null);

  // Full dealer job list (unfiltered)
  const allDealerJobs = useMemo(() => {
    if (!allJobs) return [];
    return allJobs.filter((j) => j.jobCategory === "dealer");
  }, [allJobs]);

  // Unique dealer names for the filter dropdown
  const dealerNames = useMemo(() => {
    const names = Array.from(
      new Set(allDealerJobs.map((j) => j.shopName).filter(Boolean)),
    ).sort();
    return ["All Dealers", ...names];
  }, [allDealerJobs]);

  const filtered = useMemo(() => {
    return allDealerJobs.filter((j) => {
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
      const matchDealer =
        dealerFilter === "All Dealers" || j.shopName === dealerFilter;
      const matchFrom = !dateFrom || j.dateOfJob >= dateFrom;
      const matchTo = !dateTo || j.dateOfJob <= dateTo;
      return (
        matchSearch &&
        matchStatus &&
        matchType &&
        matchDealer &&
        matchFrom &&
        matchTo
      );
    });
  }, [
    allDealerJobs,
    search,
    statusFilter,
    typeFilter,
    dealerFilter,
    dateFrom,
    dateTo,
  ]);

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "All Status" ||
    typeFilter !== "All Types" ||
    dealerFilter !== "All Dealers" ||
    dateFrom !== "" ||
    dateTo !== "";

  function clearFilters() {
    setSearch("");
    setStatusFilter("All Status");
    setTypeFilter("All Types");
    setDealerFilter("All Dealers");
    setDateFrom("");
    setDateTo("");
  }

  // Get stable serial number from full dealer jobs list
  function getSerialNo(job: JobWithId): number {
    const idx = allDealerJobs.findIndex(
      (j) => j._id === job._id && j.createdAt === job.createdAt,
    );
    return idx + 1;
  }

  async function handleDelete() {
    if (!deleteTarget || !deleteTarget._id) return;
    await deleteJob.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6" data-ocid="dealers.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Dealer Jobs</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 ml-10">
            {filtered.length} of {allDealerJobs.length} dealer jobs
          </p>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onNewDealerJob}
          data-ocid="dealers.primary_button"
        >
          <Plus className="h-4 w-4" />
          New Dealer Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by dealer, contact or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="dealers.search_input"
            />
          </div>
          <Select value={dealerFilter} onValueChange={setDealerFilter}>
            <SelectTrigger
              className="w-full sm:w-48"
              data-ocid="dealers.dealer_filter_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dealerNames.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-full sm:w-40"
              data-ocid="dealers.status_select"
            >
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
            <SelectTrigger
              className="w-full sm:w-52"
              data-ocid="dealers.type_select"
            >
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
                data-ocid="dealers.date_from_input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
                data-ocid="dealers.date_to_input"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              data-ocid="dealers.clear_filters_button"
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
          <div className="p-4 space-y-3" data-ocid="dealers.loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-14" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="dealers.empty_state"
          >
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No dealer jobs found</p>
            <p className="text-sm mt-1">
              {allDealerJobs.length === 0
                ? 'Create your first dealer job using the "New Dealer Job" button.'
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="dealers.table">
              <thead>
                <tr className="border-b bg-blue-500/10">
                  <th className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400 w-12">
                    Sr.
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Dealer / Contact
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400 hidden md:table-cell">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400 hidden sm:table-cell">
                    Rackets
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => {
                  const srNo = getSerialNo(job);
                  return (
                    <tr
                      key={String(job._id ?? job.createdAt)}
                      className="border-b last:border-0 hover:bg-blue-500/5 transition-colors"
                      data-ocid={`dealers.item.${srNo}`}
                    >
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold">
                          {srNo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-blue-300">
                          {job.shopName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.personName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.customerMobile}
                        </div>
                        {job.place && (
                          <div className="text-xs text-muted-foreground italic">
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
                        <span className="text-xs font-medium">
                          {String(job.noOfRackets)} pcs
                        </span>
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
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                            title="View"
                            data-ocid={`dealers.view_button.${srNo}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrintSheet(job)}
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                            title="Print Dealer Bill"
                            data-ocid={`dealers.print_button.${srNo}`}
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditJob(job)}
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                            title="Edit"
                            data-ocid={`dealers.edit_button.${srNo}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(job)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Delete"
                            data-ocid={`dealers.delete_button.${srNo}`}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDelete}
        jobName={deleteTarget?.shopName}
      />
    </div>
  );
}
