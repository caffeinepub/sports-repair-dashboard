import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Float "mo:core/Float";

actor {
  // V1 record type (no jobCategory) — kept for upgrade compatibility
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

  // V2 record type — adds jobCategory
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

  // V1 stable map — must be kept to avoid compatibility error on upgrade.
  // Contents are migrated to stableJobsV2 in postupgrade and this map
  // remains empty thereafter.
  let jobRecords = Map.empty<Nat, JobRecordV1>();

  // Stable storage — survives all upgrades
  stable var stableJobsV2 : [(Nat, JobRecord)] = [];
  stable var stableNextJobId : Nat = 1;

  // Working in-memory map — rebuilt from stable storage on each upgrade
  let jobRecordsV2 = Map.empty<Nat, JobRecord>();
  var nextJobId : Nat = 1;

  // Restore working map from stable storage at startup/upgrade
  system func postupgrade() {
    // 1. Restore V2 records from stable array
    for ((id, job) in stableJobsV2.vals()) {
      jobRecordsV2.add(id, job);
    };
    stableJobsV2 := [];

    // 2. Migrate any remaining V1 records
    for ((id, old) in jobRecords.entries().toArray().vals()) {
      if (not jobRecordsV2.containsKey(id)) {
        let category = if (old.shopName != "") { "shop" } else { "customer" };
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
          jobCategory = category;
        });
        if (id >= nextJobId) { nextJobId := id + 1 };
      };
    };

    nextJobId := stableNextJobId;
    if (nextJobId < 1) { nextJobId := 1 };
  };

  // Save working map to stable storage before upgrade
  system func preupgrade() {
    stableJobsV2 := jobRecordsV2.entries().toArray();
    stableNextJobId := nextJobId;
  };

  public shared func createJob(input : JobRecord) : async Nat {
    jobRecordsV2.add(nextJobId, input);
    let jobId = nextJobId;
    nextJobId += 1;
    jobId;
  };

  public shared func updateJob(id : Nat, updatedJob : JobRecord) : async () {
    if (not jobRecordsV2.containsKey(id)) {
      Runtime.trap("Job with given id does not exist.");
    };
    jobRecordsV2.add(id, updatedJob);
  };

  public shared func deleteJob(id : Nat) : async () {
    if (not jobRecordsV2.containsKey(id)) {
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

  // Returns all jobs with their IDs embedded so the frontend never needs
  // a local ID cache and data shows correctly on any device/browser.
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
};
