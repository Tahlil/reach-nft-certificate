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
    publishCourse: Fun([Course], Null),
    giveGrade: Fun([Address, UInt], Null),
    courses: Array(Course, 1100)
  });

  const Student = API('Student', { 
    enrollCourse: Fun([Address, UInt], Null),
    verifyCertificate: Fun([UInt], Bool) 
  });

  const coursesView = View('Courses', { currentCourses: Array(Course, 1100) })
  init();



  

  // coursesView.currentCourses.set(courses);
  commit();
  // write your program here
  exit();
});
