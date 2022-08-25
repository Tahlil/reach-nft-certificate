'reach 0.1';

export const main = Reach.App(() => {

  const Grade = Object({
    student: Address,
    grade: UInt
  })

  const Course = Object({
    name: Bytes(256),
    enroll: Array(Address, 100),
    grades: Array(Grade, 100),
    numberOfStudents: UInt
  });

  const Instructor = Participant('Instructor', {
    course: Course,
    getCourse: Fun([], Data({"None": Null, "Some": Course})),
    giveGrade: Fun([Address, UInt], Null),
  });

  const Student = Participant('Student', { 
    enrollCourse: Fun([UInt], Null),
    issueCertificate: Fun([UInt], Null) 
  });

  const CourseEvents = Events({
    addCourse: [UInt]
  })
  init();
 
  Instructor.publish();

  const courses = new Map(UInt, Course);
  
  
  
  // coursesView.currentCourses.set(courses);
  commit();
  // write your program here
  exit();
});
