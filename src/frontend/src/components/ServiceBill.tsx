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

interface Props {
  job: JobWithId | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ServiceBill({ job, open, onOpenChange }: Props) {
  if (!job) return null;

  const balance = job.totalAmount - job.advancedAmount;
  // Bill number: last 6 digits of createdAt
  const billNo = String(job.createdAt).slice(-6);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  function buildBillWhatsApp() {
    const lines = [
      "🏸 *Sports Repair — Service Bill*",
      `Bill No: #${billNo}  |  Date: ${today}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "🏪 *Shop Details*",
      `Shop: ${job!.shopName}`,
      `Contact: ${job!.personName}`,
      `Mobile: ${job!.customerMobile}`,
    ];
    if (job!.place) lines.push(`Place: ${job!.place}`);
    lines.push("", "🛠️ *Service Details*", `Service: ${job!.typeOfWork}`);
    if (job!.modelName) lines.push(`Model: ${job!.modelName}`);
    lines.push(
      `No. of Rackets: ${job!.noOfRackets}`,
      `Service Charges: ₹${job!.serviceCharges.toLocaleString()}`,
    );
    if (job!.jobDescription) lines.push(`Notes: ${job!.jobDescription}`);
    lines.push(
      "",
      "💰 *Payment Summary*",
      `Service Charges: ₹${job!.serviceCharges.toLocaleString()}`,
      `Total Amount: ₹${job!.totalAmount.toLocaleString()}`,
      `Advanced Paid: ₹${job!.advancedAmount.toLocaleString()}`,
      `Balance Due: ₹${balance.toLocaleString()}`,
      `Payment Mode: ${job!.paymentMode}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "Thank you for your business! 🙏",
    );
    return lines.join("\n");
  }

  function handleWhatsApp() {
    let mobile = job!.customerMobile.replace(/[\s\-()]/g, "");
    if (!mobile.startsWith("+")) {
      if (mobile.startsWith("0")) mobile = mobile.slice(1);
      mobile = `91${mobile}`;
    } else {
      mobile = mobile.slice(1);
    }
    const text = encodeURIComponent(buildBillWhatsApp());
    window.open(`https://wa.me/${mobile}?text=${text}`, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0"
        data-ocid="service_bill.dialog"
      >
        {/* No-print: dialog header controls */}
        <div className="no-print">
          <DialogHeader className="px-6 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">
                Service Bill Preview
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground"
                data-ocid="service_bill.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* BILL CONTENT — print-friendly */}
        <div
          id="service-bill-print"
          className="px-6 py-5 space-y-5"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* Bill Header */}
          <div className="text-center border-2 border-primary rounded-xl p-4 bg-blue-50">
            <div className="text-3xl mb-1">🏸</div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">
              Sports Repair Shop
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Service Bill / Invoice
            </p>
            <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">
                Bill No: <span className="text-primary">#{billNo}</span>
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

          {/* Shop Details */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-primary px-4 py-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                🏪 Shop Details
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Shop Name</p>
                <p className="text-sm font-bold">{job.shopName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Person</p>
                <p className="text-sm font-bold">{job.personName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mobile No</p>
                <p className="text-sm font-bold">{job.customerMobile}</p>
              </div>
              {job.place && (
                <div>
                  <p className="text-xs text-muted-foreground">Place</p>
                  <p className="text-sm font-bold">{job.place}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Details Table */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-primary px-4 py-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                🛠️ Service Details
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b">
                  <th className="text-left px-4 py-2 text-xs font-bold text-muted-foreground">
                    #
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-muted-foreground">
                    Service
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-muted-foreground">
                    Model
                  </th>
                  <th className="text-center px-4 py-2 text-xs font-bold text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-bold text-muted-foreground">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">1</td>
                  <td className="px-4 py-3 font-semibold">{job.typeOfWork}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {job.modelName || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {String(job.noOfRackets)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    ₹{job.serviceCharges.toLocaleString()}
                  </td>
                </tr>
                {job.jobDescription && (
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2" />
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-xs text-muted-foreground italic"
                    >
                      Notes: {job.jobDescription}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  Service Charges
                </span>
                <span className="text-sm font-semibold">
                  ₹ {job.serviceCharges.toLocaleString()}
                </span>
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
                className={`flex justify-between px-5 py-3 ${balance > 0 ? "bg-amber-50" : "bg-green-50"}`}
              >
                <span
                  className={`text-sm font-bold ${balance > 0 ? "text-amber-700" : "text-green-700"}`}
                >
                  Balance Due
                </span>
                <span
                  className={`text-lg font-extrabold ${balance > 0 ? "text-amber-700" : "text-green-700"}`}
                >
                  ₹ {balance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between px-5 py-2.5">
                <span className="text-sm text-muted-foreground">
                  Payment Mode
                </span>
                <span className="text-sm font-semibold">{job.paymentMode}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-3 border-t-2 border-dashed border-muted">
            <p className="text-sm font-semibold text-muted-foreground">
              Thank you for your business! 🙏
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Please keep this bill for your records.
            </p>
          </div>
        </div>

        {/* Action Buttons — no print */}
        <div className="no-print px-6 pb-6 flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:opacity-90"
            onClick={handlePrint}
            data-ocid="service_bill.print_button"
          >
            <Printer className="h-4 w-4" />
            Print Bill
          </Button>
          <Button
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
            onClick={handleWhatsApp}
            data-ocid="service_bill.whatsapp_button"
          >
            <MessageCircle className="h-4 w-4" />
            Send via WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="service_bill.cancel_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
