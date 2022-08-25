'reach 0.1';

export const main = Reach.App(() => {

 const Admin = Participant('Admin', {})

  const Grade = Object({
    student: Address,
    grade: UInt
  })

  const Course = Object({
    name: Bytes(256),
    enroll: Array(Address, 1100),
    grades: Array(Grade, 1100)
  });

  const Instructor = API('Instructor', {
    publishCourse: Fun([Course], Null),
    getCourse: Fun([UInt], Data({"None": Null, "Some": Course})),
    giveGrade: Fun([Address, UInt], Null),
  });

  const Student = API('Student', { 
    enrollCourse: Fun([Address, UInt], Null),
    issueCertificate: Fun([UInt], Null) 
  });

  const CourseEvents = Events({
    addCourse: [UInt]
  })
  init();
 
  Admin.publish();

  const courses = new Map(UInt, Course);
  
  const currentCourseNumber  =
  parallelReduce( 0 )
  .invariant(balance() == 0)
  .while(true)
  .api_(Instructor.publishCourse, (course) => {
    return [0, (ret) => {
      ret(null);
      courses[currentCourseNumber] = course;
      CourseEvents.addCourse(currentCourseNumber);
      return currentCourseNumber + 1;
    }]})
    .api_(Instructor.getCourse, (courseID) => {
      return [0, (ret) => {
        ret(courses[courseID]);
        return currentCourseNumber;
      }]});
  
  // coursesView.currentCourses.set(courses);
  commit();
  // write your program here
  exit();
});
