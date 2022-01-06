import React, { Component } from 'react';
import * as XLSX from "xlsx";
import {  InputLabel, Input, Grid, Button } from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import UserContext from '../components/GolbalContext'
import {fetchNotCompletedBatchDetails,saveBulkMetaData,saveBulkStudentData,saveBulkMetaDataAgain} from '../util/api';
import Student_Template1 from "./../assets/document/Student_Template1.xlsx";
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
today = yyyy + '-' + mm + '-' + dd+ ' '+time;

export default class bulkUpload extends Component{
  constructor(props){
    super(props)
    this.state={
				
 options: (UserContext.modelId== 3 ||UserContext.modelId === 6 || UserContext.modelId === 18 ||UserContext.modelId === 19||UserContext.modelId === 20||UserContext.modelId === 21||UserContext.modelId === 22||UserContext.modelId === 23)
      ?[ {value:"Mobilization", label:"Mobilization"},{value:"Enrollment" ,label:"Enrollment"}]:[{value:"Mobilization", label:"Mobilization"}],
    		
				
				
      user_unique_id:0,
      batchList:[],
      Selectedoption:"",
      student_count:0,
      fileName:"",
      studentInfo:[],
      batchName:null,
      batchId:0,
      flag : false,
      upload_button:true,
      errors: {},
      
      register_number:0,
    }
  }
 
// optind change handler
  handleOptionsChange(selectname,event){
    console.log("model_id: ",UserContext.modelId)
    const value = event
    // console.log(value)
    this.setState({
      Selectedoption: value,
      batchName:"",
      batchId:0,
      errors:{
        ...this.state.errors,
        SelectedBatch: {
          'label': '',
          'value': false
        },
      }
    })
    this.setState({batchList:[]})

    if(event === "Enrollment"){
      this.setState({
        errors:{
          ...this.state.errors,
          SelectedBatch: {
            'label': 'Please select some option',
            'value': true
          },
        }
      })
      // setDisabled(false)
      fetchNotCompletedBatchDetails(UserContext.centerId).then((jsondata) => {
        let result = JSON.parse(jsondata.data);
        // console.log("center : ",result)
       result.forEach(element => {
        //  console.log("Condition for date " , element.freezeDate > today)
          if(element.freezeDate > today ){
            this.state.batchList.push({
              "value": element.batchId,
              "label": element.batchName
            })
          }
       });
      })
    }
    else{
      // setDisabled(true)
    }
  }
   // Hhandle batch changes
   handleBatchChange(selectname,event){
    // console.log("selected optins : ",this.state.Selectedoption)
    let value = event
    // console.log(event)
    let index = this.state.batchList.findIndex((object) => object.value == value)
    let batchname = this.state.batchList[index].label
    // console.log(this.state.batcheList)
    this.setState({
      batchId:event,
      batchName: batchname,
      errors:{
        ...this.state.errors,
        SelectedBatch: {
          'label': '',
          'value': false
        },
      }
    })
  }

  // Handle for excel file change
  readExcel = (file) => {
    // 
    let file_name = file.name
    this.setState({fileName :file_name })
   const fileReader = new FileReader();
   fileReader.readAsArrayBuffer(file);

   fileReader.onload = (e) => {
    //  console.log(e)
     const bufferArray = e.target.result;

     const wb = XLSX.read(bufferArray, { type: "buffer" });

     const wsname = wb.SheetNames[0];

     const ws = wb.Sheets[wsname];
    
    // console.log("file name : ",file.name)
     const data = XLSX.utils.sheet_to_json(ws,{header:1});
    //  console.log("Header file ",data[0])
     let student_data = XLSX.utils.sheet_to_json(ws);
     this.setState({studentInfo:student_data })
    
    
    this.setState({student_count :data.length-1})
    //  console.log("DataCount : ",this.state.student_count )

    const requiredHeader =['Aadhar_Number', 'First_Name', 'Middle_Name', 'Last_Name', 'Date_of_Birth', 'Gender', 'Qualification', 'Passing_year', 'Religion', 'Address_Line_1', 'Village', 'District', 'State', 'Pincode', 'Category', 'Primary_Contact_Number', 'Primary_Mail_ID', 'College_register_no', 'Iti_grade', 'Iti_trade']
    let flag = true
    // var x= requiredHeader.findIndex(element =>{
    //   element == "Created_by"
    // })
    // console.log(x)
    // console.log(data[0] )
    requiredHeader.map((element,id) =>{
      // console.log("header comparison ",element, "data : ",data[0][id])
    
      if(flag){
        if(element==data[0][id]){
            if(id+1 == requiredHeader.length)
            {     
              // Activating the upload button
              this.setState({upload_button:false})      
            }
      }
        else{
          flag = false
           
          alert("Plese use the correct template for upload.The coloumn in the upload file and sample template does not match.")
          // Plese use the correct template for upload.
          this.setState({upload_button:true})
          return;
        }
      }
    })
   }
}
// Uploadinh the doumnet
// this.setState({metaData})
 async uploadDocuments(){
   
  let studentInfo =  this.state.studentInfo
  let duplicateAddhar = []
  // Checking the duplicate aadhar in same file

for(var i = 0; i <this.state.student_count; i++) {  
 for(var j = i + 1; j <this.state.student_count; j++) { 
  //  if(studentInfo[i].Aadhar_Number  === undefined){
  //   continue
  //  }
     if(studentInfo[i].Aadhar_Number === studentInfo[j].Aadhar_Number && (studentInfo[i].Aadhar_Number != null && studentInfo[i].Aadhar_Number != "" && studentInfo[i].Aadhar_Number!= 0) ) {
       duplicateAddhar[i]= studentInfo[i].Aadhar_Number
     }        
 }    
 }  

 if(duplicateAddhar.length>0){
  
  var x =0
   let data=[]
   for(var i=0;i<duplicateAddhar.length;i++){
      if(duplicateAddhar[i] != undefined){
        data[x] =duplicateAddhar[i] 
        x++;
      }
   }
  //  console.log(data)
  alert( data +"  duplicate Addhar Number") 
  return; 
 }
 else{
  const response = await saveBulkMetaData(this.state.fileName,today,this.state.Selectedoption,this.state.batchName,this.state.batchId,this.state.student_count,"L",UserContext.centerName,UserContext.centerId,UserContext.modelId, UserContext.userid,"  ").then((jsondata)=>{
    let result = JSON.parse(jsondata.data)
    // console.log("Mpdel id : ",result[0].modelId)
  
    this.state.register_number = result[0].regId
    // console.log(this.state.register_number)
    if(result[0].regId ==0){
      alert("Data Not saved")
     // changes
      return;
    }
   else{
    this.state.user_unique_id = result[0].regId
    this.uploadStudentData();
   }
  })
  
 }  
} 


 async uploadStudentData(){
  let flag = false
  let studentInfo =  this.state.studentInfo
  // console.log("Bulk Student data : ",studentInfo)
    for(var i=0;i<this.state.student_count;i++){
        const response1 = await saveBulkStudentData(this.state.user_unique_id,
          studentInfo[i].First_Name || '',
           studentInfo[i].Last_Name || '',
           studentInfo[i].Middle_Name || '',
           studentInfo[i].Date_of_Birth|| '',
  
           studentInfo[i].Aadhar_Number || '',  // c
           this.state.batchName || '',
           studentInfo[i].Qualification || '',
           studentInfo[i].Passing_year|| '', 
           studentInfo[i].Gender || '',
           studentInfo[i].Religion || '',
           studentInfo[i].Category || '',
           studentInfo[i].Primary_Contact_Number || 0,
           studentInfo[i].Primary_Mail_ID || '',
           
           studentInfo[i].College_register_no|| '',
           studentInfo[i].Iti_grade || '',
           studentInfo[i].Iti_trade || '',
          
           studentInfo[i].Address_Line_1 || '',
           studentInfo[i].Village || '',
          
           studentInfo[i].District || '',
           studentInfo[i].State || '',
           studentInfo[i].Pincode || 0,
         
          today, // remove every place
           UserContext.userid,
           "P",
           "::",
           "::").then((jsondata)=>{
           let result =JSON.parse(jsondata.data)
          //  console.log(result)
           flag = true
         })
   }


  if(flag == true){
    alert("Data Saved Successfully and Registration ID is : " + this.state.user_unique_id)
  }
  else{
    alert("Data Not Saved")
    return;
  }

  // to change the status from L to P
  saveBulkMetaDataAgain(this.state.register_number,this.state.fileName,today,this.state.Selectedoption,
    this.state.batchName,this.state.batchId,this.state.student_count,"P",UserContext.centerName,
    UserContext.centerId,UserContext.modelId, UserContext.userid," " ).then((jsondata)=>{
  let result = JSON.parse(jsondata.data)
  // console.log(result)
  })
}

// Download file
downloadFile(){
  const url = Student_Template1;
  window.open(url);
}

// Routes Change
routeChange(){
  this.props.history.push(({ pathname: '/dashboard/History',state: {} }));
 
}


  render(){
    return(
      <div style={{ width: '100%' }}>
         <Grid container direction="row" justify="flex-end" alignItems="flex-end">
             <Button color="primary"  onClick={this.downloadFile.bind(this)}>
               Download template
             </Button>
        </Grid>
        <br/>
      <Grid container>
      <Grid item xs={12}> </Grid>
          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Options</InputLabel>
            <SingleSelect
              name="Selectedoption" id="Selectedoption"
              options={this.state.options}
              value={this.state.Selectedoption || ''}
              key={this.state.Selectedoption || ''}
              onChange={this.handleOptionsChange.bind(this, 'Selectedoption')}
              // helperText={this.state.errors.Selectedoption != undefined ? this.state.errors.Selectedoption.label : ''}
              // error={this.state.errors.Selectedoption != undefined ? this.state.errors.Selectedoption.value : ''}
            />
          </Grid>

          <Grid item xs={12} sm={2}></Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Batches</InputLabel>
            <SingleSelect
              name="SelectedBatch" id="SelectedBatch"
              key={this.state.SelectedBatch || ''}
              options={this.state.batchList}
              value={this.state.SelectedBatch || ''}
              onChange={this.handleBatchChange.bind(this, 'SelectedBatch')}
              disabled={this.state.Selectedoption=="Mobilization"?true:false}
              helperText={this.state.errors.SelectedBatch != undefined ? this.state.errors.SelectedBatch.label : ''}
              error={this.state.errors.SelectedBatch != undefined ? this.state.errors.SelectedBatch.value : ''}
            />
          </Grid>
        </Grid>

        <br />
        <Table  aria-label="simple table" style={{ width:"100%"}}>
          <TableBody>
          <TableRow>
            <TableCell> 
            <Input 
               name="upload-photo"
               type="file"
               accept='.xlsx/*, .xls/*'
               onClick={e => {
                (e.target.value = null)
                // setDisabled(true)
              }
               }
               onChange={(e) => {
                
                const file = e.target.files[0];
                var substr1 = file.name.substring(file.name.length-4, file.name.length);
                var substr2 = file.name.substring(file.name.length-3, file.name.length);
                if(substr1== "xlsx" || substr2 == "xls"){
                  this.readExcel(file); 
                }
                else{
                  alert("Please Upload Excel file")
                  return;
                }
               
              }}
              maxFileSize={5000000} filesLimit={1} showFileNames={true}
              />
              <p  style={{color:"red"}}>Note-:Please upload Excel file</p>
              <p  style={{color:"red"}}>and size should not be greater than 5MB.</p>
            </TableCell>
            </TableRow>
            </TableBody>
          </Table>
            <br /> <br />
            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
              <Button type="submit" variant="contained" color="primary" size="small"  onClick={this.uploadDocuments.bind(this)}
                    disabled={this.state.upload_button}
             >Upload Document</Button>
             </Grid>
             <br />  <br />  <br />
             <Grid container direction="row" justify="flex-end" alignItems="flex-end">
             <Button color="primary" onClick={this.routeChange.bind(this)}>
               History Details
             </Button>
             </Grid>

             {/* <Link to={History}>
              History
            </Link> */}
      </div>
    )
  }
}