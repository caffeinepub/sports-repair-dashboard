import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Printer, X } from "lucide-react";
import type { JobWithId } from "../hooks/useQueries";
import { StatusBadge } from "./StatusBadge";

interface Props {
  job: JobWithId | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  serialNo?: number;
}

function buildCustomerShareText(j: JobWithId, jobNo: string): string {
  const balanceAmt = j.totalAmount - j.advancedAmount;
  const statusEmoji =
    j.jobStatus === "Completed"
      ? "✅"
      : j.jobStatus === "In Progress"
        ? "🔧"
        : "⏳";
  const lines = [
    "🏸 *Sports Repair Shop*",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `*Job No: #${jobNo}*`,
    "",
    "👤 *Customer Details*",
    `Customer Name: ${j.personName}`,
    `Mobile No: ${j.customerMobile}`,
  ];
  lines.push("", "🛠️ *Service Details*", `Service: ${j.typeOfWork}`);
  lines.push(`Date: ${j.dateOfJob}`, `Status: ${statusEmoji} ${j.jobStatus}`);
  if (j.jobDescription) lines.push(`Notes: ${j.jobDescription}`);
  lines.push(
    "",
    "💰 *Payment Summary*",
    `Total Amount: ₹${j.totalAmount.toLocaleString()}`,
    `Advanced Paid: ₹${j.advancedAmount.toLocaleString()}`,
    `Balance Due: ₹${balanceAmt.toLocaleString()}`,
    `Payment Mode: ${j.paymentMode}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "Thank you for visiting Sports Repair Shop! 🙏",
  );
  return lines.join("\n");
}

/**
 * Format a job number as a zero-padded 4-digit string.
 * e.g. 1 → "0001", 42 → "0042", 1234 → "1234", 10000 → "10000"
 */
function formatJobNo(id: bigint | null, serialNo?: number): string {
  // If we have a real backend ID (any bigint including 0), use it zero-padded
  if (id !== null && id !== undefined) {
    return String(id).padStart(4, "0");
  }
  // Fall back to serial number if available
  if (serialNo != null) {
    return String(serialNo).padStart(4, "0");
  }
  return "0001";
}

export function CustomerJobSheet({ job, open, onOpenChange, serialNo }: Props) {
  if (!job) return null;

  const balance = job.totalAmount - job.advancedAmount;
  // Build the display job number — uses backend ID when available (any value including 0)
  const jobNo = formatJobNo(job._id, serialNo);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  function handleWhatsApp() {
    let mobile = job!.customerMobile.replace(/[\s\-()]/g, "");
    if (!mobile.startsWith("+")) {
      if (mobile.startsWith("0")) mobile = mobile.slice(1);
      mobile = `91${mobile}`;
    } else {
      mobile = mobile.slice(1);
    }
    const text = encodeURIComponent(buildCustomerShareText(job!, jobNo));
    window.open(`https://wa.me/${mobile}?text=${text}`, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0"
        data-ocid="customer_sheet.dialog"
      >
        {/* No-print: dialog header controls */}
        <div className="no-print">
          <DialogHeader className="px-6 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">
                Customer Job Sheet
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground"
                data-ocid="customer_sheet.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* JOB SHEET CONTENT — print-friendly */}
        <div
          id="customer-job-sheet-print"
          className="px-6 py-5 space-y-5"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* Header */}
          <div className="text-center border-2 border-primary rounded-xl p-4 bg-blue-50">
            <div className="text-3xl mb-1">🏸</div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">
              Sports Repair Shop
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Customer Job Sheet
            </p>
            <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">
                Job No: <span className="text-primary">#{jobNo}</span>
              </span>
              <span className="font-semibold">
                Date: <span className="text-foreground">{today}</span>
              </span>
              <span className="font-semibold">
                Job Date:{" "}
                <span className="text-foreground">{job.dateOfJob}</span>
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-primary px-4 py-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                👤 Customer Details
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Customer Name</p>
                <p className="text-sm font-bold">{job.personName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mobile No</p>
                <p className="text-sm font-bold">{job.customerMobile}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-primary px-4 py-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                🛠️ Service Details
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Type of Work</p>
                  <p className="text-sm font-bold">{job.typeOfWork}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Job</p>
                  <p className="text-sm font-bold">{job.dateOfJob}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={job.jobStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job No.</p>
                  <p className="text-sm font-bold text-primary">#{jobNo}</p>
                </div>
              </div>
              {job.jobDescription && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">
                    Job Description / Notes
                  </p>
                  <p className="text-sm bg-muted/40 rounded-lg p-2.5">
                    {job.jobDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-primary px-4 py-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                💰 Payment Summary
              </h2>
            </div>
            <div className="divide-y">
              <div className="flex justify-between px-5 py-2.5">
                <span className="text-sm text-muted-foreground">
                  Payment Mode
                </span>
                <span className="text-sm font-semibold">{job.paymentMode}</span>
              </div>
              <div className="flex justify-between px-5 py-2.5">
                <span className="text-sm text-muted-foreground">
                  Total Amount
                </span>
                <span className="text-sm font-bold">
                  ₹ {job.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between px-5 py-2.5 bg-green-50">
                <span className="text-sm text-green-700">Advanced Paid</span>
                <span className="text-sm font-bold text-green-700">
                  ₹ {job.advancedAmount.toLocaleString()}
                </span>
              </div>
              <div
                className={`flex justify-between px-5 py-3 ${
                  balance > 0 ? "bg-amber-50" : "bg-green-50"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    balance > 0 ? "text-amber-700" : "text-green-700"
                  }`}
                >
                  Balance Due
                </span>
                <span
                  className={`text-lg font-extrabold ${
                    balance > 0 ? "text-amber-700" : "text-green-700"
                  }`}
                >
                  ₹ {balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Signature / Footer */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="text-center">
              <div className="border-b-2 border-dashed border-muted-foreground/30 mb-1 h-10" />
              <p className="text-xs text-muted-foreground">
                Customer Signature
              </p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-dashed border-muted-foreground/30 mb-1 h-10" />
              <p className="text-xs text-muted-foreground">
                Authorized Signature
              </p>
            </div>
          </div>

          <Separator />

          {/* Footer message */}
          <div className="text-center py-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Thank you for visiting Sports Repair Shop! 🙏
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Please keep this job sheet for your records.
            </p>
          </div>
        </div>

        {/* Action Buttons — no print */}
        <div className="no-print px-6 pb-6 flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:opacity-90"
            onClick={handlePrint}
            data-ocid="customer_sheet.print_button"
          >
            <Printer className="h-4 w-4" />
            Print Job Sheet
          </Button>
          <Button
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
            onClick={handleWhatsApp}
            data-ocid="customer_sheet.whatsapp_button"
          >
            <MessageCircle className="h-4 w-4" />
            Send via WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="customer_sheet.cancel_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
