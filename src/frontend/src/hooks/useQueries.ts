import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type BookingRecord, type JobRecord, useActor } from "./useActor";

export type JobWithId = JobRecord & { _id: bigint | null };

// Legacy jobs from the backend may not have jobCategory; infer it from shopName.
function inferCategory(job: unknown): string {
  const j = job as { jobCategory?: string; shopName?: string };
  if (j.jobCategory) return j.jobCategory;
  return j.shopName ? "shop" : "customer";
}

export function useGetAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<JobWithId[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      const jobs = await actor.getAllJobs();
      const withIds: JobWithId[] = (jobs as unknown[]).map((job) => {
        const j = job as Record<string, unknown>;
        // The Candid decoder returns id as a bigint. We must extract it explicitly
        // before spreading, as TypeScript types may not expose it.
        const rawId = j.id;
        const resolvedId: bigint | null =
          rawId !== undefined && rawId !== null
            ? BigInt(rawId as bigint)
            : null;
        return {
          ...(j as unknown as JobRecord),
          jobCategory: inferCategory(j),
          // Store the real backend ID - works on any device/browser
          _id: resolvedId,
        };
      });
      return withIds.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSummaryStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["summaryStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSummaryStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.createJob(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["summaryStats"] });
      toast.success("Job created successfully!");
    },
    onError: () => toast.error("Failed to create job."),
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, job }: { id: bigint; job: JobRecord }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateJob(id, job);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["summaryStats"] });
      toast.success("Job updated successfully!");
    },
    onError: () => toast.error("Failed to update job."),
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteJob(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["summaryStats"] });
      toast.success("Job deleted.");
    },
    onError: () => toast.error("Failed to delete job."),
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingsSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookingsSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBookingsSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BookingRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.createBooking(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["bookingsSummary"] });
    },
    onError: () => toast.error("Failed to submit booking."),
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["bookingsSummary"] });
      toast.success("Booking status updated!");
    },
    onError: () => toast.error("Failed to update booking status."),
  });
}
