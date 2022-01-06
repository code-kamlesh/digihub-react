import React, { Component } from 'react';
import { Checkbox ,FormControl , InputLabel, Input, Grid , TextField,Button}  from '@material-ui/core';
import UserContext from '../components/GolbalContext'
import {saveAttendanceDetails,fetchAllStudentDataByEngagementId,fetchCentersDetails,fetchCentersOfUser,fetchRunningBatchDetails,fetchAttendanceDetailsByAttendanceDateAndBatchId,
  fetchEnrollmentDetailsByBatchId,fetchBatchDetailsByBatchId} from './../util/api';
import AlertDialog from './../util/AlertDialog';
import { SingleSelect } from "react-select-material-ui";
const alertDialogOptions = {
    message: ''
  }
export default class Attendance extends Component{
    constructor(props){
        super(props)
        this.state = {center: [],batchId:"",batchs:[],attendanceDate:"",attendanceDetails:[],
                      startDate:"",endDate:"",notSubmit:false};
        let centerId = [];
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
    handleCenterChange(selectname, event) {
      this.setState({[selectname]:event});
      this.setState({batchId:""});
      this.setState({attendanceDetails: []});
      fetchRunningBatchDetails(event).then((jsondata)=>{    
          let studentInfo=[];
        let  batchDetails = JSON.parse(jsondata.data);  
              for(var i=0;i<batchDetails.length;i++){
              var  details =
              {    
                'value':batchDetails[i].batchId,
                'label':batchDetails[i].batchName            
              }; 
              studentInfo.push(details);    
          }    
          this.setState({batchs: studentInfo });
       }) 
    }
    handleBatchChange(selectname,event) {
        this.setState({[selectname]:event});
        fetchBatchDetailsByBatchId(event).then((jsondata) => {
          let batchObject = JSON.parse(jsondata.data);
          var previousDate = new Date();
          previousDate.setDate(previousDate.getDate()-3);

          var  previousmonth = (previousDate .getMonth() + 1);
          var  previousday = (previousDate .getDate());
          var  previousyear = (previousDate .getFullYear());
          let startDate= previousyear + "-" + ('0' + previousmonth).slice(-2) + "-" + ('0' + previousday).slice(-2);
        

         var currentDate = new Date();
         var  month = (currentDate .getMonth() + 1);
         var  day = (currentDate .getDate());
         var year = (currentDate .getFullYear());
         let endDate= year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
        

          this.setState({startDate:startDate});
          this.setState({endDate:endDate});
        })
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value})
        this.setState({notSubmit:false});
        let currentComponent = this;
       fetchAttendanceDetailsByAttendanceDateAndBatchId(this.state.batchId,value).then((jsondata) => {
            let studentData =[];
            let objects = JSON.parse(jsondata.data);
          if(objects.length!=0){            
            objects.forEach(object => {
              let  engagementIds=[];
              engagementIds.push({ engagementId: object.engagementId });
              let  status=object.status;
              let  engagementId=object.engagementId;
              let  id=object.id;
              let  attendanceDate=object.attendanceDate;
              let  batchId=object.batchId;
              let  createdBy=object.createdBy;
              fetchAllStudentDataByEngagementId(JSON.stringify(engagementIds)).then((jsondata) => {
                let studentObjects = JSON.parse(jsondata.data);
                studentData.push({attendanceMechanism:'E',updatedBy:0,createdBy:createdBy,batchId: batchId,attendanceDate: attendanceDate,id: id, name: studentObjects[0].firstName+""+studentObjects[0].lastName, status: status,engagementId:engagementId});
              }).then(function(result){
                currentComponent.setState({attendanceDetails: []},()=>{
                    currentComponent.setState({attendanceDetails:studentData});
                });
              });
              })
            }
              else {
              fetchEnrollmentDetailsByBatchId(this.state.batchId).then((jsondata) => {
                let objects = JSON.parse(jsondata.data);
                objects.forEach(object => {
                  let  engagementIds=[];
                  engagementIds.push({ engagementId: object.engagementId });
                  let  status=object.status;
                  let  engagementId=object.engagementId;
                  fetchAllStudentDataByEngagementId(JSON.stringify(engagementIds)).then((jsondata) => {
                    let studentObjects = JSON.parse(jsondata.data);
                    studentData.push({attendanceMechanism:'E',updatedBy:0,createdBy:UserContext.userid,id:0,batchId: 0,attendanceDate: "",name: studentObjects[0].firstName+""+studentObjects[0].lastName, status:"A",engagementId:engagementId});
                  }).then(function(result){
                    currentComponent.setState({attendanceDetails: []},()=>{
                        currentComponent.setState({attendanceDetails:studentData});
                    });
                  });
                  })

              })
            }
          });     
      }

      handleChange(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        var attendanceDetails = [...this.state.attendanceDetails];
        
              var index = attendanceDetails.findIndex(obj => obj.engagementId == name);
              if(attendanceDetails[index].status==="P"){
               attendanceDetails[index].status ="A";
               attendanceDetails[index].batchId =this.state.batchId;
               attendanceDetails[index].attendanceDate =this.state.attendanceDate;
             }
     else {
       attendanceDetails[index].status ="P";
       attendanceDetails[index].batchId =this.state.batchId;
       attendanceDetails[index].attendanceDate =this.state.attendanceDate;
     }       
             this.setState({attendanceDetails});
     }

saveAttendaces = (event) => {
  let studentData =[];
  var batchId =this.state.batchId;
  var attendanceDate =this.state.attendanceDate;
  var attendanceDetails = [...this.state.attendanceDetails];
  attendanceDetails.forEach(attendanceDetail => {
    studentData.push({attendanceMechanism:'E',createdBy:attendanceDetail.createdBy,id:attendanceDetail.id,batchId: batchId,attendanceDate: attendanceDate,name:attendanceDetail.name, status:attendanceDetail.status,engagementId:attendanceDetail.engagementId,updatedBy:UserContext.userid});    
  })
  this.setState({attendanceDetails: []},()=>{
    this.setState({attendanceDetails:studentData},()=>{
      saveAttendanceDetails(JSON.stringify(this.state.attendanceDetails)).then((jsondata)=>{ 
        this.setState({alertDialogFlag:false});   
        alertDialogOptions.message="Data Saved Sucessfully";
        this.setState({alertDialogFlag:true});
        this.setState({notSubmit:true});
     }) 
    });
  });
}


  render(){
  return(
  <div style = {{ width : '100%' }}>
      {/* <form  method="post"> */}
       <Grid container spacing={2}>
      <Grid item xs={12}>
          </Grid>
          <Grid item xs={4}>
                <InputLabel shrink={true} >Center Name</InputLabel>
                <SingleSelect 
                  name="centerName" id="centerName"
                  options={this.state.center}
                  onChange={this.handleCenterChange.bind(this, 'centerId')}
                  value={this.state.centerId || '' } />
              </Grid>
  
          <Grid item xs={4}>
          <InputLabel shrink={true} >Batch Name</InputLabel>
            <SingleSelect 
                  name="batchId" id="batchId"
                  options={this.state.batchs}
                  onChange={this.handleBatchChange.bind(this, 'batchId')}
                  value={this.state.batchId || '' } 
                  key={this.state.batchId}
                  />
          </Grid> 
          <Grid item xs={12} sm={3}>
              <TextField id="attendanceDate" name="attendanceDate" id="attendanceDate"
                label="Attendance Date"
                type="date"
                onChange={this.handleInputChange.bind(this)}
                inputProps={{
                 min: this.state.startDate.toString(), max: this.state.endDate.toString()
                }} 
                InputLabelProps={{
                  shrink: true,
                }} 
                />
            </Grid>
        </Grid>

        <br/><br/>
        <table style = {{ width : '100%' }}>
  <tr>
    <th>Action</th>
    <th>Name</th>
    <th>Engagement Id</th>
    <th>Status</th>
  </tr>

  
  {this.state.attendanceDetails.map(row => (
    <tr>
    <td><Checkbox
            checked={row.status==="P"?true:false}
            onChange={this.handleChange.bind(this)}
            name={row.engagementId}
            value={row.engagementId}
            color="primary"
          /></td>
    <td>{row.name}</td>
    <td>{row.engagementId}</td>
    <td>{row.status}</td>
  </tr>
))}
</table>
    <br/>    
    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
    <Button disabled={this.state.attendanceDetails.length==0?true:this.state.notSubmit==true?true:false} variant="contained"  size="small" color="primary" onClick={this.saveAttendaces}>Save</Button> 
        </Grid>
        
          {/* </form> */}
          { 
    (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
      }
          </div>

          
  )

  }  
  
}