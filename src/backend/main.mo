import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Iter "mo:core/Iter";



actor {
  // V1 job record type (no category)
  type JobRecordV1 = {
    shopName : Text;
    personName : Text;
    customerMobile : Text;
    place : Text;
    typeOfWork : Text;
    modelName : Text;
    noOfRackets : Nat;
    jobDescription : Text;
    serviceCharges : Float;
    paymentMode : Text;
    advancedAmount : Float;
    totalAmount : Float;
    jobStatus : Text;
    dateOfJob : Text;
    createdAt : Int;
  };

  // V2 job record type — adds jobCategory
  type JobRecord = {
    shopName : Text;
    personName : Text;
    customerMobile : Text;
    place : Text;
    typeOfWork : Text;
    modelName : Text;
    noOfRackets : Nat;
    jobDescription : Text;
    serviceCharges : Float;
    paymentMode : Text;
    advancedAmount : Float;
    totalAmount : Float;
    jobStatus : Text;
    dateOfJob : Text;
    createdAt : Int;
    jobCategory : Text;
  };

  // Job with ID — returned by getAllJobs so the frontend always has the ID
  type JobWithId = {
    id : Nat;
    shopName : Text;
    personName : Text;
    customerMobile : Text;
    place : Text;
    typeOfWork : Text;
    modelName : Text;
    noOfRackets : Nat;
    jobDescription : Text;
    serviceCharges : Float;
    paymentMode : Text;
    advancedAmount : Float;
    totalAmount : Float;
    jobStatus : Text;
    dateOfJob : Text;
    createdAt : Int;
    jobCategory : Text;
  };

  // Booking record type
  type BookingRecord = {
    customerName : Text;
    customerMobile : Text;
    serviceType : Text;
    equipmentDetails : Text;
    preferredDate : Text;
    notes : Text;
    bookingStatus : Text;
    createdAt : Int;
  };

  type BookingWithId = {
    id : Nat;
    customerName : Text;
    customerMobile : Text;
    serviceType : Text;
    equipmentDetails : Text;
    preferredDate : Text;
    notes : Text;
    bookingStatus : Text;
    createdAt : Int;
  };

  // V1 stable map for job records (for upgrade compatibility only)
  let jobRecords = Map.empty<Nat, JobRecordV1>();

  // Current job stable storage
  stable var stableJobsV2 : [(Nat, JobRecord)] = [];
  stable var stableNextJobId : Nat = 1;

  // Current booking stable storage
  stable var stableBookings : [(Nat, BookingRecord)] = [];
  stable var stableNextBookingId : Nat = 1;

  // In-memory maps (persisted in stable storage)
  let jobRecordsV2 = Map.empty<Nat, JobRecord>();
  var nextJobId : Nat = 1;

  let bookingRecords = Map.empty<Nat, BookingRecord>();
  var nextBookingId : Nat = 1;

  system func preupgrade() {
    stableJobsV2 := jobRecordsV2.entries().toArray();
    stableNextJobId := nextJobId;
    stableBookings := bookingRecords.entries().toArray();
    stableNextBookingId := nextBookingId;
  };

  system func postupgrade() {
    // Restore jobs from stable storage
    for ((id, job) in stableJobsV2.vals()) {
      jobRecordsV2.add(id, job);
    };
    stableJobsV2 := [];

    // Restore bookings from stable storage
    for ((id, booking) in stableBookings.vals()) {
      bookingRecords.add(id, booking);
    };
    stableBookings := [];

    // Migrate any old V1 records that were left in storage (should be rare)
    for ((id, old) in jobRecords.entries().toArray().vals()) {
      if (not jobRecordsV2.containsKey(id)) {
        jobRecordsV2.add(id, {
          shopName = old.shopName;
          personName = old.personName;
          customerMobile = old.customerMobile;
          place = old.place;
          typeOfWork = old.typeOfWork;
          modelName = old.modelName;
          noOfRackets = old.noOfRackets;
          jobDescription = old.jobDescription;
          serviceCharges = old.serviceCharges;
          paymentMode = old.paymentMode;
          advancedAmount = old.advancedAmount;
          totalAmount = old.totalAmount;
          jobStatus = old.jobStatus;
          dateOfJob = old.dateOfJob;
          createdAt = old.createdAt;
          jobCategory = if (old.shopName != "") { "shop" } else { "customer" };
        });
      };
    };

    nextJobId := stableNextJobId;
    nextBookingId := stableNextBookingId;
    if (nextJobId < 1) { nextJobId := 1 };
    if (nextBookingId < 1) { nextBookingId := 1 };
  };

  // JOB METHODS

  public shared func createJob(input : JobRecord) : async Nat {
    jobRecordsV2.add(nextJobId, input);
    let jobId = nextJobId;
    nextJobId += 1;
    jobId;
  };

  public shared func updateJob(id : Nat, updatedJob : JobRecord) : async () {
    switch (jobRecordsV2.get(id)) {
      case (null) { Runtime.trap("Job with given id does not exist.") };
      case (?existingJob) { jobRecordsV2.add(id, updatedJob) };
    };
  };

  public shared func deleteJob(id : Nat) : async () {
    if (jobRecordsV2.get(id) == null) {
      Runtime.trap("Job with given id does not exist.");
    };
    jobRecordsV2.remove(id);
  };

  public query func getJobById(id : Nat) : async JobRecord {
    switch (jobRecordsV2.get(id)) {
      case (null) { Runtime.trap("Job with given id does not exist.") };
      case (?job) { job };
    };
  };

  public query func getAllJobs() : async [JobWithId] {
    jobRecordsV2.entries().toArray().map(func((id, job) : (Nat, JobRecord)) : JobWithId {
      {
        id = id;
        shopName = job.shopName;
        personName = job.personName;
        customerMobile = job.customerMobile;
        place = job.place;
        typeOfWork = job.typeOfWork;
        modelName = job.modelName;
        noOfRackets = job.noOfRackets;
        jobDescription = job.jobDescription;
        serviceCharges = job.serviceCharges;
        paymentMode = job.paymentMode;
        advancedAmount = job.advancedAmount;
        totalAmount = job.totalAmount;
        jobStatus = job.jobStatus;
        dateOfJob = job.dateOfJob;
        createdAt = job.createdAt;
        jobCategory = job.jobCategory;
      }
    });
  };

  public query func getSummaryStats() : async {
    totalCount : Nat;
    pendingCount : Nat;
    inProgressCount : Nat;
    completedCount : Nat;
    totalRevenue : Float;
  } {
    let jobsArr = jobRecordsV2.values().toArray();
    {
      totalCount = jobRecordsV2.size();
      pendingCount = jobsArr.filter(func(j) { j.jobStatus == "Pending" }).size();
      inProgressCount = jobsArr.filter(func(j) { j.jobStatus == "In Progress" }).size();
      completedCount = jobsArr.filter(func(j) { j.jobStatus == "Completed" }).size();
      totalRevenue = jobsArr
        .map(func(j) : Float { if (j.jobStatus == "Completed") { j.totalAmount } else { 0.0 } })
        .foldLeft(0.0, func(acc : Float, v : Float) : Float { acc + v });
    };
  };

  // BOOKING METHODS

  public shared func createBooking(input : BookingRecord) : async Nat {
    bookingRecords.add(nextBookingId, input);
    let bookingId = nextBookingId;
    nextBookingId += 1;
    bookingId;
  };

  public query func getAllBookings() : async [BookingWithId] {
    bookingRecords.entries().toArray().map(func((id, booking) : (Nat, BookingRecord)) : BookingWithId {
      {
        id = id;
        customerName = booking.customerName;
        customerMobile = booking.customerMobile;
        serviceType = booking.serviceType;
        equipmentDetails = booking.equipmentDetails;
        preferredDate = booking.preferredDate;
        notes = booking.notes;
        bookingStatus = booking.bookingStatus;
        createdAt = booking.createdAt;
      }
    });
  };

  public query func getBookingsByMobile(mobile : Text) : async [BookingWithId] {
    bookingRecords.entries().toArray().filter(
      func((id, booking) : (Nat, BookingRecord)) : Bool {
        Text.equal(booking.customerMobile, mobile);
      }
    ).map(func((id, booking) : (Nat, BookingRecord)) : BookingWithId {
      {
        id = id;
        customerName = booking.customerName;
        customerMobile = booking.customerMobile;
        serviceType = booking.serviceType;
        equipmentDetails = booking.equipmentDetails;
        preferredDate = booking.preferredDate;
        notes = booking.notes;
        bookingStatus = booking.bookingStatus;
        createdAt = booking.createdAt;
      }
    });
  };

  public shared func updateBookingStatus(id : Nat, status : Text) : async () {
    switch (bookingRecords.get(id)) {
      case (null) { Runtime.trap("Booking with given id does not exist.") };
      case (?booking) {
        let updatedBooking = {
          booking with
          bookingStatus = status
        };
        bookingRecords.add(id, updatedBooking);
      };
    };
  };

  public query func getBookingsSummary() : async {
    total : Nat;
    pending : Nat;
    confirmed : Nat;
    inProgress : Nat;
    completed : Nat;
    cancelled : Nat;
  } {
    let allBookings = bookingRecords.values().toArray();
    {
      total = allBookings.size();
      pending = allBookings.filter(func(b) { b.bookingStatus == "pending" }).size();
      confirmed = allBookings.filter(func(b) { b.bookingStatus == "confirmed" }).size();
      inProgress = allBookings.filter(func(b) { b.bookingStatus == "in-progress" }).size();
      completed = allBookings.filter(func(b) { b.bookingStatus == "completed" }).size();
      cancelled = allBookings.filter(func(b) { b.bookingStatus == "cancelled" }).size();
    };
  };
};
