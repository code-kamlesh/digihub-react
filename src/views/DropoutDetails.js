/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================


* Coded by Ashish S

=========================================================


*/

import React, { Component } from 'react';
import { render } from "react-dom";
import './../App.css';

import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import { FormControl , InputLabel,FormControlLabel, Input, Grid , RadioGroup, Radio, TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {isNotEmpty} from '../util/validation';
import AlertDialog from '../util/AlertDialog';
import { fetchCentersOfUser, fetchCentersDetails, fetchEnrollmentDetailsByBatchId,fetchAllStudentDataByEngagementIdAndReadyForDropout,fetchBatchDetails,fetchStudentDropoutDetailByEngagementId,markDropout,changeStudentStatus,
  fectUserDetails,fetchRunningBatchDetails} from '../util/api';
import MUIDataTable from "mui-datatables";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
const alertDialogOptions = {
  message: ''
}

class Dropout extends Component {
    
  constructor(props) {
    super(props);
     
     this.state = {selectedEngagementId:'',studentDetails:[],dropoutDetails:[],center: [],
     batch:[],centerId: '',batchId:'', dropoutReason:'',
     alertDialogFlag:false , errors : {dropoutReason:''} , 
              
         dropoutReasons : [
          { value: 'Others', label: 'Others' },
          { value: 'Not Interested', label: 'Not Interested' },
          { value: 'Got other job', label: 'Got other job' },
          { value: 'Health Issues', label: 'Health Issues' },
          { value: 'Moved to other place', label: 'Moved to other place' },
          { value: 'Not Eligible', label: 'Not Eligible' },
          { value: 'Marriage', label: 'Marriage' },
          { value: 'Higher Education', label: 'Higher Education'},
          { value: 'Maternity', label: 'Maternity' } 
        ]
        };    
        this.formData = {engagementId:[]}; 
       this.handleSelectChange = this.handleSelectChange.bind(this);
        this.fetchCenterById();
 }
 getMuiTheme = () => createMuiTheme({
  overrides: {
    MuiTableBody: {
      root: {
      
      }
    }
  },
  typography: {
    "fontSize":12,
   }
})

 fetchCenterById() {
  //alert("hi");
  let centerId = [];
  let batchId =[];

  let currentComponent = this;
  fetchCentersOfUser(UserContext.userid).then((jsondata) => {
    let userJsonObjects = JSON.parse(jsondata.data);
    currentComponent.setState({ userScope: userJsonObjects });
    userJsonObjects.forEach(user => {
      centerId.push({ "id": user.centerId });
    })
  }).then(function (result) {
    let centerDetails = [];
    fetchCentersDetails(JSON.stringify(centerId)).then((jsondata) => {
      let centerObjects = JSON.parse(jsondata.data);
      centerObjects.forEach(center => {
        centerDetails.push({ label: center.name, value: center.id });
      })
      currentComponent.setState({ center: centerDetails });
    });
  })
}

handleSelectChange(selectname,event) {
let centerId=[];
let batchId=[];
if (selectname =="centerId"){
  let batchDetails = [];
  centerId.push({ "id": event});
  batchId.push({"id":event});
  
  fetchRunningBatchDetails(event).then((jsondata) => {
    let batchObjects = JSON.parse(jsondata.data);
    //alert(JSON.stringify(batchObjects));
    batchObjects.forEach(batch => {
      batchDetails.push({ label: batch.batchName, value: batch.batchId });
    })
    this.setState({
      batch: batchDetails
    });
    this.setState({batchId:""});
    this.setState({studentDetails:[]});
  });
  
}
else{
this.fetchStudentsByBatchId(event);
}
this.setState({[selectname]: event})
}

handleDropoutReasonSelectChange(selectname,event) {
  this.setState({
       [selectname]: event
     })
this.validate(selectname,event);
    }

fetchDropoutDetilByEngagementId(engagementId){
  let localThis=this;
  let studentDropoutInfo=[];
fetchStudentDropoutDetailByEngagementId(engagementId).then((jsondata) =>{
  if(jsondata.data){
      let dropoutDetails = JSON.parse(jsondata.data);  
      for(var i=0;i<dropoutDetails.length;i++){
        let engagementId=dropoutDetails[i].engagementId;
          let effortSpent=dropoutDetails[i].effortSpent;
            fectUserDetails(dropoutDetails[i].createdBy).then((jsondata) =>{
            let jsonobjects = JSON.parse(jsondata.data);
            var  details =
            {    
                'engagementId':engagementId,
                'effortSpent':effortSpent,
                'createdBy':jsonobjects[0].firstName
            }; 
            studentDropoutInfo.push(details);  
          }).then(function(result){
            localThis.setState({dropoutDetails:[]},()=>{localThis.setState({dropoutDetails:studentDropoutInfo})});
          });  
    } 
  
  }    
  this.setState({dropoutDetails:[]},()=>{this.setState({dropoutDetails:studentDropoutInfo})});
});

}
 fetchStudentsByBatchId(batchId){

  fetchEnrollmentDetailsByBatchId(batchId).then((jsondata) => {
    let enrollmentDetails = JSON.parse(jsondata.data);
    this.formData.engagementId.length=0;
    enrollmentDetails.map(item => {this.formData.engagementId.push({engagementId:item.engagementId}) });
    fetchAllStudentDataByEngagementIdAndReadyForDropout(JSON.stringify(this.formData.engagementId)).then((jsondata) => {
      let studentInfo=[];
  if(jsondata.data){
      let studentDetails = JSON.parse(jsondata.data);   
      for(var i=0;i<studentDetails.length;i++){
        if(studentDetails[i].status==="Enrolled"){
        var  details =
        {    'engagement_id':studentDetails[i].engagementId,
            'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
            'status':studentDetails[i].status
        }; 
        studentInfo.push(details);    
      }
    } 
  
  }    
  
  this.setState({studentDetails:[]},()=>{this.setState({studentDetails:studentInfo})});
  studentInfo=null;
  }); 
  });
 }
 mySubmitHandler = (event) => {
   event.preventDefault();
   if(this.validateForm(this.state.errors)){
   this.markDropout(); 
   }
  }

 validate = (name,value)=>{
  let errors = this.state.errors;
  switch (name) {
    case 'dropoutReason': errors.dropoutReason =isNotEmpty(value);
      break;
      default:
       break;
}

 this.setState({errors});
}

validateForm(errors) 
{
  this.validate("dropoutReason",this.state.dropoutReason);
  this.state.errors = errors;
  this.setState({errors});
  let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

markDropout()
{
  let dropoutData='"engagementId":'+this.state.selectedEngagementId+',"dropoutReason":"'+this.state.dropoutReason+'","status":"Dropout"';
    let statusChangeData='"engagementId":'+this.state.selectedEngagementId+',"status":"Dropout","updatedBy":0';
      this.setState({alertDialogFlag:false});
      markDropout(dropoutData).then((jsondata) => { 
         changeStudentStatus(statusChangeData).then((jsondata) => { 
           alertDialogOptions.message="Data Saved Sucessfully";
           this.setState({alertDialogFlag:true});
           this.fetchStudentsByBatchId(this.state.batchId);
           this.setState({dropoutDetails:[]});
           this.setState({dropoutReason:''});
         });
    });
}

render()
{

  const columns = 
  [
  {label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
  {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
  {label: 'Status', name: 'status',headerStyle: {color:'#FF9800'}}  
 ]
 
  const options = {
    filterType: "dropdown",
    responsive: "stacked",
    sortDirection: "desc",
    selectableRows:"single",
    rowsPerPage:10,
    selectableRowsOnClick: true,
    disableToolbarSelect:true,
    textLabels: {
      body: {
        noMatch: <span style={{color:"blue"}}>Please select batch/ another batch to load students here</span>
      }
    },
    onRowsSelect: (currentRowsSelected,allRows) => {
      var index=currentRowsSelected[0].dataIndex;
      var engagementId= this.state.studentDetails[index].engagement_id      
      if(this.state.selectedEngagementId===engagementId){
        this.setState({selectedEngagementId:''})
        this.state.selectedEngagementId=''; 
      }
      else{
        this.setState({selectedEngagementId:this.state.studentDetails[index].engagement_id})
        this.state.selectedEngagementId=this.state.studentDetails[index].engagement_id; 
        this.state.selectedBeneficiaryName=this.state.studentDetails[index].name;
        this.fetchDropoutDetilByEngagementId(this.state.studentDetails[index].engagement_id);
      }

     }
  };

 return (
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">  
 <fieldset id = "roleBasedDisable">
<Grid id="hideData" container spacing={2}>
     <br></br>
     <Grid item xs={12} sm={3}>
     <SingleSelect  name="centerName" id="centerName"
              placeholder = "Select Center"              
              options={this.state.center}  
              onChange={this.handleSelectChange.bind(this, 'centerId')}
              value={this.state.centerId || '' } 
              helperText={this.state.errors.centerName}  error={this.state.errors.centerName==''?false:true}    
            />
     </Grid>
     <Grid item xs={12} sm={3}>
     <SingleSelect name="batchName" id="batchName"
              placeholder = "Select Batch"              
              options={this.state.batch}  
              onChange={this.handleSelectChange.bind(this, 'batchId')}
              value={this.state.batchId || '' } key={this.state.batchId}
              helperText={this.state.errors.batchName}  error={this.state.errors.batchName==''?false:true}    
            />
      </Grid>
   </Grid>
   <br></br>
   <br></br>
   <MuiThemeProvider theme={this.getMuiTheme()}>    
      <MUIDataTable
       title={"Enrolled Student list"} label={"List of Students"}
        data={this.state.studentDetails} columns={columns} 
        options={options} 
        />
    </MuiThemeProvider>
    <br></br>
    <br></br>
    { 
  (this.state.selectedEngagementId!='') && 
    <Grid id="hideData" container spacing={2}>
     <br></br>
     <Grid item xs={12} sm={3}>
     <SingleSelect  name="dropoutReason" id="dropoutReason"
              placeholder = "Select Reason"              
              options={this.state.dropoutReasons}  
              onChange={this.handleDropoutReasonSelectChange.bind(this, 'dropoutReason')}
              value={this.state.dropoutReason || '' }   key={this.state.dropoutReason}
            />
     </Grid>
     <Grid item xs={12} sm={3}>
     <Button type="submit" variant="contained" color="primary" size="small">Dropout</Button>
     </Grid>
   </Grid>
}
   <br></br>
   </fieldset>


   { 
  (this.state.selectedEngagementId!='') && 
  <table>
  <tr>
    <th>Engagement Id</th>
    <th>Effort Spent</th>
    <th>Created By</th>
  </tr>
  {this.state.dropoutDetails.map(row=>(
  <tr>
    <td>{row.engagementId}</td>
    { (row.effortSpent.length<=10) && <td> {row.effortSpent} </td> }
    { (row.effortSpent.length>10) && <td> {row.effortSpent.substring(0,10)} &nbsp;
    <a href="#" title={row.effortSpent}>read more</a>
    </td> }   
    <td>{row.createdBy}</td>
  </tr>
  ))}
  
</table>
 
}

 </form>
 <br></br>
 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
 </div>

 );
}

}

export default Dropout;