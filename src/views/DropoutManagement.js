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
import { roleBasedReadonly , checkButton } from '../util/validation';
import AlertDialog from '../util/AlertDialog';
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import { fetchCentersOfUser, fetchCentersDetails, fetchEnrollmentDetailsByBatchId,fetchAllStudentDataByEngagementId,fetchBatchDetails,saveDropoutDetails,fetchStudentDropoutDetailByEngagementId,
         updateReadyForDropout,fectUserDetails,fetchRunningBatchDetails} from '../util/api';
import MUIDataTable from "mui-datatables";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
const alertDialogOptions = {
  message: ''
}

class DropoutManagement extends Component {
    
  constructor(props) {
    super(props);
     
     this.state = {centerId:'',linkedEngagementId:'',dbUserId:'',status:'',selectedEngagementId:'',studentDetails:[],dropoutDetails:[],center: [],batch:[],batchName:'',engagementId : props.engagementId,centerName:'',centerId: '',batchId:'', alertDialogFlag:false , disabled : false , flag : "0" , errors : {} , 
     dropoutData : {createdOn : UserContext.userid, updatedBy : UserContext.userid ,roleId:'',effortSpent:'',readyForDropout:'N'
         },engagementId:props.engagementId
        };
        this.formData = { course : [], activebatches : [],engagementId:[],alertDialogFlag:false};
      
       this.handleSelectChange = this.handleSelectChange.bind(this);
       this.handleInputChange =this.handleInputChange.bind(this);
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
handleInputChange(event) {
  
     
  const target = event.target;
  let value =  target.value;
  const name = target.name;
  this.setState({
   "disabled" : false
 });

  this.setState({
   dropoutData: {
      ...this.state.dropoutData,
      [name]: value
    }
  })
  
}


handleSelectChange(selectname,event) {
let centerId=[];
let batchId=[];
if (selectname =="centerId"){
  let batchDetails = [];
  centerId.push({ "id": event});
  //batchId.push({"id":event});
  this.setState({center_id:event});
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
  this.setState({batchId:event});
this.fetchStudentsByBatchId(event);
}
}
 fetchStudentsByBatchId(batchId){

  fetchEnrollmentDetailsByBatchId(batchId).then((jsondata) => {
    let enrollmentDetails = JSON.parse(jsondata.data);
    //alert("student details");
    this.formData.engagementId.length=0;
    enrollmentDetails.map(item => {this.formData.engagementId.push({engagementId:item.engagementId}) });
    fetchAllStudentDataByEngagementId(JSON.stringify(this.formData.engagementId)).then((jsondata) => {
      let studentInfo=[];
  if(jsondata.data){
      let studentDetails = JSON.parse(jsondata.data);   
      for(var i=0;i<studentDetails.length;i++){
        if(studentDetails[i].status==="Enrolled"){
        var  details =
        {    'student_id':studentDetails[i].dbUserId,
            'engagement_id':studentDetails[i].engagementId,
            'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
            'status':studentDetails[i].status,
            'readyForDropout':studentDetails[i].readyForDropout
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
 componentDidMount()
    {
      roleBasedReadonly();
    }
 mySubmitHandler = (event) => {
   event.preventDefault();
   this.state.disabled = true;
  this.submitDropoutDetails(); 
 }
 validateAll() 
{
  var nonMandatoryFields = [""];
  var json = this.state.dropoutData;
  var errors = this.state.errors;
  Object.keys(json).forEach(function(key) {
      if((!nonMandatoryFields.includes(key)) && (json[key] == undefined || json[key] == '' ))
      {
        let res = "Please fill out this field";
          errors[key] = {
              'label' : res , 
              'value' : res == "" ? false : true 
            }
     }
  });
  
  this.state.errors = errors;

}

 
 

submitDropoutDetails()
{  
  
  if (this.state.dropoutData.effortSpent!="") {
        saveDropoutDetails(this.state.dropoutData.effortSpent,this.state.selectedEngagementId,UserContext.userid).then((jsondata)=>{
          this.setState({alertDialogFlag:false});
          if(jsondata.appError==null){   
             let jsonobjects = JSON.parse(jsondata.data);
             alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
             this.setState({alertDialogFlag:true});
             this.setState({
              dropoutData: {...this.state.dropoutData,
                 effortSpent: ""
               }
             })
             this.fetchDropoutDetilByEngagementId(this.state.selectedEngagementId);
            }  else{
             console.log("error");
         } 
      })

    }
      if (this.state.dropoutData.readyForDropout==="Y" || this.state.dropoutData.readyForDropout==="N") {
      updateReadyForDropout(this.state.selectedEngagementId,this.state.dropoutData.readyForDropout).then((jsondata)=>{
        this.setState({alertDialogFlag:false});
        if(jsondata.appError==null){   
            let jsonobjects = JSON.parse(jsondata.data);
            alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
            this.setState({alertDialogFlag:true});
        }  else{
            console.log("error");
        } 
     })
    }

}

fetchDropoutDetilByEngagementId(engagementId){
  let localThis=this;
  localThis.setState({dropoutDetails:[]});
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
  });
  }

render()
{

  const columns = [{label: 'Student Id', name: 'student_id',options: { sortDirection: 'desc' },headerStyle: {color:'#FF9800'}},
  {label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
  {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
  {label: 'Status', name: 'status',headerStyle: {color:'#FF9800'}},
  {label: 'readyForDropout', name: 'readyForDropout',headerStyle: {color:'#FF9800'},options: {display: false}}  
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
        this.state.selectedStudentId='';
        this.setState({selectedEngagementId:''})
        this.state.selectedEngagementId=''; 
        this.state.dropoutData.readyForDropout='N';
      }
      else{
        this.setState({selectedEngagementId:this.state.studentDetails[index].engagement_id})
        this.state.selectedStudentId=this.state.studentDetails[index].student_id;
        this.state.selectedEngagementId=this.state.studentDetails[index].engagement_id; 
        this.state.dropoutData.readyForDropout=this.state.studentDetails[index].readyForDropout; 
        this.setState({status:this.state.studentDetails[index].status});
        this.setState({dbUserId:this.state.studentDetails[index].student_id});
        this.fetchDropoutDetilByEngagementId(this.state.studentDetails[index].engagement_id);
      }
     }
  };
 return (
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">
 <Button variant="contained"  color="primary" size="small" disabled={UserContext.roleid==8?false:UserContext.roleid==9?false:true}>
<Link style = {{color : 'white'}} to={{ pathname: '/dashboard/dropout'  
}} > Dropout</Link>
  </Button>  
  <br></br>
   <br></br>
   <br></br>  
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
   <MuiThemeProvider theme={this.getMuiTheme()}>    
      <MUIDataTable
       title={"Enrolled Student list"} label={"List of Students"}
        data={this.state.studentDetails} columns={columns} 
        options={options} 
        />
    </MuiThemeProvider>
 
    <br/><br/>
    { 
  (this.state.selectedEngagementId!='') &&         
  <Grid id="hideData" container spacing={2}> 
  <Grid item xs={12} sm={3}>
   <TextareaAutosize name="effortSpent" id="effortSpent"
          onChange={this.handleInputChange}
          value={this.state.dropoutData.effortSpent}/>

  </Grid>
  { 
  (this.state.dropoutDetails.length!=0) && 
  <Grid item xs={12} sm={3}>
  <FormControlLabel
            control={<Checkbox  checked={this.state.dropoutData.readyForDropout==="Y"?true:false}
            onChange={e => {
              console.log(e.target.checked);
              this.setState({
                dropoutData: {
                   ...this.state.dropoutData,
                   readyForDropout: (e.target.checked==true?"Y":"N")
                 }
               })
            }}
            name="antoine" />}
            label="Ready For Dropout"
          />
</Grid>
}
<Grid item xs={12} sm={3}>
<Button  type="submit"  variant="contained" color="primary" size="small" 
disabled={(this.state.dropoutData.readyForDropout==="N") && (this.state.dropoutData.effortSpent==='')}>
  Save
</Button>
</Grid>
  </Grid>  
    }
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
   </fieldset>
 </form>
 <br></br>
 
 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }

 </div>

 );
}

}

export default DropoutManagement;