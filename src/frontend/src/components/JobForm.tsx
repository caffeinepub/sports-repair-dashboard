import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { JobWithId } from "../hooks/useQueries";
import { useCreateJob, useUpdateJob } from "../hooks/useQueries";

const WORK_TYPES = [
  "Badminton Racket Repair",
  "Badminton Racket Handle",
  "Badminton Racket Restring",
  "Cricket Bat Repair",
  "Cricket Bat Binding",
];

const PAYMENT_MODES = ["Cash", "PhonePay", "Card"];
const JOB_STATUSES = ["Pending", "In Progress", "Completed"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editJob?: JobWithId | null;
}

interface FormState {
  shopName: string;
  personName: string;
  customerMobile: string;
  place: string;
  typeOfWork: string;
  noOfRackets: string;
  modelName: string;
  jobDescription: string;
  paymentMode: string;
  serviceCharges: string;
  advancedAmount: string;
  totalAmount: string;
  jobStatus: string;
  dateOfJob: string;
}

const empty: FormState = {
  shopName: "",
  personName: "",
  customerMobile: "",
  place: "",
  typeOfWork: "",
  noOfRackets: "1",
  modelName: "",
  jobDescription: "",
  paymentMode: "Cash",
  serviceCharges: "0",
  advancedAmount: "0",
  totalAmount: "0",
  jobStatus: "Pending",
  dateOfJob: new Date().toISOString().split("T")[0],
};

export function JobForm({ open, onOpenChange, editJob }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  useEffect(() => {
    if (open) {
      setErrors({});
      if (editJob) {
        setForm({
          shopName: editJob.shopName,
          personName: editJob.personName,
          customerMobile: editJob.customerMobile,
          place: editJob.place,
          typeOfWork: editJob.typeOfWork,
          noOfRackets: String(editJob.noOfRackets),
          modelName: editJob.modelName,
          jobDescription: editJob.jobDescription,
          paymentMode: editJob.paymentMode,
          serviceCharges: String(editJob.serviceCharges),
          advancedAmount: String(editJob.advancedAmount),
          totalAmount: String(editJob.totalAmount),
          jobStatus: editJob.jobStatus,
          dateOfJob: editJob.dateOfJob,
        });
      } else {
        setForm(empty);
      }
    }
  }, [open, editJob]);

  const adv = Number.parseFloat(form.advancedAmount) || 0;
  const total = Number.parseFloat(form.totalAmount) || 0;
  const svcCharges = Number.parseFloat(form.serviceCharges) || 0;
  const balance = total - adv;

  function set(k: keyof FormState, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.shopName.trim()) newErrors.shopName = "Shop name is required";
    if (!form.personName.trim())
      newErrors.personName = "Person name is required";
    if (!form.customerMobile.trim())
      newErrors.customerMobile = "Mobile number is required";
    if (!form.typeOfWork) newErrors.typeOfWork = "Please select a service type";
    if (!form.dateOfJob) newErrors.dateOfJob = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    try {
      const jobRecord = {
        shopName: form.shopName.trim(),
        personName: form.personName.trim(),
        customerMobile: form.customerMobile.trim(),
        place: form.place.trim(),
        typeOfWork: form.typeOfWork,
        noOfRackets: BigInt(Number.parseInt(form.noOfRackets) || 1),
        modelName: form.modelName.trim(),
        jobDescription: form.jobDescription.trim(),
        paymentMode: form.paymentMode,
        serviceCharges: svcCharges,
        advancedAmount: adv,
        totalAmount: total,
        jobStatus: form.jobStatus,
        dateOfJob: form.dateOfJob,
        createdAt: editJob ? editJob.createdAt : now,
      };
      if (editJob && editJob._id !== null) {
        await updateJob.mutateAsync({ id: editJob._id, job: jobRecord });
      } else {
        await createJob.mutateAsync(jobRecord);
      }
      onOpenChange(false);
    } catch {
      // Error toast is already shown by onError. Keep form open for retry.
    }
  }

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="job_form.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {editJob ? "Edit Job Sheet" : "Create New Job Sheet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Shop Details */}
          <div className="rounded-xl border bg-blue-50/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">
              🏪 Shop Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  data-ocid="job_form.input"
                  value={form.shopName}
                  onChange={(e) => set("shopName", e.target.value)}
                  placeholder="e.g. Champion Sports Store"
                  className={errors.shopName ? "border-red-500" : ""}
                />
                {errors.shopName && (
                  <p className="text-xs text-red-500">{errors.shopName}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="personName">Person Name *</Label>
                <Input
                  id="personName"
                  data-ocid="job_form.input"
                  value={form.personName}
                  onChange={(e) => set("personName", e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={errors.personName ? "border-red-500" : ""}
                />
                {errors.personName && (
                  <p className="text-xs text-red-500">{errors.personName}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerMobile">Mobile No *</Label>
                <Input
                  id="customerMobile"
                  data-ocid="job_form.input"
                  value={form.customerMobile}
                  onChange={(e) => set("customerMobile", e.target.value)}
                  placeholder="e.g. 9876543210"
                  className={errors.customerMobile ? "border-red-500" : ""}
                />
                {errors.customerMobile && (
                  <p className="text-xs text-red-500">
                    {errors.customerMobile}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="place">Place / Location</Label>
                <Input
                  id="place"
                  data-ocid="job_form.input"
                  value={form.place}
                  onChange={(e) => set("place", e.target.value)}
                  placeholder="e.g. Bangalore, Koramangala"
                />
              </div>
            </div>
          </div>

          {/* Section: Service Details */}
          <div className="rounded-xl border bg-green-50/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">
              🏸 Service Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type of Service *</Label>
                <Select
                  value={form.typeOfWork}
                  onValueChange={(v) => set("typeOfWork", v)}
                >
                  <SelectTrigger
                    data-ocid="job_form.select"
                    className={errors.typeOfWork ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_TYPES.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOfWork && (
                  <p className="text-xs text-red-500">{errors.typeOfWork}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateOfJob">Date of Job *</Label>
                <Input
                  id="dateOfJob"
                  data-ocid="job_form.input"
                  type="date"
                  value={form.dateOfJob}
                  onChange={(e) => set("dateOfJob", e.target.value)}
                  className={errors.dateOfJob ? "border-red-500" : ""}
                />
                {errors.dateOfJob && (
                  <p className="text-xs text-red-500">{errors.dateOfJob}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="noOfRackets">No. of Rackets</Label>
                <Input
                  id="noOfRackets"
                  data-ocid="job_form.input"
                  type="number"
                  min="1"
                  value={form.noOfRackets}
                  onChange={(e) => set("noOfRackets", e.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modelName">Racket Model Name</Label>
                <Input
                  id="modelName"
                  data-ocid="job_form.input"
                  value={form.modelName}
                  onChange={(e) => set("modelName", e.target.value)}
                  placeholder="e.g. Yonex Astrox 99, Li-Ning N9"
                />
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="jobDescription">Job Notes / Description</Label>
            <Textarea
              id="jobDescription"
              data-ocid="job_form.textarea"
              value={form.jobDescription}
              onChange={(e) => set("jobDescription", e.target.value)}
              placeholder="Describe the work needed, string type, tension, special instructions..."
              rows={3}
            />
          </div>

          {/* Section: Payment */}
          <div className="rounded-xl border bg-amber-50/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
              💰 Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Payment Mode</Label>
                <Select
                  value={form.paymentMode}
                  onValueChange={(v) => set("paymentMode", v)}
                >
                  <SelectTrigger data-ocid="job_form.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="serviceCharges">Service Charges (₹)</Label>
                <Input
                  id="serviceCharges"
                  data-ocid="job_form.input"
                  type="number"
                  min="0"
                  value={form.serviceCharges}
                  onChange={(e) => set("serviceCharges", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="advancedAmount">Advanced Paid (₹)</Label>
                <Input
                  id="advancedAmount"
                  data-ocid="job_form.input"
                  type="number"
                  min="0"
                  value={form.advancedAmount}
                  onChange={(e) => set("advancedAmount", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                <Input
                  id="totalAmount"
                  data-ocid="job_form.input"
                  type="number"
                  min="0"
                  value={form.totalAmount}
                  onChange={(e) => set("totalAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label>Balance Amount (₹)</Label>
                <div
                  className={`flex h-9 w-full rounded-md border px-3 py-1.5 text-sm font-semibold items-center ${
                    balance > 0
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-green-300 bg-green-50 text-green-700"
                  }`}
                >
                  ₹ {balance.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Job Status</Label>
                <Select
                  value={form.jobStatus}
                  onValueChange={(v) => set("jobStatus", v)}
                >
                  <SelectTrigger data-ocid="job_form.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="job_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="job_form.submit_button"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isPending ? "Saving..." : editJob ? "Update Job" : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
