'reach 0.1';

export const main = Reach.App(() => {
  const Grade = Object({
    student: Address,
    grade: UInt
  })

  const Course = Object({
    name: Bytes(256),
    courseID: UInt,
    enroll: Array(Address, 1100),
    grades: Array(Grade, 1100)
  });

  const Instructor = Participant('Instructor', {
    // Specify Alice's interact interface here
    publishCourse: Fun()
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
  });
  init();
  // The first one to publish deploys the contract
  A.publish();
  commit();
  // The second one to publish always attaches
  B.publish();
  commit();
  // write your program here
  exit();
});
