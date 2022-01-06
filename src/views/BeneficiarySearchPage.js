import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import { FormControl,Grid , TextField}  from '@material-ui/core';
import {searchByAadharNo,searchByFirstNameAndLastNameAnddobAndPrimaryContactNumberAndPrimaryEmailId,
fetchAllStudentDataByEngagementId,fetchStudentDetailsByEngagementId,captureStudentEngagementDetails} from './../util/api';
import {BrowserRouter as Router,Link} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserContext from '../components/GolbalContext'
class BeneficiarySearchPage extends Component {
  constructor() {
    super();
    this.state = {rows:[],aadharNo:'',firstName:'',lastName:'',dob:'',fatherName:'',errors : {},
    contactNumber:'',email:'',open:false,dbUserId:''};
}


handleClose = () => {
  this.setState({open:false})
};

mobilise= () => {
  captureStudentEngagementDetails(this.state.dbUserId,UserContext.centerId,UserContext.userid).then((jsondata) => {
    this.setState({open:false});
    this.setState({dbUserId:''});
    this.search();
  })
};

handleInputChange=(event) =>{
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value})
}
reset = (event) => {
  this.setState({aadharNo:''});
  this.setState({firstName:''});
  this.setState({lastName:''});
  this.setState({dob:''});
  this.setState({fatherName:''});
  this.setState({contactNumber:''});
  this.setState({email:''});
  
}




checkStudentAvailability(engagementId,dbUserId){
var data='[{"engagementId":'+engagementId+'}]';
fetchStudentDetailsByEngagementId(engagementId).then((jsondata) => { 
  let enrollmentDetails = JSON.parse(jsondata.data);
  var centerId=enrollmentDetails[0].centerId;
  if(UserContext.centerId==centerId){
fetchAllStudentDataByEngagementId(data).then((jsondata) => { 
  let studentDetails = JSON.parse(jsondata.data);
  this.props.history.push({
      pathname: '/dashboard/updatebeneficiary',
      state: { dbUserId: studentDetails[0].dbUserId ,status : studentDetails[0].status ,  engagementId :  studentDetails[0].engagementId , name : studentDetails[0].firstName + " " + studentDetails[0].lastName, tab : 0, status : studentDetails[0].status}       
    })
  });
  }
else {
this.setState({dbUserId:dbUserId});
this.setState({open:true});
}
});
}


search = (event) => {
    let studentInfo=[];
    let  studentDetails=[];
    
    if(this.state.aadharNo!=''){
    searchByAadharNo(this.state.aadharNo).then((jsondata) => { 
        studentDetails = JSON.parse(jsondata.data);  
        for(var i=0;i<studentDetails.length;i++){
        var  details =
        {    'student_id':studentDetails[i].dbUserId, 
            'engagement_id':studentDetails[i].engagementId,
            'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
            'status':studentDetails[i].status,
            'dob':studentDetails[i].dob,
            'action':
            <Button variant="contained" color="primary" size="small" onClick= {this.checkStudentAvailability.bind(this,studentDetails[i].engagementId,studentDetails[i].dbUserId)}>View</Button>
        }; 
        studentInfo.push(details);    
    }    
    this.setState({rows: studentInfo});
       });
      }

      else{
        searchByFirstNameAndLastNameAnddobAndPrimaryContactNumberAndPrimaryEmailId(this.state.firstName,this.state.lastName,this.state.dob,this.state.contactNumber,this.state.email).then((jsondata) => { 
          this.validateAll();
          let  studentDetails = JSON.parse(jsondata.data);  
          for(var i=0;i<studentDetails.length;i++){
          var  details =
          {    'student_id':studentDetails[i].dbUserId, 
              'engagement_id':studentDetails[i].engagementId,
              'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
              'status':studentDetails[i].status,
              'dob':studentDetails[i].dob,
              'action':   
              <Button variant="contained" color="primary" size="small" onClick= {this.checkStudentAvailability.bind(this,studentDetails[i].engagementId,studentDetails[i].dbUserId)}>View</Button>
          }; 
          studentInfo.push(details);    
      }    
      this.setState({rows: studentInfo});
         });


      }
}
validateAll() 
{
  var nonMandatoryFields = ["email"];
  var json = this.state.experienceData;
  var errors = this.state.errors;
  Object.keys(json).forEach(function(key) {
      if((!nonMandatoryFields.includes(key)) && (json[key] === undefined || json[key] === '' || json[key] ===null ))
      {
        let res = "Please fill out this field";
          errors[key] = {
              'label' : res , 
              'value' : res == "" ? false : true 
            }
     }
  });
 // alert(JSON.stringify(this.state.errors));
  this.state.errors = errors;

}
  render() {
    
    const columns = [{label: 'Student Id', name: 'student_id',template:"{common.radio()}", headerStyle: {color:'#FF9800'}},
    {label: 'Engagement Id', name: 'engagement_id',options : {
      sortDirection : 'desc'
    },headerStyle: {color:'#FF9800'}},
    {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
    {label: 'Date Of Birth', name: 'dob',headerStyle: {color:'#FF9800'}},
    {label: 'Status', name: 'status',headerStyle: {color:'#FF9800'}},
    {label: 'Action', name: 'action',headerStyle: {color:'#FF9800'}}
   ]
 
    
    const options = {
        filterType: "dropdown",
        responsive: "stacked",
        sortDirection: "desc",
        disableToolbarSelect:true,
        // textLabels: {
        //   body: {
        //     noMatch: <span style={{color:"blue"}}>Please wait data is loading...</span>
        //   }
        // }
      };
      



    return ( 
<div>
<Grid container spacing={2}>
    <Grid item xs={12}>
          <FormControl>
          <h5>Basic Details</h5>
            </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl>
       
            <TextField   type="number" name="aadharNo" id="aadharNo"
            label = "Aadhar Number" onInput = {(e) =>{e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,12)}}
            onChange={this.handleInputChange} value={this.state.aadharNo} 
            inputProps={{
              readOnly: (this.state.firstName || this.state.lastName || this.state.dob || this.state.contactNumber || this.state.email) ==""?false:true
            }}
            
            />            
          </FormControl>  
        </Grid>
        </Grid>
        <br/>
         (OR)
         <Grid container spacing={2}>
         <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="text" name="firstName" id="firstName"
            label = "First Name"  onChange={this.handleInputChange} value={this.state.firstName} 
            helperText = {this.state.errors.firstName != undefined ? this.state.errors.firstName.label : '' } 
            error = {this.state.errors.firstName != undefined ? this.state.errors.firstName.value : '' }
            inputProps={{
              readOnly: this.state.aadharNo==""?false:true
            }}
            />            
          </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="text" name="lastName" id="lastName"
            label = "Last Name"  onChange={this.handleInputChange} value={this.state.lastName} 
            helperText = {this.state.errors.lastName != undefined ? this.state.errors.lastName.label : '' } 
            error = {this.state.errors.lastName != undefined ? this.state.errors.lastName.value : '' }
            inputProps={{
              readOnly: this.state.aadharNo==""?false:true
            }}
            />            
          </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
        <FormControl>
        <TextField   id="date" name = "dob" id = "dob" onChange={this.handleInputChange}
            label="Birthday" value={this.state.dob || ''}
            type="date"
            helperText = {this.state.errors.dob != undefined ? this.state.errors.dob.label : '' } 
            error = {this.state.errors.dob != undefined ? this.state.errors.dob.value : '' }
            inputProps={{  min: new Date('02/01/1985').toISOString().slice(0,10) , max: new Date().toISOString().slice(0,10)}}
            InputLabelProps={{
              shrink: true,
              readOnly: this.state.aadharNo==""?false:true
            }} />

          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="number" name="contactNumber" id="contactNumber"
            label = "Contact Number"  onChange={this.handleInputChange} value={this.state.contactNumber}
            helperText = {this.state.errors.contactNumber != undefined ? this.state.errors.contactNumber.label : '' } 
            error = {this.state.errors.contactNumber != undefined ? this.state.errors.contactNumber.value : '' }
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
          }}
            
            inputProps={{
              readOnly: this.state.aadharNo==""?false:true
            }}

            />            
          </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="email" name="email" id="email"
            label = "Email"  onChange={this.handleInputChange} value={this.state.email} 
            inputProps={{
              readOnly: this.state.aadharNo==""?false:true
            }}
            />            
          </FormControl>  
        </Grid>
        </Grid>
        <br/>
        <Grid container direction="row" justify="flex-end" alignItems="flex-end">
        <Button variant="contained" color="primary" size="small" onClick={()=>{
         this.props.history.push({pathname: '/dashboard/addobeneficiary'})}}>         
          Add Beneficiary
       </Button>
 &nbsp;
<Button variant="contained" color="primary" size="small" onClick={this.reset}>Reset</Button>
&nbsp;
<Button variant="contained" color="primary" size="small" onClick={this.search}>Search</Button>

</Grid>
        
<br/><br/>
<MUIDataTable label={"List of Students"} data={this.state.rows} columns={columns} options={options}>
</MUIDataTable>



<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText>
   Do you want to mobilise this beneficiary ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.mobilise} color="primary">
           Mobilized
          </Button>
          <Button onClick={this.handleClose} color="primary">
          Cancel
          </Button>
        </DialogActions>
      </Dialog>



</div>       
    )    
}

  }
    
export default BeneficiarySearchPage ;
