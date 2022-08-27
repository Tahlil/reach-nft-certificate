import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Student)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.GetCourseID = class extends React.Component {
  render() {
    const {parent, courseName, courseDescription, courseID} = this.props;
   
    function handleClick() {
      console.log("Handle click, course ID is: ", courseID);
      parent.setCourseID(courseID)
    }

   
    return (
      <div>
        <p>Course Name: <span>{courseName}</span></p>
        <p>Course Description: <span>{courseDescription}</span></p>
        <p>Course ID: <span>{courseID}</span></p>
        <br />
        <button
        
          onClick={handleClick}
        >Enroll Course</button>
      </div>
    );
  }
}


exports.ShowResult = class extends React.Component {
  render() {
    const {parent, gradeInNumber, courseName, courseDescription, courseID, nftBalance} = this.props;
    console.log("Show Result");
    return(
    <div>
    <h1>Course Result</h1>
    <p>Course Name: <span>{courseName}</span></p>
    <p>Course Description: <span>{courseDescription}</span></p>
    <p>Course ID: <span>{courseID}</span></p>
    <h3>Grade earned: <span>{gradeInNumber}</span></h3>
    <h3>NFT Certificates: <span>{nftBalance}</span></h3>
    <br />
    </div>
    );
    

  }
}


exports.WaitingForResults = class extends React.Component {
  render() {
    const {enrolledCourseID, nftBalance} = this.props;
    return (
      <div>
        Waiting for results from course {enrolledCourseID}
        <br />
        Current NFT Balance: {nftBalance}
      </div>
    );
  }
}



export default exports;