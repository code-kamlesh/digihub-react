import React, { Component } from 'react';
import { FormControl , InputLabel, Input, Grid , TextField,Button}  from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {businessCaseSaveOrUpdate,fetchBusinessCaseQuestions,fetchUserDocuments,fetchBusinessCaseMetaData,
  uploadDocument} from './../util/api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UserContext from '../components/GolbalContext'
import {DropzoneArea} from 'material-ui-dropzone'
import AlertDialog from './../util/AlertDialog';
import { serviceEndPoint } from './../util/serviceEndPoint';

const alertDialogOptions = {
  message: ''
}
export default class BusinessCase extends Component{
constructor(props){
super(props);
this.state = {allQuestionAnswers:[],questionAnswer1:[],questionAnswer2:[],
              questionAnswer3:[],questionAnswer4:[],questionAnswer5:[],
              questionAnswer6:[],questionAnswer7:[],
              questionAnswer8:[],questionAnswer9:[],questionAnswer10:[],
              businessCaseMetaData:[],userBusinessCaseDocuments:[],
              answersFromdb:[],answerValue:[{value:''},{value:''},{value:''},{value:''},{value:''},
              {value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],
              businessCasefile:null,businessCaseFileName:'',dbUserId:'', engagementId : 0,
              errors:{metaDataError1:'',metaDataError2:'',metaDataError3:'',metaDataError4:'',
              metaDataError5:'',metaDataError6:'',metaDataError7:'',metaDataError8:'',
              metaDataError9:'',metaDataError10:'',linkedEngagementId:''}
              


            };
this.formData={
    businessCaseMetaData:[]
};


if(props.id != null && props.id != undefined)
{
   this.state.dbUserId=props.id;
   this.state.engagementId=props.engagementId;
   this.state.linkedEngagementId=props.linkedEngagementId;
}


fetchBusinessCaseQuestions().then((jsondata) => { 
    if(jsondata.appError==null){    
    let jsonobjects = JSON.parse(jsondata.data);           
    this.setState({businessCaseMetaData : jsonobjects});
    }
});
fetchUserDocuments((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ?this.state.linkedEngagementId:this.state.engagementId,'Business Brief','P').then((jsondata) => {   
  console.log(jsondata);
    let jsonobjects = JSON.parse(jsondata.data);          
    this.setState({userBusinessCaseDocuments : jsonobjects});
    
});

fetchBusinessCaseMetaData((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ?this.state.linkedEngagementId:this.state.engagementId).then((jsondata) => { 
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

     }





  //  }
});
}
handleInputChange = (event) =>{  
    const target = event.target;  
    const value = target.value;  
    const name = target.name;  
    const id = target.id;
    let item = this.state.answerValue[id];
    item.value = value;
    this.state.answerValue[id]=item;
    let question={};
    
    var userId=this.state.dbUserId;
    var engagementId=this.state.engagementId;
     question.userId=this.state.dbUserId;
    question.questionId=id;
    question.createdBy=1;
    question.updatedBy=1;
    question.answer=value;
    question.remarks="No";
    question.engagementId=this.state.engagementId;
    const totalCharacters=100;
    document.getElementById("leftCharacters"+name).innerHTML="Number of characters left "+(totalCharacters-value.length);

    if(id==1){
    this.setState({
      questionAnswer1: {...this.state.questionAnswer1,
        "answer": value,"userId": userId,"remarks":"No",
        "questionId":id,"engagementId":engagementId,
        "createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
  }
    if(id==2){
      this.setState({
        questionAnswer2: {...this.state.questionAnswer2,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}})


    }
    if(id==3){
      this.setState({
        questionAnswer3: {...this.state.questionAnswer3,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,
          "createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }
    if(id==4){
      this.setState({
        questionAnswer4: {...this.state.questionAnswer4,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})


    }
    if(id==5){
      this.setState({
        questionAnswer5: {...this.state.questionAnswer5,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})

    }
    if(id==6){
      this.setState({
        questionAnswer6: {...this.state.questionAnswer6,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }
    if(id==7){
      this.setState({
        questionAnswer7: {...this.state.questionAnswer7,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }
    if(id==8){
      this.setState({
        questionAnswer8: {...this.state.questionAnswer8,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }
    if(id==9){
      this.setState({
        questionAnswer9: {...this.state.questionAnswer9,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }
    if(id==10){
      this.setState({
        questionAnswer10: {...this.state.questionAnswer10,
          "answer": value,"userId": userId,"remarks":"No",
          "questionId":id,"engagementId":engagementId,"createdBy":UserContext.userid,"updatedBy":UserContext.userid}})
    }

}  

saveBusinessCaseDetails=(event)=>{
     event.preventDefault();
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

businessCaseSaveOrUpdate(JSON.stringify(this.state.allQuestionAnswers)).then((jsondata) => { 
  this.setState({alertDialogFlag:false});
   // if(jsondata.appError==''){ 
    let jsonobjects = JSON.parse(jsondata.data);
    alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
    this.setState({alertDialogFlag:true});


    // this.props.history.push({
    //   pathname: '/dashboard/managebeneficiary',
    //   state: { dbUserId: jsonobjects[0].dbUserId ,  tab : 6 }
    // });
  //  } 
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


// onFileChangeHandler = (e) => {
  onFileChangeHandler = (files) => {
 // e.preventDefault();
 //  this.setState({businessCasefile: e.target.files[0]});

 this.setState({
  businessCasefile: files[0]
});
}
 

uploadBusinessCaseDocument = (e) => {
  e.preventDefault();
  this.setState({alertDialogFlag:false});
  let formData = new FormData();
  // formData.append('file', this.state.businessCasefile);

let localThis=this;

  let reader = new FileReader();
  reader.readAsDataURL(this.state.businessCasefile);
  reader.onload = function () {
  let  document = reader.result;
  

  uploadDocument(localThis.state.dbUserId,localThis.state.engagementId,"Business Brief","P","Business Brief",document,"")
  .then((jsondata) => {
    alertDialogOptions.message=<span style={{color:"green"}}>File uploaded successfully</span>;
    localThis.setState({alertDialogFlag:true});
    localThis.setState({businessCasefile:''});
    fetchUserDocuments(localThis.state.engagementId,'Business Brief','P').then((jsondata) => {   
        let jsonobjects = JSON.parse(jsondata.data);          
        localThis.setState({userBusinessCaseDocuments : jsonobjects});
 })
  // .then(res => {
  //     if(res.ok) {
  //         alertDialogOptions.message=<span style={{color:"green"}}>File uploaded successfully</span>;
  //         localThis.setState({alertDialogFlag:true});
  //         localThis.setState({businessCasefile:''});
  //         fetchUserDocuments(localThis.state.engagementId,'Business Brief','P').then((jsondata) => {   
  //         let jsonobjects = JSON.parse(jsondata.data);          
  //         localThis.setState({userBusinessCaseDocuments : jsonobjects});
            
  //       });

  //     }
   });



};

}

downloadBusinessCaseDocument = (value) => 
{
let formData = new FormData();
  formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":'+value+'}]}');
  fetch(serviceEndPoint.documentServiceEndPoint, {
      method: 'post',
      headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
      body: formData
  }).then(response => response.json()).then((jsondata)=>{
    let jsonobjects = JSON.parse(jsondata.data);
    var url=serviceEndPoint.downloadDocument+jsonobjects[0].documentPath+""; 
    window.open(url, "_blank");
   

  });
  }




render(){
return(
    <div style = {{ width : '100%' }}>
         <form onSubmit={this.saveBusinessCaseDetails} method="post">
    <Paper >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Business Case Brief</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.businessCaseMetaData.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" style={{ width:100 }}>
              <sup><font color="red" size="4px">*</font></sup>  {row.question}
              <TextareaAutosize aria-label="empty textarea"  style={{width:"100%",height:"100px"}}
               name={row.id}  id={row.id} 
               value={this.state.answerValue[row.id].value || this.getBusinessCaseAnswer(row.id)} 
               onChange={this.handleInputChange}
               required
               maxLength="100"
               readOnly={UserContext.roleid==3?true:false}
              />
              <div name={"leftCharacters"+row.id}  id={"leftCharacters"+row.id} >Number of characters left 100</div> 
            </TableCell>                      
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper> 

<br/>
<Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button type="submit" size="small" variant="contained" color="primary" 
 disabled={UserContext.roleid==3?true:false}
>Save</Button>
</Grid>
</form>
<br/>

{UserContext.roleid!=3 &&

              <form onSubmit={this.uploadBusinessCaseDocument} method="post">

              <DropzoneArea  
              name="businessCaseFile" id="businessCaseFile"
              maxFileSize={2000000} filesLimit={1} showFileNames={true}
              onChange={this.onFileChangeHandler} />
               &nbsp;&nbsp;
               <Grid container direction="row" justify="flex-end" alignItems="flex-end">
             <Button type="submit" variant="contained" color="primary" size="small" 
                    disabled={this.state.businessCasefile==null?true:false}

             >Upload Business Brief</Button>
             </Grid>
           </form>

}

    <br/>

    { 
  (this.state.userBusinessCaseDocuments!="") &&

<Paper>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Created On</TableCell>
          <TableCell>Document Name</TableCell>
          <TableCell>File Name</TableCell>
          <TableCell >Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.userBusinessCaseDocuments.map(row => (
            <TableRow key={row.basicDocId}>
              <TableCell component="th" scope="row">
          
                {row.createdOn}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.documentName}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.documentPath.split("/")[1]}
              </TableCell>
            <TableCell >                 
              <Button variant="contained" color="primary" size="small" name="download" id="download" 
             
               onClick={this.downloadBusinessCaseDocument.bind(this,row.basicDocId)}
              >Download</Button>
            </TableCell>            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>


          }


    { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
    </div>
);
}
}