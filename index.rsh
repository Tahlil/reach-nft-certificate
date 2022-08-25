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

  const courses= Array(Course, 1100);


  const Instructor = API('Instructor', {
    publishCourse: Fun([Course], Null),
    giveGrade: Fun([Address, UInt], Null)

  });

  const Student = API('Student', { 
    enrollCourse: Fun([Address, UInt], Null),
    verifyCertificate: Fun([UInt], Bool) 
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
