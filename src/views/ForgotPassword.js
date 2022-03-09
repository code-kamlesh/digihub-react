import React, { Component } from 'react';

import AlertDialog from '../util/AlertDialog';
import { isPasswordsSame,passwordStrength,isNotEmpty} from '../util/validation';
import {login,CheckIfUserWithDetailsExists,ResetPasswordWithoutLoggingIn} from '../util/api';

const alertDialogOptions = {
    message: ''
  }
export default class ForgotPassword extends React.Component{
    constructor(){
        super()
        this.state={
            email:'',
            userId_forgetpassword:'',
            password:'', user_name:'', // changes for forget passwprd
            newPassword:'',
            confirmPassword:'',
            
            errors:{newPasswordError:'',confirmPasswordError:''},
        }
    } 
//validate form
validateForm = (errors) => {

    this.validate("newPassword",this.state.newPassword);
    this.validate("confirmPassword",this.state.confirmPassword);
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }
// 
handleInputEmailChange(event){
    const target = event.target;
    const value =  target.value;
    const name = target.name; 
    this.state.email = value;
//    this.setState({
//        email: value
//    })
}

//
handleInputUser(event){
    // console.log(this.state.DOB)
    const target = event.target;
    const value =  target.value;
    const name = target.name; 
    this.state.user_name = value
    // console.log(value)
}

// 

passwordReset = (event) => {
    event.preventDefault();
    this.passwordReset1();
}

passwordReset1(){
    CheckIfUserWithDetailsExists(this.state.email,this.state.user_name).then((jsondata)=>{
        if(jsondata.data !== "null"){
        let res = JSON.parse(jsondata.data)
        // console.log(res.id)

            // console.log(res[0].UserId);
                this.setState({
                    userId_forgetpassword: res?.id
                })
            // this.state.userId_forgetpassword = res[0].UserId
        }
        else{
            alert("Invalid Credential")
        }
    })
    
}

// validating password
  validate = (name,value)=>{
    let errors = this.state.errors;
    switch (name) {
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

    handleInputPassword =(event)=>{
        const target = event.target;
        const value = target.value
        const name = target.name
        this.validate(name,value)
        this.setState({[name]:value });
       
    }  
    handleInputConfirmPassword=(event)=>{
        const target = event.target;
        const value = target.value
        const name = target.name
       
        this.validate(name,value)
        this.setState({[name]: value });
       
    }
    // update password
    updatePassword = (event)=>{
    event.preventDefault();
    // this.password();
    let errors = this.state.errors;
    this.setState({ alertDialogFlag: false });
    if(this.validateForm(errors)){
    if (isPasswordsSame(this?.state?.newPassword, this?.state?.confirmPassword)) {
        ResetPasswordWithoutLoggingIn(this.state.userId_forgetpassword, this.state.newPassword).then((jsondata) => {
        if(jsondata.status === "success"){
        alertDialogOptions.message =<span style={{color:"green"}}>Password Changed Sucessfully</span>;
        this.setState({ alertDialogFlag: true });
        window.location.reload();
        }
        else{
            alert("New Password Cannot be same as Previous password")
        }
      });
    }
    else{
        alert("New and confirm password are not same")
    }   
} 
    }

    password(){
   
}
    render(){
        return(
            <div>
            {this.state.userId_forgetpassword === '' && (

                <form onSubmit={this.passwordReset} method="post">
                    <h3 class="legend last">Reset Password</h3>
                    <div class="input">
                        <span class="fa fa-envelope-o" aria-hidden="true"></span>
                        <input type="text" placeholder="Email" name="email"  maxlength="50" onChange={this.handleInputEmailChange.bind(this)} required />
                    </div>
                    <div class="input">
                        <span class="fa fa-key" aria-hidden="true"></span>
                        <input type="text" placeholder="user_name" name="user_name"  onChange={this.handleInputUser.bind(this)} required />
                    </div>
                   
                    <div>
                    <button type="submit" class="btn submit last-btn">Submit</button>
                    </div>
                    <div class="bottom-text-w3ls">&nbsp;</div>
                    <div class="bottom-text-w3ls">&nbsp;</div>
                   
                    <div class="fill_pad4">&nbsp;</div> 
                    
                </form> )}
            { this.state.userId_forgetpassword !== '' &&
            (
                <div>
                 <form onSubmit={this.updatePassword} method="post">
                    <h3 class="legend last">Reset Password</h3>
                    <div class="input">
                        <span class="fa fa-key" aria-hidden="true"></span>
                        <input type="password" placeholder="New Password" name="newPassword" 
                        error={this.state.errors.newPasswordError==''?false:true}
                        maxlength="50" onChange={this.handleInputPassword.bind(this)} required 
                        // helperText={this.state.errors.newPasswordError}
                    />
                    </div>
                     <div> <p  style={{color:"red",  fontSize:"12px"}}>{this.state.errors.newPasswordError} </p></div>
                    <div class="input">
                        <span class="fa fa-key" aria-hidden="true"></span>
                        <input type="password"   placeholder="Confirm password" name="confirmPassword"  
                        error={this.state.errors.confirmPasswordError==''?false:true}
                        onChange={this.handleInputConfirmPassword.bind(this)} required 
                        // helperText={this.state.errors.confirmPassword}
                        />
                        
                    </div>
                    <div><p  style={{color:"red" , fontSize:"12px"}}>{this.state.errors.confirmPassword} </p></div>
                    <div>
                    <button type="submit" class="btn submit last-btn">Reset</button>
                    </div>
                    <div class="bottom-text-w3ls">&nbsp;</div>
                    <div class="bottom-text-w3ls">&nbsp;</div>
                    
                    <div class="fill_pad4">&nbsp;</div>
                    <div class="fill_pad4">&nbsp;</div> 
                    <div class="fill_pad4">&nbsp;</div> 
                    
                    <div class="fill_pad4">&nbsp;</div> 
                    <div class="fill_pad4">&nbsp;</div>
                    <div class="fill_pad4">&nbsp;</div> 
                    <div class="fill_pad4">&nbsp;</div> 
                    <div class="fill_pad4">&nbsp;</div>
                    <div class="fill_pad4">&nbsp;</div> 
                    <div class="fill_pad4">&nbsp;</div>  
                    <div class="bottom-text-w3ls">&nbsp;</div>
                </form>

                {
                (this.state.alertDialogFlag) && <AlertDialog message={alertDialogOptions.message}></AlertDialog>
                }
            </div>
            
            )}
         </div>  
        )
    }
    
}