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
import { changeStudentStatus }from './../util/api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
  import { FormControl , FormControlLabel , InputLabel, Input, Grid , RadioGroup, Radio}  from '@material-ui/core';
import styles from "../components/components.js"; 
import { CommunicationCallMerge } from 'material-ui/svg-icons';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import MUIDataTable from "mui-datatables";
import { fectUserDetails, fetchUsersByCenterId, fetchUserDetailsById,BusinessIdeaEvaluationSaveOrUpdate,
  fetchBusinessIdeaEvaluationData,fetchEvaluationData,fetchObservationdetails,fetchBusinessIdeaEvaluationQuestions } from './../util/api';
//import MasterData from './../components/MasterData.js'
import AlertDialog from './../util/AlertDialog';
import {isNotEmpty} from './../util/validation';
const alertDialogOptions = {
  message: ''
}
class BusinessEvaluation extends Component
{
    
  constructor(props) {
    super(props);
    this.state = {count : 0 , rows : [] , dbUserId : props.id ,  firstName : props.name,  engagementId : props.engagementId,businessData:[{createdBy : UserContext.userid, createdOn:UserContext.createdOn, dbUserId:UserContext.dbUserId}],
    allQuestionAnswers:[],questionAnswer1:[],questionAnswer2:[],
    questionAnswer3:[],questionAnswer4:[],questionAnswer5:[],
    questionAnswer6:[],questionAnswer7:[],
    questionAnswer8:[],questionAnswer9:[],questionAnswer10:[],questionAnswer11:[],questionAnswer12:[],
    answersFromdb:[],alertDialogFlag:false,disablButton:false
  };
  // alert(this.state.createdOn);
     this.mydata = {businessEvalData:[],
       users:[]
      };
     this.handleInputChange = this.handleInputChange.bind(this);
    // this.getUserDetails = this.getUserDetails.bind(this);
      this.getObservationMasters();
     this.fetchObservationDetails();
     this.fetchUserDetailsByCenterId();
    this.fetchDetailByEngagement();



     fetchBusinessIdeaEvaluationData(this.state.engagementId).then((jsondata) => { 
      // if(jsondata.appError==null){    
       let jsonobjects = JSON.parse(jsondata.data);  
       this.setState({answersFromdb : jsonobjects});
       for(let i=0;i<jsonobjects.length;i++){
         if(i==0){this.setState({questionAnswer1 :jsonobjects[i]});}
         if(i==1){this.setState({questionAnswer2 :jsonobjects[i]});}
         if(i==2){this.setState({questionAnswer3 :jsonobjects[i]});}
         if(i==3){this.setState({questionAnswer4 :jsonobjects[i]});}
         if(i==4){this.setState({questionAnswer5 :jsonobjects[i]});}
         if(i==5){this.setState({questionAnswer6 :jsonobjects[i]});}
         if(i==6){this.setState({questionAnswer7 :jsonobjects[i]});}
         if(i==7){this.setState({questionAnswer8 :jsonobjects[i]});}
         if(i==8){this.setState({questionAnswer9 :jsonobjects[i]});}
         if(i==9){this.setState({questionAnswer10 :jsonobjects[i]});}
         if(i==10){this.setState({questionAnswer11 :jsonobjects[i]});}
         if(i==11){this.setState({questionAnswer12 :jsonobjects[i]});}

   
        }
   });

     
 }



 getBusinessCaseAnswer(id){
  let answersFromdb=this.state.answersFromdb;
  for (let i = 0; i < answersFromdb.length; i++) {
      var sigleAnsewr =answersFromdb[i];
            if(sigleAnsewr.questionId==id){
               return sigleAnsewr.answer;
            }
           
  }
}


 handleInputChange = (id,uniqKey) => e => {
   const rows = [...this.state.rows];
   const ques = document.getElementById(id).getAttribute("value");
   const { name, value } = e.target;
   rows[this.state.count] = {};
   rows[this.state.count] [name]= value;
  //  rows[this.state.count]['question'] = ques;
  //  rows[this.state.count]['dbUserId'] = this.state.dbUserId;
  //  rows[this.state.count]['createdBy'] = UserContext.userid;
  //  rows[this.state.count]['createdOn'] = UserContext.createdOn;
  //  rows[this.state.count]['engagementId'] = this.state.engagementId;
  //  rows[this.state.count]['firstName'] = this.state.firstName;
  //  this.setState({
  //    rows
  //  });
  //  this.setState({
  //    count : this.state.count + 1
  //  });
  

  var engagementId= this.state.engagementId;


  console.log(id);

   if(id==1){
    this.setState({
      questionAnswer1: {...this.state.questionAnswer1,
        "engagementId":engagementId, "questionId":id,
        "subQuestionId":uniqKey,"answer": value,"remarks":"No",
        "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
  }
    if(id==2){
      this.setState({
        questionAnswer2: {...this.state.questionAnswer2,
          "engagementId":engagementId, "questionId":id,
        "subQuestionId":uniqKey,"answer": value,"remarks":"No",
        "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())


    }
    if(id==3){
      this.setState({
        questionAnswer3: {...this.state.questionAnswer3,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==4){
      this.setState({
        questionAnswer4: {...this.state.questionAnswer4,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())


    }
    if(id==5){
      this.setState({
        questionAnswer5: {...this.state.questionAnswer5,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())

    }
    if(id==6){
      this.setState({
        questionAnswer6: {...this.state.questionAnswer6,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==7){
      this.setState({
        questionAnswer7: {...this.state.questionAnswer7,
          "engagementId":engagementId, "questionId":id,
        "subQuestionId":uniqKey,"answer": value,"remarks":"No",
        "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==8){
      this.setState({
        questionAnswer8: {...this.state.questionAnswer8,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==9){
      this.setState({
        questionAnswer9: {...this.state.questionAnswer9,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==10){
      this.setState({
        questionAnswer10: {...this.state.questionAnswer10,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==11){
      this.setState({
        questionAnswer11: {...this.state.questionAnswer11,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }
    if(id==12){
      this.setState({
        questionAnswer12: {...this.state.questionAnswer12,
          "engagementId":engagementId, "questionId":id,
          "subQuestionId":uniqKey,"answer": value,"remarks":"No",
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}},()=>this.validate())
    }

 };

 mySubmitHandler = (event) => {
     event.preventDefault();
     this.submitBusinessEvalDetails();
     //document.getElementById("observation-form").reset();
    // this.refs["user-form"].form.reset()
 }


 submitBusinessEvalDetails()
{
  let bieStatus = "";
this.setState({allQuestionAnswers:[]},()=>{
this.state.allQuestionAnswers.push(this.state.questionAnswer1);
this.state.allQuestionAnswers.push(this.state.questionAnswer2);
this.state.allQuestionAnswers.push(this.state.questionAnswer3);
this.state.allQuestionAnswers.push(this.state.questionAnswer4);
this.state.allQuestionAnswers.push(this.state.questionAnswer5);
this.state.allQuestionAnswers.push(this.state.questionAnswer6);
this.state.allQuestionAnswers.push(this.state.questionAnswer7);
this.state.allQuestionAnswers.push(this.state.questionAnswer8);
this.state.allQuestionAnswers.push(this.state.questionAnswer9);
this.state.allQuestionAnswers.push(this.state.questionAnswer10);
this.state.allQuestionAnswers.push(this.state.questionAnswer11);
this.state.allQuestionAnswers.push(this.state.questionAnswer12);

if(this.validate())
  {
  BusinessIdeaEvaluationSaveOrUpdate(JSON.stringify(this.state.allQuestionAnswers)).then((jsondata) => { 
    this.setState({alertDialogFlag:false});
      let jsonobjects = JSON.parse(jsondata.data);
            
      alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
      this.setState({alertDialogFlag:true});
      this.setState({disablButton:true});
    });
  }
this.fetchDetailByEngagement();


}
);
bieStatus="Shortlisted";

let statusChangeData='"engagementId":'+this.state.engagementId+',"status": "' +bieStatus +  '"' ;
changeStudentStatus(statusChangeData).then((jsondata) => { 
  //alert(statusChangeData);
    console.log(jsondata.data);
    this.setState({statusChangeData})
        alert("Business Evaluation completed successfully");
        
  });
}


fetchDetailByEngagement(engagementId)
{
    // let formData = new FormData();
    //     formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "ViewByEngagementId" +'", "data" : [{ "engagementId":' + engagementId + '} ]}');
       
    try {
      fetchEvaluationData(engagementId)
      //  fetch("http://playground.tatastrive.com/sservices-v1/engagement", {
      //   method: "POST",
      //   body: formData 
      //   }).then(response => response.json())
        
        .then((jsondata)=>{
            console.log(jsondata); 
            if(jsondata.appError==null){      
                let jsonobjects = JSON.parse(jsondata.data);
                var check=  jsonobjects[0].engagementId
            }  
         })
        .catch(error => {
         
        });
    
    }  catch (error) {
      
    }
}


fetchUserDetailsByCenterId() {
fetchUsersByCenterId(UserContext.centerId).then((jsondata) => {
 let dbUserId = [];
let userCenterRoleMap = JSON.parse(jsondata.data);
userCenterRoleMap.map(item => {dbUserId.push({ id: item.userId })  });

fetchUserDetailsById(JSON.stringify(dbUserId)).then((jsondata) => {
 let userDetails = JSON.parse(jsondata.data);
 for (var i = 0; i < userDetails.length; i++) {
   let user = userDetails[i];
   this.mydata.users.push({label : user.firstName + " " + user.lastName , value : user.id});
  //alert(JSON.stringify(this.myData.users)) ;
  
 }
});
});
}
 getObservationMasters(){

  //  let formData = new FormData();
  //  formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
  //  fetch("http://playground.tatastrive.com/services-v1/bieservice", {
  //      method: "POST",
  //      body: formData 
  //      }).then(response => response.json()).
       
       
       fetchBusinessIdeaEvaluationQuestions().then((jsondata)=>{
           console.log(jsondata); 
          // alert(jsondata);
          //aler("check");
           if(jsondata.appError==null){     
               let jsonobjects = JSON.parse(jsondata.data);
              // jsonobjects.map(item => { this.mydata.businessEvalData.push({label: item.question, value: item.id})
              jsonobjects.map(item => { this.mydata.businessEvalData.push({question: item.question, value: item.id,parameter:item.parameter,subParameter:item.subParameter,
                evaluatorReponse1:item.evaluatorReponse1,score1:item.score1,
                evaluatorReponse2:item.evaluatorReponse2,score2:item.score2,
                evaluatorReponse3:item.evaluatorReponse3,score3:item.score3,
                uniqKey:item.uniqKey,id:item.id})
              })
              this.setState({mydata : jsonobjects});
           } 
           return (true);
        }).then(response => response);
       }

       fetchObservationDetails() {
       
         let observationInfo=[];
        //  let requestFormData = new FormData();  
        //  requestFormData.append('data', '{"token" : "", "action" : "viewAllObservationsForUser", "data" : [{"engagementId":'+this.state.engagementId+'}]}');
        //  fetch("http://playground.tatastrive.com/sservices-v1/observationservice",{
        //  method: "POST",
        //  body: requestFormData, 
        //  }).then(response => response.json())
         
         
        fetchObservationdetails(this.state.engagementId).then((jsondata)=>{   
           let  observationDetails = JSON.parse(jsondata.data);  
        //alert(observationDetails);

                 for(let i=0;i<observationDetails.length;i++){
                   let name = "";
                   fectUserDetails(observationDetails[i].createdBy).then((jsondata) => {
                     name  =  JSON.parse(jsondata.data)[0].firstName + " " + JSON.parse(jsondata.data)[0].lastName;
                     var  details =
                  {   
                      'engagement_id':observationDetails[i].engagementId,
                      'first_name' : name,
                      'created_on':observationDetails[i].createdOn
                       
                  }; 
                  observationInfo.push(details);
                  this.setState({
                   info: observationInfo
                     });  
               }); 
             }    
            
          })  
     }
 
validate = ()=>{
let flag=true;
  if(this.state.questionAnswer1.answer==null){
    document.getElementById("error1").style.display = "block";
    flag=false}
  else {document.getElementById("error1").style.display = "none";}

   if(this.state.questionAnswer2.answer==null){document.getElementById("error2").style.display = "block";
    flag=false}
  else {document.getElementById("error2").style.display = "none";}

  if(this.state.questionAnswer2.answer==null){document.getElementById("error2").style.display = "block";
  flag=false}
else {document.getElementById("error2").style.display = "none";}

if(this.state.questionAnswer3.answer==null){document.getElementById("error3").style.display = "block";
    flag=false}
  else {document.getElementById("error3").style.display = "none";}

  if(this.state.questionAnswer4.answer==null){document.getElementById("error4").style.display = "block";
    flag=false}
  else {document.getElementById("error4").style.display = "none";}

  if(this.state.questionAnswer5.answer==null){document.getElementById("error5").style.display = "block";
    flag=false}
  else {document.getElementById("error5").style.display = "none";}

  if(this.state.questionAnswer6.answer==null){document.getElementById("error6").style.display = "block";
    flag=false}
  else {document.getElementById("error6").style.display = "none";}

  if(this.state.questionAnswer7.answer==null){document.getElementById("error7").style.display = "block";
    flag=false}
  else {document.getElementById("error7").style.display = "none";}

  if(this.state.questionAnswer8.answer==null){document.getElementById("error8").style.display = "block";
    flag=false}
  else {document.getElementById("error8").style.display = "none";}

  if(this.state.questionAnswer9.answer==null){document.getElementById("error9").style.display = "block";
    flag=false}
  else {document.getElementById("error9").style.display = "none";}

  if(this.state.questionAnswer10.answer==null){document.getElementById("error10").style.display = "block";
    flag=false}
  else {document.getElementById("error10").style.display = "none";}

  if(this.state.questionAnswer11.answer==null){document.getElementById("error11").style.display = "block";
    flag=false}
  else {document.getElementById("error11").style.display = "none";}


  if(this.state.questionAnswer12.answer==null){document.getElementById("error12").style.display = "block";
    flag=false}
  else {document.getElementById("error12").style.display = "none";}
  
  return flag;


}     
 
render()
{

const columns = [{label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
             
              {label: 'Created On', name: 'created_on',headerStyle: {color:'#FF9800'}},
              {label: 'Name', name: 'first_name',headerStyle: {color:'#FF9800'}}


]

const options = {
 filterType: "dropdown",
 responsive: "scroll",

 sortDirection: "desc"
};

const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
let button;

if (dbUserId) {
 button =   <Button variant="contained" type="submit" color="primary">
 Save
</Button>;
} else {
 button = <Button type="submit" variant="contained" color="secondary">Update</Button>;
}
 return (
   
<div style = {{ width : '100%' }}>

   
 <form onSubmit={this.mySubmitHandler} method="post" id="observation-form">

 <Paper >
   <Table  aria-label="simple table">
     <TableHead>
       <TableRow>
         <TableCell>Business Idea Brief</TableCell>
         <TableCell >Parameter</TableCell>
         <TableCell >Sub-parameter</TableCell>
         <TableCell >Evaluator's response</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
     {this.mydata.businessEvalData.map((row, idx)=> (
         <TableRow key={row.value} name ="parameter" id="parameter">
           <TableCell id = {row.id} name="parameter" value= {row.value}>
           {row.question}
           </TableCell>
           <TableCell id = {row.id} name="parameter" value= {row.value}>
           {row.parameter}
           </TableCell>
           <TableCell id = {row.id} name="parameter" value= {row.value}>
           {row.subParameter}
           </TableCell>
           
           <TableCell align="right"> 
           <RadioGroup row aria-label="observationValue" 
           name="observationValue" id="observationValue"  
           onChange={this.handleInputChange(row.id,row.uniqKey)} 
            defaultValue={row.score1==this.getBusinessCaseAnswer(row.id)?row.score1+"":row.score2==this.getBusinessCaseAnswer(row.id)?row.score2+"":row.score3==this.getBusinessCaseAnswer(row.id)?row.score3+"":""}>
           {(row.evaluatorReponse1) &&
          <FormControlLabel  value={row.score1+""}  
          // checked={row.score1==this.getBusinessCaseAnswer(row.id)?true:false}  
          control={<Radio />} label={row.evaluatorReponse1}></FormControlLabel>
           }
          {(row.evaluatorReponse2) &&
          <FormControlLabel value={row.score2+""} 
          // checked={row.score2==this.getBusinessCaseAnswer(row.id)?true:false} 
          control={<Radio/>} label={row.evaluatorReponse2} />
          }
       {(row.evaluatorReponse3) &&
<FormControlLabel value={row.score3+""} 
// checked={row.score3==this.getBusinessCaseAnswer(row.id)?true:false} 
 control={<Radio />} label={row.evaluatorReponse3} />
       }    
         
     </RadioGroup>
     <div style={{color:"red",display:"none"}}  id ={"error"+row.id}>Please Select Answer</div>  
         </TableCell>     
         </TableRow>
))}
     </TableBody>
   </Table>
 </Paper> 

      
  

   <br/>
     
   {/* {button} */}  
   <Grid container direction="row" justify="flex-end" alignItems="flex-end">
   <Button variant="contained" type="submit" color="primary" 
   disabled={this.state.answersFromdb.length==12?true:this.state.disablButton}>
     Save
   </Button>
   </Grid>
<br/>
{/* 
   <MUIDataTable label={"List of Observation"} data={this.state.info} columns={columns} options={options}
   /> */}

 </form>


 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }

 </div>

 );
}

}

export default BusinessEvaluation;