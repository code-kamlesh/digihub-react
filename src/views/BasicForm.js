import React, { Component } from 'react';
import { useState } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'
import underscore from 'underscore';

//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { captureStudentEngagementDetails,findByAadharNo, submitAddressData, subMitBasicData, fetchAddressData, fetchBasicData,
         fetchAddressDetailsBasedOnPincode} from './../util/api';
import { regenerateToken } from './../util/validation';
import {checkButton , validateBirthDate, validateEmail ,validateContact,validatePassingYear, 
   validateNames, validateAadhar , validatePincode, roleBasedReadonly,
  isAadharNoDuplicate} from './../util/validation';
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
//import 'bootstrap/dist/css/bootstrap.min.css';
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from '@material-ui/core/Button';
  import { FormControl,FormControlLabel , InputLabel , Switch, Input, Grid , TextField}  from '@material-ui/core';
import styles from "../components/components.js"; 
import { CommunicationCallMerge } from 'material-ui/svg-icons';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
//import MasterData from './../components/MasterData.js'
import { serviceEndPoint } from './../util/serviceEndPoint';
class BasicForm extends Component
{

  
    constructor(props) {
      super(props);

        this.state = {
          salutation : [
            { value: 'Mr.', label: 'Mr.' },
            { value: 'Mrs.', label: 'Mrs.' },
            { value: 'Miss', label: 'Miss' }
            ],
            
            
            qual : [
            { value: 'Uneducated', label: 'Uneducated' },
            { value: 'Below 5th Standard', label: 'Below 5th Standard' },
            { value: '5th Standard Passed', label: '5th Standard Passed' },
            { value: '7th Standard Passed', label: '7th Standard Passed' },
            { value: '8th Standard Failed', label: '8th Standard Failed' },
            { value: '8th Standard Passed', label: '8th Standard Passed' },
            { value: '9th Standard Passed', label: '9th Standard Passed' },
            { value: '10th Standard Passed', label: '10th Standard Passed' },
            { value: '12th Standard', label: '12th Standard' },
            { value: 'Below 12th Standard', label: 'Below 12th Standard' },
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
            
            
            gender : [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Others', label: 'Others' }
            ],
            
            
            religion : [
            { value: 'Hindu', label: 'Hindu' },
            { value: 'Muslim', label: 'Muslim' },
            { value: 'Christian', label: 'Christian' },
            { value: 'Sikh', label: 'Sikh' },
            { value: 'Buddhist', label: 'Buddhist' },
            { value: 'Jews', label: 'Jews' },
            { value: 'Others', label: 'Others' }
            ],
            
            category : [
            { value: 'Gen', label: 'Gen' },
            { value: 'OBC', label: 'OBC' },
            { value: 'SC', label: 'SC' },
            { value: 'ST', label: 'ST' },
            { value: 'PH', label: 'PH' },
            { value: 'DNT', label: 'DNT' },
            { value: 'IDWTDC', label: 'IDWTDC' },
            { value: 'VJ', label: 'VJ' },
            { value: 'SBC', label: 'SBC' },
            { value: 'NT', label: 'NT' }
            ],
            
            channel : [
            { value: 'Flyer/Sticker/Banner/Poster', label: 'Flyer/Sticker/Banner/Poster' },
            { value: 'Call from Tata STRIVE', label: 'Call from Tata STRIVE' },
            { value: 'Reference - Employee', label: 'Reference - Employee' },
            { value: 'NGO - Mobilisation Partner', label: 'NGO - Mobilisation Partner' },
            { value: 'Reference - Influencer', label: 'Reference - Influencer' },
            { value: 'Reference - Learner', label: 'Reference - Learner' },
            { value: 'Other', label: 'Other' },
            { value: 'School/College/University', label: 'School/College/University' },
            { value: 'Social Media/ SMS', label: 'Social Media/ SMS' },
            { value: 'Advertisement Media', label: 'Advertisement Media' },
            { value: 'Community Activity', label: 'Community Activity' },
            { value: 'Call Center', label: 'Call Center' },
            { value: 'Job Fairs/ Community', label: 'Job Fairs/ Community' },
            { value: 'Corporate Support', label: 'Corporate Support' },
            { value: 'TS - Website Lead', label: 'TS - Website Lead' },
            { value: 'Walk-in', label: 'Walk-in' }
            ],
            
            bloodgroup : [
              { value: 'A +ve', label: 'A +ve' },
              { value: 'A -ve', label: 'A -ve' } , 
              { value: 'B +ve', label: 'B +ve' } , 
              { value: 'B -ve', label: 'B -ve' } , 
              { value: 'O +ve', label: 'O +ve' } , 
              { value: 'O -ve', label: 'O -ve' } , 
              { value: 'AB +ve', label: 'AB +ve' } , 
              { value: 'AB -ve', label: 'AB -ve' }           
          ],
            bplStatus : [
                { value: 'BPL', label: 'BPL' },
                { value: 'APL', label: 'APL' },
                { value: 'Antyodaya', label: 'Antyodaya' }             
            ],
            
          state1 : [],
          district1 : [],
          state2 : [],
          district2 : [],
          pincodes:[],   
          city1:[],
          village1:[],
          city2:[],
          village2:[],
          checked : false , disabled : false , flag : "0" ,errors : {} , erroradd1 : {} , erroradd2 : {}, engagementId : props.engagementId , dbUserId : props.id, basicData : {createdBy : UserContext.userid,
          mobilizedBy : UserContext.userid,
        aadharNo : "" , salutation : "" , gender : "" , firstName : "" , middleName : "" , lastName : "" , highestQualification : "", religion : "",
        bplStatus : "" , bloodGroup : "" , passingYear : null , primaryContactNumber : "" , secondaryContactNumber : null , primaryEmailId : "" , secondaryEmailId : "",
        category : "" , mobilizationChannel : "" , dob : ""
        }, address : {createdBy : UserContext.userid,'isActive' : 'Y','type' : 'R' , pincode : "" , addressLine1 : "" , addressLine2 : "" , district : "" , state : "" , cityName : "", villageName : ""},
        address2 : {createdBy : UserContext.userid,'isActive' : 'Y','type' : 'P' , pincode : "" , addressLine1 : "" , addressLine2 : "" , district : "" , state : "" , cityName : "", villageName : ""} ,
        addressTmp : {id:'',createdBy : UserContext.userid,'isActive' : 'Y','type' : 'P' , pincode : "" , addressLine1 : "" , addressLine2 : "" , district : null , state : null , cityName : null, villageName : null}};
        this.updatedData = {firstName : ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleAddressInputChange = this.handleAddressInputChange.bind(this);
        this.handleAddressSelectChange = this.handleAddressSelectChange.bind(this);
        this.handleAddressInputChange2 = this.handleAddressInputChange2.bind(this);
        this.handleAddressSelectChange2 = this.handleAddressSelectChange2.bind(this);
        this.handlePresentPermanentAddress = this.handlePresentPermanentAddress.bind(this);
        //this.validateAll = this.validateAll.bind(this);
 
        if(props.id != null && props.id != undefined)
        {
         this.getBasicData((props.id));
         this.getAddressData((props.id));
         
        }
       // alert(this.state.dbUserId);
        
    }

    componentDidMount()
    {
      roleBasedReadonly();
      if(this.state.dbUserId != null && this.state.dbUserId != undefined)
      {
        document.getElementById("aadharNo").setAttribute("disabled", true);
      }
    }

    handlePresentPermanentAddress = name => event => {
      this.setState({ ...this.state, [name]: event.target.checked });
      if(event.target.checked == true)
      {
        this.getPincodeData2("pincode" , this.state.address.pincode);
        this.setState({
          address2 : {
           // ...this.state.address,
           ...this.state.address2,
            "type" : "P",
            "addressLine1":this.state.address.addressLine1,
            "addressLine2":this.state.address.addressLine2,
            "pincode":this.state.address.pincode,
            "villageName":this.state.address.villageName,
            "cityName":this.state.address.cityName,
            "district":this.state.address.district,
             "state":this.state.address.state
          },
          erroradd2 : this.state.erroradd1
        })
        
      }
      else
      {
        this.state = {...this.state , 
          state2 : [],
          district2 : [],
          village2 : [],
          city2 : []
        }

this.setState({
  addressTmp : {...this.state.addressTmp,
               "id":this.state.address2.id}
              },()=>{ this.setState({address2 : this.state.addressTmp})});       
      }
      
    };

    handleInputChange(event) {
      this.setState({
        "disabled" : false
      });
      let flag = 0;
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          errors: {
            ...this.state.errors,
            [name] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
      if(name == "dob")
      {
        let res = validateBirthDate(value);
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
      if(name == "primaryEmailId" || name == "secondaryEmailId")
      {
        let res = validateEmail(name , value);
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
      if((name == "secondaryContactNumber" || name == "primaryContactNumber" ))
        {
          let res = validateContact(name, value);
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

      if((name == "firstName" || name == "middleName" || name == "lastName" ))
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
 
      if(name == "aadharNo")
      {
        let res = validateAadhar(value);
        if(!res){
          findByAadharNo(value).then((jsondata) => { 
            let studentDetails = JSON.parse(jsondata.data);
           if(studentDetails.length>0){
             res="student is already registered with this aadhar number";
             this.setState({
              errors: {...this.state.errors,
                [name] : {'label' : res , 'value' : res == "" ? false : true }}
          });
          }
        });
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
      if(name == "passingYear")
      {
        let res = validatePassingYear(value,this.state.basicData.dob,this.state.basicData.highestQualification);
        this.setState({
          basicData : {
            ...this.state.basicData,
            [name] : res == "" ? value : null 
          },
          errors: {
            ...this.state.errors,
            [name] : {
              'label' : res , 
              'value' : res == "" ? false : true 
            }
          }
      });
      }
      this.setState({
        basicData: {
          ...this.state.basicData,
          [name]: value
        }
      });
      
      
    }
      handleSelectChange(selectname, event) {
        this.setState({
          "disabled" : false
        });
        if(selectname == "highestQualification" && event == "1")
        {
          this.state.basicData.passingYear = null;
            this.state.errors.passingYear = {"label" : "" , "value" : false};
          document.getElementById("passingYear").setAttribute("disabled" , true);
        }
        else if(selectname == "highestQualification")
        {
          document.getElementById("passingYear").removeAttribute("disabled");
        }
        this.setState({
          basicData: {
            ...this.state.basicData,
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
        
      }

      handleAddressInputChange(event) {
        this.setState({
          "disabled" : false
        });
        let flag = 0 ;
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          erroradd1: {
            ...this.state.errors,
            [name] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
        this.setState({
          address: {
            ...this.state.address,
            [name]: value
          }
        })

        
      }
      handleAddressSelectChange(selectname, event) {
        this.setState({
          "disabled" : false
        });
        this.setState({
          address: {
            ...this.state.address,
            [selectname]: event
          }
        })

        this.setState({
          erroradd1: {
            ...this.state.erroradd1,
            [selectname] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
        
      }
      handleAddressInputChange2(event) {
        this.setState({
          "disabled" : false
        });
        let flag = 0 ;
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          erroradd2: {
            ...this.state.erroradd1,
            [name] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
        this.setState({
          address2: {
            ...this.state.address2,
            [name]: value
          }
        })

        
      }
      handleAddressSelectChange2(selectname, event) {
        this.setState({
          "disabled" : false
        });
        this.setState({
          address2: {
            ...this.state.address2,
            [selectname]: event
          }
        })

        this.setState({
          erroradd2: {
            ...this.state.erroradd2,
            [selectname] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
        
      }
      getPincodeData(selectname, event) {
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
        let res = validatePincode(value);
          this.setState({
            erroradd1: {
              ...this.state.erroradd1,
              "pincode" : {
                'label' : res , 
                'value' : res == "" ? false : true 
              }
            }
        });
          this.setState({
            address: {
              ...this.state.address,
              "pincode": value
            }
          })

       if(value.length==6){         
         fetchAddressDetailsBasedOnPincode(value).then((jsondata)=>{    
           let jsonobjects = JSON.parse(jsondata.data);
           let taluk=[];
           let pincode=[]; 
           let cityVillage=[]; 
           let states=[];  
           let district=[]; 

           jsonobjects.map(item => { cityVillage.push({label: item.cityVillage, value: item.cityVillage})});
           cityVillage=underscore.uniq(cityVillage,true,"label");
           jsonobjects.map(item => {taluk.push({label: (item.taluk).toString(), value: item.taluk})});          
           taluk=underscore.uniq(taluk,true,"label");
           jsonobjects.map(item => {states.push({label: item.state, value: (item.state).toString()})});          
           states=underscore.uniq(states,true,"label");
           jsonobjects.map(item => {district.push({label: item.district, value: (item.district).toString()})});          
           district=underscore.uniq(district,true,"label");
           this.setState({
             state1 : states,
             district1 : district ,  
             village1 :  cityVillage,
             city1 : taluk

           })

          })
        }
          
      }
      getPincodeData2(selectname, event) {
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
        let res = validatePincode(value);

          this.setState({
            erroradd2: {
              ...this.state.erroradd2,
              "pincode" : {
                'label' : res , 
                'value' : res == "" ? false : true 
              }
            }
        });
          this.setState({
            address2: {
              ...this.state.address2,
              "pincode": value
            }
          })

       if(value.length==6){
         fetchAddressDetailsBasedOnPincode(value).then((jsondata)=>{            
           let jsonobjects = JSON.parse(jsondata.data);
           let taluk=[];
           let pincode=[]; 
           let cityVillage=[]; 
           let states=[];  
           let district=[]; 

           jsonobjects.map(item => { cityVillage.push({label: item.cityVillage, value: item.cityVillage})});
           cityVillage=underscore.uniq(cityVillage,true,"label");
           jsonobjects.map(item => {taluk.push({label: item.taluk, value: item.taluk})});          
           taluk=underscore.uniq(taluk,true,"label");
           jsonobjects.map(item => {states.push({label: item.state, value: item.state})});          
           states=underscore.uniq(states,true,"label");
           jsonobjects.map(item => {district.push({label: item.district, value: item.district})});          
           district=underscore.uniq(district,true,"label");
           this.setState({
            state2 : states,
            district2 : district ,  
            village2 :  cityVillage,
            city2 : taluk

          })
          })
        }
          
      }
      
    mySubmitHandler = (event) => {
        event.preventDefault();
        this.state.disabled = true;
       this.validateAll();
      
        // authentication response and redirect to error or dashbaord page
        this.setState({
          errors : this.state.errors,
          erroradd1 : this.state.erroradd1,
          erroradd2 : this.state.erroradd2
        });
        if(checkButton(this.state.errors) && checkButton(this.state.erroradd2) && checkButton(this.state.erroradd1))
          {
            this.submitStudent();
          }
          else
          {
            this.state.disabled = true;
        }

        
    }

validateAll() 
{
  var nonMandatoryFields = ["addressLine2" , "createdBy", "mobilizedBy" , "middleName" , "dbUserId" , "secondaryContactNumber" , "secondaryEmailId","passingYear","bloodGroup","mobilizationPlace"]
  var json = this.state.basicData;
  var jsonaddress1 = this.state.address;
  var jsonaddress2 = this.state.address2;
  var errors = this.state.errors;
  var erroradd1 = this.state.erroradd1;
  var erroradd2 = this.state.erroradd2;
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
  Object.keys(jsonaddress1).forEach(function(key) {
    if((!nonMandatoryFields.includes(key)) && (jsonaddress1[key] == undefined || jsonaddress1[key] == '' ))
    {
      let res = "Please fill out this field";
      erroradd1[key] = {
            'label' : res , 
            'value' : res == "" ? false : true 
          }
   }
});
Object.keys(jsonaddress2).forEach(function(key) {
  if((!nonMandatoryFields.includes(key)) && (jsonaddress2[key] == undefined || jsonaddress2[key] == '' ))
  {
    let res = "Please fill out this field";
    erroradd2[key] = {
          'label' : res , 
          'value' : res == "" ? false : true 
        }
 }
});
  //alert(JSON.stringify(errors));
  this.state.errors = errors;
  this.state.erroradd1 = erroradd1;
  this.state.erroradd2 = erroradd2;
  
}
    getBasicData(id)
    {

      let formData = new FormData();
     //alert(JSON.stringify(this.state));
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewBeneficiaryDetailsById" +'", "data" : [{"dbUserId" : ' + id + '}]}');
      try {
          return fetch(serviceEndPoint.studentServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        },    
          body: formData 
          }).then(response => response.json()).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  console.log(jsonobjects); 
                  Object.keys(jsonobjects[0]).forEach(function(key) {
                    this.setState({
                      basicData: {
                        ...this.state.basicData,
                        [key]: jsonobjects[0][key].toString()
                      }
                    })
                  }.bind(this));
                 //alert(JSON.stringify(this.state));
              
              }  else{
                  console.log("error");
              } 
           })
           
      }  catch (error) {
          console.log("XXXXXX"+error);
      }
    }

    getAddressData(id)
    {
      fetchAddressData(id).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  console.log(jsonobjects); 
                  Object.keys(jsonobjects[0]).forEach(function(key) {
                    if(jsonobjects[0].type == "R")
                    {
                      this.setState({
                        address: {
                          ...this.state.address,
                          [key]: jsonobjects[0][key].toString()
                        }
                      })
                    }
                    if(jsonobjects[0].type == "P")
                    this.setState({
                      address2: {
                        ...this.state.address2,
                        [key]: jsonobjects[0][key].toString()
                      }
                     // ,["prAddId"] : jsonobjects[0].id
                    })
                  }.bind(this));
                  if(typeof  jsonobjects[1]!="undefined"){
                  Object.keys(jsonobjects[1]).forEach(function(key) {
                    if(jsonobjects[1].type == "R")
                    {
                      this.setState({
                        address: {
                          ...this.state.address,
                          [key]: jsonobjects[1][key].toString()
                        }
                      })
                    }
                    if(jsonobjects[1].type == "P")
                    this.setState({
                      address2: {
                        ...this.state.address2,
                        [key]: jsonobjects[1][key].toString()
                      }
                     // ,["prAddId"] : jsonobjects[1].id
                    })
                  }.bind(this));
                }
                  this.getPincodeData("pincode" , this.state.address.pincode);
                  this.getPincodeData2("pincode" , this.state.address2.pincode);
                  if(this.state.address.addressLine1 == this.state.address2.addressLine1 && this.state.address.pincode == this.state.address2.pincode)
                 {
                   this.setState({
                     ...this.state,
                      "checked" : true
                   })
                 }
              
              }  else{
                  console.log("error");
              } 
           })
    
    }

 

 submitStudent()
{
    let action = "";
    const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
      if (dbUserId) {
        action =  "captureBeneficiaryDetails";
      } else {
        action =  "updateBeneficiaryDetails";
        this.setState({
          basicData: 
          {
            ...this.state.basicData,
            "updatedBy" : UserContext.userid
          }
        })
      }
    //alert(JSON.stringify(this.state.basicData));
        //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
        subMitBasicData(action,this.state.basicData).then((jsondata)=>{
            console.log(jsondata); 
            if(jsondata.appError==null){      
                let jsonobjects = JSON.parse(jsondata.data);
                console.log(jsonobjects); 
               // alert("Successfully Mobilized");
                //this.props.history.push('/dashboard');
                UserContext.dbUserId = jsonobjects[0].dbUserId;
                if(action == 'captureBeneficiaryDetails')
                {
                this.submitAddress(jsonobjects[0].dbUserId,this.state.address) ;
                // if(this.state.prAddId != undefined)
                // {
                //   this.setState({
                //     address2 : {
                //       ...this.state.address2,
                //       "id" : this.state.prAddId
                //     }
                //   })
                // }
                this.submitAddress(jsonobjects[0].dbUserId,this.state.address2) ;
                captureStudentEngagementDetails(jsonobjects[0].dbUserId,UserContext.centerId,UserContext.userid).then((jsondata) => { 
                  let json = JSON.parse(jsondata.data);
                  this.setState({
                    engagementId : json[0].engagementId
                  })
                  alert("Successfully Mobilized");
                   setTimeout(() => {this.props.history.push({
                    pathname: '/dashboard/updatebeneficiary',
                    state: { dbUserId: jsonobjects[0].dbUserId, engagementId : this.state.engagementId ,  tab : 1 , name : jsonobjects[0].firstName + " " + jsonobjects[0].lastName  }
                  }) },3000)
                });
               
                } 
                else 
                {
                  this.submitAddress(jsonobjects[0].dbUserId,this.state.address) ;
                  // if(this.state.prAddId != undefined)
                  // {
                  //   this.setState({
                  //     address2 : {
                  //       ...this.state.address2,
                  //       "id" : this.state.prAddId
                  //     }
                  //   })
                  // }


                  this.submitAddress(jsonobjects[0].dbUserId,this.state.address2) ;
                  alert("Successfully Updated");
                  setTimeout(() => {this.props.history.push({
                    pathname: '/dashboard/updatebeneficiary',
                    state: { dbUserId: jsonobjects[0].dbUserId , engagementId : this.state.engagementId , tab : 1} 
                  }) },3000)
                }
                
                

            }  else{
                console.log("error");
            } 
         })

}

submitAddress(dbUserId , address)
{
  let action = "";
  const dbUserId2 = (this.state.dbUserId == '' || this.state.dbUserId == null);
  //alert(dbUserId);
      if (dbUserId2) {
        action =  "captureAddress";
      } else {
        action =  "updateAddress";
        address = {
          ...address , 
          "updatedBy" : UserContext.userid
        }
      }

        address =  {
          ...address,
          'entityId': dbUserId,
          "entityType" : "S"
        }
          submitAddressData(action,address).then((jsondata)=>{
            if(jsondata.appError==null){      
                let jsonobjects = JSON.parse(jsondata.data);
                //alert("Successfully Mobilized");
                //this.props.history.push('/dashboard');
                //this.submitEngagement(jsonobjects[0].dbUserId) ;
            }  else{
                console.log("error");
            } 
         })
}

render()
{
  const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
  let button;
  let displayText = "";
  if(this.state.checked)
  {
    displayText = 
    <Grid item xs={12} sm={12}>
          (Permanent address same as present address ? ).
          <FormControlLabel
            control={
              <Switch onChange={this.handlePresentPermanentAddress('checked')} checked = {this.state.checked} />
            }
            
      />    
        </Grid>
  }
  else
  {
    displayText = 
    <Grid item xs={12} sm={12}>
          (Permanent address same as present address ? ).
          <FormControlLabel
            control={
              <Switch onChange={ this.handlePresentPermanentAddress('checked')} checked = {this.state.checked} />
            }
            
      />    
        </Grid>
  }
  if (dbUserId) {
    button =   <Button disabled = {this.state.disabled} id = "save" type = "submit" variant="contained"  color="primary"   size="small">
    Mobilise
  </Button>;
  } else {
    button = <Button  disabled = {this.state.disabled} id = "save" type = "submit" variant="contained" color="secondary" size="small">Update</Button>;
  }
    return (
  <div style = {{ width : '100%' }}>
    <form method="post" onSubmit = {this.mySubmitHandler}>
      <fieldset id = "roleBasedDisable">
   <Grid container spacing={2}>
    <Grid item xs={12}>
          <FormControl>
          <h5>Basic Details</h5>
            </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="number" name="aadharNo" id="aadharNo"
            label = "Aadhar Number"  onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,12)
          }}
           onChange={this.handleInputChange} value={this.state.basicData.aadharNo || ''}
            helperText = {this.state.errors.aadharNo != undefined ? this.state.errors.aadharNo.label : '' } 
            error = {this.state.errors.aadharNo != undefined ? this.state.errors.aadharNo.value : '' }  
            />
            
          </FormControl>  
        </Grid>
        <Grid item xs={12} sm={3}>
        <InputLabel shrink={true} >Gender</InputLabel>
            <SingleSelect  isClearable={true} onChange={this.handleSelectChange.bind(this, 'gender')} name="gender" id="gender"
               value={this.state.basicData.gender || '' }
              helperText = {this.state.errors.gender != undefined ? this.state.errors.gender.label : '' } 
            error = {this.state.errors.gender != undefined ? this.state.errors.gender.value : '' }
              options={this.state.gender}
            />
        </Grid>
        <Grid item xs={12} sm={3}>
            <TextField   id="date" name = "dob" id = "dob" onChange={this.handleInputChange}
            label="Birthday" value={this.state.basicData.dob || ''}
            helperText = {this.state.errors.dob != undefined ? this.state.errors.dob.label : '' } 
            error = {this.state.errors.dob != undefined ? this.state.errors.dob.value : '' }
            type="date"
            inputProps={{  min: new Date('02/01/1980').toISOString().slice(0,10) , max: new Date().toISOString().slice(0,10)}}
            InputLabelProps={{
              shrink: true,
            }} />

        </Grid>
        <Grid item xs={12} sm={3}>
       <InputLabel shrink={true} >Blood Group</InputLabel>
       <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'bloodGroup')} name="bloodGroup" id="bloodGroup"
               options={this.state.bloodgroup}  value={this.state.basicData.bloodGroup || ''}
           //   helperText = {this.state.errors.bloodGroup != undefined ? this.state.errors.bloodGroup.label : '' } 
           // error = {this.state.errors.bloodGroup != undefined ? this.state.errors.bloodGroup.value : '' }
            /> 
        </Grid>
        <Grid item xs={12} sm={3}>
        <InputLabel shrink={true} >Salutation</InputLabel>
        <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'salutation')} name="salutation" id="salutation" value={this.state.basicData.salutation || ''}
              helperText = {this.state.errors.salutation != undefined ? this.state.errors.salutation.label : '' } 
            error = {this.state.errors.salutation != undefined ? this.state.errors.salutation.value : '' }
              options={this.state.salutation}
            />
        </Grid>
         <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="text" name="firstName" id="firstName"
            helperText = {this.state.errors.firstName != undefined ? this.state.errors.firstName.label : '' } 
            error = {this.state.errors.firstName != undefined ? this.state.errors.firstName.value : '' }
            label = "First Name"  onChange={this.handleInputChange} value={this.state.basicData.firstName || ''} />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl> 
            <TextField type="text" name="middleName" id="middleName"
            helperText = {this.state.errors.middleName != undefined ? this.state.errors.middleName.label : '' } 
            error = {this.state.errors.middleName != undefined ? this.state.errors.middleName.value : '' }
            label = "Middle Name" onChange={this.handleInputChange}  value={this.state.basicData.middleName || ''} />
          </FormControl>
        </Grid>
         <Grid item xs={12} sm={3}>
          <FormControl>
            <TextField   type="text" name="lastName" id="lastName" 
             helperText = {this.state.errors.lastName != undefined ? this.state.errors.lastName.label : '' } 
             error = {this.state.errors.lastName != undefined ? this.state.errors.lastName.value : '' } 
            label = "Last Name"  onChange={this.handleInputChange} value={this.state.basicData.lastName || ''} />
          </FormControl>
        </Grid>
  
       <Grid item xs={12} sm={4}>
       <InputLabel shrink={true} >Mobilization Channel</InputLabel>
       <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'mobilizationChannel')} name="mobilizationChannel" id="mobilizationChannel"
              options={this.state.channel} value={this.state.basicData.mobilizationChannel || ''}
              helperText = {this.state.errors.mobilizationChannel != undefined ? this.state.errors.mobilizationChannel.label : '' } 
            error = {this.state.errors.mobilizationChannel != undefined ? this.state.errors.mobilizationChannel.value : '' }
            /> 
        </Grid>
        <Grid item xs={12} sm={4}>
        <FormControl> 
            <TextField type="text" name="mobilizationPlace" id="mobilizationPlace"
            label = "Mobilization Place" onChange={this.handleInputChange}  
            value={this.state.basicData.mobilizationPlace || ''} />
          </FormControl>
        </Grid>
         <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >Highest Qualification</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'highestQualification')} name="highestQualification" id="highestQualification"
               value={this.state.basicData.highestQualification || ''}
               helperText = {this.state.errors.highestQualification != undefined ? this.state.errors.highestQualification.label : '' } 
            error = {this.state.errors.highestQualification != undefined ? this.state.errors.highestQualification.value : '' }
              options={this.state.qual}
            /> 
        </Grid>
         <Grid item xs={12} sm={4}>
         <TextField type = "number"  onChange={this.handleInputChange} name="passingYear" id="passingYear"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,4)
          }}
          label = "Passing Year"
             value={this.state.basicData.passingYear || ''} 
             helperText = {this.state.errors.passingYear != undefined ? this.state.errors.passingYear.label : '' } 
            error = {this.state.errors.passingYear != undefined ? this.state.errors.passingYear.value : '' }
            /> 
        </Grid>
         <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >Religion</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'religion')} name="religion" id="religion"
               value={this.state.basicData.religion || ''}
               helperText = {this.state.errors.religion != undefined ? this.state.errors.religion.label : '' } 
            error = {this.state.errors.religion != undefined ? this.state.errors.religion.value : '' }
              options={this.state.religion}
            /> 
        </Grid>
         <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >Category</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'category')} name="category" id="category"
               value={this.state.basicData.category || ''}
               helperText = {this.state.errors.category != undefined ? this.state.errors.category.label : '' } 
            error = {this.state.errors.category != undefined ? this.state.errors.category.value : '' }
              options={this.state.category}
            /> 
        </Grid>
         <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >BPL</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleSelectChange.bind(this, 'bplStatus')} name="bplStatus" id="bplStatus"
              value={this.state.basicData.bplStatus || ''}
              helperText = {this.state.errors.bplStatus != undefined ? this.state.errors.bplStatus.label : '' } 
            error = {this.state.errors.bplStatus != undefined ? this.state.errors.bplStatus.value : '' }
              options={this.state.bplStatus}
            /> 
        </Grid>

       <Grid item xs={12}>
          <FormControl>
          <h5>Contact Information</h5>
            </FormControl>  
        </Grid>
         <Grid item xs={12} sm={6}>
          <FormControl>
           
            <TextField   type="number" name="primaryContactNumber" id="primaryContactNumber" label="Primary Contact"
              helperText = {this.state.errors.primaryContactNumber != undefined ? this.state.errors.primaryContactNumber.label : '' } 
              error = {this.state.errors.primaryContactNumber != undefined ? this.state.errors.primaryContactNumber.value : '' }
               onInput = {(e) =>{
                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
            }}
            onChange={this.handleInputChange} value={this.state.basicData.primaryContactNumber || ''} />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl>
            <TextField   type="email" name="primaryEmailId" id="primaryEmailId"
            label="Primary Email"
            helperText = {this.state.errors.primaryEmailId != undefined ? this.state.errors.primaryEmailId.label : '' } 
            error = {this.state.errors.primaryEmailId != undefined ? this.state.errors.primaryEmailId.value : '' }
            onChange={this.handleInputChange} value={this.state.basicData.primaryEmailId || ''}  />
          </FormControl>
        </Grid>

         <Grid item xs={12} sm={6}>
          <FormControl>
            <TextField type="number" name="secondaryContactNumber" id="secondaryContactNumber" label="Secondary Contact"
            helperText = {this.state.errors.secondaryContactNumber != undefined ? this.state.errors.secondaryContactNumber.label : '' } 
            error = {this.state.errors.secondaryContactNumber != undefined ? this.state.errors.secondaryContactNumber.value : '' }
             onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
          }}
            onChange={this.handleInputChange} value={this.state.basicData.secondaryContactNumber || ''} />
          </FormControl>
        </Grid>
         <Grid item xs={12} sm={6}>
          <FormControl>
            <TextField  type="email" name="secondaryEmailId" id="secondaryEmailId"
            label="Secondary Email"
            helperText = {this.state.errors.secondaryEmailId != undefined ? this.state.errors.secondaryEmailId.label : '' } 
            error = {this.state.errors.secondaryEmailId != undefined ? this.state.errors.secondaryEmailId.value : '' }
            onChange={this.handleInputChange} value={this.state.basicData.secondaryEmailId || ''}  />
          </FormControl>
        </Grid>
  
        <Grid item xs={12}>
          <FormControl>
          <h5>Address Information</h5>
            </FormControl>  
        </Grid>
        <Grid item xs={12}>
          <FormControl>
          <h4>Present Address</h4>
            </FormControl>  
        </Grid>
        <Grid item xs={12} sm={4}>
      <FormControl>
        <TextField   type="text" name="addressLine1" id="addressLine1" 
        helperText = {this.state.erroradd1.addressLine1 != undefined ? this.state.erroradd1.addressLine1.label : '' } 
        error = {this.state.erroradd1.addressLine1 != undefined ? this.state.erroradd1.addressLine1.value : '' }
        label = "Address Line 1" maxLength = "20"
        onChange={this.handleAddressInputChange} value={this.state.address.addressLine1 || ''} />
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl>
        <TextField   type="text" name="addressLine2" id="addressLine2"
        helperText = {this.state.erroradd1.addressLine2 != undefined ? this.state.erroradd1.addressLine2.label : '' } 
        error = {this.state.erroradd1.addressLine2 != undefined ? this.state.erroradd1.addressLine2.value : '' }
        label = "Address Line 2"  maxLength = "20"
        onChange={this.handleAddressInputChange}  value={this.state.address.addressLine2 || ''} />
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
            <TextField   type="number" label = "Pincode"
              name="pincode" id="pincode" onInput = {(e) =>{
                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,6)
            }}
            helperText = {this.state.erroradd1.pincode != undefined ? this.state.erroradd1.pincode.label : '' } 
            error = {this.state.erroradd1.pincode != undefined ? this.state.erroradd1.pincode.value : '' }
              onChange={this.getPincodeData.bind(this, 'pincode')}
              value = {this.state.address.pincode || ''}
              />
        </Grid>
        <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="village">Village</InputLabel>
             <SingleSelect  
              isClearable={true}  
              name="villageName" id="villageName"
              options={this.state.village1}
              helperText = {this.state.erroradd1.villageName != undefined ? this.state.erroradd1.villageName.label : '' } 
            error = {this.state.erroradd1.villageName != undefined ? this.state.erroradd1.villageName.value : '' }
              onChange={this.handleAddressSelectChange.bind(this, 'villageName')}
              value={this.state.address.villageName || ''}
            /> 

        </Grid>
         <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="city">City</InputLabel>
            <SingleSelect  isClearable={true}  
             onChange={this.handleAddressSelectChange.bind(this, 'cityName')} name="cityName" id="cityName"
             options={this.state.city1}  
             helperText = {this.state.erroradd1.cityName != undefined ? this.state.erroradd1.cityName.label : '' } 
            error = {this.state.erroradd1.cityName != undefined ? this.state.erroradd1.cityName.value : '' }
             value={this.state.address.cityName || ''}
              
            />      
        </Grid>
        <Grid item xs={4}>
         <InputLabel shrink={true} >District</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleAddressSelectChange.bind(this, 'district')} 
              name="district" id="district"
              options={this.state.district1}
              helperText = {this.state.erroradd1.district != undefined ? this.state.erroradd1.district.label : '' } 
            error = {this.state.erroradd1.district != undefined ? this.state.erroradd1.district.value : '' }
              value={this.state.address.district || ''}
                     
            /> 
        </Grid> 

        <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >State</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleAddressSelectChange.bind(this, 'state')} name="state" id="state"
          options={this.state.state1}  
          helperText = {this.state.erroradd1.state != undefined ? this.state.erroradd1.state.label : '' } 
            error = {this.state.erroradd1.state != undefined ? this.state.erroradd1.state.value : '' }
              value={this.state.address.state || ''}
                        
            /> 
        </Grid>
        <Grid item xs={12}>
          <FormControl>
          <h4>Permanent Address</h4>
          </FormControl> 
          </Grid>
        {displayText}
        <Grid item xs={12} sm={4}>
      <FormControl>
        <TextField   type="text" name="addressLine1" id="addressLine1" 
        helperText = {this.state.erroradd2.addressLine1 != undefined ? this.state.erroradd2.addressLine1.label : '' } 
        error = {this.state.erroradd2.addressLine1 != undefined ? this.state.erroradd2.addressLine1.value : '' }
        label = "Address Line 1" maxLength = "20"
        onChange={this.handleAddressInputChange2} value={this.state.address2.addressLine1 || ''} />
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl>
        <TextField   type="text" name="addressLine2" id="addressLine2"
        helperText = {this.state.erroradd2.addressLine2 != undefined ? this.state.erroradd2.addressLine2.label : '' } 
        error = {this.state.erroradd2.addressLine2 != undefined ? this.state.erroradd2.addressLine2.value : '' }
        label = "Address Line 2"  maxLength = "20"
        onChange={this.handleAddressInputChange2}  value={this.state.address2.addressLine2 || ''} />
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
            <TextField   type="number" label = "Pincode"
              name="pincode" id="pincode" onInput = {(e) =>{
                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,6)
            }}
            helperText = {this.state.erroradd2.pincode != undefined ? this.state.erroradd2.pincode.label : '' } 
            error = {this.state.erroradd2.pincode != undefined ? this.state.erroradd2.pincode.value : '' }
              onChange={this.getPincodeData2.bind(this, 'pincode')}
              value = {this.state.address2.pincode || ''}
              />
        </Grid>
        <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="village">Village</InputLabel>
             <SingleSelect  isClearable={true}  
              name="villageName" id="villageName"
              options={this.state.village2}
              helperText = {this.state.erroradd2.villageName != undefined ? this.state.erroradd2.villageName.label : '' } 
            error = {this.state.erroradd2.villageName != undefined ? this.state.erroradd2.villageName.value : '' }
              onChange={this.handleAddressSelectChange2.bind(this, 'villageName')}
              value={this.state.address2.villageName || ''}
            /> 
        </Grid>
         <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="city">City</InputLabel>
            <SingleSelect  isClearable={true}  
             onChange={this.handleAddressSelectChange2.bind(this, 'cityName')} name="cityName" id="cityName"
             options={this.state.city2}  
             helperText = {this.state.erroradd2.cityName != undefined ? this.state.erroradd2.cityName.label : '' } 
            error = {this.state.erroradd2.cityName != undefined ? this.state.erroradd2.cityName.value : '' }
             value={this.state.address2.cityName || ''}
              
            />      
        </Grid>
        <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >District</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleAddressSelectChange2.bind(this, 'district')} 
              name="district" id="district"
              options={this.state.district2}
              helperText = {this.state.erroradd2.district != undefined ? this.state.erroradd2.district.label : '' } 
            error = {this.state.erroradd2.district != undefined ? this.state.erroradd2.district.value : '' }
              value={this.state.address2.district || ''}
                     
            /> 
        </Grid> 

        <Grid item xs={12} sm={4}>
         <InputLabel shrink={true} >State</InputLabel>
         <SingleSelect  isClearable={true}  onChange={this.handleAddressSelectChange2.bind(this, 'state')} name="state" id="state"
          options={this.state.state2}  
          helperText = {this.state.erroradd2.state != undefined ? this.state.erroradd2.state.label : '' } 
            error = {this.state.erroradd2.state != undefined ? this.state.erroradd2.state.value : '' }
              value={this.state.address2.state || ''}
                        
            /> 
        </Grid>

        
        
      </Grid>

      <Grid container direction="row" justify="flex-end" alignItems="flex-end">{button}</Grid> 
      </fieldset>
    </form>
    </div>

    );
}

}
export default BasicForm;