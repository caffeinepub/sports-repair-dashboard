import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface JobWithId {
    id: bigint;
    jobCategory: string;
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
export interface BookingWithId {
    id: bigint;
    customerName: string;
    serviceType: string;
    createdAt: bigint;
    customerMobile: string;
    equipmentDetails: string;
    bookingStatus: string;
    preferredDate: string;
    notes: string;
}
export interface JobRecord {
    jobCategory: string;
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
export interface BookingRecord {
    customerName: string;
    serviceType: string;
    createdAt: bigint;
    customerMobile: string;
    equipmentDetails: string;
    bookingStatus: string;
    preferredDate: string;
    notes: string;
}
export interface backendInterface {
    createBooking(input: BookingRecord): Promise<bigint>;
    createJob(input: JobRecord): Promise<bigint>;
    deleteJob(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<BookingWithId>>;
    getAllJobs(): Promise<Array<JobWithId>>;
    getBookingsByMobile(mobile: string): Promise<Array<BookingWithId>>;
    getBookingsSummary(): Promise<{
        total: bigint;
        cancelled: bigint;
        pending: bigint;
        completed: bigint;
        confirmed: bigint;
        inProgress: bigint;
    }>;
    getJobById(id: bigint): Promise<JobRecord>;
    getJobsByCategory(category: string): Promise<Array<JobWithId>>;
    getSummaryStats(): Promise<{
        pendingCount: bigint;
        inProgressCount: bigint;
        totalCount: bigint;
        completedCount: bigint;
        totalRevenue: number;
    }>;
    updateBookingStatus(id: bigint, status: string): Promise<void>;
    updateJob(id: bigint, updatedJob: JobRecord): Promise<void>;
}
