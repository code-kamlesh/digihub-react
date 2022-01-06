import React, { Component } from 'react';
import { useState } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'
import underscore from 'underscore';
//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
//import 'bootstrap/dist/css/bootstrap.min.css';
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from '@material-ui/core/Button';
import { changeStudentStatus,fetchStudentDetailsByEngagementId,fetchKnackScore,fetchEvaluationData }from './../util/api';
  import { FormControl , FormControlLabel ,TextField, InputLabel, Input, Grid , RadioGroup, Radio}  from '@material-ui/core';
import styles from "../components/components.js"; 
import { CommunicationCallMerge } from 'material-ui/svg-icons';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
//import MasterData from './../components/MasterData.js'

class Shortlist extends Component
{
    constructor(props) {
       super(props);
     
        this.state = {knackData : {} , engagementData : {},engagementId : props.engagementId,dbUserId : props.id, shortlistData : {action : "" ,comments : "" , actionedBy : UserContext.userid }}
        this.handleInputChange = this.handleInputChange.bind(this);
        if(props.id != null && props.id != undefined)
        {
          this.state.engagementId=props.engagementId;
          this.getKnackScore(this.state.engagementId);
          this.getEvaluationData(this.state.engagementId);
          this.getshortlistData(this.state.engagementId);
        } 
       // alert(this.state.dbUserId);
        
    }

    handleInputChange(event) {
        
        const target = event.target;
        const value =  (target.value);
        const name = target.name;
        this.setState({
          shortlistData: {
            ...this.state.shortlistData,
            [name]: value
          }
        })
        
      }
      getEvaluationData(eng)
      {
       // let formData = new FormData();
        let finalAvg = 0;
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          // formData.append('data','{"token" : "'+ "1234" +'", "action" : "viewByEngagementId", "data" : [{ "engagementId" : ' + eng + '}]}');
          // fetch("http://playground.tatastrive.com/sservices-v1/evaluation", {
          // method: "POST",
          // body: formData 
          // }).then(response => response.json())
          
          fetchEvaluationData(eng).then((jsondata)=>{
            console.log(jsondata);
            let finalDetails = JSON.parse(jsondata.data);
            for(let i=0 ; i<finalDetails.length;i++){
               let score = (0.05 * this.state.knackData.finalScore) + (0.15 * finalDetails[i].individualExecScore) + (0.15 * finalDetails[i].groupExecObservation) + (0.15 * finalDetails[i].behaviourInterviewObservation);
              if(finalAvg != 0)
              {
                finalAvg = (finalAvg + score)/2;
              }
              else
              {
                finalAvg = score;
              }
         }  
        // alert(finalAvg)  ;
              
      });   
      }
      getKnackScore(eng)
      {
     //   let formData = new FormData();
      //alert(JSON.stringify(this.state));
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          // formData.append('data','{"token" : "'+ "1234" +'", "action" : "get", "data" : [{ "engagementId" : ' + eng + '}]}');
          // return fetch("http://playground.tatastrive.com/sservices-v1/knack", {
          // method: "POST",
          // body: formData 
          // }).then(response => response.json())
          
          fetchKnackScore(eng).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.data != []){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  this.setState({knackData :jsonobjects[0][0]});
                 // alert(JSON.stringify(this.state.knackData)) ;
              }  else{
                  console.log("error");
              } 
           })
      }

      getshortlistData(eng)
      {
        // let formData = new FormData();
      //alert(JSON.stringify(this.state));
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          // formData.append('data','{"token" : "'+ "1234" +'", "action" : "viewStudentEngagementById", "data" : [{ "engagementId" : ' + eng + '}]}');
          // return fetch("http://playground.tatastrive.com/sservices-v1/engagement", {
          // method: "POST",
          // body: formData 
          // }).then(response => response.json())
          
          fetchStudentDetailsByEngagementId(eng).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  this.setState({engagementData :jsonobjects[0]});
                  console.log(jsonobjects);  
              }  else{
                  console.log("error");
              } 
           })
      }

    mySubmitHandler = (event) => {
        event.preventDefault();
        document.getElementById("save").setAttribute("disabled" , true);
        // authentication response and redirect to error or dashbaord page
        //alert(this.email)
        this.submitEngagement(this.state.dbUserId,this.state.engagementId);
        //this.submitEngagement();
        //this.props.history.push('/dashboard/mobilize')
    }

   
submitEngagement(dbUserId,engId)
{

    let statusChangeData='"engagementId":'+this.state.engagementId+',"status": "' +this.state.shortlistData.action +  '","updatedBy":' + UserContext.userid + ', "remarks" : "' + this.state.shortlistData.remarks + '"' ;
    //alert(statusChangeData);
    changeStudentStatus(statusChangeData).then((jsondata) => { 
            alert("Status changed successfully");
            this.props.history.push({
              pathname: '/dashboard/managebeneficiary',
              state: { dbUserId: this.state.dbUserId ,  tab : 10 }
            });
      });
   
  
    
}

render()
{
  
  const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
  let button;
  let displayText;
    button =   <Button id = "save" variant="contained" type="submit" color="primary">
    Save
  </Button>;

      if(this.state.engagementData.status == "Shortlisted")
      {
        displayText = 
        <Grid item xs={12} sm={8}>
          <h2>Already Shortlisted</h2>
          </Grid>;
          button = "";
      }
      else if(this.state.engagementData.status == "Rejected")
      {
        displayText =
        <Grid item xs={12} sm={8}>
        <h2>Already Rejected</h2>
        </Grid>;
        button = "";
      }
      else{
        displayText =
          <Grid item xs={12} sm={8}>
          <FormControl>
          <RadioGroup row aria-label="recommend"  name="action"  onChange={this.handleInputChange}>
          <FormControlLabel value="Shortlisted" control={<Radio />} label="Shortlist" />
          <FormControlLabel value="Rejected" control={<Radio />} label="Reject" />
        </RadioGroup>
            </FormControl>
      </Grid>;
      }

    return (
  <div style = {{ width : '100%' }}>
    <form onSubmit={this.mySubmitHandler} method="post">
   <Grid container spacing={2}>
    
        <Grid item xs={12} sm={6}>
          <FormControl>
            <TextField type = "text"
              label="Remarks"
              name = "remarks"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleInputChange}
            />
          </FormControl>  
        </Grid>
        <Grid item xs={12} sm={6}>
          </Grid>
         {displayText}
        
      </Grid>

      <br/>
      {button}
    
    </form>
    </div>

    );
}

}
export default Shortlist;