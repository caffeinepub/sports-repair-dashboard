import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface JobRecord {
    noOfRackets: bigint;
    dateOfJob: string;
    advancedAmount: number;
    serviceCharges: number;
    jobDescription: string;
    createdAt: bigint;
    jobStatus: string;
    customerMobile: string;
    personName: string;
    totalAmount: number;
    modelName: string;
    shopName: string;
    paymentMode: string;
    place: string;
    typeOfWork: string;
}
export interface backendInterface {
    createJob(input: JobRecord): Promise<bigint>;
    deleteJob(id: bigint): Promise<void>;
    getAllJobs(): Promise<Array<JobRecord>>;
    getJobById(id: bigint): Promise<JobRecord>;
    getSummaryStats(): Promise<{
        pendingCount: bigint;
        inProgressCount: bigint;
        totalCount: bigint;
        completedCount: bigint;
        totalRevenue: number;
    }>;
    updateJob(id: bigint, updatedJob: JobRecord): Promise<void>;
}
