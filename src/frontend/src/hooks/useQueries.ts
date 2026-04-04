import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { JobRecord } from "../backend.d";
import { useActor } from "./useActor";

// --- ID Registry (localStorage) ---
const JOB_ID_MAP_KEY = "srd_job_ids_v2";

function getJobIdMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(JOB_ID_MAP_KEY) || "{}");
  } catch {
    return {};
  }
}
function setJobIdMap(map: Record<string, string>) {
  localStorage.setItem(JOB_ID_MAP_KEY, JSON.stringify(map));
}
export function registerJobId(createdAt: bigint, jobId: bigint) {
  const map = getJobIdMap();
  map[String(createdAt)] = String(jobId);
  setJobIdMap(map);
}
export function lookupJobId(createdAt: bigint): bigint | null {
  const map = getJobIdMap();
  const val = map[String(createdAt)];
  return val ? BigInt(val) : null;
}

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
      const withIds: JobWithId[] = (jobs as unknown[]).map((job) => ({
        ...(job as JobRecord),
        jobCategory: inferCategory(job),
        _id: lookupJobId((job as JobRecord).createdAt),
      }));
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
    onSuccess: (returnedId, input) => {
      registerJobId(input.createdAt, returnedId);
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
