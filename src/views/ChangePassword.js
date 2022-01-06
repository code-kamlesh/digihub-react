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
  updatePassword = (event) => {
    let errors = this.state.errors;
    this.setState({ alertDialogFlag: false });
    event.preventDefault();
    if(this.validateForm(errors)){ 
    if (isPasswordsSame(this.state.newPassword, this.state.confirmPassword)) {
        changePassword(UserContext.userid, this.state.newPassword).then((jsondata) => {
        this.resetForm();
        alertDialogOptions.message =<span style={{color:"green"}}>Password Changed Sucessfully</span>;
        this.setState({ alertDialogFlag: true });
        // window.location.reload();
        window.location.href = "http://localhost:3000/";
        // window.location.href = "https://digihubdev.tatastrive.com";
        // this.props.history.push(({ pathname: 'https://digihubdev.tatastrive.com/',state: {} }));

      });
    }
    else {
      errors.confirmPasswordError='New and confirm password are not same';
      this.setState({errors});
      
        }
  } 
}


  isCurrentPasswordValid = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ ...this.state, currentPassword: value });
    let errors = this.state.errors;
    this.validate(name,value);
    isCurrentPasswordValid(UserContext.userName, value).then((jsondata) => {
      let userDetails = JSON.parse(jsondata.data);
      if (userDetails.length == 0) {
        errors.currentPasswordError='Current Password is not valid';
        this.setState({errors});
           this.setState({ ...this.state, disabledButton: true });
      }
      else {
        errors.currentPasswordError="";
        this.setState({errors});
        this.setState({ ...this.state, disabledButton: false });
      }
    });
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