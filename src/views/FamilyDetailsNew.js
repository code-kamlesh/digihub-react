import React, { Component } from 'react';
import { render } from "react-dom";
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { roleBasedReadonly , checkButton } from './../util/validation';
import AlertDialog from './../util/AlertDialog';
import {fetchFamilydetails,saveFamilyDetailsNew,fetchFamilyDetails} from './../util/api';
import MUIDataTable from "mui-datatables";
import {isNotEmpty,hasFatherDetails,hasMotherDetails,validateContact,validateNames,validateGrossSal} from './../util/validation';
import { serviceEndPoint } from './../util/serviceEndPoint';
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import { zIndex } from 'material-ui/styles';

const alertDialogOptions = {
  message: ''
}

class FamilyDetails extends Component {
    
  constructor(props) {
    super(props);
     
     this.state = {engagementId:props.engagementId,alertDialogFlag:false , disabled : false , flag : "0" , errors : {} , dbUserId : props.id, info:[{"createdBy" : UserContext.userid ,"updatedBy" : UserContext.userid , "isActive" : "Y" , "dbUserId" : props.id}],
     FamilyData : {createdBy : UserContext.userid , isActive:"Y",updatedBy : UserContext.userid ,  dbUserId : props.id, name: "",qualId:"", primaryBreadWinner:"",relationshipId:"", occupation:"" },
      qual : [
        { value: 'Uneducated', label: 'Uneducated' },
        { value: 'Below 5th Standard', label: 'Below 5th Standard' },
        { value: '5th Standard Passed', label: '5th Standard Passed' },
        { value: '7th Standard Passed', label: '7th Standard Passed' },
        { value: '8th Standard Passed', label: '8th Standard Passed' },
        { value: '9th Standard Passed', label: '9th Standard Passed' },
        { value: '10th Standard Passed', label: '10th Standard Passed' },
        { value: '12th Passed - science', label: '12th Passed - science' },
        { value: '12th Passed - Non-science', label: '12th Passed - Non-science' },
        { value: '12th Standard Passed', label: '12th Standard Passed' },
        { value: 'CSTI Certified', label: 'CSTI Certified' },
        { value: 'Diploma', label: 'Diploma' },
        { value: 'ITI', label: 'ITI' },
        { value: 'Professional', label: 'Professional' },
        { value: 'Degree', label: 'Degree' },
        { value: 'BSC - science', label: 'BSC - science' },
        { value: 'BSC - Non-science', label: 'BSC - Non-science' },
        { value: '2 Years Diploma', label: '2 Years Diploma' },
        { value: 'Bachelors Degree 2nd Year', label: 'Bachelors Degree 2nd Year' },
        { value: 'Bachelors Degree 3rd Year', label: 'Bachelors Degree 3rd Year' },
        { value: 'Bachelors Degree 4th Year', label: 'Bachelors Degree 4th Year' },
        { value: 'Bachelors Degree 5th Year', label: 'Bachelors Degree 5th Year' },
        { value: 'Graduate', label: 'Graduate' },
        { value: 'Masters Degree 1st Year', label: 'Masters Degree 1st Year' },
        { value: 'Masters Degree 2nd Year', label: 'Masters Degree 2nd Year' },
        { value: 'Post Graduate', label: 'Post Graduate' }
        ],
              occup : [
                { value: 'Agriculture', label: 'Agriculture' },
                { value: 'Businessman', label: 'Businessman' },
                { value: 'Casual labor / Physical work', label: 'Casual labor / Physical work' },
                {value: 'Deceased', label: 'Deceased' },
                { value: 'Don’t know Other', label: 'Don’t know Other' },
                { value: 'Profession (Teacher, Health care) Government job', label: 'Profession (Teacher, Health care) Government job' },
                { value: 'Student', label: 'Student' },
                { value: 'Soldier', label: 'Soldier' },
                { value: 'Shop worker', label: 'Shop worker' },
                { value: 'Shop owner', label: 'Shop owner' },
                { value: 'Trade (Construction, Tailoring, etc.) ', label: 'Trade (Construction, Tailoring, etc.) ' },
                { value: 'Unemployed', label: 'Unemployed' },
                { value: 'Agriculture', label: 'SelfEmployed-Agriculture' },
                { value: 'SelfEmployed-NonAgriculture', label: 'SelfEmployed-NonAgriculture' },
                { value: 'Employed-Agriculture', label: 'Employed-Agriculture' },
                { value: 'Employed-NonAgriculture', label: 'Employed-NonAgriculture' },
                { value: 'Unemployed', label: 'Unemployed' },
                { value: 'Student', label: 'Student' },
                { value: 'NotWorking', label: 'NotWorking' },
                { value: 'Retired', label: 'Retired' },
                { value: 'Pensioner', label: 'Pensioner' },
                { value: 'Housewife', label: 'Housewife' }
                ],
              relation:[
                { value: 'Father', label: 'Father' },
                { value: 'Mother', label: 'Mother' },
                { value: 'Brother', label: 'Brother' },
                { value: 'Daughter', label: 'Daughter' },
                { value: 'Father-In-Law', label: 'Father-In-Law' },
                { value: 'Father Guardian', label: 'Father Guardian' },
                { value: 'Guardian', label: 'Guardian' },
                { value: 'GrandMother', label: 'GrandMother' },
                { value: 'GrandFather', label: 'GrandFather' },
                { value: 'Mother-In-Law', label: 'Mother-In-Law' },
                { value: 'Sister', label: 'Sister' },
                { value: 'Son', label: 'Son' },
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Sister-In-Law', label: 'Sister-In-Law' },
                { value: 'Relative in Mumbai', label: 'Relative in Mumbai' },
                { value: 'Other', label: 'Other' }
                ],
              hOF : [
              { value: "Y", label: 'Yes' },
              { value: "N", label: 'No' }            
          ],
          pbw :[
            { value: "Y", label: 'Yes' },
              { value: "N", label: 'No' }
          ],
         };
    
         this.handleInputChange = this.handleInputChange.bind(this);
         this.handleSelectChange = this.handleSelectChange.bind(this);
         //this.fetchFamilydetailsFouUser();

         if(props.id != null && props.id != undefined)
         {
          this.fetchFamilydetailsFouUser((props.id));
          
         }
         
    //  if(props.id != null && props.id != undefined)
    //  {
    //    UserContext.dbUserId = props.id;
    //   this.getExperienceData((props.id));
    
      
    //  }
    
     
 }
 componentDidMount()
    {
      roleBasedReadonly();
    }
    validate = (name,value)=>{
      let errors = this.state.errors;
      switch (name) {
        case 'name': errors.name =isNotEmpty(value);
          break;
        // case 'qualId': errors.qualId = isNotEmpty(value);
        //   break;
      
        default:
        break;
    }
    
     // this.setState({errors, [name]: value});
     this.setState({errors});
    }
    

    handleSelectChange(selectname, event) {
      let value = 0 ;
      let target = null;
      try {
        target = event.target;
        value =  target.value;
      }
     catch(e)
     {
      value =  event;
     }
      
        this.setState({
          "disabled" : false
        });

        this.setState({
            FamilyData: {
              ...this.state.FamilyData,
              [selectname]: event
            }
          })

          this.setState({
            errors: {
              ...this.state.errors,
              [selectname] : {
                'label' : "" , 
                'value' : false
              }
            }
        });
        

        if(selectname=="relationshipId" ){
         // document.getElementById("relationshipId").style.overflow = "visible";
          let res=""
          if (hasFatherDetails(this.state.info) && event=="Father"){
            // alert("inside condition");
           res="Father's details are already added";
           value="";
          
           }
           if (hasMotherDetails(this.state.info) && event=="Mother"){
            //alert("inside condition mothr");
          res="Mother's details are already added";
          value="";
          
          }
         this.setState({
           errors: {
             ...this.state.errors,
             "relationshipId" : {
               'label' : res , 
               'value' : res == "" ? false : true 
             }
           }
       });
        }
          // if (selectname="occupation"){
          //   let res="";
          //   if(this.state.FamilyData.occupation==""){
          //     res="Please Fill Occupation.";
          //     value="";
        
          //   }else if(selectname="headOfFamily"){
          //     let res="";
          //     if(this.state.FamilyData.headOfFamily){
          //       res="Please Fill Head of Family.";
          //       value="";
          //     }
          //   }
          // }
       
      
      }
      handleEditChange(obj){
       // alert(JSON.stringify(obj));
        this.setState({
          FamilyData : obj 
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
       errors: {
           ...this.state.errors,
         [name] : {
            'label' : "" , 
            'value' : false
          }
         }
    });


    if(name == "name" )
        {
          let res = validateNames(value);
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
   
    // if(name == "contactNumber")
    // {
    //   let res = validateContact(name , value);
    
    // }

    // if(name == "grossSal")
    // {
    //   let res = validateGrossSal(name , value);
    
    // }

   
  // if(name == "name")
  // {
  //   alert(name);
  //   let res = "";
  //   if(this.state.FamilyData.name == "")
  //   {
  //     res = "Please fill Name first.";
  //     value = "";
  //   }
    
    
  // //   this.setState({
  // //     errors: {
  // //       ...this.state.errors,
  // //       [name] : {
  // //         'label' : res , 
  // //         'value' : res == "" ? false : true 
  // //       }
  // //     }
  // // });
  // }
 
   this.setState({
    FamilyData: {
       ...this.state.FamilyData,
       [name]: value
     }
   })
   //this.validate(name,value);
   }


 
  
 mySubmitHandler = (event) => {
  event.preventDefault();
  this.state.disabled = true;
 this.validateAll();

  // authentication response and redirect to error or dashbaord page
 // this.submitFamilyDetails();
 
   this.setState({
     errors : this.state.errors,
   });


   if(checkButton(this.state.errors))
     {
     //  alert(this.state.info);
      if(hasFatherDetails(this.state.info) || this.state.FamilyData.relationshipId == "Father" || this.state.FamilyData.relationshipId == "Mother")
            {
              
              this.state.disabled = false;
            this.submitFamilyDetails();
            }
            else
            {
              this.setState({alertDialogFlag:false});
              alertDialogOptions.message=<span style={{color:"red"}}>Please Enter Father/Mother Details</span>;
              this.setState({alertDialogFlag:true});
              this.state.disabled = true;
            }
      // this.submitFamilyDetails();
     }
     else
     {
       this.state.disabled = true;
  } 
 }

 validateAll() 
{
  var nonMandatoryFields = ["contactNumber","grossSal","id"];
  var json = this.state.FamilyData;
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
// alert(JSON.stringify(this.state.errors));

}
 fetchFamilydetailsFouUser(id){
  
      let familyInfo=[];

      fetchFamilyDetails(id).then((jsondata)=>{    
            let  familyDetailsOfUser = JSON.parse(jsondata.data); 
        //  alert(JSON.stringify(familyDetailsOfUser)) ;
                  for(var i=0;i<familyDetailsOfUser.length;i++){
                  var  details =
                  {    'name':familyDetailsOfUser[i].name, 
                      'relationship_id':familyDetailsOfUser[i].relationshipId,
                      'occupation':familyDetailsOfUser[i].occupation,
                      'qual_id' :familyDetailsOfUser[i].qualId,
                      'action':<EditIcon style={{color:"blue"}} onClick={this.handleEditChange.bind(this,familyDetailsOfUser[i])} />
                       
                  }; 
                  familyInfo.push(details);    
              }    
              this.setState({
                  info: familyInfo
                });
           }) 
         
     
 }

submitFamilyDetails()
{

 let action = "";
 const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
   if (dbUserId) {
     action =  "captureFamilyDetails";
   } else {
     action =  "updateFamilyDetails";
   }
   saveFamilyDetailsNew(action,this.state.FamilyData).then((jsondata)=>{
         if(jsondata.appError==null){      
             let jsonobjects = JSON.parse(jsondata.data);
             console.log(jsonobjects); 
           // alert(JSON.stringify(jsonobjects));
             this.setState({alertDialogFlag:false});
             if(action == 'captureFamilyDetails')
             {
              alertDialogOptions.message=<span style={{color:"green"}}>Family Details Saved Sucessfully</span>;
              this.setState({alertDialogFlag:true});
             }
             else 
             {
              alertDialogOptions.message=<span style={{color:"green"}}>Family Details Updated Sucessfully</span>;
              this.setState({alertDialogFlag:true});
             }
             UserContext.dbUserId = jsonobjects[0].dbUserId;
             this.resetForm();
            

         }  else{
             console.log("error");
         } 
         this.fetchFamilydetailsFouUser(this.state.dbUserId);
        
      })

}

resetForm = () => {
  this.setState({
    FamilyData: {
    ...this.state.FamilyData,
      name: '',
      occupation:'',
      contactNumber:'',
      headOfFamily:'',
      qualId:'',
      relationshipId:'',
      primaryBreadWinner:'',
      grossSal:''
},errors:{
  ...this.state.errors,
  name: '',
  occupation:'',
  
  headOfFamily:'',
  qualId:'',
  relationshipId:'',
  primaryBreadWinner:'',
  
}
  }
// },()=>{
//   if(typeof  this.state.FamilyData.id!="undefined"){
//     this.setState({FamilyData: {
//                   ...this.state.FamilyData,
//                   id: 0
//                   }
//   });
//   }
// }
);
}


render()
{
    const columns = [{label: 'Name', name: 'name', headerStyle: {color:'#FF9800'}},
    {label: 'Relationship Id', name: 'relationship_id',headerStyle: {color:'#FF9800'}},
    {label: 'Occupation', name: 'occupation',headerStyle: {color:'#FF9800'}},
    {label: 'Qualification', name: 'qual_id',headerStyle: {color:'#FF9800'}},
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
const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
let button;

if (dbUserId) {
 button = <Grid container direction="row" justify="flex-end" alignItems="flex-end">  <Button disabled = {this.state.disabled} variant="contained" type="submit"  size="small" color="primary">
 Save 
</Button></Grid>
} else {
 button =<Grid container direction="row" justify="flex-end" alignItems="flex-end"> 
 <Button disabled = {this.state.disabled} type="submit" variant="contained" size="small" color="primary">Save</Button>
 &nbsp;&nbsp;
 <Button onClick={this.resetForm}  variant="contained" size="small" color="primary">Reset</Button>
 </Grid>;
}
 return (
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">
 <fieldset id = "roleBasedDisable">
   
<Grid container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
       <h5> Family Details</h5>
         </FormControl>  
     </Grid>
     
     
     <Grid item xs={12} sm={3}>
         <TextField type="text" name = "name" onChange={this.handleInputChange}
         label=" Name"  value={this.state.FamilyData.name || ''}
         helperText = {this.state.errors.name != undefined ? this.state.errors.name.label : '' } 
         error = {this.state.errors.name != undefined ? this.state.errors.name.value : '' }
         
         />

     </Grid>

     <Grid item xs={12} sm={3}>
     <SingleSelect  name="occupation" id="occupation" label="Occupation"
     onChange={this.handleSelectChange.bind(this, 'occupation')}
                            value={this.state.FamilyData.occupation || ''}
                            helperText = {this.state.errors.occupation != undefined ? this.state.errors.occupation.label : '' } 
                            error = {this.state.errors.occupation != undefined ? this.state.errors.occupation.value : '' }
                            options={this.state.occup} key={this.state.FamilyData.occupation}
                            /> 

     </Grid>
     
     
  
      <Grid item xs={12} sm={3}>
       
       <TextField
                              type="number"  label=" Contact Number" onChange={this.handleInputChange}
                              name="contactNumber" onChange={this.handleInputChange}
                              value={this.state.FamilyData.contactNumber || ''}
                              onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                            }}
                             
                            />
      
     </Grid>
      <Grid item xs={12} sm={3}>
      
       <SingleSelect  name="headOfFamily" id="headOfFamily" label="Head Of Family"
       onChange={this.handleSelectChange.bind(this, 'headOfFamily')}
                            value={this.state.FamilyData.headOfFamily || ''}
                            helperText = {this.state.errors.headOfFamily != undefined ? this.state.errors.headOfFamily.label : '' } 
                            error = {this.state.errors.headOfFamily != undefined ? this.state.errors.headOfFamily.value : '' }  
                            options={this.state.hOF} key={this.state.FamilyData.headOfFamily}
                            /> 
       
     </Grid>
      <Grid item xs={12} sm={3}>
     
       <SingleSelect label="Qualification"  name="qualId" id="qualId" 
        onChange={this.handleSelectChange.bind(this, 'qualId')}
                            value={this.state.FamilyData.qualId || ''}
                            helperText = {this.state.errors.qualId != undefined ? this.state.errors.qualId.label : '' } 
                            error = {this.state.errors.qualId != undefined ? this.state.errors.qualId.value : '' }                           
                            options={this.state.qual} key={this.state.FamilyData.qualId}></SingleSelect>
      
     </Grid>
      <Grid item xs={12} sm={3}>
      
       <SingleSelect styles={{
  
    overflow:"visible"
  }}  name="relationshipId" id="relationshipId" label="Relationship"
        onChange={this.handleSelectChange.bind(this, 'relationshipId')}
                            value={this.state.FamilyData.relationshipId || ''}
                            helperText = {this.state.errors.relationshipId != undefined ? this.state.errors.relationshipId.label : '' } 
                            error = {this.state.errors.relationshipId != undefined ? this.state.errors.relationshipId.value : '' }
                         options={this.state.relation} key={this.state.FamilyData.relationshipId}
                            /> 
       
     </Grid>

     <Grid item xs={12} sm={3}>
      
       <SingleSelect  name="primaryBreadWinner" id="primaryBreadWinner" label="Primary Breadwinner"
        onChange={this.handleSelectChange.bind(this, 'primaryBreadWinner')}
                            value={this.state.FamilyData.primaryBreadWinner || ''}
                            helperText = {this.state.errors.primaryBreadWinner != undefined ? this.state.errors.primaryBreadWinner.label : '' } 
                            error = {this.state.errors.primaryBreadWinner != undefined ? this.state.errors.primaryBreadWinner.value : '' }
                            options={this.state.pbw} key={this.state.FamilyData.primaryBreadWinner}
                            /> 
      
     </Grid>
     <Grid item xs={12} sm={3}>
       
       <TextField
                              type="number"
                              name="grossSal"
                             value={this.state.FamilyData.grossSal || ''}
                             onInput = {(e) =>{
                              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)
                          }}
                             onChange={this.handleInputChange}
                             label="Gross Salary /month"
                               className="form-control"
                            />
       
     </Grid>

   </Grid>
   <br></br>
   {button}
   </fieldset>
   <br></br>
   <br></br>
   
   
   
 </form>
 <br></br>
 <p  style={{color:"red"}}>Note-: Father and Mother details are mandatory.</p>
 <MUIDataTable    styles={{
    // Fixes the overlapping problem of the component
    zIndex: -1
  }}  title={"List Of Family Members"} label={"List of Family members"} data={this.state.info} columns={columns} options={options}
      />
 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
 </div>

 );
}

}

export default FamilyDetails;