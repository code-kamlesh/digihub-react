import React, { Component ,Fragment,useState} from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {fetchUserDetailsById, saveBatchDetails,fetchCenterCapacity,
  fetchCenterActiveCourses,fetchCourseDetailsByIds,fetchCenterCapacityByIds,fetchUsersByCenterIdAndRoleMapId } from './../util/api';
import {validateDates,  validateOJTDates , validateBatchDescription,validateStartDate,validateAssessmentDate,validateOJTEndDate,ojtStartDateLessThanOjtEndDate} from './../util/validation';
import {isNotEmpty} from './../util/validation';
import {calculateBatchFreezeDate,calculateWeekendDays,diffDays} from './../util/util';


  class Batch extends Component {
  constructor(props) {
  
    super(props);
    this.myData = { 
      course : [],
      users: [],
      classroom:[],
      batchType : [
        { value: 1, label: 'ClassRoom' },
        { value: 2, label: 'Virtual' }            
    ],
    batchOwnerMasterData:[ 
                { value: 'domain_facilitator', label: 'Domain Facilitator'},
                { value: 'ydm_facilitator', label: 'YDM Facilitator'}            
              ]
    };
    if(props.location.state != null && props.location.state != undefined)
    {
      this.state = {startDate:new Date(props.location.state.batch.startDate).toISOString().slice(0,10),endDate:new Date(props.location.state.batch.endDate).toISOString().slice(0,10)
        ,traingHrs:0,Ojt:0,courseData:[],user:[],errors : {courseId:'',batchType:'',batchDescription:'',batchOwner:'',ydmCoach:'',startDate:'',endDate:'',ojtStartDate:'',assessmentDate:'',ojtEndDate:'',batchHelperId:'',domainFacilitator:''},batchData : props.location.state.batch,
        users: [] 
    };
    }
    else
    
    {
      this.state ={startDate:new Date().toISOString().slice(0,10),endDate:new Date().toISOString().slice(0,10),traingHrs:0,Ojt:0,courseData:[], user:[],errors : {courseId:'',batchType:'',batchDescription:'',batchOwner:'',ydmCoach:'',startDate:'',endDate:'',ojtStartDate:'',assessmentDate:'',ojtEndDate:'',batchHelperId:'',domainFacilitator:''},batchData : {freezeDate:'',courseId:'',batchType:'',batchDescription:'',batchOwner:'',ydmCoach:'',startDate:'',endDate:'',ojtStartDate:'',createdBy : UserContext.userid, dbUserId:UserContext.dbUserId,updatedBy:UserContext.userid,
      assessmentDate:'',ojtEndDate:'',batchHelperId:'',domainFacilitator:''
      },users: []};

    }

     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleSelectChange = this.handleSelectChange.bind(this);
     this.fetchUserDetailsByCenterId();
     this.getClassroomMasters();

    //  if(props.location.state != null && props.location.state != undefined)
    //  {
    //   this.setState({startDate:props.location.state.batch.startDate});
    // }
   
    //  else{
    //   this.setState({startDate:new Date().toISOString().slice(0,10)});
    //  }

     fetchCenterActiveCourses(UserContext.centerId).then((jsondata) => {
      let courseDetails=[];
      let centerActiveCourses = JSON.parse(jsondata.data);
      centerActiveCourses.map(item => {courseDetails.push({ id: item.courseId })  });
     this.getCourseMasters(JSON.stringify(courseDetails));
     });
   
     let centerIds=[];
     centerIds.push({centerId: UserContext.centerId});
     fetchCenterCapacityByIds(JSON.stringify(centerIds)).then((jsondata) => {
      let centerCapacityDetails=[];
      let jsonObjects = JSON.parse(jsondata.data);
      jsonObjects.map(item => { centerCapacityDetails.push({label: item.roomName, value: item.id})});
      this.setState({centerCapacity:centerCapacityDetails});
     });
   

    
 }

 getCourseName()
 {
    let batchName = this.state.batchData.batchName;
    let course  = batchName.split("_")[0] + "_" + this.state.batchData.courseId;
    this.state.courseData.map(item =>{ 
      if(item.id == this.state.batchData.courseId){
       this.state.traingHrs=item.trainingHour
       this.state.Ojt=item.ojt
      }
    });
    this.setState({
      batchData : {
        ...this.state.batchData , 
          courseId : course
      }
    });
  //  alert(JSON.stringify(this.state.batchData));

 }
 handleInputChange(event) {
  let errors = this.state.errors;
     const target = event.target;
     const value =  target.value;
     const name = target.name;
  //   const label=target.lable;

  if(name == "batchDescription" )
  {
    
    let res = validateBatchDescription(value);
    this.setState({
      errors: {
        ...this.state.errors,
        [name] : {
          'label' : res , 
          'value' : res == "" ? false : true 
        }
      }
  });
}
 
  if((name == "ojtStartDate" ))
        {
          let res = validateOJTDates(value);
          errors.ojtStartDate=res;
          // if(res===""){
          // res = ojtStartDateLessThanOjtEndDate(value,this.state.batchData.ojtEndDate);
          // }
        //   this.setState({
        //     errors: {
        //       ...this.state.errors,
        //       ojtStartDate:res
        //     }
        // });

// if ojt changes 

let osd=value;
//alert(osd);
let oDate=new Date(osd);
let days=(this.state.Ojt/7)
let actualDays=Math.round(days);

//alert(actualDays);
oDate.setDate(oDate.getDate()+days);
var month = (oDate .getMonth() + 1);
var day = (oDate .getDate());
var year = (oDate .getFullYear());
var actualojtDate= year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
//alert(actualojtDate);

var weekendDays=calculateWeekendDays(value,actualojtDate); 

var date = new Date(actualojtDate);
date.setDate(date.getDate() + weekendDays);
var months= date.getMonth() + 1;
var actualojtDate= date.getFullYear() + "-"+ ('0' +months).slice(-2) + "-" +('0' +date.getDate()).slice(-2);     

this.state.batchData.endDate =  document.getElementById("endDate").value= actualojtDate;
this.state.batchData.ojtEndDate=document.getElementById("ojtEndDate").value= actualojtDate;
this.state.batchData.assessmentDate=document.getElementById("assessmentDate").value= actualojtDate;

      }

  if((name == "endDate" ))
        {
          let res = validateDates(value);
          let ojtEndDateError = validateOJTEndDate(value,this.state.batchData.ojtEndDate);
          this.setState({
            errors: {
              ...this.state.errors,
              endDate:res
            }
        });
        errors.ojtEndDate=ojtEndDateError;
        this.setState({errors});
      }

      if((name == "startDate" ))
      {
        let res = validateStartDate(value);
        this.setState({
          errors: {
            ...this.state.errors,
              startDate: res
          }
      });
     
      this.getFreezeDate(value);

     // this.state.batchData.startDate =  document.getElementById("startDate").value= today;

//batch end date calculation
      let Bsd=value;
      let sDate=new Date(Bsd);
      let days=((this.state.traingHrs+this.state.Ojt)/7)
      let actualDays=Math.round(days);
     // alert(actualDays);
      sDate.setDate(sDate.getDate()+days);
      var month = (sDate .getMonth() + 1);
      var day = (sDate .getDate());
      var year = (sDate .getFullYear());
      var actualDate= year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
      var weekendDays=calculateWeekendDays(value,actualDate);   
      var date = new Date(actualDate);
      date.setDate(date.getDate() + weekendDays);
      var months= date.getMonth() + 1;

     // alert((date.getMonth()+1).length);
      var actualDate= date.getFullYear() + "-"+ ('0' +months).slice(-2) + "-" +('0' +date.getDate()).slice(-2);     
      this.state.batchData.endDate =  document.getElementById("endDate").value= actualDate;
      
    //ojt start date calculation

    this.state.batchData.ojtStartDate =null;
    this.state.batchData.ojtEndDate =null;

  if(this.state.Ojt!='' &&  typeof  this.state.Ojt!="undefined"){
   
    let osdDays=((this.state.traingHrs/7));
    let actualOsdDays=Math.round(osdDays);
     //alert(actualOsdDays);
     let ojtStart = new Date(Bsd);
     ojtStart.setDate(ojtStart.getDate() + osdDays);
     month = (ojtStart .getMonth() + 1);
       day = (ojtStart .getDate());
       year = (ojtStart .getFullYear());
       let actualOsdDate= year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
       this.state.batchData.ojtStartDate =  document.getElementById("ojtStartDate").value= actualOsdDate;
       var osd = actualOsdDate;
    //ojt end date calculations
     let OedDays=((this.state.Ojt/7));
     OedDays = Math.round(OedDays);
     osd  = new Date(osd);
     osd.setDate(osd.getDate()+OedDays);
     month = (osd .getMonth() + 1);
       day = (osd .getDate());
       year = (osd .getFullYear());
       let  actualOedDate= year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
      this.state.batchData.ojtEndDate =  document.getElementById("ojtEndDate").value= actualOedDate;
    }

      this.state.batchData.assessmentDate =  document.getElementById("assessmentDate").value= actualDate;
         
    }
     
      if((name == "ojtEndDate" ))
      {
        let res = ojtStartDateLessThanOjtEndDate(this.state.batchData.ojtStartDate,value);
        errors.ojtStartDate=res;
      }
     this.setState({errors});
     this.setState({
      batchData: {
         ...this.state.batchData,
         [name]: value
       }
     });
     this.validate(name,value);
     
   }
   handleSelectChange(selectname, event) {
//selection of course get the training hrs and ojt duration

let errors = this.state.errors;

if(selectname=="courseId" ){
  //if courseId changes all dates should be blank

  this.state.batchData.startDate= document.getElementById("startDate").value=""
  this.state.batchData.endDate= document.getElementById("endDate").value="";
  this.state.batchData.ojtStartDate= document.getElementById("ojtStartDate").value="";
  this.state.batchData.ojtEndDate=document.getElementById("ojtEndDate").value="";
  this.state.batchData.assessmentDate=document.getElementById("assessmentDate").value="";

  let cId =  event.split("_")[1]
 
  this.state.courseData.map(item =>{ 
    if(item.id==cId){
     this.state.traingHrs=item.trainingHour
     this.state.Ojt=item.ojt
    }
   
  } );
 
}


    // if(selectname == "batchType" && event == 1)
    // {
    //   document.getElementById("ihubId").setAttribute("hidden"  , true);
    //   document.getElementById("ihubProductName").setAttribute("hidden"  , true);
    // }
    // else if (selectname == "batchType" && event == 2)
    // {
      
    //   document.getElementById("ihubId").removeAttribute("hidden");
    //   document.getElementById("ihubProductName").removeAttribute("hidden");
    // }
      if( selectname == "ydmCoach" )
      {
  
       if(this.state.batchData.batchOwner == event)
       {
        
        this.state.batchData.batchOwner = "";
     // alert("Batch Owner and Ydm Coach Should Not be same");
    
     errors.ydmCoach="Batch Owner and Ydm Coach Should Not be same";
    
    }
   }

   if( selectname == "batchOwner" )
   {
    if(this.state.batchData.ydmCoach == event)
    {
     
      this.state.batchData.ydmCoach = "";
      // alert("Batch Owner and Ydm Coach Should Not be same");
       errors.batchOwner="Batch Owner and Ydm Coach Should Not be same";
 }
}


   this.setState({
    batchData: {
       ...this.state.batchData,
       [selectname]: event
     }
   })
 
   this.validate(selectname,event);
  }
 mySubmitHandler = (event) => {
     event.preventDefault();
     if(this.validateForm(this.state.errors)){
     this.submitBatchDetails();
     }   
 }

  fetchUserDetailsByCenterId() {

    fetchUsersByCenterIdAndRoleMapId(UserContext.centerId,4).then((jsondata) => {
      let dbUserId = [];
    let userCenterRoleMap = JSON.parse(jsondata.data);
    userCenterRoleMap.map(item => {dbUserId.push({ id: item.userId })  });
    
    fetchUserDetailsById(JSON.stringify(dbUserId)).then((jsondata) => {
      let userDetails = JSON.parse(jsondata.data);
      let users=[];
    //  let jsonObjects = JSON.parse(jsondata.data);
    userDetails.map(item => {users.push({label : item.firstName + " " + item.lastName , value : (item.id).toString()})});
      this.setState({users:users});
      //for (var i = 0; i < userDetails.length; i++) {
       // let user = userDetails[i];
      //  this.myData.users.push({label : user.firstName + " " + user.lastName , value : user.id});
    //  this.state.users.push({label : user.firstName + " " + user.lastName , value : user.id});
     // }
    });
  });
}
 getCourseMasters(ids){

  // let formData = new FormData();
  // formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
  // fetch("http://playground.tatastrive.com/services-v1/courseservice", {
  //     method: "POST",
  //     body: formData 
  //     }).then(response => response.json()).
      
    //  fetchCourseDetails().then((jsondata)=>{

      fetchCourseDetailsByIds(ids).then((jsondata)=>{
          console.log(jsondata);
          if(jsondata.appError==null){     
              let jsonobjects = JSON.parse(jsondata.data);
           
             jsonobjects.map(item => { this.myData.course.push({label: item.name, value: item.name + "_" + item.id})
             })
             this.setState({courseData : jsonobjects});
             if(this.state.batchData.batchId != undefined)
             {
              this.getCourseName();
             }
             
          } 
          return (true);
       }).then(response => response);
      }

 getClassroomMasters(){

        // let formData = new FormData();
        // formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
        // fetch("http://playground.tatastrive.com/services-v1/centercapacityservice", {
        //     method: "POST",
        //     body: formData 
        //     }).then(response => response.json()).
            
        fetchCenterCapacity().then((jsondata)=>{
                console.log(jsondata);
                if(jsondata.appError==null){     
                    let jsonobjects = JSON.parse(jsondata.data);
                  //  alert(jsonobjects);
                   jsonobjects.map(item => { this.myData.classroom.push({label:item.roomName, value:item.id})
                   })
                 //  this.setState({mydata : jsonobjects});
                   
                } 
                return (true);
             }).then(response => response);
            }
      

submitBatchDetails()
{
 let formData = new FormData();
 let action = "";
 const batchId = (this.state.batchData.batchId == '' || this.state.batchData.batchId == null);
  
    if (!batchId){
      action =  "updateBatch";
      this.state.batchData.updatedBy=UserContext.userid;
      this.state.batchData.courseId = (this.state.batchData.courseId).split('_')[1]; 
   }else{
     action="save";
   }

   this.state.batchData.centerId =UserContext.centerId;
   this.state.batchData.createdBy=UserContext.userid;
 
 saveBatchDetails(action,this.state.batchData).then((jsondata)=>{
         if(jsondata.appError.length==0){      
             let jsonobjects = JSON.parse(jsondata.data);
             console.log(jsonobjects[0].batchName); 
            
             if(action == 'save')
             {
             alert(jsonobjects[0].batchName +" Successfully Created");
             this.props.history.push({
              pathname: '/dashboard/managebatches'
             }
            );
             }

             else 
             {
              alert(jsonobjects[0].batchName +" Successfully Updated");
              this.props.history.push({
               pathname: '/dashboard/managebatches'
              }
              );
              
             }
           
         }  else{
          
         } 
      })
}

validate = (name,value)=>{
  let errors = this.state.errors;
  switch (name) {
    case 'courseId': errors.courseId =isNotEmpty(value);
      break;
      case 'batchType': errors.batchType =isNotEmpty(value);
      break;
      // case 'batchDescription': errors.batchDescription =validateBatchDescription(value);
      // break;
      case 'batchDescription': errors.batchDescription =isNotEmpty(value);
      break;
      case 'startDate': errors.startDate =isNotEmpty(value);
      break;
      case 'endDate': errors.endDate =isNotEmpty(value);
      break;
      case 'batchOwner': errors.batchOwner =isNotEmpty(value);
      break;
      case 'domainFacilitator': errors.domainFacilitator =isNotEmpty(value);
      break;
      case 'ydmCoach': errors.ydmCoach =isNotEmpty(value);
      break;
      case 'assessmentDate': errors.assessmentDate =validateAssessmentDate(this.state.batchData.startDate,value);
      break;
      case 'ojtEndDate': errors.ojtEndDate =validateOJTEndDate(this.state.batchData.endDate,value);
      break;
      case 'batchHelperId': errors.batchHelperId =isNotEmpty(value);
      break;
     default:
     break;
}

 this.setState({errors});
}


validateForm = (errors) => {

this.validate("courseId",this.state.batchData.courseId);
this.validate("batchType",this.state.batchData.batchType);
this.validate("batchDescription",this.state.batchData.batchDescription);
this.validate("batchOwner",this.state.batchData.batchOwner);
if(this.state.batchData.batchOwner==="domain_facilitator"){
  errors.ydmCoach="";
  this.validate("domainFacilitator",this.state.batchData.domainFacilitator);
}
if(this.state.batchData.batchOwner==="ydm_facilitator"){
  errors.domainFacilitator="";
  this.validate("ydmCoach",this.state.batchData.ydmCoach);
}
this.validate("startDate",this.state.batchData.startDate);
this.validate("endDate",this.state.batchData.endDate);
this.validate("assessmentDate",this.state.batchData.assessmentDate);
this.validate("ojtEndDate",this.state.batchData.ojtEndDate);
//this.validate("batchHelperId",this.state.batchData.batchHelperId);


if(this.state.batchData.startDate!='' && this.state.batchData.endDate!=''){
if(diffDays(this.state.batchData.startDate,this.state.batchData.endDate)<=(this.state.traingHrs/7)){
this.state.errors.startDate="Difference between Start date and End Date must NOT be less than Course duration";
}
else{
  this.state.errors.startDate="";

}
}


var ydmCoach=this.state.batchData.ydmCoach;
var batchHelperId=this.state.batchData.batchHelperId;
var batchOwner=this.state.batchData.batchOwner;
let domainFacilitator=this.state.batchData.domainFacilitator;


if(domainFacilitator!="" && batchHelperId!=""){
  if (domainFacilitator === batchHelperId){
    errors.domainFacilitator="Batch Helper and Domain Facilitator not same";
  }
  else{ errors.domainFacilitator="";}
 }
 if(ydmCoach!="" && batchHelperId!=""){
  if (ydmCoach === batchHelperId){
  errors.batchHelperId="YDM Facilitator and Batch Helper not same";
   }
   else{errors.batchHelperId="";}
 }

 if(ydmCoach!="" && domainFacilitator!=""){
  if (ydmCoach === domainFacilitator){
   errors.ydmCoach="YDM Facilitator and Domain Facilitator not same";
   }
   else{errors.ydmCoach="";}
 }

 this.setState({errors});

let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}


getFreezeDate(startDate){

 let courseDetails=[];
 courseDetails.push({id:this.state.batchData.courseId.split("_")[1]});
 fetchCourseDetailsByIds(JSON.stringify(courseDetails)).then((jsondata) => { 
   let courseObject = JSON.parse(jsondata.data);
 var freezeDate =calculateBatchFreezeDate(startDate,courseObject[0].trainingHour);
 this.setState({
  batchData: {
     ...this.state.batchData,
     freezeDate: freezeDate
   }
 })
  });

  }


render()
{

  if(this.state.batchData != null && this.state.batchData != undefined){
    
    
 return (
  
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">
   
 <Grid item xs={12}>
       <FormControl>
       <h5> Batch Details</h5>
         </FormControl>  
     </Grid>
     <br></br>
     <Grid container spacing={4}>
     <Grid item xs={12} sm={4} alignContent="center"  >
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'courseId')} name="courseId" id="courseId"
              placeholder = "Select Coures" required
              value={this.state.batchData.courseId || ''}
              options={this.myData.course}
              disabled = {(this.state.batchData.batchId == undefined || this.state.batchData.batchId == null) ? false : true}
              error={this.state.errors.courseId==''?false:true}
              helperText={this.state.errors.courseId}
            />
            </Grid>
            <br></br><br></br>
            <Grid item xs={12} sm={6}>
            { 
  (this.state.batchData.freezeDate) &&   
  <div style={{color:"red"}}>Batch Freeze Date is :{this.state.batchData.freezeDate.split("-")[2]} - {this.state.batchData.freezeDate.split("-")[1]} - {this.state.batchData.freezeDate.split("-")[0]}
    </div>
            }
          </Grid>  
            <Grid item xs={12} sm={6} id="batchName">
      <FormControl>
        <TextField type="text" name="batchName" id="batchName" style = {{width: 400}} 
         value={this.state.batchData.batchName || ''}  
        hidden = {(this.state.batchData.batchId == undefined || this.state.batchData.batchId == null) ? true : false}
        />
      </FormControl>
      </Grid>  
      </Grid>  


            <br></br>

      <Grid container spacing={4}>

     <Grid item xs={12} sm={3}>
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchType')} name="batchType" id="batchType" required
              placeholder = "Batch Type" value={this.state.batchData.batchType || ''}
              options={this.myData.batchType}
              error={this.state.errors.batchType==''?false:true}
              helperText={this.state.errors.batchType}
            />
            </Grid>      
            { 
  (this.state.batchData.batchType===2) &&  
<React.Fragment>  
  <Grid item xs={12} sm={3} id="ihubId">
<FormControl >
  <InputLabel for="ihubProductId">iHUB Product Id</InputLabel>
  <Input type="text" name="ihubId" id="ihubId" onChange={this.handleInputChange}  value={this.state.batchData.ihubId || ''}/>
</FormControl>
</Grid>

<Grid item xs={12} sm={3} id="ihubProductName" >
<FormControl>
  <InputLabel for="ihubProductName">iHUB Product Name</InputLabel>
  <Input type="text" name="ihubProductName" id="ihubProductName" onChange={this.handleInputChange} value={this.state.batchData.ihubProductName || ''}   />
</FormControl>
</Grid>
</React.Fragment> 
  }

<Grid item xs={12} lg={3}>
<FormControl>
  <TextField type="text" name="batchDescription" id="batchDescription"  
  value={this.state.batchData.batchDescription || ''} onChange={this.handleInputChange}
  label = "Batch Description" 
  error={this.state.errors.batchDescription==''?false:true}
  helperText={this.state.errors.batchDescription}
  
  />
</FormControl>
</Grid>
             
     <Grid item xs={12} sm={3}>
         <TextField id="date" readonly  name = "startDate" id = "startDate" 
          error={this.state.errors.startDate==''?false:true}
          helperText={this.state.errors.startDate}
         onChange={this.handleInputChange}   value={this.state.batchData.startDate || ''}  
         label="Batch Start Date" 
         type="date"
         InputLabelProps={{
           shrink: true,
         }} 
         inputProps={{  min: this.state.startDate, max: new Date('01/01/2050').toISOString().slice(0,10)}}
         disabled={new Date(this.state.startDate) < new Date(new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate())}
         />

     </Grid>

     <Grid item xs={12} sm={3}>
         <TextField id="date" name = "endDate" id = "endDate" 
          error={this.state.errors.endDate==''?false:true}
          helperText={this.state.errors.endDate}
         onChange={this.handleInputChange}  value={this.state.batchData.endDate || ''} 
         label="Batch End Date " 
         type="date"
         InputLabelProps={{
           shrink: true,
         }} 
         inputProps={{  min: this.state.endDate , max: new Date('01/01/2050').toISOString().slice(0,10)}}
         disabled={new Date(this.state.endDate) < new Date(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())}
         />

     </Grid>

     <Grid item xs={12} sm={3}>
         <TextField id="date" name = "ojtStartDate" id = "ojtStartDate" 
          error={this.state.errors.ojtStartDate==''?false:true}
          helperText={this.state.errors.ojtStartDate}
         onChange={this.handleInputChange} value={this.state.batchData.ojtStartDate || ''} 
         label="OJT Start Date" 
         type="date"
         InputLabelProps={{
           shrink: true,
         }} 
         inputProps={{  min: new Date('01/01/2000').toISOString().slice(0,10) , max: new Date('01/01/2050').toISOString().slice(0,10)}}
         disabled={this.state.Ojt===0?true:false}
         />

     </Grid>

     <Grid item xs={12} sm={3}>
         <TextField id="date" name = "ojtEndDate" id = "ojtEndDate" onChange={this.handleInputChange} value={this.state.batchData.ojtEndDate || ''} 
         label="OJT End Date "
         type="date"
         InputLabelProps={{
           shrink: true,
         }} 
         inputProps={{  min: new Date('01/01/2000').toISOString().slice(0,10) , max: new Date('01/01/2050').toISOString().slice(0,10)}}
         error={this.state.errors.ojtEndDate==''?false:true}
         helperText={this.state.errors.ojtEndDate} disabled={this.state.Ojt===0?true:false}
        />
     </Grid>
     <Grid item xs={12} sm={3}>
         <TextField id="date" name = "assessmentDate" id = "assessmentDate" onChange={this.handleInputChange} value={this.state.batchData.assessmentDate || ''} 
         label="Assessment Date "  
         type="date"
         InputLabelProps={{
           shrink: true,
         }} 
         inputProps={{  min: new Date('01/01/2000').toISOString().slice(0,10) , max: new Date('01/01/2050').toISOString().slice(0,10)}}
         error={this.state.errors.assessmentDate==''?false:true}
         helperText={this.state.errors.assessmentDate}
     
      />

     </Grid>

     {/* <Grid item xs={12} sm={3}>
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'classroomId')} name="classroomId" id="classroomId"
              placeholder = "Clasroom"  
              label= "Clasroom"
              value={this.state.batchData.classroomId || ''}
             options={this.myData.classroom}
              
            />
            </Grid> */}

     <Grid item xs={12} sm={3}>
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchOwner')} name="batchOwner" id="batchOwner"
              placeholder = "Select Batch Owner"  
              label="Select Batch Owner"
              key={this.state.batchData.batchOwner}
              value={this.state.batchData.batchOwner || ''}
              options={this.myData.batchOwnerMasterData}
              error={this.state.errors.batchOwner==''?false:true}
              helperText={this.state.errors.batchOwner}   
            />
            </Grid>
            <Grid item xs={12} sm={3}>
             <SingleSelect onChange={this.handleSelectChange.bind(this, 'domainFacilitator')} name="domainFacilitator" id="domainFacilitator"
              placeholder = "Select Domain Facilitator" 
              label="Select Domain Facilitator"
              key={this.state.batchData.domainFacilitator}
              value={this.state.batchData.domainFacilitator || ''}
            //  options={this.myData.users}
              options={this.state.users}
              error={this.state.errors.domainFacilitator==''?false:true}
              helperText={this.state.errors.domainFacilitator} 
            />
            </Grid>

            <Grid item xs={12} sm={3}>
             <SingleSelect onChange={this.handleSelectChange.bind(this, 'ydmCoach')} name="ydmCoach" id="ydmCoach"
              placeholder = "Select YDM Facilitator" 
              label="Select YDM Facilitator"
              key={this.state.batchData.ydmCoach}
              value={this.state.batchData.ydmCoach || ''}
            //  options={this.myData.users}
              options={this.state.users}
              error={this.state.errors.ydmCoach==''?false:true}
              helperText={this.state.errors.ydmCoach}
            />
            </Grid>     

            <Grid item xs={12} sm={3}>
             <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchHelperId')} name="batchHelperId" id="batchHelperId"
              placeholder = "Select Batch Helper" 
              label="Select Batch Helper"
              value={this.state.batchData.batchHelperId || ''}
              //options={this.myData.users}
              options={this.state.users}      
              error={this.state.errors.batchHelperId==''?false:true}
              helperText={this.state.errors.batchHelperId}      
            />
            </Grid> 

            <Grid item xs={12} sm={3}>
             <SingleSelect onChange={this.handleSelectChange.bind(this, 'classroomId')} name="'classroomId'" id="classroomId"
              placeholder = "Classroom" 
              label="Class Room"
              value={this.state.batchData.classroomId || ''}
              options={this.state.centerCapacity}            
            />
            </Grid>


            <Grid item xs={12} lg={3}>
<FormControl>
  <TextField type="text" name="googleMeetLink" id="googleMeetLink"  
  value={this.state.batchData.googleMeetLink || ''} onChange={this.handleInputChange}
  label = "Google Meet Link"
 />
</FormControl>
</Grid>

{/* <Grid item xs={12} lg={3}>
<FormControl>
  <TextField type="text" name="ydmGoogleMeetLink" id="ydmGoogleMeetLink"  
  value={this.state.batchData.ydmGoogleMeetLink || ''} onChange={this.handleInputChange}
  label = "YDM Google Meet Link"
 />
</FormControl>
</Grid> */}

   </Grid>
   <br></br>
   <Grid container direction="row" justify="flex-end" alignItems="flex-end">
   <Button variant="contained" color="primary" type="submit" size="small" disabled={(new Date(new Date(this.state.batchData.endDate).toDateString()) < new Date(new Date().toDateString()))}>  
              Save
                </Button>
                </Grid>
             
 
 </form>
 </div>

 );
        }
    //     else{

    //       return (
  
    //         <div style = {{ width : '100%' }}>
    //          <form onSubmit={this.mySubmitHandler} method="post">
    //          <Grid item xs={12}>
    //                <FormControl>
    //                <h5> Batch Details</h5>
    //                  </FormControl>  
    //              </Grid>
    //              <br></br>
            
    //              <Grid item xs={12} sm={4} alignContent="center" >
    //              <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchName')} name="batchName" id="batchName"
    //                       placeholder = "Select Coures" 
                         
    //                       options={this.myData.course}
                          
    //                     />
    //                     </Grid>
    //                     <br></br>
            
    //               <Grid container spacing={2}>
            
    //              <Grid item xs={12} sm={3}>
    //              <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchType')} name="batchType" id="batchType"
    //                       placeholder = "Select Batch Type" 
    //                       options={this.myData.batchType}
                          
    //                     />
    //                     </Grid>
                        
    //                     <Grid item xs={12} sm={3}>
    //         <FormControl>
    //           <InputLabel for="batchDiscription">Batch Description</InputLabel>
    //           <Input type="text" name="batchDescription" id="batchDescription" onChange={this.handleInputChange}  />
    //         </FormControl>
    //         </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //         <FormControl>
    //           <InputLabel for="ihubProductId">iHUB Product Id</InputLabel>
    //           <Input type="text" name="ihubId" id="ihubId" onChange={this.handleInputChange} />
    //         </FormControl>
    //         </Grid>
            
    //         <Grid item xs={12} sm={3}>
    //         <FormControl>
    //           <InputLabel for="ihubProductName">iHUB Product Name</InputLabel>
    //           <Input type="text" name="ihubProductName" id="ihubProductName" onChange={this.handleInputChange}    />
    //         </FormControl>
    //         </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //                  <TextField id="date" name = "startDate" id = "startDate" onChange={this.handleInputChange} 
    //                  label="Batch Start Date" 
    //                  type="date"
    //                  InputLabelProps={{
    //                    shrink: true,
    //                  }} />
            
    //              </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //                  <TextField id="date" name = "endDate" id = "endDate" onChange={this.handleInputChange} 
    //                  label="Batch End Date " 
    //                  type="date"
    //                  InputLabelProps={{
    //                    shrink: true,
    //                  }} />
            
    //              </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //                  <TextField id="date" name = "ojtStartDate" id = "ojtStartDate" onChange={this.handleInputChange}
    //                  label="OJT Start Date" 
    //                  type="date"
    //                  InputLabelProps={{
    //                    shrink: true,
    //                  }} />
            
    //              </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //                  <TextField id="date" name = "ojtEndDate" id = "ojtEndDate" onChange={this.handleInputChange} 
    //                  label="OJT End Date "
    //                  type="date"
    //                  InputLabelProps={{
    //                    shrink: true,
    //                  }} />
            
    //              </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //                  <TextField id="date" name = "assessmentDate" id = "assessmentDate" onChange={this.handleInputChange}
    //                  label="Assessment Date "  
    //                  type="date"
    //                  InputLabelProps={{
    //                    shrink: true,
    //                  }} />
            
    //              </Grid>
    //              <Grid item xs={12} sm={3}>
    //  <SingleSelect onChange={this.handleSelectChange.bind(this, 'classroomId')} name="classroomId" id="classroomId"
    //           placeholder = "Clasroom"  
    //           label="Clasroom " 
    //           //value={this.state.batchData.classroomId || ''}
    //          options={this.myData.classroom}
              
    //         />
    //         </Grid>
            
    //              <Grid item xs={12} sm={3}>
    //              <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchOwner')} name="batchOwner" id="batchOwner"
    //                       placeholder = "Select Batch Owner" 
    //                       label="Batch Owner "
    //                      options={this.myData.users}
                          
    //                     />
    //                     </Grid>
    //                     <Grid item xs={12} sm={3}>
    //              <SingleSelect onChange={this.handleSelectChange.bind(this, 'ydmCoach')} name="ydmCoach" id="ydmCoach"
    //                       placeholder = "Select YDM Coach" 
    //                       label="YDM Coach "
    //                       options={this.myData.users}
                          
    //                     />
    //                     </Grid>
              
                  
                
                 
                
             
                 
    //            </Grid>
    //           <Button variant="contained" color="primary" type="submit">  
    //           Save
    //             </Button>
             
    //          </form>
    //          </div>
            
    //          );



    //     }
}

}

export default Batch;