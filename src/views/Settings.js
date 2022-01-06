import React, { Component } from 'react';
import {InputLabel,Grid, Button } from '@material-ui/core';
import { fetchCentersOfUser, fetchCentersDetails, fetchRoleDetails,setDefaultSettings,fetchCenterProgramMapping,fetchProgram,fetchComponentsByProgramIdAndRoleId} from './../util/api';
import { isNotEmpty } from './../util/validation';
import { SingleSelect } from "react-select-material-ui";
import AlertDialog from './../util/AlertDialog';
import UserContext from '../components/GolbalContext'
import ComponentVisibility from './../util/ComponentVisibility';
const alertDialogOptions = {
  message: ''
}
export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = { center: [], role: [], centerId: '', userScope: [],roleId:'', 
    errors: {centerName:'',roleName:'',programName:''},program:[],programId:'' 
  };
    
    let centerId = [];
    let currentComponent = this;
    fetchCentersOfUser(UserContext.userid).then((jsondata) => {
      let userJsonObjects = JSON.parse(jsondata.data);
      currentComponent.setState({ userScope: userJsonObjects });
      userJsonObjects.forEach(user => {
        centerId.push({ "id": user.centerId });
      })
    }).then(function (result) {
      let centerDetails = [];
      fetchCentersDetails(JSON.stringify(centerId)).then((jsondata) => {
        let centerObjects = JSON.parse(jsondata.data);
        centerObjects.forEach(center => {
          centerDetails.push({ label: center.name, value: center.id });
        })
        currentComponent.setState({ center: centerDetails });
      });


    })



  }
  handleCenterChange(selectname, event) {
    this.setState({programId:""});
    this.setState({roleId:""});
    let roleId = [];
    let itemsProcessed = 0;
    let totalItems = this.state.userScope.length;
    this.state.userScope.forEach(scope => {
      itemsProcessed = itemsProcessed + 1;
      if (event == scope.centerId) {
        roleId.push({ "id": scope.roleMapId });
      }
      if (itemsProcessed == totalItems) {
        fetchRoleDetails(JSON.stringify(roleId)).then((jsondata) => {
          let roleDetails = [];
          let roleObjects = JSON.parse(jsondata.data);
          roleObjects.forEach(role => {
            roleDetails.push({ label: role.name, value: role.id });
          })
          this.setState({ role: roleDetails });
        });

      }
    });

    
    let programId = [];
    let programDetails = [];
    let programState = this;
    fetchCenterProgramMapping(event).then((jsondata)=>{   
                
      let jsonobjects = JSON.parse(jsondata.data); 
    //  alert(jsonobjects[1].programId+"length is:"+jsonobjects[0].programId);  
    //  UserContext.programId = jsonobjects[0].programId;   
      jsonobjects.forEach(program => {
        programId.push({ "id":program.programId});
      })
     
      // fetchProgram(JSON.stringify(programId)).then((jsondata)=>{              
      //     let jsonobjects = JSON.parse(jsondata.data);   
      //     jsonobjects.forEach(program => {
      //       programDetails.push({ label: program.name, value: program.id });
      //     })
      //     this.setState({program:programDetails});
      //  }) ; 
   }).then(function (result) {
    fetchProgram(JSON.stringify(programId)).then((jsondata)=>{              
      let jsonobjects = JSON.parse(jsondata.data);   
      jsonobjects.forEach(program => {
        programDetails.push({ label: program.name, value: program.id });
      })
      programState.setState({program:programDetails});
   })
  }); 


  this.setState({[selectname]:event});
  }

  handleRoleChange(selectname, event) {
    this.setState({[selectname]:event});
  }

  handleProgramChange(selectname, event) {
    this.setState({[selectname]:event});
  }


  saveDefaultSettings = (event) => {
    event.preventDefault();
    if(this.validateForm(this.state.errors)){
    this.setState({alertDialogFlag:false});
    alertDialogOptions.message=<span style={{color:"green"}}>Default Settings Saved Sucessfully</span>;  
    setDefaultSettings(UserContext.userid,this.state.roleId,this.state.centerId,this.state.programId).then((jsondata) => {
      this.setState({alertDialogFlag:true});
      UserContext.centerId = this.state.centerId;
      UserContext.roleid = this.state.roleId;    
      UserContext.defaultRoleId=this.state.roleId;
      UserContext.defaultProgramId=this.state.programId;
      let roleId = [];
      roleId.push({ "id": this.state.roleId});
      fetchRoleDetails(JSON.stringify(roleId)).then((roleData) => {
        let roleObjects = JSON.parse(roleData.data);    
        UserContext.roleName = roleObjects[0].name;    
      });
      let programId = [];
      programId.push({ "id":this.state.programId});
      fetchProgram(JSON.stringify(programId)).then((jsondata)=>{              
        let jsonobjects = JSON.parse(jsondata.data);     
        UserContext.programName=jsonobjects[0].name;
     });
 Object.keys(ComponentVisibility).forEach(function(key) { delete ComponentVisibility[key]; });
 fetchComponentsByProgramIdAndRoleId(UserContext.defaultProgramId,UserContext.roleid).then((jsondata)=>{              
  let jsonobjects = JSON.parse(jsondata.data);  
   jsonobjects.map(item => {
      ComponentVisibility[item.componentName] = item.isVisibility;
      });
  }) ; 

      let centerId = [];
      centerId.push({ "id": this.state.centerId});

      fetchCentersDetails(JSON.stringify(centerId)).then((centerData) => {
        let centerObjects = JSON.parse(centerData.data);              
        UserContext.centerName = centerObjects[0].name;  
        UserContext.assessmentCenterId = centerObjects[0].assessmentCenterId;
        UserContext.modelId = centerObjects[0].model; // to refresh the model id
        this.props.history.push('/dashboard');
      });
      
    });
  }
  }


  validate = (name,value)=>{
    let errors = this.state.errors;
    switch (name) {      
      case 'centerName':   errors.centerName = isNotEmpty(value);
      break;
      case 'roleName':   errors.roleName = isNotEmpty(value);
      break;
      case 'programId':   errors.programName = isNotEmpty(value);
      break;
      default:
      break;
  }
   this.setState({errors});
  }

  validateForm = (errors) => {
    this.validate("centerName",this.state.centerId);
    this.validate("roleName",this.state.roleId);  
    this.validate("programId",this.state.programId);  


    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  render() {
    return (
      <div style={{ width: '100%' }}>


        <form method="post" onSubmit={this.saveDefaultSettings}>
          <fieldset id="roleBasedDisable">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputLabel shrink={true} >Center Name</InputLabel>
                <SingleSelect isClearable={true}
                  name="centerName" id="centerName"
                  options={this.state.center}
                  onChange={this.handleCenterChange.bind(this, 'centerId')}
                  value={this.state.centerId || '' } 
                  helperText={this.state.errors.centerName}  error={this.state.errors.centerName==''?false:true}    
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel shrink={true} for="city">Program</InputLabel>
                <SingleSelect isClearable={true}
                  name="programId" id="programId"
                  onChange={this.handleProgramChange.bind(this, 'programId')}
                  options={this.state.program}
                  value={this.state.programId || '' } 
                  helperText={this.state.errors.programName}  error={this.state.errors.programName==''?false:true}
                  key={this.state.programId}
                />
              </Grid>



              <Grid item xs={12} sm={4}>
                <InputLabel shrink={true} for="city">Role</InputLabel>
                <SingleSelect isClearable={true}
                  name="roleName" id="roleName"
                  onChange={this.handleRoleChange.bind(this, 'roleId')}
                  options={this.state.role}
                  value={this.state.roleId || '' }   
                  helperText={this.state.errors.roleName}  error={this.state.errors.roleName==''?false:true}  
                  key={this.state.roleId}
                />
              </Grid>

<br/><br/>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
              <Button variant="contained" size="small" type="submit" color="primary" >Update Settings</Button>

            </Grid>
          </fieldset>
        </form>

        {
          (this.state.alertDialogFlag) && <AlertDialog message={alertDialogOptions.message}></AlertDialog>
        }




      </div>
    )
  }
}