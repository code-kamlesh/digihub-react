/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================


* Coded by Ashish S

=========================================================


*/

import React, { Component } from 'react';
import { render } from "react-dom";
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import { FormControl , InputLabel,FormControlLabel, Input, Grid , RadioGroup, Radio, TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {isNotEmpty,isNotZero} from './../util/validation';
import { roleBasedReadonly , checkButton } from '../util/validation';
import AlertDialog from '../util/AlertDialog';
import Paper from '@material-ui/core/Paper';
import {savePlacementDetails,deleteDocumentById,fetchUserDocumentsByUserIdAndTypeOfDocument,fectAddressDetailsByAddressID,fetchAddressDetailsBasedOnPincode,fetchPlacementDetailsByEngagementId,fetchAllCenter,saveAddressDetails,uploadDocument,fetchEmployerDetails} from '../util/api';
import MUIDataTable from "mui-datatables";
import AddressForPlacement from "./AddressForPlacement";
import underscore from 'underscore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {DropzoneArea} from 'material-ui-dropzone';
import EditIcon from '@material-ui/icons/Edit';
import { serviceEndPoint } from '../util/serviceEndPoint';
import Checkbox from '@material-ui/core/Checkbox';
const alertDialogOptions = {
  message: ''
}

class PlacementDetails extends Component {
    
  constructor(props) {
    super(props);
     
     this.state = {status:props.status,engagementId:props.engagementId,alertDialogFlag:false , disabled : false , flag : "0" , errors : {joiningDate:'',offerDate:'',annualSal:'',spocPhoneNumber:'',designation:'',pincode:'',noOfPeopleEmployed:'',spocName:''} , dbUserId : props.id,info:[], 
     placementData : {annualSal:'0',empId:0,noOfPeopleEmployed:'0',joined:'',spocPhoneNumber:'',spocName:'',designation:'',domainName:'',addressId : "0",createdBy : UserContext.userid, updatedBy : UserContext.userid ,engagementId:props.engagementId, dbUserId : props.id, interviewDate : "",
     interviewStatus : "" , interviewRemark : "" , offerDate : "", joiningDate:"",isActive:"Y",isDocumentsUploaded:'',reason:'',

         }, center : [],centerData:[],documents:[],
         info:[{"createdBy" : UserContext.userid ,"updatedBy" : UserContext.userid , "isActive" : "Y" , "dbUserId" : props.id}],
         intStatus : [
          { value: 'Placed', label: 'Placed' },
          { value: 'Offer Not Taken', label: 'Offer Not Taken'},
          { value: 'Not Placed', label: 'Not Placed' },
          { value: 'Not Interested', label: 'Not Interested'},
          { value: 'Entrepreneurship', label: 'Entrepreneurship' },
          { value: 'Self Employed', label: 'Self Employed' },
          { value: 'Rejected', label: 'Rejected'}
         ],
         offerNotTakenReason : [
          { value: 'Low salary', label: 'Low salary' },
          { value: 'Migration', label: 'Migration' },
          { value: 'Family problem', label: 'Family problem' },
          { value: 'health issues', label: 'health issues' },
          { value: 'further studies', label: 'further studies' },
          { value: 'marriage', label: 'marriage' }
         ],
         notPlacedReasons : [
          { value: 'Other', label: 'Other' } , 
          { value: 'Not Interested', label: 'Not Interested' },
          { value: 'Got other job', label: 'Got other job' },
          { value: 'Health Issues', label: 'Health Issues' },     
          { value: 'Moved to other place', label: 'Moved to other place' },
          { value: 'Not Eligible', label: 'Not Eligible' },
          { value: 'Marriage', label: 'Marriage' },
          { value: 'Higher Education', label: 'Higher Education' },
          { value: 'Maternity', label: 'Maternity' }
          ],
          notInterestedReason  : [
            { value: 'family issue', label: 'family issue' } , 
            { value: 'medical problem', label: 'medical problem' },
            { value: 'higher studies', label: 'higher studies' }
           ],  
         studStatus : [
          { value: 'Inter', label: 'Inter' },
          { value: 'Joined', label: 'Joined' }
         
         ],
         domains: [
          { value: 'Banking', label: 'Banking'},
          { value: 'Retails', label: 'Retails' },
          { value: 'House Keeping', label: 'House Keeping'},
          { value: 'F and B', label: 'F and B' },
          { value: 'Android', label: 'Android'},
          { value: 'QSR', label: 'QSR' },
          { value: 'Electrical', label: 'Electrical' }
         ],
         join: [
          { value: 'Yes', label: 'Yes'},
          { value: 'No', label: 'No' }
         ],
         typeOfDocument:null,file:null,
         typeOfProofData:[ 
          { value: 'AgeProof', label: 'Age Proof' },
          { value: 'ApplicationForm', label: 'Application Form' },
          { value: 'CasteCertificate', label: 'Caste Certificate' },
          { value: 'ContributionReceipt', label: 'Contribution Receipt' },
          { value: 'EducationProof', label: 'Education Proof' },
          { value: 'FirstDayPicture', label: 'First Day Picture' },
          { value: 'LastDayPicture', label: 'Last Day Picture' },
          { value: 'Medicalfitnesscertificate', label: 'Medical fitness certificate' },
          { value: 'PhotoProof', label: 'Photo Proof' },
          { value: 'StudentPicture', label: 'Student Picture' },
          { value: 'Studentsigned', label: 'Student signed' }
        ],
        typeOfDocumentData:[ 
          { value: 'Offer Letter', label: 'Offer Letter' },
          { value: 'Joining Letter', label: 'Joining Letter' },
          { value: 'Pay Slip', label: 'Pay Slip' },
          { value: 'Student Declaration', label: 'Student Declaration' },
          { value: 'Pic Of Business', label: 'Pic Of Business'},
          { value: 'Registration Certificate', label: 'Registration Certificate' }
        ],
        address : {entityId : props.engagementId, createdBy : UserContext.userid,'isActive' : 'Y','type' : 'PD' ,'entityType' :'S', pincode : "" , addressLine1 : "" , addressLine2 : "" , district : "" , state : "" , cityName : "", villageName : ""}, state: [], district: [], pincodes: [], city: [],village: [],engagementId:props.engagementId};
         this.formData = { state: [], district: [], pincodes: [], city: [],village: []  };
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleChange=this.handleChange.bind(this);
     this.getEmployerDetails();
    // this.getCenterMasters();
     this.getDocuments();
     //alert(this.state.engagementId);
     if(props.id != null && props.id != undefined )
     {
       
       this.fetchPlacementdetailsFouUser(props.engagementId);
     }



    
     
 }
 componentDidMount()
    {
      roleBasedReadonly();
    }

  

     handleChange = (event) => {
      const target = event.target;
      let value =  target.value;
      const name = target.name;
     
      this.setState({
        placementData: {
     
        ...this.state.placementData
         }
 
      });
      
    };

    getDocuments(){

      fetchUserDocumentsByUserIdAndTypeOfDocument(this.state.dbUserId,'PD').then((jsondata) => {   
      let jsonobjects = JSON.parse(jsondata.data);          
      this.setState({documents: [...this.state.documents,...jsonobjects]})    
      });
      
      }
      deleteDocument = (basicDocId) => {
        deleteDocumentById(basicDocId);
        this.getDocuments();
      }
    
    handleEditChange(obj){
       this.setState({
         placementData : obj 
       },()=>{
        if(this.state.placementData.interviewStatus==='Placed' 
        || this.state.placementData.interviewStatus==='Offer Not Taken'
        || this.state.placementData.interviewStatus==='Entrepreneurship'){        
        this.getAddressDetailsByAddressID(this.state.placementData.addressId)
        }
        });
     }

     getAddressDetailsByAddressID(addressId){
      fectAddressDetailsByAddressID(addressId).then((jsondata)=>{    
             let  addressDetails = JSON.parse(jsondata.data);        
               this.setState({
                   address: addressDetails[0]
                 },()=>{this.getAddressdataBasedOnPin(this.state.address.pincode)});
            })   
    }

     getAddressdataBasedOnPin(pincode){
      fetchAddressDetailsBasedOnPincode(pincode).then((jsondata) => {
        let jsonobjects = JSON.parse(jsondata.data);
        let taluk = [];
        let pincode = [];
        let cityVillage = [];
        let states = [];
        let district = [];
  
        this.formData.village.length = 0;
        this.formData.pincodes.length = 0;
        this.formData.city.length = 0;
        this.formData.state.length = 0;
        this.formData.district.length = 0;
  
        jsonobjects.map(item => { cityVillage.push({ label: item.cityVillage, value: item.id }) });
        cityVillage = underscore.uniq(cityVillage, true, "label");
        cityVillage.map(item => { this.formData.village.push({ label: item.label, value: (item.label).toString() }) });
        this.setState({village:this.formData.village});
        
        jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
        taluk = underscore.uniq(taluk, true, "label");
        taluk.map(item => { this.formData.city.push({ label: item.label, value: (item.label).toString() }) });
        this.setState({city:this.formData.city});
  
  
  
        jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
        states = underscore.uniq(states, true, "label");
        states.map(item => { this.formData.state.push({ label: item.label, value: (item.value).toString() }) });
        this.setState({state:this.formData.state},()=>{console.log(this.state.state)});
  
        jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
        district = underscore.uniq(district, true, "label");
        district.map(item => { this.formData.district.push({ label: item.label, value: (item.value).toString() }) });
        this.setState({district:this.formData.district});
      })
     }

     
     handleSelectChangeDoc(selectname, event) {
      this.setState({[selectname]: event}); 
     }

     handlePlacementSelectChange(selectname, event) {
      this.setState({
        placementData: {
           ...this.state.placementData,
           [selectname]: event
         }
       });
this.validate(selectname,event);
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
            placementData: {
              ...this.state.placementData,
              [selectname]: event
            }
          })

        //   this.setState({
        //     errors: {
        //       ...this.state.errors,
        //       [selectname] : {
        //         'label' : "" , 
        //         'value' : false
        //       }
        //     }
        // });
        
        if(this.state.placementData.interviewStatus==='Not Placed'){
          this.validateNotPlaced(selectname,event);
        }
        
       else if(this.state.placementData.interviewStatus==='Not Interested'){
          this.validateNotInterested(selectname,event);
        }
        else if(this.state.placementData.interviewStatus==='Placed' || this.state.placementData.interviewStatus==='Offer Not Taken'){
          this.validatePlacedAndOfferNotTaken(selectname,event);
        }
     
        else if(this.state.placementData.interviewStatus==='Rejected'){
          this.validateRejected(selectname,event);
        }
        
      
}
 handleInputChange(event) {
     
     const target = event.target;
     let value =  target.value;
     const name = target.name;
     this.setState({
      "disabled" : false
    });

  //   this.setState({
  //     errors: {
  //       ...this.state.errors,
  //       [name] : {
  //         'label' : "" , 
  //         'value' : false
  //       }
  //     }
  // });

  this.setState({
    placementData: {
       ...this.state.placementData,
       [name]: value
     }
   });
   
   if(this.state.placementData.interviewStatus==='Entrepreneurship'){
    this.validateEntrepreneurship(name,value);
  }

  else if(this.state.placementData.interviewStatus==='Placed' || this.state.placementData.interviewStatus==='Offer Not Taken'){
    this.validatePlacedAndOfferNotTaken(name,value);
  } 
  
   }

  handleCheckboxChange = (event) => {
    this.setState({
      placementData: {
         ...this.state.placementData,
         [event.target.name]: event.target.checked
       }
     })
};



   fetchPlacementdetailsFouUser(engagementId){
  
    let placementInfo=[];

    fetchPlacementDetailsByEngagementId(engagementId).then((jsondata)=>{    
      //alert(JSON.stringify(jsondata));
          let  placementDetailsOfUser = JSON.parse(jsondata.data); 
    
                for(var i=0;i<placementDetailsOfUser.length;i++){
                var  details =
                {   // 'employer_name':placementDetailsOfUser[i].employerName, 
                    'interview_status':placementDetailsOfUser[i].interviewStatus,
                    'Reason':placementDetailsOfUser[i].reason,
                    'annual_sal' :placementDetailsOfUser[i].annualSal,
                    'action':<EditIcon style={{color:"blue"}} onClick={this.handleEditChange.bind(this,placementDetailsOfUser[i])} />
                     
                }; 
                placementInfo.push(details);    
            }    
            this.setState({
                info: placementInfo
              });
         }) 
       
   
}



getEmployerDetails(){
  fetchEmployerDetails("Active Partner","%Placement%").then((jsondata)=>{
    if(jsondata.appError==null){     
        let jsonobjects = JSON.parse(jsondata.data);
       jsonobjects.map(item => { this.state.center.push({label: item.accountName, value:item.id})
       })    
    } 
 })
}

   getCenterMasters(ids){  
    fetchAllCenter().then((jsondata)=>{
            console.log(jsondata);
            if(jsondata.appError==null){     
                let jsonobjects = JSON.parse(jsondata.data);
            // alert(JSON.stringify(jsonobjects));
               jsonobjects.map(item => { this.state.center.push({label: item.name, value:item.id})
               })
              // this.setState({centerData : jsonobjects});
              
               
            } 
            return (true);
         }).then(response => response);
        }
 
  
 mySubmitHandler = (event) => {
  // alert("check");
   event.preventDefault();
   this.state.disabled = true;
   this.validate("interviewStatus",this.state.placementData.interviewStatus);
   
    if(this.state.errors.interviewStatus===''){

      if(this.state.placementData.interviewStatus==='Placed' 
      || this.state.placementData.interviewStatus==='Offer Not Taken'
    ){
        this.validatePlacedAndOfferNotTaken("empId",this.state.placementData.empId);
        this.validatePlacedAndOfferNotTaken("domainName",this.state.placementData.domainName);
        this.validatePlacedAndOfferNotTaken("spocName",this.state.placementData.spocName);
        this.validatePlacedAndOfferNotTaken("designation",this.state.placementData.designation);     
        this.validatePlacedAndOfferNotTaken("spocPhoneNumber",this.state.placementData.spocPhoneNumber);            
        this.validatePlacedAndOfferNotTaken("annualSal",this.state.placementData.annualSal); 
        this.validatePlacedAndOfferNotTaken("offerDate",this.state.placementData.offerDate);     
        this.validatePlacedAndOfferNotTaken("joiningDate",this.state.placementData.joiningDate);            
        this.validatePlacedAndOfferNotTaken("joined",this.state.placementData.joined); 
        this.validateAddress("pincode",this.state.address.pincode);
        this.validateAddress("villageName",this.state.address.villageName);
        this.validateAddress("cityName",this.state.address.cityName);
        this.validateAddress("state",this.state.address.state);
        this.validateAddress("district",this.state.address.district);

        let errorsExist=true;
          Object.values(this.state.errors).forEach(
           (val)=>val.length>0 && (errorsExist=false)
      ); 
         if(errorsExist){
           this.submitPlacementDetails();
          }       
  }
  else if(this.state.placementData.interviewStatus==='Not Placed'){
    this.validateNotPlaced("reason",this.state.placementData.reason);
    
    let errorsExist=true;
    Object.values(this.state.errors).forEach(
     (val)=>val.length>0 && (errorsExist=false)
); 
   if(errorsExist){
     this.submitPlacementDetails();
    }    


  }
  else if(this.state.placementData.interviewStatus==='Not Interested'){
    this.validateNotInterested("reason",this.state.placementData.reason); 
    let errorsExist=true;
    Object.values(this.state.errors).forEach(
     (val)=>val.length>0 && (errorsExist=false)); 
   if(errorsExist){
     this.submitPlacementDetails();
    }    
  }

  else if(this.state.placementData.interviewStatus==='Entrepreneurship'){
    this.validateAddress("pincode",this.state.address.pincode);
    this.validateAddress("villageName",this.state.address.villageName);
    this.validateAddress("cityName",this.state.address.cityName);
    this.validateAddress("state",this.state.address.state);
    this.validateAddress("district",this.state.address.district);
    this.validateEntrepreneurship("noOfPeopleEmployed",this.state.placementData.noOfPeopleEmployed); 
    let errorsExist=true;
    Object.values(this.state.errors).forEach(
     (val)=>val.length>0 && (errorsExist=false)); 
   if(errorsExist){
     this.submitPlacementDetails();
    }    
  }

  else if(this.state.placementData.interviewStatus==='Rejected'){
    this.validateRejected("empId",this.state.placementData.empId); 
    let errorsExist=true;
    Object.values(this.state.errors).forEach(
     (val)=>val.length>0 && (errorsExist=false)); 
   if(errorsExist){
     this.submitPlacementDetails();
    }    
  }



  else{
    this.submitPlacementDetails();
  } 
  }

   // authentication response and redirect to error or dashbaord page
   this.setState({
     errors : this.state.errors,
    });
    if(checkButton(this.state.errors))
    {
      
    
   
    }
    else
    {
      this.state.disabled = true;
  } 
 }




 validate = (name,value)=>{
let errors = this.state.errors;
  switch (name) {
    case 'interviewStatus':  errors.interviewStatus =  isNotEmpty(value);
    break;
    default:
    break;
}

 this.setState({errors});
}



validateNotInterested = (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'reason':  errors.reason =  isNotEmpty(value);
        break;
        default:
        break;
  } 
   this.setState({errors});
}


validateEntrepreneurship = (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'noOfPeopleEmployed':  errors.noOfPeopleEmployed =  isNotEmpty(value);
        break;
        default:
        break;
  } 
   this.setState({errors});
}

validateNotPlaced= (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'reason':  errors.reason =  isNotEmpty(value);
        break;
        default:
        break;
  }
  
   this.setState({errors});
}


validateRejected= (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'empId':  errors.empId =  isNotZero(value);
        break;
        default:
        break;
  }
   this.setState({errors});
}


validatePlacedAndOfferNotTaken= (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'empId':  errors.empId =  isNotEmpty(value);
        break;
        case 'domainName':  errors.domainName =  isNotEmpty(value);
        break;
        case 'spocName':  errors.spocName =  isNotEmpty(value);
        break;    
        case 'designation':  errors.designation =  isNotEmpty(value);
        break;    
        case 'spocPhoneNumber':  errors.spocPhoneNumber =  isNotEmpty(value);
        break;    
        case 'annualSal':  errors.annualSal =  isNotEmpty(value);
        break;       
        case 'offerDate':  errors.offerDate =  isNotEmpty(value);
        break;       
        case 'joiningDate':  errors.joiningDate =  isNotEmpty(value);
        break;       
        case 'joined':  errors.joined =  isNotEmpty(value);
        break;       
        default:
        break;
  }
  
   this.setState({errors});
}


validateAddress = (name,value)=>{
  let errors = this.state.errors;
    switch (name) {
        case 'pincode':  errors.pincode =  isNotEmpty(value);
        break;
        case 'villageName':  errors.village =  isNotEmpty(value);
        break;
        case 'cityName':  errors.cityName =  isNotEmpty(value);
        break;
        case 'state':   errors.state = isNotEmpty(value);
        break;
        case 'district':   errors.district = isNotEmpty(value);
        break;
       default:
       break;
  }
  
   this.setState({errors});
  }


handleAddressInputChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
    address: {
      ...this.state.address,
      [name]: value
    }
  })
  this.validate(name,value);
}
handleAddressSelectChange(selectname, event) {
  this.setState({
    address: {
      ...this.state.address,
      [selectname]: event
    }
  })

  this.validateAddress(selectname,event);
}

handleTypeOfProofSelectChange(selectname, event) {

  let newVal = event;
  let stateVal = this.state.documentType;

  stateVal.indexOf(newVal) === -1
    ? stateVal.push(newVal)
    : stateVal.length === 1
      ? (stateVal = [])
      : stateVal.splice(stateVal.indexOf(newVal), 1)

      this.setState({ documentType: stateVal });
     
 }

 downloadDocuments = (value) => 
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

   uploadDocuments = (e) =>  {
   e.preventDefault();
 var levelOfDocument="G";
 
 let localThis=this;
 
 let reader = new FileReader();
 reader.readAsDataURL(this.state.file);
 reader.onload = function () {
 let  document = reader.result;

 localThis.setState({alertDialogFlag:false});
 uploadDocument(localThis.state.dbUserId,localThis.state.engagementId,localThis.state.typeOfDocument,'PD',localThis.state.typeOfDocument,document,"")
 
   .then(res => {
  
   
   });
 
 
 }
    
   }
 
   onFileChangeHandler = (files) => {this.setState({file: files[0]});}

getPincodeData(selectname, event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
    address: {
      ...this.state.address,
      [name]: value
    }
  })
  this.validateAddress(name,value);
  if (value.length == 6) {
   
    fetchAddressDetailsBasedOnPincode(value).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      let taluk = [];
      let pincode = [];
      let cityVillage = [];
      let states = [];
      let district = [];

      this.formData.village.length = 0;
      this.formData.pincodes.length = 0;
      this.formData.city.length = 0;
      this.formData.state.length = 0;
      this.formData.district.length = 0;

      jsonobjects.map(item => { cityVillage.push({ label: item.cityVillage, value: item.id }) });
      cityVillage = underscore.uniq(cityVillage, true, "label");
      cityVillage.map(item => { this.formData.village.push({ label: item.label, value: (item.label).toString() }) });
      this.setState({village:this.formData.village});
      
      jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
      taluk = underscore.uniq(taluk, true, "label");
      taluk.map(item => { this.formData.city.push({ label: item.label, value: (item.label).toString() }) });
      this.setState({city:this.formData.city});



      jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
      states = underscore.uniq(states, true, "label");
      states.map(item => { this.formData.state.push({ label: item.label, value: (item.value).toString() }) });
      this.setState({state:this.formData.state},()=>{console.log(this.state.state)});

      jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
      district = underscore.uniq(district, true, "label");
      district.map(item => { this.formData.district.push({ label: item.label, value: (item.value).toString() }) });
      this.setState({district:this.formData.district});
    })
  }

}

 

submitPlacementDetails()
{

  if(this.state.placementData.interviewStatus==='Placed' || this.state.placementData.interviewStatus==='Offer Not Taken'
  || this.state.placementData.interviewStatus==='Entrepreneurship'){
  
   saveAddressDetails(JSON.stringify(this.state.address)).then((jsondata) => {
    let jsonobjects = JSON.parse(jsondata.data);
    //alert(jsonobjects[0].id);
    this.setState({
      placementData: {
         ...this.state.placementData,
         'addressId': jsonobjects[0].id
       }
     },()=>{this.saveAllDetails()});
     this.setState({alertDialogFlag:false});
     alertDialogOptions.message=<span style={{color:"green"}}>Placement Details Saved Sucessfully</span>;
     this.setState({alertDialogFlag:true});
    });

  }
  else{
    this.saveAllDetails();
  }

  
}
saveAllDetails(){

  savePlacementDetails(this.state.placementData).then((jsondata)=>{
    this.resetForm();
    this.fetchPlacementdetailsFouUser(this.state.engagementId);
    if(jsondata.appError==null){   
      let jsonobjects = JSON.parse(jsondata.data);
        this.setState({alertDialogFlag:false});
         alertDialogOptions.message=<span style={{color:"green"}}>Placement Details Saved Sucessfully</span>;
         this.setState({alertDialogFlag:true});
    }  else{
        console.log("error");
    } 
 })
}

resetForm = ()=> {
  this.setState({
    placementData: {
    ...this.state.placementData,
    interviewStatus: '',spocName:'',
    spocPhoneNumber:'',domainName:'',
    reason:'',designation:'',
    annualSal:'',offerDate:'',
    joiningDate:'',joined:'',empId:''
}
})
this.setState({
  address: {
  ...this.state.address,
  pincode: '',villageName:'',
  district : '', state : '',cityName : ''
}
})
}

render()
{
  const columns = [
  {label: 'Interview Status', name: 'interview_status',headerStyle: {color:'#FF9800'}},
  {label: 'Reason', name: 'Reason',headerStyle: {color:'#FF9800'}},
  {label: 'Annual Salary', name: 'annual_sal',headerStyle: {color:'#FF9800'}},
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
  button = <Grid container direction="row" justify="flex-end"  id="btn" alignItems="flex-end">  <Button  variant="contained" type="submit"  size="small" color="primary" disabled={this.state.status==="Enrolled"?false:true}>
  Save 
 </Button></Grid>
 

 return (
<div style = {{ width : '100%' }}>
 <form onSubmit={this.mySubmitHandler} method="post">
 <fieldset id = "roleBasedDisable">
 <Grid item xs={12} sm={4}>
 <SingleSelect  name="interviewStatus" id="interviewStatus" label="Interview Status"
     onChange={this.handlePlacementSelectChange.bind(this, 'interviewStatus')}
                            value={this.state.placementData.interviewStatus || ''}
                            helperText = {this.state.errors.interviewStatus} 
                            error = {this.state.errors.interviewStatus ===''?false:true}
                            options={this.state.intStatus} key={this.state.placementData.interviewStatus}
                            />
</Grid>
<div style={{display:(this.state.placementData.interviewStatus==="Placed" || this.state.placementData.interviewStatus==="Offer Not Taken"?"block":"none")}}>
<Grid id="hideData" container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
         </FormControl>  
     </Grid>
     <br></br>
     { 
  (this.state.placementData.interviewStatus==="Offer Not Taken") &&         
  <Grid item xs={12} sm={4}>
  <SingleSelect  name="reason" id="reason" label="Reason"
  onChange={this.handleSelectChange.bind(this, 'reason')}
                         value={this.state.placementData.reason || ''}
                         options={this.state.offerNotTakenReason} key={this.state.placementData.reason}
                         /> 
  </Grid>
}
     <Grid item xs={12} sm={4}>
     <SingleSelect  name="empId" id="empId" label="Employer Name"
     onChange={this.handleSelectChange.bind(this, 'empId')}
                            value={this.state.placementData.empId || ''}
                            helperText = {this.state.errors.empId} 
                            error = {this.state.errors.empId ===''?false:true}
                            options={this.state.center} key={this.state.placementData.empId}
                            /> 

     </Grid>
     <Grid item xs={12} sm={4} id="interviewRemark">
          <FormControl>
            <TextField type="text" name="spocName" id="spocName"
            label = "SPOC name"
            onChange={this.handleInputChange} 
            value={this.state.placementData.spocName || ''} 
            helperText = {this.state.errors.spocName} 
            error = {this.state.errors.spocName ===''?false:true}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} id="interviewRemark">
          <FormControl>
            <TextField type="text" name="spocPhoneNumber" id="spocPhoneNumber"
            label = "SPOC phone NO."
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
          }}
            onChange={this.handleInputChange} 
            value={this.state.placementData.spocPhoneNumber || ''} 
            helperText = {this.state.errors.spocPhoneNumber} 
            error = {this.state.errors.spocPhoneNumber ===''?false:true}
            />
          </FormControl>
        </Grid>
     <Grid item xs={12} sm={4}>
     <SingleSelect  name="domainName" id="domainName" label="Domain"
     onChange={this.handleSelectChange.bind(this, 'domainName')}
     value={this.state.placementData.domainName || ''}
     helperText = {this.state.errors.domainName} 
     error = {this.state.errors.domainName ===''?false:true}
     options={this.state.domains} key={this.state.placementData.domainName}/> 
     </Grid>
        <Grid item xs={12} sm={4} id="interviewRemark">
          <FormControl>
            <TextField type="text" name="designation" id="designation"
            label = "Designation"
            onChange={this.handleInputChange} 
            value={this.state.placementData.designation || ''} 
            helperText = {this.state.errors.designation} 
            error = {this.state.errors.designation ===''?false:true}
            />
          </FormControl>
        </Grid>
     {/* <Grid item xs={12} sm={3} id = "interviewDate">
         <TextField id="date" name = "interviewDate" id = "interviewDate" onChange={this.handleInputChange}
         label="InterView Date" value={this.state.placementData.interviewDate || ''}
         helperText = {this.state.errors.placementData != undefined ? this.state.errors.placementData.label : '' } 
        error = {this.state.errors.placementData != undefined ? this.state.errors.placementData.value : '' }
         type="date"
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} />
     </Grid> */}

         {/* <Grid item xs={12} sm={3} id="interviewRemark">
          <FormControl>
            <TextField type="text" name="interviewRemark" id="interviewRemark"
            label = "Interview Remark"
            helperText = {this.state.errors.interviewRemark != undefined ? this.state.errors.interviewRemark.label : '' } 
            error = {this.state.errors.interviewRemark != undefined ? this.state.errors.interviewRemark.value : '' }
            onChange={this.handleInputChange} value={this.state.placementData.interviewRemark || ''} />
          </FormControl>
        </Grid>
      */}
    
      {/* <Grid item xs={12} sm={3} id="monthlyGrossSal">
       <FormControl>
         <TextField type="text" name="monthlyGrossSal" id="monthlyGrossSal"
         label = "Salary"
         helperText = {this.state.errors.monthlyGrossSal != undefined ? this.state.errors.monthlyGrossSal.label : '' } 
         error = {this.state.errors.monthlyGrossSal != undefined ? this.state.errors.monthlyGrossSal.value : '' }
         onChange={this.handleInputChange} value={this.state.placementData.monthlyGrossSal || ''}
         onInput = {(e) =>{
          e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)
      }}
         
         />
       </FormControl>
     </Grid> */}

     <Grid item xs={12} sm={4} id="annualSal">
       <FormControl>
         <TextField type="text" name="annualSal" id="annualSal"
         label = "Salary"
         helperText = {this.state.errors.annualSal} 
         error = {this.state.errors.annualSal ===''?false:true}
         onChange={this.handleInputChange} value={this.state.placementData.annualSal || ''}
         onInput = {(e) =>{
          e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,6)
      }}
         />
       </FormControl>
     </Grid>
     {/* <Grid item xs={12} sm={3}>
     <SingleSelect  name="studentStatus" id="studentStatus" label="Student Status"
     onChange={this.handleSelectChange.bind(this, 'studentStatus')}
                            value={this.state.placementData.studentStatus || ''}
                            helperText = {this.state.errors.studentStatus != undefined ? this.state.errors.studentStatus.label : '' } 
                            error = {this.state.errors.studentStatus != undefined ? this.state.errors.studentStatus.value : '' }
                            options={this.state.studStatus} 
                            /> 
     </Grid>
      */}
      {/* <Grid item xs={12} sm={3} id="studentRemark">
       <FormControl>
         <TextField type="text" name="studentRemark" id="studentRemark" label = "Student Remark"
         helperText = {this.state.errors.studentRemark != undefined ? this.state.errors.studentRemark.label : '' } 
         error = {this.state.errors.studentRemark != undefined ? this.state.errors.studentRemark.value : '' }
         onChange={this.handleInputChange} value={this.state.placementData.studentRemark || ''}  />
       </FormControl>
     </Grid> */}
    
     <Grid item xs={12} sm={4} id = "offerDate">
         <TextField id="date" name = "offerDate" id = "offerDate" onChange={this.handleInputChange}
         label="Offer Date" value={this.state.placementData.offerDate || ''}
         helperText = {this.state.errors.offerDate} 
         error = {this.state.errors.offerDate ===''?false:true}
            type="date"
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} />

     </Grid>


     <Grid item xs={12} sm={4} id = "joiningDate">
         <TextField id="date" name = "joiningDate" id = "joiningDate" onChange={this.handleInputChange}
         label="Joining Date" value={this.state.placementData.joiningDate || ''}
         helperText = {this.state.errors.joiningDate} 
         error = {this.state.errors.joiningDate ===''?false:true}
         type="date"
         inputProps={{ max: new Date().toISOString().slice(0,10)}}
         InputLabelProps={{
           shrink: true,
         }} />

     </Grid>
     <Grid item xs={12} sm={4}>
     <SingleSelect  name="joined" id="joined" label="Joined"
     onChange={this.handleSelectChange.bind(this, 'joined')}
                            value={this.state.placementData.joined || ''}
                            options={this.state.join} 
                            helperText = {this.state.errors.joined} 
                            error = {this.state.errors.joined ===''?false:true}
                            key={this.state.placementData.joined}
                            /> 

     </Grid>


     <Grid item xs={12}>
              <FormControl>
                <h6 style={{fontWeight: 'bold'}}>Job Location</h6>
              </FormControl>
            </Grid>

            <AddressForPlacement

                pincodeName="pincode" pincodeId="pincode" pincodeOnChange={this.getPincodeData.bind(this, 'pincode')} pincodeValue={this.state.address.pincode || ''} pincodeHelperText={this.state.errors.pincode}  pincodeError={this.state.errors.pincode==''?false:true}
                villageName="villageName" villageId="villageName" villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')} villageData={this.state.village} villageValue={this.state.address.villageName || ''}  villageHelperText={this.state.errors.village}  villageError={this.state.errors.village==''?false:true}
                cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''} cityData={this.state.city} cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')} cityNameHelperText={this.state.errors.cityName}  cityNameError={this.state.errors.cityName==''?false:true}
                stateName="state" stateId="state" stateData={this.state.state} stateValue={this.state.address.state|| ''} stateInputValue={this.handleAddressSelectChange.bind(this, 'state')} stateHelperText={this.state.errors.state}  stateError={this.state.errors.state==''?false:true}
                districtName="district" districtId="district" districtValue={this.state.address.district || ''} districtData={this.state.district} districtInputValue={this.handleAddressSelectChange.bind(this, 'district')} districtHelperText={this.state.errors.district}  districtError={this.state.errors.district==''?false:true}         
             />

<Grid item xs={12} sm={6} >
<FormControlLabel
        control={
          <Checkbox
            onChange={this.handleCheckboxChange}
            name="isDocumentsUploaded"
            color="primary"
          />
        }
        label="I have uploaded appropriate Evidence"
      />
   </Grid>
<br/>


   </Grid>

</div>

<div id="notPlaced" style={{display:(this.state.placementData.interviewStatus==="Not Placed"?"block":"none")}}>
<Grid  container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
         </FormControl>  
     </Grid>
     <br></br>
     <Grid item xs={12} sm={4}>
     <SingleSelect  name="reason" id="reason" label="Reason"
     onChange={this.handleSelectChange.bind(this, 'reason')}
                            value={this.state.placementData.reason || ''}
                            options={this.state.notPlacedReasons} 
                            helperText = {this.state.errors.reason} 
                            error = {this.state.errors.reason ===''?false:true}
                            /> 
     </Grid>
   </Grid>
</div>

<div id="notInterested" style={{display:(this.state.placementData.interviewStatus==="Not Interested"?"block":"none")}}>
<Grid  container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
         </FormControl>  
     </Grid>
     <br></br>
     <Grid item xs={12} sm={4}>
     <SingleSelect  name="reason" id="reason" label="Reason"
     onChange={this.handleSelectChange.bind(this, 'reason')}
                            value={this.state.placementData.reason || ''}
                            options={this.state.notInterestedReason} 
                            helperText = {this.state.errors.reason} 
                            error = {this.state.errors.reason ===''?false:true}
                            /> 
     </Grid>
   </Grid>
</div>

<div id="entrepreneurship" style={{display:(this.state.placementData.interviewStatus==="Entrepreneurship"?"block":"none")}}>
<Grid  container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
         </FormControl>  
     </Grid>
     <br></br>

     <Grid item xs={12} sm={4}>
     <SingleSelect  name="domainName" id="domainName" label="Domain"
     onChange={this.handleSelectChange.bind(this, 'domainName')}
     value={this.state.placementData.domainName || ''}
     options={this.state.domains} /> 
     </Grid>
      <Grid item xs={12} sm={4} id="studentRemark">
       <FormControl>
         <TextField type="text" name="noOfPeopleEmployed" id="noOfPeopleEmployed" label = "No. of people employed"
          helperText = {this.state.errors.noOfPeopleEmployed} 
          error = {this.state.errors.noOfPeopleEmployed ===''?false:true} 
         onChange={this.handleInputChange} value={this.state.placementData.noOfPeopleEmployed || ''} 
         onInput = {(e) =>{
          e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
         }}/>
       </FormControl>
     </Grid>
     <Grid item xs={12}>
              <FormControl>
                <h6 style={{fontWeight: 'bold'}}>Job Location</h6>
              </FormControl>
            </Grid>
            <AddressForPlacement
                pincodeName="pincode" pincodeId="pincode" pincodeOnChange={this.getPincodeData.bind(this, 'pincode')} pincodeValue={this.state.address.pincode || ''} pincodeHelperText={this.state.errors.pincode}  pincodeError={this.state.errors.pincode==''?false:true}
                villageName="villageName" villageId="villageName" villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')} villageData={this.state.village} villageValue={this.state.address.villageName || ''}  villageHelperText={this.state.errors.village}  villageError={this.state.errors.village==''?false:true}
                cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''} cityData={this.state.city} cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')} cityNameHelperText={this.state.errors.cityName}  cityNameError={this.state.errors.cityName==''?false:true}
                stateName="stateName" stateId="stateName" stateData={this.state.state} stateValue={this.state.address.state|| ''} stateInputValue={this.handleAddressSelectChange.bind(this, 'state')} stateHelperText={this.state.errors.state}  stateError={this.state.errors.state==''?false:true}
                districtName="district" districtId="district" districtValue={this.state.address.district || ''} districtData={this.state.district} districtInputValue={this.handleAddressSelectChange.bind(this, 'district')} districtHelperText={this.state.errors.district}  districtError={this.state.errors.district==''?false:true}         
             />

<Grid item xs={12} sm={6} >
<FormControlLabel
        control={
          <Checkbox
            onChange={this.handleCheckboxChange}
            name="isDocumentsUploaded"
            color="primary"
          />
        }
        label="I have uploaded appropriate Evidence"
      />
   </Grid>
<br/>


   </Grid>


</div>

<div id="selfemployedform" style={{display:(this.state.placementData.interviewStatus==="Self Employed"?"block":"none")}}>

</div>



<div style={{display:(this.state.placementData.interviewStatus==="Rejected"?"block":"none")}}>
<Grid id="hideData" container spacing={2}>
 <Grid item xs={12}>
       <FormControl>
         </FormControl>  
     </Grid>
     <br></br>

     <Grid item xs={12} sm={4}>
     <SingleSelect  name="empId" id="empId" label="Employer Name"
     onChange={this.handleSelectChange.bind(this, 'empId')}
                            value={this.state.placementData.empId || ''}
                            helperText = {this.state.errors.empId} 
                            error = {this.state.errors.empId ===''?false:true}
                            options={this.state.center} 
                            /> 

     </Grid>

   </Grid>

</div>



   {button}
   </fieldset>
 </form>
 <form onSubmit={this.uploadDocuments} method="post">
 <Table  aria-label="simple table" style={{ width:"80%"}}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width:"50%"}}>Type of Document</TableCell>
            <TableCell style={{ width:"30%"}}>Browse and Upload</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow >               
            <TableCell >  
          
            <SingleSelect  isClearable={true} 
               name="typeOfDocument" id="typeOfDocument"
              options={this.state.typeOfDocumentData}
              onChange={this.handleSelectChangeDoc.bind(this, 'typeOfDocument')}
              value={this.state.typeOfDocument || ''}
            />          
            </TableCell>
           
            <TableCell>   
            <DropzoneArea  
              name="file" id="file"
              maxFileSize={2000000} filesLimit={1} showFileNames={true} 
              onChange={this.onFileChangeHandler}
             // key={this.state.clearDropzoneArea}
              />
            </TableCell>
            </TableRow>            
        </TableBody>
      </Table>
      <Grid container direction="row" justify="flex-end" alignItems="flex-end">
             <Button type="submit" variant="contained" color="primary" size="small" 
                    disabled={this.state.file==null || this.state.typeOfDocument==''?true:false}
             >Upload Document</Button>
             </Grid>
</form>



 <br></br>
 <MUIDataTable id="dtb" title={"List Of Placement Details"} label={"List of Placement Details "}  columns={columns} data={this.state.info} options={options}
      />

      
{ 
  (this.state.documents!="") &&

<Paper>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Created On</TableCell>
          <TableCell>Document Name</TableCell>
          <TableCell>File Name</TableCell>
          <TableCell >Download</TableCell>
          <TableCell >Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.documents.map(row => (
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
             
               onClick={this.downloadDocuments.bind(this,row.basicDocId)}
              >Download</Button>
            </TableCell>            

            <TableCell >                 
              <Button variant="contained" color="primary" size="small" name="delete" id="delete" 
               onClick={this.deleteDocument.bind(this,row.basicDocId)}
              >Delete</Button>
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

export default PlacementDetails;