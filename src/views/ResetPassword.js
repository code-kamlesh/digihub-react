import React, { Component } from 'react';
import { FormControl , InputLabel, Input, Grid , TextField,Button}  from '@material-ui/core';
import UserContext from '../components/GolbalContext'
import {changePassword} from './../util/api';
export default class ResetPassword extends Component{


    constructor(props){
        super(props)
        this.state = {newPassword:'',confirmPassword:'',id:''};
        const query = new URLSearchParams(this.props.location.search);
         const dbUserId=query.get('id');        
         this.state.id=dbUserId;
    }
  
  
  
    handleInputChange(event) {
          
      const target = event.target;
      const value =  target.value;
      const name = target.name;
      this.setState({[name]:value});
    }
  
  
    updatePassword = (event) => {
      event.preventDefault(); 
      changePassword(this.state.id,this.state.newPassword).then((jsondata) => {     
        alert("Password Changed Sucessfully");
     });
      }
  
  render(){
  return(
  
  <div style = {{ width : '100%' }}>
      <form onSubmit={this.updatePassword} method="post">
      <Grid container spacing={2}>
      <Grid item xs={12}>
            <FormControl>
            <h5>Change Password</h5>
              </FormControl>  
          </Grid>
  
          <Grid item xs={12} sm={3}>
            <FormControl>
              <InputLabel for="firstName">New Password</InputLabel>
              <Input type="Password" name="newPassword" id="newPassword" 
              placeholder="New Password"  onChange={this.handleInputChange.bind(this)}   
              value={this.state.newPassword}
              />
            </FormControl>
          </Grid>
  
          <Grid item xs={12} sm={3}>
            <FormControl>
              <InputLabel for="firstName">Confirm Password </InputLabel>
              <Input type="Password" name="confirmPassword" id="confirmPassword" 
              placeholder="Confirm Password"  onChange={this.handleInputChange.bind(this)}  
              value={this.state.newPassword}        
              />
            </FormControl>
          </Grid> 
        </Grid>
    <br/>
        <Button variant="contained" type="submit" color="primary">Update Password</Button>
          </form>

          {this.props.location.pathName}
          {this.props.location.search}

         
          </div>
  
  
  
  )
  
  }


}