import React,{ Fragment } from 'react';
import { SingleSelect } from "react-select-material-ui";
import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
const Address = (props) => {
   return (
       <Fragment>



    
<Grid item xs={12} sm={4}>
    <TextField type="text"
     name={props.pincodeName} id={props.pincodeId}
     placeholder = {props.pincodePlaceHolder}  value={props.pincodeValue}
     onChange={props.pincodeOnChange}
     label="Pincode"  error={props.pincodeError}
     helperText={props.pincodeHelperText}
     />
</Grid>
<Grid item xs={12} sm={4}>
    <InputLabel shrink={true} for="village">Village</InputLabel>
     <SingleSelect  
      name={props.villageName} id={props.villageId} value={props.villageValue}
      placeholder = {props.villagePlaceHolder}
      options={props.villageData}    onChange={props.villageInputValue}
      error={props.villageError}
      helperText={props.villageHelperText}

    /> 
</Grid>
 <Grid item xs={12} sm={4}>
    <InputLabel shrink={true} for="city">City</InputLabel>
    <SingleSelect
   name={props.cityName} id={props.cityId}
   placeholder = {props.cityPlaceHolder} 
   options={props.cityData}    onChange={props.cityInputValue}
   value={props.cityValue}
   error={props.cityNameError}
   helperText={props.cityNameHelperText}
    />      
</Grid>

<Grid item xs={12} sm={4}>
 <InputLabel shrink={true} >State</InputLabel>
 <SingleSelect 
name={props.stateName} id={props.stateId} value={props.stateValue}
placeholder = {props.statePlaceHolder}   
options={props.stateData}  onChange={props.stateInputValue}
error={props.stateError}
helperText={props.stateHelperText}
 /> 
</Grid>

 <Grid item xs={12} sm={4}>
 <InputLabel shrink={true} >District</InputLabel>
 <SingleSelect   
name={props.districtName} id={props.districtId} value={props.districtValue}
placeholder = {props.districtPlaceHolder}
options={props.districtData} onChange={props.districtInputValue}
error={props.districtError}
helperText={props.districtHelperText}
 /> 
</Grid>  
</Fragment>

   );
}

export default Address;