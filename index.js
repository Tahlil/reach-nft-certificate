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
      console.log("NFT ID", nftId);
      this.certificateNFT = nftId;
      backend.Instructor(ctc, this);
      const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
      this.setState({ ctc });
      this.setState({view: 'WaitingForAttacher', ctcInfoStr, nftId});
    }

    async showCourse(){
        console.log("Calling show course....");
       const {name, description, courseID} = this.courseDetails;
       console.log(this.state.ctc);
       const res = await this.state.ctc.v.getCourse();
       const res2 = await this.state.ctc.views.getCourse();
       console.log("Res: ");
       console.log(res);
       console.log("Res2: ");
       console.log(res2);

       this.setState({view: 'CourseSection', name, description, courseID, res});
    }


    // async getAcceptanceOfFortune(fortune) {
    //   return await new Promise(resolveAcceptedP => {
    //     this.setState({view: 'AcceptTerms', fortune, resolveAcceptedP});
    //   });
    // }
    // fortuneAccepted(accepted) {
    //   this.state.resolveAcceptedP(accepted);
    //   if(!accepted){
    //     this.setState({view: 'WaitingForTurn'});
    //   }
    // }
    render() { return renderView(this, DeployerViews); }
  }

  //Student
  class Attacher extends React.Component {
    constructor() {
      super();
      this.state = {view: 'Attach'};
    }
    attach(ctcInfoStr) {
      const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
      this.setState({view: 'Attaching'});
      backend.Student(ctc, this);
    }
    // async readFortune() {
    //   const fortune = await new Promise(resolveFortune => {
    //       this.setState({view: 'ReadFortune', resolveFortune});
    //     });
    //     console.log("Resolved");
    //   this.setState({view: 'WaitingForResults', fortune});
    //   console.log("Attacher exiting... fortune is:", fortune);  
    //     return fortune;
    // }
    // tellFortune(fortune) { 
    //   console.log("The fortune is:", fortune);
    //   this.state.resolveFortune(fortune); }
    render() { return renderView(this, AttacherViews); }
  }

renderDOM(<App />);