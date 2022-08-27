import React from 'react';

const exports = {};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Deployer">
        <h2>Deployer (Instructor)</h2>
        {content}
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div>
       
        <button
          onClick={() => parent.deploy()}
        >Deploy</button>
      </div>
    );
  }
}




exports.SetCourseDetails = class extends React.Component {
  render() {
    const {parent} = this.props;
    let courseName = "default";
    let courseDescription = "default";
    
    function handleClick() {
      console.log("Handle click, name and description are: ", courseName, courseDescription);
      courseName = courseName.substr(0,32).padEnd(32, ' ');
      courseDescription = courseDescription.substr(0,256).padEnd(256, ' ');
      parent.setCourseDetails(courseName, courseDescription);
    }

    function handleNameChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      courseName=e.currentTarget.value;
      console.log("Course name is ", courseName);
    }

    function handleDescriptionChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      courseDescription=e.currentTarget.value;
      console.log("Course Description is ", courseDescription);
    }

    return (
      <div>
        <input
          type='text'
          placeholder="Course name"
          onChange={(e) => handleNameChange(e)}
        /> 
        <input
          type='text'
          placeholder="Course description"
          onChange={(e) => handleDescriptionChange(e)}
        /> 
        <br />
        <button
        
          onClick={handleClick}
        >Set course details</button>
      </div>
    );
  }
}

exports.GiveGrade = class extends React.Component {
  render() {
    const {parent} = this.props;
    let grade =0;
    function handleClick() {
      console.log("Handle click, grade: ", grade);
     
      parent.setGrade(grade);
    }

   
    function handleChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      grade = parseInt(e.currentTarget.value);
      console.log("Grade is ", grade);
    }

    return (
      <div>
        
        <input
          type='number'
          placeholder="Grade"
          onChange={(e) => handleChange(e)}
        /> 
        <br />
        <button
        
          onClick={handleClick}
        >Set grade</button>
      </div>
    );
  }
}

exports.EvaluateGrade = class extends React.Component {
  render() {
    const {parent, grade, address} = this.props;
    if (grade > 80){
      return (
        <div>
          Issuing Certificate to {address}.
        </div>
      );
    }
    else{
      return (
        <div>
          Did not earn certificate.
        </div>
      );
    }
   
  }
}


exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.CourseSection = class extends React.Component {
  render() {
    const {parent, name, description, courseID, res} = this.props;
    console.log("Res: ", res);
   
    return (
      <div>
        <h1>All Courses</h1>
        <p>Course Name: <span>{name}</span></p>
        <p>Course Description: <span>{description}</span></p>
        <p>Course ID: <span>{courseID}</span></p>
        <br />
      </div>
    );
  }
}

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipboard(button) {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  

  render() {
    const {parent, ctcInfoStr, nftId, nftBalance} = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipboard(e.currentTarget)}
        >Copy to clipboard</button>
        <br />
        <h3>NFT Address: {nftId}</h3>
        <br />
        <h3>NFT Balance: {nftBalance}</h3>
        <br />

        <button onClick={() => parent.showCourse()}>Go to course</button>

      </div>
      
      
    )
  }
}

export default exports;