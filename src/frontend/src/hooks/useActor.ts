// Custom localStorage-based actor hook for CF Sports Repair
// The ICP backend is empty; all data is stored in localStorage.

export interface JobRecord {
  shopName: string;
  personName: string;
  customerMobile: string;
  place: string;
  typeOfWork: string;
  noOfRackets: bigint;
  modelName: string;
  jobDescription: string;
  paymentMode: string;
  serviceCharges: number;
  advancedAmount: number;
  totalAmount: number;
  jobStatus: string;
  dateOfJob: string;
  createdAt: bigint;
  jobCategory: string;
}

export interface JobWithIdRaw extends JobRecord {
  id: bigint;
}

export interface BookingRecord {
  customerName: string;
  customerMobile: string;
  serviceType: string;
  equipmentDetails: string;
  preferredDate: string;
  notes: string;
  bookingStatus: string;
  createdAt: bigint;
}

export interface BookingWithId extends BookingRecord {
  id: bigint;
}

interface SummaryStats {
  totalCount: bigint;
  pendingCount: bigint;
  inProgressCount: bigint;
  completedCount: bigint;
  totalRevenue: number;
}

interface BookingsSummary {
  total: bigint;
  pending: bigint;
  confirmed: bigint;
  inProgress: bigint;
  completed: bigint;
  cancelled: bigint;
}

const JOBS_KEY = "cf_sports_jobs";
const BOOKINGS_KEY = "cf_sports_bookings";
const JOB_COUNTER_KEY = "cf_sports_job_counter";
const BOOKING_COUNTER_KEY = "cf_sports_booking_counter";

function loadJobs(): JobWithIdRaw[] {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    return parsed.map((j) => ({
      ...(j as unknown as JobRecord),
      id: BigInt(j.id as string),
      noOfRackets: BigInt((j.noOfRackets as string) ?? "1"),
      createdAt: BigInt((j.createdAt as string) ?? "0"),
    }));
  } catch {
    return [];
  }
}

function saveJobs(jobs: JobWithIdRaw[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function nextJobId(): bigint {
  const current = Number.parseInt(
    localStorage.getItem(JOB_COUNTER_KEY) ?? "0",
    10,
  );
  const next = current + 1;
  localStorage.setItem(JOB_COUNTER_KEY, String(next));
  return BigInt(next);
}

function loadBookings(): BookingWithId[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    return parsed.map((b) => ({
      ...(b as unknown as BookingRecord),
      id: BigInt(b.id as string),
      createdAt: BigInt((b.createdAt as string) ?? "0"),
    }));
  } catch {
    return [];
  }
}

function saveBookings(bookings: BookingWithId[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function nextBookingId(): bigint {
  const current = Number.parseInt(
    localStorage.getItem(BOOKING_COUNTER_KEY) ?? "0",
    10,
  );
  const next = current + 1;
  localStorage.setItem(BOOKING_COUNTER_KEY, String(next));
  return BigInt(next);
}

const localActor = {
  getAllJobs(): Promise<JobWithIdRaw[]> {
    return Promise.resolve(loadJobs());
  },

  createJob(record: JobRecord): Promise<bigint> {
    const jobs = loadJobs();
    const id = nextJobId();
    jobs.push({ ...record, id });
    saveJobs(jobs);
    return Promise.resolve(id);
  },

  updateJob(id: bigint, record: JobRecord): Promise<void> {
    const jobs = loadJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx !== -1) {
      jobs[idx] = { ...record, id };
      saveJobs(jobs);
    }
    return Promise.resolve();
  },

  deleteJob(id: bigint): Promise<void> {
    const jobs = loadJobs();
    saveJobs(jobs.filter((j) => j.id !== id));
    return Promise.resolve();
  },

  getSummaryStats(): Promise<SummaryStats> {
    const jobs = loadJobs();
    const totalRevenue = jobs.reduce((sum, j) => sum + j.totalAmount, 0);
    return Promise.resolve({
      totalCount: BigInt(jobs.length),
      pendingCount: BigInt(
        jobs.filter((j) => j.jobStatus === "Pending").length,
      ),
      inProgressCount: BigInt(
        jobs.filter((j) => j.jobStatus === "In Progress").length,
      ),
      completedCount: BigInt(
        jobs.filter((j) => j.jobStatus === "Completed").length,
      ),
      totalRevenue,
    });
  },

  getAllBookings(): Promise<BookingWithId[]> {
    return Promise.resolve(loadBookings());
  },

  createBooking(record: BookingRecord): Promise<bigint> {
    const bookings = loadBookings();
    const id = nextBookingId();
    bookings.push({ ...record, id });
    saveBookings(bookings);
    return Promise.resolve(id);
  },

  updateBookingStatus(id: bigint, status: string): Promise<void> {
    const bookings = loadBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], bookingStatus: status };
      saveBookings(bookings);
    }
    return Promise.resolve();
  },

  getBookingsSummary(): Promise<BookingsSummary> {
    const bookings = loadBookings();
    return Promise.resolve({
      total: BigInt(bookings.length),
      pending: BigInt(
        bookings.filter((b) => b.bookingStatus === "pending").length,
      ),
      confirmed: BigInt(
        bookings.filter((b) => b.bookingStatus === "confirmed").length,
      ),
      inProgress: BigInt(
        bookings.filter((b) => b.bookingStatus === "in-progress").length,
      ),
      completed: BigInt(
        bookings.filter((b) => b.bookingStatus === "completed").length,
      ),
      cancelled: BigInt(
        bookings.filter((b) => b.bookingStatus === "cancelled").length,
      ),
    });
  },

  getBookingsByMobile(mobile: string): Promise<BookingWithId[]> {
    const bookings = loadBookings();
    return Promise.resolve(bookings.filter((b) => b.customerMobile === mobile));
  },
};

export function useActor() {
  return { actor: localActor, isFetching: false };
}
