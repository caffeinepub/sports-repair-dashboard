import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";

import Float "mo:core/Float";


actor {
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
  };

  var nextJobId = 1;

  let jobRecords = Map.empty<Nat, JobRecord>();

  public shared ({ caller }) func createJob(input : JobRecord) : async Nat {
    let newJob : JobRecord = {
      input with
      shopName = input.shopName;
      personName = input.personName;
      customerMobile = input.customerMobile;
      place = input.place;
      typeOfWork = input.typeOfWork;
      modelName = input.modelName;
      noOfRackets = input.noOfRackets;
      jobDescription = input.jobDescription;
      paymentMode = input.paymentMode;
      advancedAmount = input.advancedAmount;
      totalAmount = input.totalAmount;
      jobStatus = input.jobStatus;
      dateOfJob = input.dateOfJob;
      serviceCharges = input.serviceCharges;
      createdAt = input.createdAt;
    };
    jobRecords.add(nextJobId, newJob);
    let jobId = nextJobId;
    nextJobId += 1;
    jobId;
  };

  public shared ({ caller }) func updateJob(id : Nat, updatedJob : JobRecord) : async () {
    if (not jobRecords.containsKey(id)) {
      Runtime.trap("Job with given id does not exist. ");
    };
    jobRecords.add(id, updatedJob);
  };

  public shared ({ caller }) func deleteJob(id : Nat) : async () {
    if (not jobRecords.containsKey(id)) {
      Runtime.trap("Job with given id does not exist. ");
    };
    jobRecords.remove(id);
  };

  public query ({ caller }) func getJobById(id : Nat) : async JobRecord {
    switch (jobRecords.get(id)) {
      case (null) {
        Runtime.trap("Job with given id does not exist. ");
      };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getAllJobs() : async [JobRecord] {
    jobRecords.values().toArray();
  };

  public query ({ caller }) func getSummaryStats() : async {
    totalCount : Nat;
    pendingCount : Nat;
    inProgressCount : Nat;
    completedCount : Nat;
    totalRevenue : Float;
  } {
    let jobsArr = jobRecords.values().toArray();
    {
      totalCount = jobRecords.size();
      pendingCount = jobsArr.filter(func(j) { j.jobStatus == "Pending" }).size();
      inProgressCount = jobsArr.filter(func(j) { j.jobStatus == "In Progress" }).size();
      completedCount = jobsArr.filter(func(j) { j.jobStatus == "Completed" }).size();
      totalRevenue = jobsArr.map(func(j) { if (j.jobStatus == "Completed") { j.totalAmount } else { 0.0 } }).foldLeft(
        0.0,
        func(total, amount) { total + amount },
      );
    };
  };
};
