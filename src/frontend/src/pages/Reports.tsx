import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, Printer } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useGetAllJobs } from "../hooks/useQueries";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function currentYear() {
  return new Date().getFullYear();
}

function yearRange() {
  const yr = currentYear();
  return Array.from({ length: 5 }, (_, i) => yr - i);
}

export function Reports() {
  const { data: jobs, isLoading } = useGetAllJobs();
  const printRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth()));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  // By Work Type
  const byWorkType = useMemo(() => {
    if (!jobs) return [];
    const map = new Map<string, { count: number; revenue: number }>();
    for (const j of jobs) {
      const key = j.typeOfWork || "Unknown";
      const prev = map.get(key) ?? { count: 0, revenue: 0 };
      map.set(key, {
        count: prev.count + 1,
        revenue: prev.revenue + j.totalAmount,
      });
    }
    return Array.from(map.entries())
      .map(([type, v]) => ({ type, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [jobs]);

  // By Payment Mode
  const byPaymentMode = useMemo(() => {
    if (!jobs) return [];
    const map = new Map<string, { count: number; collected: number }>();
    for (const j of jobs) {
      const key = j.paymentMode || "Unknown";
      const prev = map.get(key) ?? { count: 0, collected: 0 };
      map.set(key, {
        count: prev.count + 1,
        collected: prev.collected + j.advancedAmount,
      });
    }
    return Array.from(map.entries())
      .map(([mode, v]) => ({ mode, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [jobs]);

  // By Status
  const byStatus = useMemo(() => {
    if (!jobs) return [];
    const map = new Map<string, number>();
    for (const j of jobs) {
      const key = j.jobStatus || "Unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [jobs]);

  // Monthly Statement
  const monthlyJobs = useMemo(() => {
    if (!jobs) return [];
    const mIdx = Number.parseInt(selectedMonth, 10);
    const yr = Number.parseInt(selectedYear, 10);
    const prefix = `${yr}-${String(mIdx + 1).padStart(2, "0")}`;
    return jobs.filter((j) => j.dateOfJob.startsWith(prefix));
  }, [jobs, selectedMonth, selectedYear]);

  const monthlyTotals = useMemo(() => {
    return monthlyJobs.reduce(
      (acc, j) => ({
        count: acc.count + 1,
        total: acc.total + j.totalAmount,
        advanced: acc.advanced + j.advancedAmount,
        balance: acc.balance + (j.totalAmount - j.advancedAmount),
      }),
      { count: 0, total: 0, advanced: 0, balance: 0 },
    );
  }, [monthlyJobs]);

  function handlePrint() {
    window.print();
  }

  if (isLoading) {
    return (
      <div className="space-y-6" data-ocid="reports.loading_state">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      {/* Print styles injected inline */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #monthly-print-section,
          #monthly-print-section * { visibility: visible !important; }
          #monthly-print-section {
            position: fixed !important;
            top: 0; left: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="space-y-8" data-ocid="reports.page">
        {/* Page Header */}
        <div className="flex items-center gap-3 no-print">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Summary across all {jobs?.length ?? 0} jobs
            </p>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
          {/* By Work Type */}
          <Card className="rounded-xl shadow-card" data-ocid="reports.card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                By Work Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Work Type</TableHead>
                    <TableHead className="text-xs text-right">Jobs</TableHead>
                    <TableHead className="text-xs text-right">
                      Revenue (₹)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byWorkType.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground text-sm py-6"
                        data-ocid="reports.empty_state"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  ) : (
                    byWorkType.map((row, i) => (
                      <TableRow
                        key={row.type}
                        data-ocid={`reports.item.${i + 1}`}
                      >
                        <TableCell className="text-xs py-2.5 max-w-[140px]">
                          <span className="line-clamp-2">{row.type}</span>
                        </TableCell>
                        <TableCell className="text-xs text-right py-2.5 font-medium">
                          {row.count}
                        </TableCell>
                        <TableCell className="text-xs text-right py-2.5 font-semibold text-primary">
                          ₹{row.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* By Payment Mode */}
          <Card className="rounded-xl shadow-card" data-ocid="reports.card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                By Payment Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Mode</TableHead>
                    <TableHead className="text-xs text-right">Jobs</TableHead>
                    <TableHead className="text-xs text-right">
                      Collected (₹)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byPaymentMode.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground text-sm py-6"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  ) : (
                    byPaymentMode.map((row, i) => (
                      <TableRow
                        key={row.mode}
                        data-ocid={`reports.item.${i + 1}`}
                      >
                        <TableCell className="text-xs py-2.5">
                          {row.mode}
                        </TableCell>
                        <TableCell className="text-xs text-right py-2.5 font-medium">
                          {row.count}
                        </TableCell>
                        <TableCell className="text-xs text-right py-2.5 font-semibold text-accent">
                          ₹{row.collected.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* By Status */}
          <Card className="rounded-xl shadow-card" data-ocid="reports.card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                By Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byStatus.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground text-sm py-6"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  ) : (
                    byStatus.map((row, i) => (
                      <TableRow
                        key={row.status}
                        data-ocid={`reports.item.${i + 1}`}
                      >
                        <TableCell className="text-xs py-2.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : row.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-right py-2.5 font-bold">
                          {row.count}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Statement */}
        <div id="monthly-print-section" ref={printRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 no-print">
            <h2 className="text-lg font-bold">Monthly Statement</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-36" data-ocid="reports.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, idx) => (
                    <SelectItem key={m} value={String(idx)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24" data-ocid="reports.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearRange().map((yr) => (
                    <SelectItem key={yr} value={String(yr)}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handlePrint}
                data-ocid="reports.primary_button"
              >
                <Printer className="h-4 w-4" />
                Print Statement
              </Button>
            </div>
          </div>

          {/* Print Header — only visible when printing */}
          <div className="hidden print:block mb-4">
            <h1 className="text-xl font-bold">Sports Repair Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Monthly Statement — {MONTHS[Number.parseInt(selectedMonth, 10)]}{" "}
              {selectedYear}
            </p>
            <hr className="my-2" />
          </div>

          <Card className="rounded-xl shadow-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold">
                {MONTHS[Number.parseInt(selectedMonth, 10)]} {selectedYear} —{" "}
                <span className="text-primary">{monthlyJobs.length} jobs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {monthlyJobs.length === 0 ? (
                <div
                  className="py-14 text-center text-muted-foreground"
                  data-ocid="reports.empty_state"
                >
                  <BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-25" />
                  <p className="font-medium">No jobs for this month</p>
                  <p className="text-sm mt-1">
                    Select a different month or year.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">#</TableHead>
                        <TableHead className="text-xs">Shop / Person</TableHead>
                        <TableHead className="text-xs">Mobile</TableHead>
                        <TableHead className="text-xs">Service</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Payment</TableHead>
                        <TableHead className="text-xs text-right">
                          Total (₹)
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          Advanced (₹)
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          Balance (₹)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyJobs.map((job, i) => {
                        const balance = job.totalAmount - job.advancedAmount;
                        return (
                          <TableRow
                            key={String(job.createdAt)}
                            data-ocid={`reports.row.item.${i + 1}`}
                          >
                            <TableCell className="text-xs py-2.5 text-muted-foreground">
                              {i + 1}
                            </TableCell>
                            <TableCell className="text-xs py-2.5 font-medium">
                              <div>{job.shopName}</div>
                              <div className="text-muted-foreground">
                                {job.personName}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs py-2.5 text-muted-foreground">
                              {job.customerMobile}
                            </TableCell>
                            <TableCell className="text-xs py-2.5 max-w-[160px]">
                              <span className="line-clamp-2">
                                {job.typeOfWork}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs py-2.5 text-muted-foreground">
                              {job.dateOfJob}
                            </TableCell>
                            <TableCell className="text-xs py-2.5">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                  job.jobStatus === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : job.jobStatus === "In Progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {job.jobStatus}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs py-2.5">
                              {job.paymentMode}
                            </TableCell>
                            <TableCell className="text-xs py-2.5 text-right font-semibold">
                              ₹{job.totalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs py-2.5 text-right">
                              ₹{job.advancedAmount.toLocaleString()}
                            </TableCell>
                            <TableCell
                              className={`text-xs py-2.5 text-right font-semibold ${
                                balance > 0
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              ₹{balance.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* Totals row */}
                      <TableRow className="bg-muted/40 font-bold border-t-2">
                        <TableCell className="text-xs py-3" colSpan={7}>
                          <span className="font-bold">
                            TOTALS ({monthlyTotals.count} jobs)
                          </span>
                        </TableCell>
                        <TableCell className="text-xs py-3 text-right font-bold text-primary">
                          ₹{monthlyTotals.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs py-3 text-right font-bold">
                          ₹{monthlyTotals.advanced.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={`text-xs py-3 text-right font-bold ${
                            monthlyTotals.balance > 0
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          ₹{monthlyTotals.balance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
