import React, { Component } from 'react';
import Address from './Address';
import {fetchMasterSalutation,fetchMasterGenderDetails,fetcRoleDetails,fetchUserDetails,mapUserToRole,
  saveUserDetails} from './../util/api';
import { FormControl , InputLabel, Input, Grid , TextField,Button}  from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import underscore from 'underscore';
import UserContext from '../components/GolbalContext'

class CreateUser extends Component{
constructor(props){
    super(props);
    
    this.state = {firstName:'',emailAddress:'',userName:'',dob:'',middleName:'',lastName:'',
    id:'0',roleId:'',centerId:'',userId:'',roleDetails:[]};

    this.formData = { 
        
        village:[],city:[],state:[],district:[]
    };

    fetcRoleDetails().then((jsondata) => {       
      let jsonobjects = JSON.parse(jsondata.data);
      jsonobjects.map(item => { this.state.roleDetails.push({label: item.name, value: (item.id).toString()})})
       });

    
        if(props.location.state!=null){
        const dbUserId = props.location.state.dbUserId;
        this.state.id=dbUserId;
        fetchUserDetails(dbUserId).then((jsondata) => {       
          let jsonobjects = JSON.parse(jsondata.data);
          this.setState({firstName:jsonobjects[0].firstName});
          this.setState({lastName:jsonobjects[0].lastName}); 
          this.setState({emailAddress:jsonobjects[0].emailAddress}); 
          this.setState({id:jsonobjects[0].id});
          this.setState({dob:jsonobjects[0].dob});
          this.setState({middleName:jsonobjects[0].middleName});
          this.setState({userName:jsonobjects[0].userName}); 
        
        });
        }
}

handleInputChange = (event) =>{  
    const target = event.target;  
    const value = target.value;  
    const name = target.name;  
        this.setState({  
        [name]: value  
    });  

}  

handleSelectChange(selectname, event) {
this.setState({[selectname]:event});
}

saveDetails = (event) => {
    event.preventDefault();
  let formData = new FormData();

  var profileData='{"userName":"'+this.state.userName+'","firstName":"'+this.state.firstName+'","lastName":"'+this.state.lastName+'","id":"'+this.state.id+'","emailAddress":"'+this.state.emailAddress+'"}';

  // formData.append('data','{"token" : "'+ "1234" +'", "action" : "saveUserDetails", "data" : [{"userName":"'+this.state.userName+'","firstName":"'+this.state.firstName+'","lastName":"'+this.state.lastName+'","id":"'+this.state.id+'","emailAddress":"'+this.state.emailAddress+'"}]}');
  //     return fetch("http://playground.tatastrive.com/ssservices-v1/users", {
  //     method: "POST",
  //     headers: {
  //       'Authorization': 'Bearer '+UserContext.token
  //   }, 
  //     body: formData 
  //     }).then(response => response.json())
      
      
  saveUserDetails(profileData).then((jsondata)=>{
        let jsonobjects = JSON.parse(jsondata.data);
        this.setState({userId:jsonobjects.id});
        alert("Data Saved Successfully");
       if(this.state.id=='0'){
        this.saveUserCenterRoleMapDetails();
       }
    })     
}
saveUserCenterRoleMapDetails(){
  mapUserToRole(this.state.userId,UserContext.centerId,this.state.roleId).then((jsondata) => {
     });
}

render(){
return  (
<div style = {{ width : '100%' }}>
    <form onSubmit={this.saveDetails} method="post">
   <Grid container spacing={2}>
    <Grid item xs={12}>
          <FormControl>
          <h5>Basic Details</h5>
            </FormControl>  
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel for="firstName">User Name</InputLabel>
            <Input type="text" name="userName" id="userName" 
            placeholder="Enter First Name" 
            value={this.state.userName}
            onChange={this.handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
            <TextField id="date" name = "dob" id = "dob"
            label="Birthday" 
            type="date"
            value={this.state.dob}
           // onChange={this.handleInputChange}
            InputLabelProps={{
              shrink: true,
            }} />

        </Grid>
         <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel for="firstName">First Name</InputLabel>
            <Input type="text" name="firstName" id="firstName" placeholder="Enter First Name"
            value={this.state.firstName}
            onChange={this.handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl> 
            <InputLabel for="middleName">Middle Name</InputLabel>
            <Input type="text" name="middleName" id="middleName" placeholder="Enter Middle Name"
             onChange={this.handleInputChange}
             value={this.state.middleName}
            />
          </FormControl>
        </Grid>
         <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel for="lastName">Last Name</InputLabel>
            <Input type="text" name="lastName" id="lastName"
             placeholder="Enter Last Name" 
             onChange={this.handleInputChange}
             value={this.state.lastName}
             />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>

         <InputLabel shrink={true} >Role</InputLabel>
         <SingleSelect  
              onChange={this.handleSelectChange.bind(this,'roleId')} 
              name="role" id="role"
              options={this.state.roleDetails}
              value={this.state.roleId}
                     
            /> 
        </Grid> 

       <Grid item xs={12}>
          <FormControl>
          <h5>Contact Information</h5>
            </FormControl>  
        </Grid>
         <Grid item xs={12} sm={6}>
          <FormControl>
            <InputLabel for="primaryEmailId">Primary Email</InputLabel>
            <Input type="email" name="emailAddress" id="emailAddress" 
             onChange={this.handleInputChange}
             value={this.state.emailAddress}
             />
          </FormControl>
        </Grid>
      </Grid>
  <br/>
      <Button variant="contained" type="submit" color="primary">Save</Button>
    
    </form>
    
    </div>

);
}
}
export default CreateUser;