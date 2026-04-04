import { createActorWithConfig } from "../config";
import { registerJobId } from "../hooks/useQueries";

const SEED_KEY = "sports_repair_seeded_v2";

const sampleJobs = [
  {
    shopName: "Champion Sports Store",
    personName: "Rahul Sharma",
    customerMobile: "9876543210",
    place: "Bangalore, Koramangala",
    typeOfWork: "Badminton Racket Restring",
    noOfRackets: 2,
    modelName: "Yonex Astrox 99",
    jobDescription:
      "Restring with BG65 Yonex at 28lbs tension. Grip replacement also needed.",
    paymentMode: "Cash",
    serviceCharges: 300,
    advancedAmount: 200,
    totalAmount: 500,
    jobStatus: "Pending",
    dateOfJob: "2026-03-28",
  },
  {
    shopName: "Victory Sports",
    personName: "Priya Patel",
    customerMobile: "9812345678",
    place: "Chennai, Anna Nagar",
    typeOfWork: "Broken Badminton Racket Repair",
    noOfRackets: 1,
    modelName: "Li-Ning N9",
    jobDescription:
      "Frame cracked near T-joint. Customer wants full repair if possible.",
    paymentMode: "PhonePay",
    serviceCharges: 800,
    advancedAmount: 0,
    totalAmount: 800,
    jobStatus: "Completed",
    dateOfJob: "2026-03-25",
  },
  {
    shopName: "Star Cricket Hub",
    personName: "Arjun Kumar",
    customerMobile: "9988776655",
    place: "Mumbai, Andheri",
    typeOfWork: "Cricket Bat Repair",
    noOfRackets: 1,
    modelName: "MRF Genius",
    jobDescription:
      "Bat face has deep cracks. Needs sanding, filling and oiling. Handle is loose.",
    paymentMode: "Card",
    serviceCharges: 700,
    advancedAmount: 500,
    totalAmount: 1200,
    jobStatus: "In Progress",
    dateOfJob: "2026-03-29",
  },
  {
    shopName: "Sports Kingdom",
    personName: "Sunita Reddy",
    customerMobile: "9765432100",
    place: "Hyderabad, Banjara Hills",
    typeOfWork: "Badminton Racket Handle",
    noOfRackets: 3,
    modelName: "Victor TK-HMR",
    jobDescription:
      "Handle replacement with premium grip tape on all three rackets.",
    paymentMode: "Cash",
    serviceCharges: 150,
    advancedAmount: 100,
    totalAmount: 300,
    jobStatus: "Pending",
    dateOfJob: "2026-03-30",
  },
  {
    shopName: "Pro Badminton World",
    personName: "Vikram Singh",
    customerMobile: "9654321098",
    place: "Delhi, Lajpat Nagar",
    typeOfWork: "Badminton Racket Repair",
    noOfRackets: 1,
    modelName: "Yonex Nanoflare 800",
    jobDescription: "Li-Ning string at 26lbs. New overgrip requested.",
    paymentMode: "Cash",
    serviceCharges: 600,
    advancedAmount: 0,
    totalAmount: 600,
    jobStatus: "Completed",
    dateOfJob: "2026-03-22",
  },
  {
    shopName: "Elite Sports Corner",
    personName: "Meena Iyer",
    customerMobile: "9543210987",
    place: "Pune, Kothrud",
    typeOfWork: "Cricket Bat Binding",
    noOfRackets: 2,
    modelName: "SS Ton Classic",
    jobDescription:
      "Full bat binding with fibre tape. Edge guard also to be replaced.",
    paymentMode: "PhonePay",
    serviceCharges: 450,
    advancedAmount: 300,
    totalAmount: 900,
    jobStatus: "In Progress",
    dateOfJob: "2026-03-31",
  },
];

export async function seedIfNeeded() {
  if (localStorage.getItem(SEED_KEY)) return;
  try {
    const actor = await createActorWithConfig();
    const existing = await actor.getAllJobs();
    if (existing.length > 0) {
      localStorage.setItem(SEED_KEY, "1");
      return;
    }
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    const results = await Promise.all(
      sampleJobs.map((job, i) => {
        const createdAt = now - BigInt(i) * BigInt(3_600_000_000_000);
        return actor
          .createJob({
            shopName: job.shopName,
            personName: job.personName,
            customerMobile: job.customerMobile,
            place: job.place,
            typeOfWork: job.typeOfWork,
            noOfRackets: BigInt(job.noOfRackets),
            modelName: job.modelName,
            jobDescription: job.jobDescription,
            paymentMode: job.paymentMode,
            serviceCharges: job.serviceCharges,
            advancedAmount: job.advancedAmount,
            totalAmount: job.totalAmount,
            jobStatus: job.jobStatus,
            dateOfJob: job.dateOfJob,
            createdAt,
          })
          .then((jobId) => ({ jobId, createdAt }));
      }),
    );
    for (const { jobId, createdAt } of results) {
      registerJobId(createdAt, jobId);
    }
    localStorage.setItem(SEED_KEY, "1");
  } catch (e) {
    console.warn("Seed failed", e);
  }
}
