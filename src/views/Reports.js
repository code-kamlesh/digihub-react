import React, { Component } from 'react'  
//import axios from 'axios';  
import { SingleSelect } from "react-select-material-ui";
import { Multiselect } from 'multiselect-react-dropdown';
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import { fetchCentersOfUser, fetchCentersDetails,getReports,downloadReports,fetchBatchDetails} from './../util/api';
import { isNotEmpty,isNotZero } from './../util/validation';
import AlertDialog from './../util/AlertDialog';
import UserContext from '../components/GolbalContext'
import Button from '@material-ui/core/Button';
import { FormControl , InputLabel,FormControlLabel, Input, Grid , RadioGroup, Radio, TextField}  from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { serviceEndPoint } from './../util/serviceEndPoint';
export class ExportExcel extends Component {  
        constructor(props) {  
                super(props)  
                this.state = {  
                  report:[],pageNumber:1,pageSize:20,ProductData: []  ,center: [], centerId: '', userScope: [], 
                        errors: {centerName:''},reportName:'',
                        reportOptions :[
                          { label: "Mobilisation",value :"Mobilised"},
                          { label: "Enrolled", value :"Enrolled"}
                        ],startDate:'',endDate:'',studentEngagementStatus:'',
                        errors: {studentEngagementStatus: '',centerId:'',startDate: '',endDate:'',batchId:''},
                        batchDetails:[],batchId:0
                      }

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
        
         report =()=>{
          let errors = this.state.errors;
          if(this.validateForm(errors)){ 
    getReports(this.state.pageNumber,this.state.pageSize,this.state.centerId,this.state.startDate,this.state.endDate,this.state.studentEngagementStatus,this.state.batchId).then((jsondata) => {
    let reportData=[];
      let objects = JSON.parse(jsondata.data);
    objects.forEach(object => {
      reportData.push({"engagementId":object.engagementId,"Name":object.firstName+" "+object.lastName,"PrimaryContactNumber":object.primaryContactNumber,
      "studentEngagementStatus":object.studentEngagementStatus,"studentCreatedOn":object.studentCreatedOn,
      "enrolledDate":object.enrolledDate,"batchName":object.batchName,
      "aadharNo":object.aadharNo.replace(/\d(?=\d{4})/g, "*"),
    "dob":object.dob,"maritalStatus":object.maritalStatus});
    })
    this.setState({ report: reportData });
  });
}    
   }       
     

   downloadReport=()=>{
    downloadReports(this.state.pageNumber,this.state.pageSize,this.state.centerId,this.state.startDate,this.state.endDate,this.state.studentEngagementStatus,this.state.batchId).then((jsondata) => {
        let object = JSON.parse(jsondata.data);
        var url=serviceEndPoint.mdmdownloadDocument+object[0].reportName+""; 
        window.open(url, "_blank");
    });

   }


   
   previous =()=>{
     let previous=this.state.pageNumber-1;      
this.setState({pageNumber:previous});
this.report()
        }       
           

        next =()=>{
          let next=this.state.pageNumber+1;      
     this.setState({pageNumber:next});
     this.report()
             }    


             handleSelectChange(selectname, event) {  
              this.setState({[selectname]:event})
            //  this.validate(selectname,event);
             if(selectname==="centerId"){
              this.batchDetails(event);
             } 
            }
            
            handleStartDateInputChange(event) {
              const target = event.target;
              const value =  target.value;
              const name = target.name;
              this.setState({[name]: value})
              
            // if(this.state.endDate===""){
            // var d = new Date(value);   
            // d.setMonth(d.getMonth() + 6); 
            // let endDate=d.getFullYear()+"-"+('0' +d.getMonth()).slice(-2)+"-"+('0' +d.getDate()).slice(-2);
            // this.setState({endDate:endDate});
            // }
          }

            handleEndDateInputChange(event) {
              const target = event.target;
              const value =  target.value;
              const name = target.name;
              this.setState({[name]: value})
            //  this.validate(name,value);

            //   if(this.state.startDate===""){
            // var d = new Date(value);   
            // d.setMonth(d.getMonth() - 6); 
            // let startDate=d.getFullYear()+"-"+('0' +d.getMonth()).slice(-2)+"-"+('0' +d.getDate()).slice(-2);
            // this.setState({startDate:startDate});  
            //   }
          }

            batchDetails(centerId){
            fetchBatchDetails(centerId).then((jsondata)=>{ 
              let batchs=[];
              let  objects = JSON.parse(jsondata.data);
              objects.forEach(object => {
                batchs.push({ label: object.batchName, value: object.batchId });
              })
              this.setState({batchDetails:batchs});
             })
            }

            validate = (name,value)=>{
              let errors = this.state.errors;
              switch (name) {
                case 'centerId': errors.centerId =isNotEmpty(value);
                  break;
                case 'studentEngagementStatus': errors.studentEngagementStatus = isNotEmpty(value);
                  break;
                case 'startDate': errors.startDate =isNotEmpty(value)!=""?isNotEmpty(value):this.inMonths(new Date(this.state.startDate),new Date(this.state.endDate))<=13?"":"dates gap should not be more than 12 months";
                  break;
                case 'endDate': errors.endDate =  isNotEmpty(value);
                  break;
                  case 'batchId': errors.batchId =  isNotZero(value);
                  break;
                default:
                break;
            }
             this.setState({errors});
            }

            validateForm = (errors) => {
              errors.centerId="";
              errors.studentEngagementStatus="";
              errors.startDate="";
              errors.endDate="";
              errors.batchId=0;
              this.setState({errors});
              this.validate("centerId",this.state.centerId);
              this.validate("studentEngagementStatus",this.state.studentEngagementStatus);
               if(this.state.studentEngagementStatus==="Mobilised"){
              this.validate("startDate",this.state.startDate);
              this.validate("endDate",this.state.endDate);
               }
               if(this.state.studentEngagementStatus==="Enrolled"){
                 if(this.state.batchId===0){
                  this.validate("startDate",this.state.startDate);
                  this.validate("endDate",this.state.endDate);
                 }
                 else{
                  this.validate("batchId",this.state.batchId);
                 }              
              }

              let valid = true;
              Object.values(this.state.errors).forEach(
                // if we have an error string set valid to false
                (val) => val.length > 0 && (valid = false)
              );
              return valid;
            }
            resetForm = () => {
              this.setState({"centerId":''});
              this.setState({"studentEngagementStatus":''});
              this.setState({"startDate":''});
              this.setState({"endDate":''});
              this.setState({"batchId":0});
              this.setState({"report":[]});
            }

             inMonths=(d1, d2)=> {
              var d1Y = d1.getFullYear();
              var d2Y = d2.getFullYear();
              var d1M = d1.getMonth();
              var d2M = d2.getMonth();
              return (d2M+12*d2Y)-(d1M+12*d1Y);
          }
          
          
        render() {  
          const options = {selectableRows : false,rowsPerPage: 20,print: false,download: false,
            pagination:false}
          const columns = [{label: 'Engagement Id',name:"engagementId"},
          {name:"Name"},
          {name:"PrimaryContactNumber"},
          {label: 'Status', name: 'studentEngagementStatus'},
          {label: 'Mobilised Date', name: 'studentCreatedOn'},
          {label: 'Enrolled Date', name: 'enrolledDate'},
          {label: 'Batch Name', name: 'batchName'}, 
          {name:"aadharNo",options: {display: false}},{name:"dob",options: {display: false}},{name:"maritalStatus",options: {display: false}}]

          return (  
                  <div style = {{ width : '100%' }}>
                  <form  method="get" id="">
                  <Grid container spacing={2}>
                   <Grid item xs={5}>
                <InputLabel shrink={true} >Center Name</InputLabel>
                <SingleSelect isClearable={true}
                  name="centerName" id="centerName"
                  options={this.state.center}
                  onChange={this.handleSelectChange.bind(this, 'centerId')}
                  value={this.state.centerId || '' } 
                  error={this.state.errors.centerId==''?false:true}
                  helperText={this.state.errors.centerId}
                  key={this.state.centerId}
                />
              </Grid>
              <Grid item xs={5}>
                <InputLabel shrink={true} >Report Name</InputLabel>
                <SingleSelect isClearable={true}
                  name="studentEngagementStatus" id="studentEngagementStatus"
                  options={this.state.reportOptions}
                 onChange={this.handleSelectChange.bind(this, 'studentEngagementStatus')}
                  value={this.state.studentEngagementStatus || '' } 
                  error={this.state.errors.studentEngagementStatus==''?false:true}
                  helperText={this.state.errors.studentEngagementStatus}
                  key={this.state.studentEngagementStatus}/>
              </Grid>       

     <Grid item xs={12} sm={5} >
         <TextField id="date" name = "startDate" id = "startDate" 
         label=" Start Date"
         type="date" onChange={this.handleStartDateInputChange.bind(this)}
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} 
         error={this.state.errors.startDate==''?false:true}
                  helperText={this.state.errors.startDate}   
                  value={this.state.startDate || '' }    
         />

     </Grid>
     <Grid item xs={12} sm={5}>
         <TextField id="date" name = "endDate" id = "endDate" 
         label="End Date"
         type="date" onChange={this.handleEndDateInputChange.bind(this)}
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} 
         error={this.state.errors.endDate==''?false:true}
                  helperText={this.state.errors.endDate}
          value={this.state.endDate || '' } 
         />
     </Grid>
     </Grid>
     <br/>
     { 
  (this.state.studentEngagementStatus==='Enrolled') &&                     
     <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>(OR)</div>
     }
<br/>
     { 
  (this.state.studentEngagementStatus==='Enrolled') &&                     
  <Grid container spacing={2}>
     <Grid item xs={5}>
                <InputLabel shrink={true} >Batch Name</InputLabel>
                <SingleSelect isClearable={true}
                  name="'batchId'" id="batchId"
                  options={this.state.batchDetails}
                  onChange={this.handleSelectChange.bind(this, 'batchId')}
                  value={this.state.batchId || '' } 
                  error={this.state.errors.batchId==''?false:true}
                  helperText={this.state.errors.batchId}
                  key={this.state.batchId}
              //    disabled={this.state.studentEngagementStatus!='Enrolled'}  
                />
              </Grid>
              </Grid>
              
        }
 
</form>
<Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button variant="contained" color="primary" size="small" onClick={this.report} 
>View Report</Button>
&nbsp;&nbsp;
<Button onClick={this.resetForm}  variant="contained" size="small" color="primary">Reset</Button>
</Grid>

<br/><br/>
<MUIDataTable title={"Student Details"} data={this.state.report} columns={columns} options={options} />
<br/>

<br/>

<Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button variant="contained" color="primary" size="small" onClick={this.previous} 
disabled={this.state.pageNumber===1?true:false}
>Previous</Button>
&nbsp;&nbsp;
<Button variant="contained" color="primary" size="small" onClick={this.next} 
disabled={this.state.report.length<=20?true:false}
>Next</Button>
</Grid>
<br/>
<Grid container direction="row" justify="flex-end"  id="btn" alignItems="flex-end">  
<Button  variant="contained" type="submit"   
    size="small" color="primary"
    onClick={this.downloadReport} 
    disabled={this.state.report.length===0?true:false}
>
Download Excel
</Button>
</Grid>
</div>
                )  
        }  
}  

export default ExportExcel  




















// import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// import { FormControl , InputLabel, Input, Grid , RadioGroup, Radio, TextField}  from '@material-ui/core';
// import { SingleSelect } from "react-select-material-ui";

// const GreenCheckbox = withStyles({
//   root: {
//     color: green[400],
//     '&$checked': {
//       color: green[600],
//     },
//   },
//   checked: {},
// })((props) => <Checkbox color="default" {...props} />);

// export default function CheckboxLabels() {
//   const [state, setState] = React.useState({
//     checkedA: true,
//     checkedB: true,
//     checkedF: true,
//     checkedG: true,
//   });
 
//   const handleChange = (event) => {
//     setState({ ...state, [event.target.name]: event.target.checked });
//   };

//   return (
//     <FormGroup row>
//   <Grid item xs={12} sm={4} alignContent="center"  >
//      <SingleSelect
//               placeholder = "Select Report" required
             
//               //options={this.myData.reportType}
            
//             />
//             </Grid>
// <Grid item xs={12} sm={3} id = "">
//          <TextField id="date" name = "" id = ""
//          label="Start Date" 
       
//          type="date"
//          inputProps={{ max: new Date().toISOString().slice(0,10)}}
//          InputLabelProps={{
//            shrink: true,
//          }} />

//      </Grid>

//      <Grid item xs={12} sm={3} id = "">
//          <TextField id="date" name = "" id = ""
//          label="End Date" 
//          type="date"
//          inputProps={{ max: new Date().toISOString().slice(0,10)}}
//          InputLabelProps={{
//            shrink: true,
//          }} />

//      </Grid>
//      <Grid item xs={12} sm={3} id = ""></Grid>
//      <br></br>
     

//      <FormControlLabel
//         control={
//           <Checkbox
//            // checked={state.checkedB}
//             onChange={handleChange}
//             name="checkedB"
//             color="primary"
//           />
//         }
//         label="First Name"
//       />


//       <FormControlLabel
//         control={
//           <Checkbox
//            // checked={state.checkedB}
//             onChange={handleChange}
//             name="checkedB"
//             color="primary"
//           />
//         }
//         label="Last Name"
//       />
//       <FormControlLabel
//         control={
//           <Checkbox
//           //  checked={state.checkedB}
//             onChange={handleChange}
//             name="checkedB"
//             color="primary"
//           />
//         }
//         label="Eng ID"
//       />

// <FormControlLabel
//       control={
//         <Checkbox
//          // checked={state.checkedB}
//           onChange={handleChange}
//           name="checkedB"
//           color="primary"
//         />
//       }
//       label="DOB"
//     />
//     <FormControlLabel
//         control={
//           <Checkbox
//             //checked={state.checkedB}
//             onChange={handleChange}
//             name="checked"
//             color="primary"
//           />
//         }
//         label="Gender"
//       />
     
//     </FormGroup>
    

//   );
// }
