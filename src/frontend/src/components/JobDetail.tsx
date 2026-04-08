import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle,
  Copy,
  FileText,
  Loader2,
  MessageCircle,
  Pencil,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import type { JobWithId } from "../hooks/useQueries";
import { useUpdateJob } from "../hooks/useQueries";
import { StatusBadge } from "./StatusBadge";

interface Props {
  job: JobWithId | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEdit: (job: JobWithId) => void;
  onGenerateBill: (job: JobWithId) => void;
  onCustomerSheet: (job: JobWithId) => void;
}

function buildShareText(j: JobWithId): string {
  const balanceAmt = j.totalAmount - j.advancedAmount;
  const statusEmoji =
    j.jobStatus === "Completed"
      ? "✅"
      : j.jobStatus === "In Progress"
        ? "🔧"
        : "⏳";

  const isCustomer = j.jobCategory === "customer";

  const lines = ["🏸 *CF Sports Repair*", "━━━━━━━━━━━━━━━━━━━━", ""];

  if (isCustomer) {
    lines.push(
      "👤 *Customer Details*",
      `Customer Name: ${j.personName}`,
      `Mobile: ${j.customerMobile}`,
    );
  } else {
    lines.push(
      "🏪 *Shop Details*",
      `Shop: ${j.shopName}`,
      `Contact: ${j.personName}`,
      `Mobile: ${j.customerMobile}`,
    );
    if (j.place) lines.push(`Place: ${j.place}`);
  }

  lines.push("", "🛠️ *Service Details*", `Service: ${j.typeOfWork}`);
  if (j.modelName) lines.push(`Model: ${j.modelName}`);
  lines.push(
    `No. of Rackets: ${j.noOfRackets}`,
    `Date: ${j.dateOfJob}`,
    `Status: ${statusEmoji} ${j.jobStatus}`,
  );
  if (j.jobDescription) lines.push(`Notes: ${j.jobDescription}`);
  lines.push(
    "",
    "💰 *Payment Summary*",
    `Service Charges: ₹${j.serviceCharges.toLocaleString()}`,
    `Total Amount: ₹${j.totalAmount.toLocaleString()}`,
    `Advanced Paid: ₹${j.advancedAmount.toLocaleString()}`,
    `Balance Due: ₹${balanceAmt.toLocaleString()}`,
    `Payment Mode: ${j.paymentMode}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "Thank you for your business! 🙏",
  );
  return lines.join("\n");
}

export function JobDetail({
  job,
  open,
  onOpenChange,
  onEdit,
  onGenerateBill,
  onCustomerSheet,
}: Props) {
  const updateJob = useUpdateJob();

  if (!job) return null;

  // Capture as a non-nullable local so handlers don't need null assertions
  const currentJob: JobWithId = job;
  const balance = currentJob.totalAmount - currentJob.advancedAmount;
  const isCustomer = currentJob.jobCategory === "customer";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildShareText(currentJob));
      toast.success("Job details copied! Paste to share via WhatsApp.");
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  }

  function handleWhatsApp() {
    let mobile = currentJob.customerMobile.replace(/[\s\-()]/g, "");
    if (!mobile.startsWith("+")) {
      if (mobile.startsWith("0")) mobile = mobile.slice(1);
      mobile = `91${mobile}`;
    } else {
      mobile = mobile.slice(1);
    }
    const text = encodeURIComponent(buildShareText(currentJob));
    window.open(`https://wa.me/${mobile}?text=${text}`, "_blank");
  }

  async function handleMarkComplete() {
    if (currentJob._id === null) {
      toast.error("Cannot update: job ID not found.");
      return;
    }
    const jobId = currentJob._id;
    const { _id: _ignored, ...jobRecord } = currentJob;
    await updateJob.mutateAsync({
      id: jobId,
      job: { ...jobRecord, jobStatus: "Completed" },
    });
    onOpenChange(false);
  }

  function handlePrintSheet() {
    if (isCustomer) {
      onCustomerSheet(currentJob);
    } else {
      onGenerateBill(currentJob);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
        data-ocid="job_detail.sheet"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg font-bold">
            Job Sheet Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Customer / Shop Info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {isCustomer ? "Customer Information" : "Shop Information"}
            </h3>
            <div
              className={`rounded-xl p-4 space-y-2 ${
                isCustomer ? "bg-blue-50" : "bg-green-50"
              }`}
            >
              {isCustomer ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer Name
                    </span>
                    <span className="text-sm font-semibold">
                      {currentJob.personName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Mobile No
                    </span>
                    <span className="text-sm font-semibold">
                      {currentJob.customerMobile}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shop Name
                    </span>
                    <span className="text-sm font-semibold">
                      {currentJob.shopName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Contact Person
                    </span>
                    <span className="text-sm font-semibold">
                      {currentJob.personName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Mobile
                    </span>
                    <span className="text-sm font-semibold">
                      {currentJob.customerMobile}
                    </span>
                  </div>
                  {currentJob.place && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Place
                      </span>
                      <span className="text-sm font-semibold">
                        {currentJob.place}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Job Info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Service Details
            </h3>
            <div className="bg-card border rounded-xl p-4 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm text-muted-foreground">
                  Type of Service
                </span>
                <span className="text-sm font-semibold text-right max-w-[55%]">
                  {currentJob.typeOfWork}
                </span>
              </div>
              {currentJob.modelName && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Model Name
                  </span>
                  <span className="text-sm font-semibold">
                    {currentJob.modelName}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  No. of Rackets
                </span>
                <span className="text-sm font-semibold">
                  {String(currentJob.noOfRackets)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={currentJob.jobStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-semibold">
                  {currentJob.dateOfJob}
                </span>
              </div>
              {currentJob.jobDescription && (
                <div>
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <p className="text-sm mt-1 text-foreground bg-muted/40 rounded-lg p-2.5">
                    {currentJob.jobDescription}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Payment Summary */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Payment Summary
            </h3>
            <div className="rounded-xl border shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-3.5 bg-card">
                <span className="text-sm text-muted-foreground">
                  Payment Mode
                </span>
                <span className="text-sm font-semibold">
                  {currentJob.paymentMode}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center p-3.5 bg-card">
                <span className="text-sm text-muted-foreground">
                  Service Charges
                </span>
                <span className="text-sm font-bold">
                  ₹ {currentJob.serviceCharges.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center p-3.5 bg-card">
                <span className="text-sm text-muted-foreground">
                  Total Amount
                </span>
                <span className="text-sm font-bold">
                  ₹ {currentJob.totalAmount.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center p-3.5 bg-green-50">
                <span className="text-sm text-green-700">Advanced Paid</span>
                <span className="text-sm font-bold text-green-700">
                  ₹ {currentJob.advancedAmount.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div
                className={`flex justify-between items-center p-3.5 ${
                  balance > 0 ? "bg-amber-50" : "bg-green-50"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    balance > 0 ? "text-amber-700" : "text-green-700"
                  }`}
                >
                  Balance Due
                </span>
                <span
                  className={`text-base font-extrabold ${
                    balance > 0 ? "text-amber-700" : "text-green-700"
                  }`}
                >
                  ₹ {balance.toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="col-span-2 gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold"
              onClick={handleWhatsApp}
              data-ocid="job_detail.whatsapp_button"
            >
              <MessageCircle className="h-4 w-4" />
              Send via WhatsApp
            </Button>
            <Button
              className="col-span-2 gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold"
              onClick={handlePrintSheet}
              data-ocid="job_detail.open_modal_button"
            >
              {isCustomer ? (
                <>
                  <Printer className="h-4 w-4" />
                  Print Job Sheet
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Service Bill
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleCopy}
              data-ocid="job_detail.copy_button"
            >
              <Copy className="h-4 w-4" />
              Copy Details
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                onOpenChange(false);
                onEdit(currentJob);
              }}
              data-ocid="job_detail.edit_button"
            >
              <Pencil className="h-4 w-4" />
              Edit Job
            </Button>
            {currentJob.jobStatus !== "Completed" && (
              <Button
                className="gap-2 col-span-2 bg-accent text-accent-foreground hover:opacity-90"
                onClick={handleMarkComplete}
                disabled={updateJob.isPending}
                data-ocid="job_detail.confirm_button"
              >
                {updateJob.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
