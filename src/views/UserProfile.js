import React, { Component } from 'react';
import { FormControl, InputLabel, Input, Grid, TextField, Button } from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import { fectUserDetails, fetcRoleDetails, fectUserRoleDetails, fectAddressDetails, 
  fetchAllStateDetails, fetchAddressDetailsBasedOnPincode,saveUserDetails,saveAddressDetails } from './../util/api';
import UserContext from '../components/GolbalContext'
import {isNotEmpty} from './../util/validation';
import Address from "./Address";
import underscore from 'underscore';
import AlertDialog from './../util/AlertDialog';
import { serviceEndPoint } from './../util/serviceEndPoint';

// import {DropzoneArea} from 'material-ui-dropzone';
import ErrorBoundary from  './../util/ErrorBoundary';
const alertDialogOptions = {
  message: ''
}

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleDetails: [], address: {}, 
      profileData: { userName: '', firstName: '', middleName: '', lastName: '', emailAddress: '',primaryContactNumber:'',
                     id:UserContext.userid //,documentFile:null
                    },
      state: [], district: [], pincodes: [], city: [],village: [],
      errors: {firstName: '',middleName:'',lastName: '',dob:'',primaryContactNumber:'',emailAddress:'',
      addressLine1:'',addressLine2:'',pincode:'',village:'',cityName:'',state:'',district:''}
      
    };
    this.formData = { state: [], district: [], pincodes: [], city: [],village: []  };

    fectUserDetails(UserContext.userid).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      this.setState({ profileData: jsonobjects[0]});
    });

    fectAddressDetails(UserContext.userid).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
     
      fetchAddressDetailsBasedOnPincode(jsonobjects[0].pincode).then((jsondata) => {
        let jsonobjects = JSON.parse(jsondata.data);
        let taluk = [];
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
        states.map(item => { this.formData.state.push({ label: (item.label).toString(), value: (item.label).toString() }) });
        this.setState({state:this.formData.state},()=>{console.log(this.state.state)});

        jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
        district = underscore.uniq(district, true, "label");
        district.map(item => { this.formData.district.push({ label: item.label, value: (item.label).toString() }) });
        this.setState({district:this.formData.district});

      });

      this.setState({ address: jsonobjects[0] });

    });

    fetchAllStateDetails().then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      jsonobjects.map(item => { this.formData.state.push({ label: item.name, value: item.id }) })


    });

  }

  validate = (name,value)=>{
  let errors = this.state.errors;
  switch (name) {
    case 'firstName': errors.firstName =isNotEmpty(value);
      break;
    case 'middleName': errors.middleName = isNotEmpty(value);
      break;
    case 'lastName': errors.lastName =  isNotEmpty(value);
      break;
    case 'dob': errors.dob =  isNotEmpty(value);
      break;
    case 'emailAddress':  errors.emailAddress =  isNotEmpty(value);
    break;
    case 'primaryContactNumber': errors.primaryContactNumber =  isNotEmpty(value);
    break;
    case 'addressLine1':  errors.addressLine1 =  isNotEmpty(value);
    break;
    case 'addressLine2':  errors.addressLine2 =  isNotEmpty(value);
    break;
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

 // this.setState({errors, [name]: value});
 this.setState({errors});
}




  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      profileData: {
        ...this.state.profileData,
        [name]: value
      }
    })
    this.validate(name,value);
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

    this.validate(selectname,event);
  }

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
    this.validate(name,value);
    if (value.length == 6) {
      // let requestFormData = new FormData();
      // requestFormData.append('data', '{"token" : "", "action" : "findpincode", "data" : [{"pincode":' + value + '}]}');
      // fetch("http://playground.tatastrive.com/services-v1/cityvillageservice", {
      //   method: "POST",
      //   body: requestFormData,
      // }).then(response => response.json())


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
        this.setState({
          village: {
            ...this.state.village,
            village: this.formData.village
          }
        })
        
        jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
        taluk = underscore.uniq(taluk, true, "label");
        taluk.map(item => { this.formData.city.push({ label: item.label, value: (item.label).toString() }) });

        this.setState({
          city: {
            ...this.state.city,
            city: this.formData.city
          }
        })



        jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
        states = underscore.uniq(states, true, "label");
        states.map(item => { this.formData.state.push({ label: item.label, value: (item.value).toString() }) });

        this.setState({
          state: {
            ...this.state.state,
            state: this.formData.state
          }
        })

        jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
        district = underscore.uniq(district, true, "label");
        district.map(item => { this.formData.district.push({ label: item.label, value: (item.value).toString() }) });
        
        this.setState({
          district: {
            ...this.state.district,
            district: this.formData.district
          }
        })
     
      })
    }

  }


  // onFileChangeHandler = (files) => {
  //   this.setState({
  //    documentFile: files[0]
  //  });
  //  }

  saveDetails = (event) => {
    event.preventDefault();
    const dbUserId = UserContext.userid;
    this.setState({address: {...this.state.address,'id': dbUserId}});
   
    this.setState({alertDialogFlag:false});
    if(this.validateForm(this.state.errors)){
    saveUserDetails(JSON.stringify(this.state.profileData)).then((jsondata) => {     
    });

    saveAddressDetails(JSON.stringify(this.state.address)).then((jsondata) => {
      console.log(this.state.state);
    alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
    this.setState({alertDialogFlag:true});
    });

  }
  }



  submitAddress() {
    let action = "";
    const dbUserId = UserContext.userid;
    this.setState({
      address: {
        ...this.state.address,
        'dbUserId': dbUserId
      }
    })

    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "updateAddress", "data" : [' + JSON.stringify(this.state.address) + ']}');
    return fetch(serviceEndPoint.addressServiceEndPoint, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
      body: formData
    }).then(response => response.json()).then((jsondata) => {
      alert(jsondata[0]);
    })
  }

   validateForm = (errors) => {

    const localProfileData=this.state.profileData;
    const localAddress=this.state.address;
    let localThis=this;
    Object.keys(localProfileData).forEach(function(key) {localThis.validate(key,localProfileData[key]);});
    Object.keys(localAddress).forEach(function(key) {localThis.validate(key,localAddress[key]);});
    

    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  render() {
    return (
      <ErrorBoundary>
      <div style={{ width: '100%'}}>
        <form onSubmit={this.saveDetails} method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl>
                <h6 style={{fontWeight: 'bold'}}>User Profile</h6>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl>
                <InputLabel for="firstName">User Name </InputLabel>
                <Input type="text" name="userName" id="userName"
                  value={this.state.profileData.userName}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl>
                {/* <InputLabel for="firstName">First Name</InputLabel> */}
                <TextField type="text" name="firstName" id="firstName"

                  error={this.state.errors.firstName==''?false:true}
                  helperText={this.state.errors.firstName}
                  label ="First Name" onChange={this.handleInputChange.bind(this)}
                  value={this.state.profileData.firstName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl>
                <TextField type="text" name="middleName" id="middleName"
                  label="Middle Name" onChange={this.handleInputChange.bind(this)}
                  value={this.state.profileData.middleName}
                  error={this.state.errors.middleName==''?false:true}
                  helperText={this.state.errors.middleName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl>
                <TextField type="text" name="lastName" id="lastName"
                  label="Last Name" onChange={this.handleInputChange.bind(this)}
                  value={this.state.profileData.lastName}
                  error={this.state.errors.lastName==''?false:true}
                  helperText={this.state.errors.lastName}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField id="date" name="dob" id="dob"
                label="Birthday"
                type="date"
                onChange={this.handleInputChange.bind(this)}
                InputLabelProps={{
                  shrink: true,
                }} 
                
                error={this.state.errors.dob==''?false:true}
                helperText={this.state.errors.dob}
                />

            </Grid>

          
            <Grid item xs={12}>
              <FormControl>
                <h6 style={{fontWeight: 'bold'}}>Contact Information</h6>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <TextField type="email" name="emailAddress" id="emailAddress"
                  value={this.state.profileData.emailAddress} onChange={this.handleInputChange.bind(this)}
                  helperText={this.state.errors.emailAddress}
                  label="Primary Email Address"
                  error={this.state.errors.emailAddress==''?false:true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <TextField type="text" name="primaryContactNumber" id="primaryContactNumber"
                  onChange={this.handleInputChange.bind(this)}
                  value={this.state.profileData.primaryContactNumber || ''}
                  error={this.state.errors.primaryContactNumber==''?false:true}
                  helperText={this.state.errors.primaryContactNumber}
                  label="Primary Contact Number"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <h6 style={{fontWeight: 'bold'}}>Address Information</h6>
              </FormControl>
            </Grid>

            <Address
              addressLine1Name="addressLine1" addressLine1Id="addressLine1" addressLine1Data={this.handleAddressInputChange.bind(this)} addressLine1Value={this.state.address.addressLine1 || ''} addressLine1HelperText={this.state.errors.addressLine1}  addressLine1Error={this.state.errors.addressLine1==''?false:true}
              addressLine2Name="addressLine2" addressLine2Id="addressLine2" addressLine2Data={this.handleAddressInputChange.bind(this)} addressLine2Value={this.state.address.addressLine2 || ''} addressLine2HelperText={this.state.errors.addressLine2}  addressLine2Error={this.state.errors.addressLine2==''?false:true}
              pincodeName="pincode" pincodeId="pincode" pincodeOnChange={this.getPincodeData.bind(this, 'pincode')} pincodeValue={this.state.address.pincode || ''} pincodeHelperText={this.state.errors.pincode}  pincodeError={this.state.errors.pincode==''?false:true}
              villageName="villageName" villageId="villageName" villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')} villageData={this.state.village} villageValue={this.state.address.villageName || ''}  villageHelperText={this.state.errors.village}  villageError={this.state.errors.village==''?false:true}
              cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''} cityData={this.state.city} cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')} cityNameHelperText={this.state.errors.cityName}  cityNameError={this.state.errors.cityName==''?false:true}
              stateName="stateName" stateId="stateName" stateData={this.state.state} stateValue={this.state.address.state|| ''} stateInputValue={this.handleAddressSelectChange.bind(this, 'state')} stateHelperText={this.state.errors.state}  stateError={this.state.errors.state==''?false:true}
              districtName="district" districtId="district" districtValue={this.state.address.district || ''} districtData={this.state.district} districtInputValue={this.handleAddressSelectChange.bind(this, 'district')} districtHelperText={this.state.errors.district}  districtError={this.state.errors.district==''?false:true}
            />
          </Grid>
          <br />
          <Grid container direction="row" justify="flex-end" alignItems="flex-end">
          <Button variant="contained" type="submit" color="primary">Save</Button>
          </Grid>
        </form> 
     
        {/* <br/>
        <form onSubmit={this.uploadBusinessCaseDocument} method="post">
<DropzoneArea  
name="businessCaseFile" id="businessCaseFile"
maxFileSize={2000000} filesLimit={1} showFileNames={true} 
onChange={this.onFileChangeHandler} />
 &nbsp;&nbsp;
 <Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button type="submit" variant="contained" color="primary" size="small" 
      disabled={this.state.documentFile==null?true:false}

>Upload Documents</Button>
</Grid>
</form> */}




        { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }

      </div>
      </ErrorBoundary>   
    );
  }
}