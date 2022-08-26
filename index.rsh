'reach 0.1';

export const main = Reach.App(() => {

 
  
  const Course = Struct([
    ['name', Bytes(32)],
    ['description', Bytes(256)]
  ]);

  const Instructor = Participant('Instructor', {
    courseDetails: Object({name: Bytes(32), description: Bytes(256), courseID: UInt}),
    giveGrade: Fun([Address], UInt),
   certificateNFT: Token
  });

  const Student = Participant('Student', { 
    enrollCourse: Fun([], UInt),
    getGrade: Fun([UInt], Null)
  });

  const courseView = View({ 
    getCourse: Fun([UInt],  Course),
    getEnrollment: Fun([UInt, Address], Bool)
  });

  const CourseEvents = Events({
    addCourse: [UInt],
    logEnroll: [Address, UInt]
  });

  init();
 
  Instructor.publish();

  const courses = new Map(UInt, Course);
  const enroll = new Map(Tuple(UInt, Address), Bool);

  
  commit();
  Student.publish();
  commit();

  

  Instructor.only(() => {
    const courseDetails = declassify(interact.courseDetails);
  })
  Instructor.publish(courseDetails);
  commit();
  Instructor.only(() => {
    const nftId = declassify(interact.certificateNFT);
  });
  Instructor.publish(nftId);
  const { name, description, courseID } = courseDetails;
  assert(isNone(courses[courseID]));
 
  const DEFAULT_COURSE_IF_NOT_FOUND = Course.fromObject({
    name: "Lorem ipsum dolor sit amet orci.",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus mi erat, et mattis leo sagittis id. Proin ornare mi ut urna tempus rutrum. Nulla vitae enim sit amet arcu volutpat vestibulum. Aliquam fermentum est et felis convallis feugiat. Sed et."
  });
  courses[courseID] = Course.fromObject({
    name: name,
    description: description
  }) 
  courseView.getCourse.set((id) => fromSome(courses[id], DEFAULT_COURSE_IF_NOT_FOUND));
 
 
  CourseEvents.addCourse(courseID);

  const maxStudent = 3;
  const nftAmt = 1;

  var [ studentsEnrolled, studentsGraded  ] = array(UInt, [0,0]);
  invariant(balance() == 0);
  while(studentsGraded != maxStudent) {
    commit();
    Student.only(() => {
      assume(studentsEnrolled<maxStudent);
      const enrolledCourseID = declassify(interact.enrollCourse());
    });
    Student.publish(enrolledCourseID);
    CourseEvents.logEnroll(Student, enrolledCourseID);
    commit();
    Instructor.only(() => {
      const grade = declassify(interact.giveGrade(Student));
    });
    Instructor.publish(grade);
    // commit();
    if (grade > 80) {
      commit();
      Instructor.only(() => {
      });
      Instructor.pay([[nftAmt, nftId]]);
      transfer(nftAmt, nftId).to(Student);
    }
    commit();
    Student.only(() => {
      interact.getGrade(grade);
    });
    Student.publish();
    studentsEnrolled = studentsEnrolled + 1; 
    // [studentsEnrolled,studentsGraded] = studentsEnrolled + 1, studentsGraded+1;
    continue;
  }
  commit();
  // write your program here
  exit();
});
