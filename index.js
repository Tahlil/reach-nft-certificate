import React from 'react';
import AppViews from './views/AppViews.js';
import DeployerViews from './views/InstructorViews.js';
import AttacherViews from './views/StudentViews.js';
import {renderDOM, renderView} from './views/render.js';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);


const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultWager: '3', standardUnit};

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {view: 'ConnectAccount', ...defaults};
    }
    async componentDidMount() {
      const acc = await reach.getDefaultAccount();
      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
   

      this.setState({acc, bal});
      if (await reach.canFundFromFaucet()) {
        this.setState({view: 'FundAccount'});
      } else {
        this.setState({view: 'DeployerOrAttacher'});
      }
    }
    async fundAccount(fundAmount) {
      await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
      this.setState({view: 'DeployerOrAttacher'});
    }
    async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
    selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
    selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
    render() { return renderView(this, AppViews); }
  }

  //Instructor
  class Deployer extends React.Component {
    constructor() {
       super();
       this.state = {view: 'SetCourseDetails'};
    }

    setCourseDetails(courseName, courseDescription) { this.setState({view: 'Deploy', courseName, courseDescription}); }
  
    async deploy() {
      const ctc = this.props.acc.contract(backend);
      this.setState({view: 'Deploying', ctc});
      this.courseDetails = { name: this.state.courseName, description: this.state.courseDescription, courseID: 11};
      this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector];
      const certificateNFT = await reach.launchToken(this.props.acc, "CertNFT", "NFT", { supply: 3 });
      const nftId = certificateNFT.id;
     
      const nftBalance = parseInt((await this.props.acc.balanceOf(nftId))._hex, 16);
      console.log("NFT balance", nftBalance);
      console.log("NFT ID", nftId);
      this.certificateNFT = nftId;
      backend.Instructor(ctc, this);
      const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
      this.setState({ ctc });
      this.setState({view: 'WaitingForAttacher', ctcInfoStr, nftId, nftBalance});
    }

    async showCourse(){
        console.log("Calling show course....");
       const res = await this.state.ctc.v.getCourse();
       const [name, description, hexNum] = res[1];
      
       console.log(hexNum);
       const courseID = parseInt(hexNum._hex, 16);
        //  const courseID = 11;
       console.log("Cours ID", courseID);
       console.log("Res[1]: ");
       console.log(res[1]);
       this.setState({view: 'CourseSection', name, description, courseID, res});
    }

    async giveGrade(address){
        console.log("Give address", address);
        console.log(address);
        const grade = await new Promise(resolveGrade => {
            this.setState({view: 'GiveGrade',  resolveGrade});
          });
        this.setState({view: 'EvaluateGrade', grade, address});
        console.log("Finish giving grade..");
        return grade;
    }

    setGrade(grade) {
        this.state.resolveGrade(grade); 
    }
  
    render() { return renderView(this, DeployerViews); }
  }

  //Student
  class Attacher extends React.Component {
    constructor() {
      super();
      this.state = {view: 'Attach'};
    }
    attach(ctcInfoStr) {
        console.log("Attaching....");
      const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
      this.setState({view: 'Attaching'});
      backend.Student(ctc, this);
      this.setState({ ctc });
      console.log("Finished...");
    }

    async enrollCourse(){
        console.log(this.state.ctc);
        const res = await this.state.ctc.v.getCourse();
       const [courseName, courseDescription, hexNum, nft] = res[1];
       const nftBalance = parseInt((await this.props.acc.balanceOf(nft))._hex, 16);
      
       console.log(hexNum);
       const courseID = parseInt(hexNum._hex, 16);
        const enrolledCourseID = await new Promise(resolveCourse => {
            this.setState({view: 'GetCourseID', courseName, courseDescription, courseID, resolveCourse});
          });
        this.setState({view: 'WaitingForResults', enrolledCourseID, nftBalance});
        return enrolledCourseID;
    }

    setCourseID(courseID) { this.state.resolveCourse(courseID); }

    async getGrade(grade){
       console.log("Calling get grade: ");
       const gradeInNumber = parseInt(grade._hex, 16)
       const res = await this.state.ctc.v.getCourse();
       const [courseName, courseDescription, hexNum, nft] = res[1];
       const nftBalance = parseInt((await this.props.acc.balanceOf(nft))._hex, 16);

       console.log(nft); 
       console.log(hexNum);
       const courseID = parseInt(hexNum._hex, 16);
       this.setState({view: 'ShowResult', gradeInNumber, courseName, courseDescription, courseID, nftBalance});
    }

    render() { return renderView(this, AttacherViews); }
  }

renderDOM(<App />);