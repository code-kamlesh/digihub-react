import React, { Component } from 'react';
import { FormControl, InputLabel, Input, Grid, TextField, Button } from '@material-ui/core';
import UserContext from '../components/GolbalContext'
import { changePassword, isCurrentPasswordValid } from './../util/api';
import { isPasswordsSame,passwordStrength,isNotEmpty} from './../util/validation';
import AlertDialog from './../util/AlertDialog';
const alertDialogOptions = {
  message: ''
}
export default class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPassword: '', newPassword: '', confirmPassword: '',disabledButton: false,
      verifyPassowrd :true, // return boolean after verfying password
      errors:{newPasswordError:'',confirmPasswordError:'',currentPasswordError:''}
    };
  }

  validateForm = (errors) => {

    this.validate("currentPassword",this.state.currentPassword);
    this.validate("newPassword",this.state.newPassword);
    this.validate("confirmPassword",this.state.confirmPassword);
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

    validate = (name,value)=>{
    let errors = this.state.errors;
    switch (name) {
      case 'currentPassword': 
      errors.currentPasswordError =isNotEmpty(value);
        break;
      case 'newPassword': 
      errors.newPasswordError = isNotEmpty(value);
        if(!isNotEmpty(value)){
          errors.newPasswordError=passwordStrength(value);
         }  
      break;
      case 'confirmPassword': errors.confirmPasswordError =  isNotEmpty(value);
        break;
   
      default:
      break;
  }
  this.setState({errors});

}



  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    this.validate(name,value);

  }
  resetForm() {
    this.setState({ newPassword: '' });
    this.setState({ confirmPassword: '' });
    this.setState({ currentPassword: '' });
    let errors = this.state.errors;
    errors.currentPasswordError="";
    errors.confirmPasswordError="";
    errors.newPasswordError="";    
    this.setState({errors});
  }
  // Changes in function for password reset
 updatePassword =  async (event) => {
    let errors = this.state.errors;
    this.setState({ alertDialogFlag: false });
    event.preventDefault();
    // console.log(this.state.currentPassword)
    if( await this.validateCurrentPassowrd(this.state.currentPassword)){
      // console.log("all error>>>",this.state.errors)
      if(this.validateForm(errors)){ 
        if (isPasswordsSame(this.state.newPassword, this.state.confirmPassword)) {
          if(isPasswordsSame(this.state.currentPassword,this.state.newPassword)){
            alertDialogOptions.message =<span style={{color:"red"}}>New Passowrd Cannot be Same as Previous.</span>;
            this.setState({ alertDialogFlag: true });
          }
          else{
            changePassword(UserContext.userid, this.state.newPassword).then((jsondata) => {
              // this.resetForm();
              let data = JSON.parse(jsondata)
              console.log(data)
              alertDialogOptions.message =<span style={{color:"green"}}>Password Changed Sucessfully</span>;
              this.setState({ alertDialogFlag: true });
              // window.location.href = "http://localhost:3000/";
              // window.location.href = "https://digihubdev.tatastrive.com";
              // window.location.href = "https://digihubtest.tatastrive.com";
              // window.location.href = "https://digihub.tatastrive.com";
            });
          }
           
        }
        else {
          errors.confirmPasswordError='New and confirm password are not same';
          this.setState({errors});
          
            }
      }  
    }
}
  isCurrentPasswordValid = (event) => {
    let errors = this.state.errors;
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ ...this.state, currentPassword: value });
    // removing error onchange value
    errors.currentPasswordError="";
    this.setState({errors});
  }

// Validate Current password (new function for validating)
validateCurrentPassowrd= async (currentPassword)=>{
    let errors = this.state.errors;
    this.validate(currentPassword,currentPassword);
    await isCurrentPasswordValid(UserContext.userName, currentPassword).then((jsondata) => {
      let userDetails = JSON.parse(jsondata.data);
      // console.log("datalength>>>>>>>>>>",userDetails)
      if (userDetails.length == 0) {
        errors.currentPasswordError='Current Password is not valid';
        this.setState({errors});
        // this.setState({ ...this.state, disabledButton: true });
        // verifyPassowrd = false
        this.setState({verifyPassowrd : false});
       
      }
      else {
        errors.currentPasswordError="";
        this.setState({errors});
        // verifyPassowrd = true
        this.setState({verifyPassowrd : true});
      }
    });
    // console.log(this.state.verifyPassowrd)
    return this.state.verifyPassowrd;
  }
    

  render() {
    return (
      <div style={{ width: '100%' }}>
        <form onSubmit={this.updatePassword} method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl>
                <h5>Change Password</h5>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl>
                <TextField type="Password" name="currentPassword" id="currentPassword"
                  error={this.state.errors.currentPasswordError==''?false:true}
                  label="Current Password" onChange={this.isCurrentPasswordValid.bind(this)}
                  value={this.state.currentPassword}
                  helperText={this.state.errors.currentPasswordError}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl>
                <TextField type="Password" name="newPassword" id="newPassword"
                  error={this.state.errors.newPasswordError==''?false:true}
                  label="New Password" 
                  
                  onChange={this.handleInputChange.bind(this)}
                  value={this.state.newPassword}
                  helperText={this.state.errors.newPasswordError}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl>
                <TextField type="Password" name="confirmPassword" id="confirmPassword"
                  error={this.state.errors.confirmPasswordError==''?false:true}
                  label="Confirm Password"
                  onChange={this.handleInputChange.bind(this)}
                  value={this.state.confirmPassword}
                  helperText={this.state.errors.confirmPasswordError}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Button variant="contained" size="small" type="submit" color="primary" disabled={this.state.disabledButton}>Update Password</Button>
        </form>
    

        {
          (this.state.alertDialogFlag) && <AlertDialog message={alertDialogOptions.message}></AlertDialog>
        }

<br/><br/><br/>

<div style={{fontWeight: 'bold'}}> Password Policy : </div> <br/> 
<span style={{fontSize: '12px'}}>
       1. Password min 8 characters. <br/>
       2. Password max 15 characters.<br/>
       3. Password must contain at least one number (0-9).<br/>
       4. Password must contain at least one lowercase letter (a-z).<br/>
       5. Password must contain at least one uppercase letter (A-Z).<br/>
       6. Password must contain at least one special character (@#$%^&+=).<br/>
       </span>
      </div>
    )
  }
}