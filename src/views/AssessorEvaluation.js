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
import MUIDataTable from "mui-datatables";
import { changeStudentStatus, saveEvaluationData, fetchKnackScore, fetchEvaluationData}from './../util/api';
  import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
  //import { FormControl , FormControlLabel , InputLabel, Input, Grid,  , RadioGroup, Radio}  from '@material-ui/core';
import styles from "../components/components.js"; 
import { CommunicationCallMerge } from 'material-ui/svg-icons';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
//import MasterData from './../components/MasterData.js'
import { fectUserDetails } from './../util/api';
import { serviceEndPoint } from './../util/serviceEndPoint';

import {checkButton, checkButtonForArray , validateAssessorName} from './../util/validation';
import DetailsPage from './DetailsPage.js'; 
class AssessorEvaluation extends Component
{
    constructor(props) {
       super(props);
       
    //     this.myData = { 
    //     behaviourExecScore : [
    //         { value: "20", label: 'Candidate was not able to narrate relevant example/s to showcase expected traits' },
    //         { value: "60", label: 'Candidate was able to narrate example/s which showcased some of the expected traits' },
    //         { value: "100", label: 'Candidate was able to narrate relevant example/s which consistently showcased the trait expected' }
    //     ],
    //     groupExecScore : [
    //         { value: "0", label: 'No Traits observed' },
    //         { value: "20", label: 'Only 1 Traits Observed' },
    //         { value: "40", label: '2 Traits Observed' },
    //         { value: "60", label: '3 Traits Observed' },
    //         { value: "80", label: 'All 4 Traits Observed' },
    //         { value: "100", label: 'All 4 Traits Observed Consistently' }
    //     ],
    //  }
        this.state = {name : props.name,ies : "" , readonly : false , disabled : false , flag : "0" , errors : [] , rows : [{'engagementId' : props.engagementId , individualExecScore : "", groupExecObservation : "" , behaviourInterviewObservation : "", assessedBy : UserContext.userid}] ,  knackData : {} , engagementId : props.engagementId,dbUserId : props.dbUserId
        , evaluationData : [] , evaluationSingleData : {'assessedBy' : UserContext.userid , 'engagementId' : props.engagementId , individualExecScore : "", groupExecObservation : "" , behaviourInterviewObservation : ""}};
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
          this.getEvaluationData(this.state.engagementId);
          this.getKnackScore(this.state.engagementId);
    }

    handleSelectChange(selectname, event, idx) {
      const errors = [...this.state.errors];
      const rows = [...this.state.rows];
      this.setState({
        "disabled" : false
      });
      errors[event] = {};
      errors[event] [selectname] = {"label" : "" , "value" : false};
      rows[event] [selectname] = idx;
      this.setState({
        rows,errors
      });
     // alert(JSON.stringify(this.state));
      
    }
    validateAll()
    {
      var errors = this.state.errors;
      this.state.rows.map((item,idx) => {
        Object.keys(item).forEach(function(key) {
          if(item[key] != 0 && (item[key] == undefined || item[key] == '' ))
          {
            let res = "Cannot be empty";
              errors[idx][key] = {
                  'label' : res , 
                  'value' : res == "" ? false : true 
                }
         }
      });
      })
      this.state.errors = errors;
    }
    handleChange = idx => e => {
      const rows = [...this.state.rows];
      const errors = [...this.state.errors];
      const { name, value } = e.target;
      errors[idx] = {};
      errors[idx] [name] = {"label" : "" , "value" : false};
      this.setState({
        "disabled" : false
      });
      if(name == "assessorName")
      {
        let res = validateAssessorName(value, rows);
        errors[idx] [name] = {"label" : res , "value" : res == "" ? false:true};
      }
      if(name == "individualExecScore")
      {
        this.setState({ies : value});
      }
      rows[idx] [name]= value;
        this.setState({
          rows,errors
        });
  
     // alert(JSON.stringify(this.state));
    };
    handleAddRow = (props) => {
      const item = {
        engagementId : this.state.engagementId,
        assessedBy : UserContext.userid,
        groupExecObservation: "",
        behaviourInterviewObservation: "",
        individualExecScore: "",
      };
      this.setState({
        rows: [...this.state.rows, item],
        errors : [...this.state.errors, {}],
      });
    };
    handleRemoveRow = () => {
      this.setState({
        rows: this.state.rows.slice(0, -1),
        errors : this.state.errors.slice(0, -1),
      });
    };
    handleRemoveSpecificRow = (idx) => () => {
      const rows = [...this.state.rows]
      const errors = [...this.state.errors]
      rows.splice(idx, 1)
      errors.splice(idx, 1)
      this.setState({ rows , errors })
    }
    mySubmitHandler = (event) => {
      event.preventDefault();
      this.state.rows.map((item,idx) => {
        this.state.rows[idx].individualExecScore = this.state.ies ; 
      })
      this.validateAll();
    
      // authentication response and redirect to error or dashbaord page
      this.setState({
        errors : this.state.errors
      });
      if(checkButtonForArray(this.state.errors))
        {
          this.state.disabled = false;
          this.submitEvaluationData();
        }
        else
        {
          this.state.disabled = true;
      }
     
  }

      
      getEvaluationData(eng)
      {
        fetchEvaluationData(eng).then((jsondata)=>{
            console.log(jsondata);
            let finalDetails = JSON.parse(jsondata.data);
            let rows = [];
           finalDetails.map((item,idx)=>{
            rows[idx] = {};
            Object.keys(item).forEach(function(key) {
              rows[idx][key] = item[key].toString();
                })
           });
            if(finalDetails.length != 0)
            {
              this.setState({readonly : true,
                rows: rows,
                ies : finalDetails[0].individualExecScore,
                errors : [{}]
              });
            }
            
      //       for(let i=0 ; i<finalDetails.length;i++){
      //          var  details =
      //        {   
      //            'engagement_id':finalDetails[i].engagementId,
      //            'assessor_name' : finalDetails[i].assessor_name,
      //            'created_on':finalDetails[i].assessedDate, 
                  
      //        }; 
      //        eData.push(details);
      //        this.setState({
      //         evaluationData: eData
      //           });  
         
      // }    
              
      });   
      }
   getKnackScore(eng)
      {
       fetchKnackScore(eng).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.data != []){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  if(jsonobjects[0][0] != undefined)
                  {
                    this.setState({knackData :jsonobjects[0][0]});
                  } 
                 // alert(JSON.stringify(this.state.knackData)) ;
              }  else{
                  console.log("error");
              } 
           })
      }

   
submitEvaluationData()
{
  document.getElementById("save").setAttribute("disabled", true);
 
      saveEvaluationData(this.state.rows).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  alert("Data Saved Successfully");
                   this.props.history.push({
                  pathname: '/dashboard/managebeneficiary'
                });
              }  else{
                  console.log("error");
              } 
           })

}

render()
{
    
  const columns = [{label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
                 {label: 'Assessed By', name: 'assessor_name',headerStyle: {color:'#FF9800'}},
                 {label: 'Assessed On', name: 'created_on',headerStyle: {color:'#FF9800'}}
 
   
 ]
 const options = {
  filterType: "dropdown",
  responsive: "scroll",
  selectableRows: false
};
  const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
  let button;
  let displayText;
  let knackText;
    button =   <Button type = "submit" id = "save" variant="contained" type="submit" color="primary" disabled = {this.state.disabled}>
      Save
  </Button>;
  knackText = <TextField label = "Knack Score"   type="number" name="knack" id="knack" readonly 
  value={ this.state.knackData.finalScore || ''} />
  
    displayText =  <TextField label = "Individual Score"   type="number" name="individualExecScore"
     onChange={this.handleChange(0)} value = {this.state.ies} InputProps={{ inputProps: { max: 100 } }}
    id="individualExecScore" 
    />
  
    return (
  <div style = {{ width : '100%' }}>
    <form onSubmit={this.mySubmitHandler} method="post">
   <Grid container spacing={2}>
    
        <Grid item xs={12} sm={4}>
          <FormControl>
            {knackText}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl>
            {displayText}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}></Grid>
        </Grid>
        <br/>
        <br/>
        <div  style = {{width : "75%"}} >
        <div className="row clearfix">
        <div className="col-md-12 column">
        <table
          className="table table-bordered table-hover"
          id="tab_logic"
        >
          <thead>
            <tr>
              <th className="text-center"> Group Exercise Score </th>
              <th className="text-center"> Behaviour Interview Score </th>
              <th className="text-center"> Assessor Name </th>
          <th />
          </tr>
        </thead>
        <tbody>
          {this.state.rows.map((item, idx) => (
            <tr id="addr0" key={idx}>
              
            <td>
							<TextField  type="number"  onChange={this.handleChange(idx)} name="groupExecObservation" 
							id="groupExecObservation" InputProps={{ inputProps: {  max: 16 } }}
							helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].groupExecObservation != undefined ? this.state.errors[idx].groupExecObservation.label : '' } 
             error = {this.state.errors[idx] != undefined && this.state.errors[idx].groupExecObservation != undefined ? this.state.errors[idx].groupExecObservation.value : '' }	
              value={this.state.rows[idx].groupExecObservation}
							/>
               </td>
             <td>
              <TextField  type="number"  onChange={this.handleChange(idx)} name="behaviourInterviewObservation" 
							id="behaviourInterviewObservation" InputProps={{ inputProps: {  max: 20 } }}
              helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].behaviourInterviewObservation != undefined ? this.state.errors[idx].behaviourInterviewObservation.label : '' } 
              error = {this.state.errors[idx] != undefined && this.state.errors[idx].behaviourInterviewObservation != undefined ? this.state.errors[idx].behaviourInterviewObservation.value : '' }
              value={this.state.rows[idx].behaviourInterviewObservation}
							/>
              </td>
              <td>
              <TextField  type="text" name="assessorName"
						helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].assessorName != undefined ? this.state.errors[idx].assessorName.label : '' } 
            error = {this.state.errors[idx] != undefined && this.state.errors[idx].assessorName != undefined ? this.state.errors[idx].assessorName.value : '' }
               id="assessorName"  
               onChange={this.handleChange(idx)}
               value={this.state.rows[idx].assessorName}
							 />
              </td>
               <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={this.handleRemoveSpecificRow(idx)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
                  <Input type = "button" onClick={this.handleAddRow} className="btn btn-primary" value = "Add Row" />
                  <Input type = "button" onClick={this.handleRemoveRow} className="btn btn-danger float-right" value = "Delete Row" />
                  </div>
      <br/>
      <br/>
      {button}
    
    </form>
    <br/>
    <br/>
    </div>
    );
}

}
export default AssessorEvaluation;