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
  Store,
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
  onNewShopJob: () => void;
  onViewJob: (job: JobWithId) => void;
  onEditJob: (job: JobWithId) => void;
  onPrintSheet: (job: JobWithId) => void;
}

export function ShopJobsList({
  onNewShopJob,
  onViewJob,
  onEditJob,
  onPrintSheet,
}: Props) {
  const { data: allJobs, isLoading } = useGetAllJobs();
  const deleteJob = useDeleteJob();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<JobWithId | null>(null);

  // Filter to shop-type jobs only using the jobCategory stored on the backend
  const shopJobs = useMemo(() => {
    if (!allJobs) return [];
    return allJobs.filter(
      (j) =>
        j.jobCategory === "shop" ||
        (j.jobCategory !== "customer" && !!j.shopName),
    );
  }, [allJobs]);

  const filtered = useMemo(() => {
    return shopJobs.filter((j) => {
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
  }, [shopJobs, search, statusFilter, typeFilter, dateFrom, dateTo]);

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
    <div className="space-y-6" data-ocid="shopjobs.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Sports Shop Jobs</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 ml-10">
            {filtered.length} of {shopJobs.length} shop jobs
          </p>
        </div>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={onNewShopJob}
          data-ocid="shopjobs.primary_button"
        >
          <Plus className="h-4 w-4" />
          New Shop Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by shop, person or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="shopjobs.search_input"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-full sm:w-40"
              data-ocid="shopjobs.select"
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
              data-ocid="shopjobs.select"
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
                data-ocid="shopjobs.input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
                data-ocid="shopjobs.input"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              data-ocid="shopjobs.secondary_button"
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
          <div className="p-4 space-y-3" data-ocid="shopjobs.loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-14" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="shopjobs.empty_state"
          >
            <Store className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No shop jobs found</p>
            <p className="text-sm mt-1">
              {shopJobs.length === 0
                ? 'Create your first shop job using the "New Shop Job" button.'
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="shopjobs.table">
              <thead>
                <tr className="border-b bg-green-50/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700">
                    Shop / Person
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700 hidden md:table-cell">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700 hidden sm:table-cell">
                    Rackets
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-green-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => (
                  <tr
                    key={String(job.createdAt)}
                    className="border-b last:border-0 hover:bg-green-50/20 transition-colors"
                    data-ocid={`shopjobs.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-green-800">
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
                        <div className="text-xs text-amber-600">
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
                          className="p-1.5 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
                          title="View"
                          data-ocid={`shopjobs.row.item.${i + 1}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintSheet(job)}
                          className="p-1.5 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
                          title="Print Service Bill"
                          data-ocid={`shopjobs.secondary_button.${i + 1}`}
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditJob(job)}
                          className="p-1.5 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
                          title="Edit"
                          data-ocid={`shopjobs.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-destructive transition-colors"
                          title="Delete"
                          data-ocid={`shopjobs.delete_button.${i + 1}`}
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
        jobName={deleteTarget?.shopName}
      />
    </div>
  );
}
