'reach 0.1';

export const main = Reach.App(() => {

 
  
  const Course = Object({
    name: Bytes(256),
    enroll: Array(Address, 3),
    grades: Array(UInt, 3),
    numberOfStudents: UInt
  });

  const Instructor = Participant('Instructor', {
    courseDetails: Object({name: Bytes(256), courseID: UInt}),
    giveGrade: Fun([Address, UInt], Null),
  });

  const Student = Participant('Student', { 
    enrollCourse: Fun([UInt], Null),
    issueCertificate: Fun([UInt], Null) 
  });

  const courseView = View('ShowCourse', { getCourse: Fun([UInt], Course) });

  const CourseEvents = Events({
    addCourse: [UInt]
  })
  init();
 
  Instructor.publish();

  const courses = new Map(UInt, Course);
  commit();

  Instructor.only(() => {
    const courseDetails = declassify(interact.courseDetails);
  })
  Instructor.publish(courseDetails);
  const { name, courseID } = courseDetails;
  assert(isNone(courses[courseID]));

  courses[courseID] = {
    name: name,
    enroll: array(Address, [getAddress(), getAddress(), getAddress()]),
    grades: array(UInt, [0,0,0]),
    numberOfStudents: 0
  }
  courseView.getCourse.set((id) => Maybe(courses[id]));
  CourseEvents.addCourse(courseID);
  commit();


 

  // write your program here
  exit();
});
