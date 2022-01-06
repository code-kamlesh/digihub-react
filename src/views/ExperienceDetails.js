/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================


* Coded by Ashish S

=========================================================


*/

import React, { Component } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContext from '../components/GolbalContext'
import { FormControl,FormControlLabel,Grid , RadioGroup, Radio, TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { roleBasedReadonly , checkButton } from './../util/validation';
import AlertDialog from './../util/AlertDialog';
import {saveExpDetails,fetchExperienceDetails} from './../util/api';
import MUIDataTable from "mui-datatables";
import EditIcon from '@material-ui/icons/Edit';


const alertDialogOptions = {
  message: ''
}

class Experience extends Component {
    
  constructor(props) {
    super(props);
     
     this.state = {alertDialogFlag:false , disabled : false , flag : "0" , errors : {} , dbUserId : props.id,info:[], 
     experienceData : {createdBy : UserContext.userid, updatedBy : UserContext.userid , dbUserId : props.id, experienceFrom : "NA",
     experienceTo : "NA" , employerName : "" , employerAddress : "", isExperience:"",isActive:"Y", postingLocation : "", lastDesignation : "",
     grossSalary : "0" , natureOfExperience : "",id:0
         },engagementId:props.engagementId,tempFresherId:0,
        selectedOption:[ { value: "Y", label: 'Yes' },
        { value: "N", label: 'No' }  ]};
    
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleChange=this.handleChange.bind(this);
     if(props.id != null && props.id != undefined )
     {
     UserContext.dbUserId = props.id;
       
       
        
      this.fetchExperiencedetailsFouUser((props.id));
     
      
     }
    
     
 }
 componentDidMount()
    {
      roleBasedReadonly();
    }

    handleEditChange(obj){
      // alert(JSON.stringify(obj));
       this.setState({
        experienceData : obj 
       })
     
     }

     handleChange = (event) => {
      const target = event.target;
      let value =  target.value;
      const name = target.name;  
    
      if(name== "Fresher1"){
        this.setState({
          experienceData: {...this.state.experienceData,
            isExperience:event.target.value,
            id:this.state.tempFresherId
       }});
     
        document.getElementById("experienceFrom").setAttribute("hidden"  , true);
      
        document.getElementById("experienceTo").setAttribute("hidden"  , true);
        document.getElementById("employerName").setAttribute("hidden"  , true);
      
        document.getElementById("employerAddress").setAttribute("hidden"  , true);
        document.getElementById("postingLocation").setAttribute("hidden"  , true);
      
        document.getElementById("lastDesignation").setAttribute("hidden"  , true);
        document.getElementById("natureOfExperience").setAttribute("hidden"  , true);
        document.getElementById("grossSalary").setAttribute("hidden"  , true);
        //document.getElementById("btn").setAttribute("hidden"  , true);
        document.getElementById("dtb").setAttribute("hidden"  , true);

        
      }
      else if(name =="experienced"){
        this.setState({
          experienceData: {...this.state.experienceData,
            isExperience:event.target.value,
            id:0
       }});
     
        document.getElementById("experienceFrom").removeAttribute("hidden"  , true);
        document.getElementById("experienceTo").removeAttribute("hidden"  , true);
        document.getElementById("employerName").removeAttribute("hidden"  , true);
        document.getElementById("employerAddress").removeAttribute("hidden"  , true);
        document.getElementById("postingLocation").removeAttribute("hidden"  , true);
        document.getElementById("lastDesignation").removeAttribute("hidden"  , true);
        document.getElementById("natureOfExperience").removeAttribute("hidden"  , true);
        document.getElementById("grossSalary").removeAttribute("hidden"  , true);
      //  document.getElementById("btn").removeAttribute("hidden"  , true);
        document.getElementById("dtb").removeAttribute("hidden"  , true);
      }
    };
 handleInputChange(event) {
     
     const target = event.target;
     let value =  target.value;
     const name = target.name;
     this.setState({
      "disabled" : false
    });

    this.setState({
      errors: {
        ...this.state.errors,
        [name] : {
          'label' : "" , 
          'value' : false
        }
      }
  });

  if(name == "experienceTo")
      {
        let res = "";
        if(this.state.experienceData.experienceFrom == "")
        {
          res = "Please fill Experience 'from' date first.";
          value = "";
        }
        else if(Date.parse(value) <= Date.parse(this.state.experienceData.experienceFrom))
        {
          res = "Experience 'to' date must be greater than 'from' date. ";
          value = "";
        }
        
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
      if(name == "experienceFrom")
      {
        this.state.experienceData.experienceTo = "";
      }

     this.setState({
      experienceData: {
         ...this.state.experienceData,
         [name]: value
       }
     })
     
   }


 
  
 mySubmitHandler = (event) => {
   event.preventDefault();
   this.state.disabled = true;
     if(this.state.experienceData.isExperience=="Y"){
   this.validateAll();
     }
   // authentication response and redirect to error or dashbaord page
   this.setState({
     errors : this.state.errors,
    });
    if(checkButton(this.state.errors))
    {
      this.submitExperience();
    }
    else
    {
      this.state.disabled = true;
  } 
 }
 validateAll() 
{
  var nonMandatoryFields = ["natureOfExperience","id"];
  var json = this.state.experienceData;
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
 // alert(JSON.stringify(this.state.errors));
  this.state.errors = errors;

}
//  getExperienceData(id)
//  {

//        fetchExpDetails(id).then((jsondata)=>{
//            console.log(jsondata); 
//            if(jsondata.appError==null){      
//                let jsonobjects = JSON.parse(jsondata.data);
//                console.log(jsonobjects);
//                if(jsonobjects[0] !== null && jsonobjects[0] !== undefined)
//                {
//                 Object.keys(jsonobjects[0]).forEach(function(key) {
//                   this.setState({
//                    experienceData: {
//                       ...this.state.experienceData,
//                       [key]: jsonobjects[0][key].toString()
//                     }
//                   })
//                 }.bind(this));
//                } 
               
//               //alert(JSON.stringify(this.state));
           
//            }  else{
//                console.log("error");
//            } 
//         })
//  }
 fetchExperiencedetailsFouUser(id){
 
  let expInfo=[];

  fetchExperienceDetails(id).then((jsondata)=>{    
        let  experienceDetailsOfUser = JSON.parse(jsondata.data);
    if(experienceDetailsOfUser.isExperience!="Y"){
      document.getElementById("dtb").removeAttribute("hidden"  , true);
    }
if(experienceDetailsOfUser.length !=0){
  // if(experienceDetailsOfUser[0].isExperience=="Y" ||(experienceDetailsOfUser[1].isExperience !="undefined" && experienceDetailsOfUser[1].isExperience=="Y")){
  //   this.state.experienceData.isExperience="Y"
  //             for(var i=0;i<experienceDetailsOfUser.length;i++){
  //             var  details =
  //             {    'employer_name':experienceDetailsOfUser[i].employerName, 
  //                 'experience_from':experienceDetailsOfUser[i].experienceFrom,
  //                 'experience_to':experienceDetailsOfUser[i].experienceTo,
  //                 'last_designation' :experienceDetailsOfUser[i].lastDesignation,
  //                 'action':<EditIcon style={{color:"blue"}} onClick={this.handleEditChange.bind(this,experienceDetailsOfUser[i])} />
                   
  //             }; 
  //             expInfo.push(details);    
  //         }    
  //      }

for(var i=0;i<experienceDetailsOfUser.length;i++){
   if(experienceDetailsOfUser[i].isExperience=="Y" ||(experienceDetailsOfUser[i].isExperience !="undefined" && experienceDetailsOfUser[i].isExperience=="Y")){
        this.state.experienceData.isExperience="Y";
               var  details =
               {    'employer_name':experienceDetailsOfUser[i].employerName, 
                   'experience_from':experienceDetailsOfUser[i].experienceFrom,
                   'experience_to':experienceDetailsOfUser[i].experienceTo,
                   'last_designation' :experienceDetailsOfUser[i].lastDesignation,
                   'action':<EditIcon style={{color:"blue"}} onClick={this.handleEditChange.bind(this,experienceDetailsOfUser[i])} />
               }; 
               expInfo.push(details);
        }
     else if(experienceDetailsOfUser[i].isExperience=="N") {
       //  this.state.experienceData.isExperience="N";
        this.setState({tempFresherId:experienceDetailsOfUser[i].id});
         this.setState({
          experienceData: {
            ...this.state.experienceData,
              "isExperience": "N",
             "id":experienceDetailsOfUser[i].id
          }
        });

         document.getElementById("experienceFrom").setAttribute("hidden"  , true);
         document.getElementById("experienceTo").setAttribute("hidden"  , true);
         document.getElementById("employerName").setAttribute("hidden"  , true);
         document.getElementById("employerAddress").setAttribute("hidden"  , true);
         document.getElementById("postingLocation").setAttribute("hidden"  , true);
         document.getElementById("lastDesignation").setAttribute("hidden"  , true);
         document.getElementById("natureOfExperience").setAttribute("hidden"  , true);
         document.getElementById("grossSalary").setAttribute("hidden"  , true);
         }
} 
        }
        else {
         // this.state.experienceData.isExperience="N"
        document.getElementById("experienceFrom").setAttribute("hidden"  , true);
        document.getElementById("experienceTo").setAttribute("hidden"  , true);
        document.getElementById("employerName").setAttribute("hidden"  , true);
        document.getElementById("employerAddress").setAttribute("hidden"  , true);
        document.getElementById("postingLocation").setAttribute("hidden"  , true);
        document.getElementById("lastDesignation").setAttribute("hidden"  , true);
        document.getElementById("natureOfExperience").setAttribute("hidden"  , true);
        document.getElementById("grossSalary").setAttribute("hidden"  , true);
        }
          this.setState({
              info: expInfo
            });   
       }) 
}

 

submitExperience()
{
 let action = "";
 const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
   if (dbUserId) {
     action =  "captureExperience";
   } else {
     action =  "updateExperience";
   }
  
        saveExpDetails(action,this.state.experienceData).then((jsondata)=>{
         if(jsondata.appError==null){   
             let jsonobjects = JSON.parse(jsondata.data); 
             this.setState({alertDialogFlag:false});
             if(action == 'captureExperience')
             {
              alertDialogOptions.message=<span style={{color:"green"}}>Experience Details Saved Sucessfully</span>;
              this.setState({alertDialogFlag:true});
              setTimeout(() => {this.props.history.push({
              pathname: '/dashboard/addobeneficiary',
              state: { dbUserId: jsonobjects[0].dbUserId,tab : 5 , engagementId : this.state.engagementId , status : this.state.status}
            }) },3000)
             }
             else 
             {
              alertDialogOptions.message=<span style={{color:"green"}}>Experience Details Updated Sucessfully</span>;
              this.setState({alertDialogFlag:true});
              setTimeout(() => {this.props.history.push({
                pathname: '/dashboard/updatebeneficiary',
                state: { dbUserId: jsonobjects[0].dbUserId ,engagementId:this.state.engagementId,status : this.state.status , tab : 5 }
              }) },3000);
             }
             UserContext.dbUserId = jsonobjects[0].dbUserId;
         }  else{
             console.log("error");
         } 
      })
}

render()
{
  const columns = [{label: 'Employer Name', name: 'employer_name', headerStyle: {color:'#FF9800'}},
  {label: 'Experience Form', name: 'experience_from',headerStyle: {color:'#FF9800'}},
  {label: 'Experience To', name: 'experience_to',headerStyle: {color:'#FF9800'}},
  {label: 'Designation', name: 'last_designation',headerStyle: {color:'#FF9800'}},
  {label: 'Action', name: 'action',headerStyle: {color:'#FF9800'}}
 ]

 const options = {
  filterType: "dropdown",
  responsive: "stacked",
  sortDirection: "desc",
  selectableRows : 'single',
  disableToolbarSelect:true,
  rowsPerPage:10,
  selectableRowsOnClick: true,
 

 
};

  let button;
  button = <Grid container direction="row" justify="flex-end"  id="btn" alignItems="flex-end">  <Button disabled = {this.state.experienceData.isExperience==""?true:false} variant="contained" type="submit"  size="small" color="primary">
  Save 
 </Button></Grid>
 

 return (
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">
 <fieldset id = "roleBasedDisable">
<Grid id="hideData" container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
       <h5> Experience Details</h5>
         </FormControl>  
     </Grid>
     <Grid item xs={12} sm={3}></Grid>
     <Grid item xs={12} >
     <RadioGroup  row aria-label="position"   onChange={this.handleChange.bind(this)}>
     <FormControlLabel checked={this.state.experienceData.isExperience=="N" || ''} value="N" name="Fresher1" labelPlacement="start" control={<Radio />} label="Fresher" />
        <FormControlLabel  checked={this.state.experienceData.isExperience=="Y" || ''} value="Y" labelPlacement="start" name="experienced" control={<Radio />} label="Experienced" />
     </RadioGroup>
     </Grid>
    
     <br></br>
     <Grid item xs={12} sm={3} id = "experienceFrom">
         <TextField id="date" name = "experienceFrom" id = "experienceFrom" onChange={this.handleInputChange}
         label="Experience from" value={this.state.experienceData.experienceFrom || ''}
         helperText = {this.state.errors.experienceFrom != undefined ? this.state.errors.experienceFrom.label : '' } 
        error = {this.state.errors.experienceFrom != undefined ? this.state.errors.experienceFrom.value : '' }
         type="date"
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} />

     </Grid>

     <Grid item xs={12} sm={3} id = "experienceTo">
         <TextField id="date" name = "experienceTo" id = "experienceTo" onChange={this.handleInputChange}
         label="Experience to"
         helperText = {this.state.errors.experienceTo != undefined ? this.state.errors.experienceTo.label : '' } 
        error = {this.state.errors.experienceTo != undefined ? this.state.errors.experienceTo.value : '' }
        value={this.state.experienceData.experienceTo || ''}
         type="date"
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} />

     </Grid>
     
     <Grid item xs={12}>
        
     </Grid>
  
      <Grid item xs={12} sm={3} id="employerName">
       <FormControl>
         <TextField type="text" name="employerName" id="employerName"
         label = "Employer Name"
         helperText = {this.state.errors.employerName != undefined ? this.state.errors.employerName.label : '' } 
         error = {this.state.errors.employerName != undefined ? this.state.errors.employerName.value : '' }
         onChange={this.handleInputChange} value={this.state.experienceData.employerName || ''} />
       </FormControl>
     </Grid>
      <Grid item xs={12} sm={3} id="employerAddress">
       <FormControl>
         <TextField type="text" name="employerAddress" id="employerAddress"
         label = "Employer Address"
         helperText = {this.state.errors.employerAddress != undefined ? this.state.errors.employerAddress.label : '' } 
         error = {this.state.errors.employerAddress != undefined ? this.state.errors.employerAddress.value : '' }
         onChange={this.handleInputChange} value={this.state.experienceData.employerAddress || ''} />
       </FormControl>
     </Grid>
      <Grid item xs={12} sm={3}  id="postingLocation">
       <FormControl>
         <TextField type="text" name="postingLocation" id="postingLocation" label = "Location of posting"
         helperText = {this.state.errors.postingLocation != undefined ? this.state.errors.postingLocation.label : '' } 
         error = {this.state.errors.postingLocation != undefined ? this.state.errors.postingLocation.value : '' }
         onChange={this.handleInputChange} value={this.state.experienceData.postingLocation || ''}  />
       </FormControl>
     </Grid>
      <Grid item xs={12} sm={3} id="lastDesignation">
       <FormControl>
         <TextField type="text" name="lastDesignation" id="lastDesignation" label = "Last Designation"
         helperText = {this.state.errors.lastDesignation != undefined ? this.state.errors.lastDesignation.label : '' } 
         error = {this.state.errors.lastDesignation != undefined ? this.state.errors.lastDesignation.value : '' }
         onChange={this.handleInputChange} value={this.state.experienceData.lastDesignation || ''}  />
       </FormControl>
     </Grid>

     <Grid item xs={12} sm={3} id="natureOfExperience">
       <FormControl>
         <TextField type="text" name="natureOfExperience" id="natureOfExperience" label = "Nature Of Experience"
         onChange={this.handleInputChange} value={this.state.experienceData.natureOfExperience || '' }
         helperText = {this.state.errors.natureOfExperience != undefined ? this.state.errors.natureOfExperience.label : '' } 
        error = {this.state.errors.natureOfExperience != undefined ? this.state.errors.natureOfExperience.value : '' }  />
       </FormControl>
     </Grid>
     <Grid item xs={12} sm={3} id="grossSalary">
       <FormControl>
         <TextField type="number" name="grossSalary" id="grossSalary" label = "Gross Salary (/Month)"
         onChange={this.handleInputChange} value={this.state.experienceData.grossSalary || ''}
         onInput = {(e) =>{
          e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,7)
      }}
         helperText = {this.state.errors.grossSalary != undefined ? this.state.errors.grossSalary.label : '' } 
        error = {this.state.errors.grossSalary != undefined ? this.state.errors.grossSalary.value : '' }  />
       </FormControl>
     </Grid>

   </Grid>
   <br></br>
   {button}
   </fieldset>
 </form>
 <br></br>
 <div id="dtb">
 <MUIDataTable  title={"List Of Experience Details"} label={"List of Experience Details "}  columns={columns} data={this.state.info} options={options}
      />
      </div>
 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
 </div>

 );
}

}

export default Experience;