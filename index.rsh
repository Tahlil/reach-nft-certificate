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
  
  const currentCourseNumber  =
  parallelReduce( 0 )
  .invariant(balance() == 0)
  .while(true)
  .api_(Instructor.publishCourse, (courseName) => {
    return [0, (ret) => {
      ret(null);
      const arr1 = Array(Address, 100);
      const arr2 = Array(Grade, 100);
      courses[currentCourseNumber] = {
        name: courseName,
        enroll: arr1,
        grades: arr2,
        numberOfStudents: 0
      }
      CourseEvents.addCourse(currentCourseNumber);
      return currentCourseNumber + 1;
    }]})
    .api_(Instructor.getCourse, (courseID) => {
      return [0, (ret) => {
        ret(courses[courseID]);
        return currentCourseNumber;
      }]})
      .api_(Student.enrollCourse, (courseIDToEnroll) => {
        return [0, (ret) => {
          assert(!isSome(courses[courseIDToEnroll]), "Already enrolled");

          ret(Null);
          return currentCourseNumber;
        }]});
  
  // coursesView.currentCourses.set(courses);
  commit();
  // write your program here
  exit();
});
