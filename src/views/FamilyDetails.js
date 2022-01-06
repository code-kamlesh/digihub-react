import React, { Component } from 'react';
import { render } from "react-dom";
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {checkButton, hasFatherDetails , validateGrossSal, validateNames, roleBasedReadonly, checkButtonForArray, validateContact} from './../util/validation';
import AlertDialog from './../util/AlertDialog';
import {isNotEmpty} from './../util/validation';
import {fetchFamilyDetails,saveFamilyDetails} from './../util/api';
import { serviceEndPoint } from './../util/serviceEndPoint';

const alertDialogOptions = {
  message: ''
}

class Family extends Component {
    
    constructor(props) {
        super(props);
         
         this.state = { alertDialogFlag:false,
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
                  occup : [
                    { value: 'SelfEmployed-Agriculture', label: 'SelfEmployed-Agriculture' },
                    { value: 'SelfEmployed-NonAgriculture', label: 'SelfEmployed-NonAgriculture' },
                    { value: 'Employed-Agriculture', label: 'Employed-Agriculture' },
                    { value: 'Employed-NonAgriculture', label: 'Employed-NonAgriculture' },
                    { value: 'Unemployed', label: 'Unemployed' },
                    { value: 'Student', label: 'Student' },
                    { value: 'NotWorking', label: 'NotWorking' },
                    { value: 'NA', label: 'NA' }
                    ],
                  relation:[
                    { value: 'Father', label: 'Father' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Brother', label: 'Brother' },
                    { value: 'Sister', label: 'Sister' },
                    { value: 'Guardian', label: 'Guardian' },
                    { value: 'Son', label: 'Son' },
                    { value: 'Daughter', label: 'Daughter' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'GrandMother', label: 'GrandMother' },
                    { value: 'GrandFather', label: 'GrandFather' },
                    { value: 'Mother-In-Law', label: 'Mother-In-Law' },
                    { value: 'Father-In-Law', label: 'Father-In-Law' },
                    { value: 'Sister-In-Law', label: 'Sister-In-Law' },
                    { value: 'Father Guardian', label: 'Father Guardian' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Relative in Mumbai', label: 'Relative in Mumbai' }
                    ],
                  hOF : [
                  { value: "Y", label: 'Yes' },
                  { value: "N", label: 'No' }            
              ],
              pbw :[
                { value: "Y", label: 'Yes' },
                  { value: "N", label: 'No' }
              ],
           disabled : false , flag : "0" , errors : [{}]  , dbUserId : props.id, rows: [{"createdBy" : UserContext.userid ,"updatedBy" : UserContext.userid , "isActive" : "Y" , "dbUserId" : props.id}],
           engagementId:props.engagementId , status : props.status
          };
         this.handleChange = this.handleChange.bind(this);
         this.handleSelectChange = this.handleSelectChange.bind(this);
        
         if(props.id != null && props.id != undefined)
         {
          this.getFamilyData((props.id));
          
         }
         
     }

     componentDidMount()
     {
       roleBasedReadonly();
     }
     
      handleSelectChange(selectname, event, idx) {
        const errors = [...this.state.errors];
        this.setState({
          "disabled" : false
        });

        if (errors[event] ==undefined){
          errors[event]={}
        }
        errors[event] [selectname] = {"label" : "" , "value" : false};
        const rows = [...this.state.rows];
        rows[event] [selectname] = idx;
        this.setState({
          rows,errors
        });
      
      }
      validateAll()
      {
        var errors = this.state.errors;
        this.state.rows.map((item,idx) => {
          Object.keys(item).forEach(function(key) {
            if((key != "grossSal") && (item[key] == undefined || item[key] == '' ))
            {
              let res = "Cannot be empty";
                errors[idx][key] = {
                    'label' : res , 
                    'value' : res == "" ? false : true 
                  }
           }
        });
        })
        this.state.errors = errors;
      }
      handleChange = idx => e => {
        const rows = [...this.state.rows];
        const errors = [...this.state.errors];
        
        const { name, value } = e.target;
        if (errors[idx] ==undefined){
          errors[idx]={}
        }
        errors[idx] [name] = {"label" : "" , "value" : false};
        this.setState({
          "disabled" : false
        });
        if(name == "name")
        {
          let res = validateNames(value);
          if (errors[idx] ==undefined){
            errors[idx]={}
          }
          errors[idx] [name] = {"label" : res , "value" : res == "" ? false:true};
        }
        if(name == "contactNumber")
        {
          let res = validateContact(name , value);
          if (errors[idx] ==undefined){
            errors[idx]={}
          }
          errors[idx] [name] = {"label" : res , "value" : res == "" ? false:true};
        }

        if(name == "grossSal")
        {
          let res = validateGrossSal(name , value);
          if (errors[idx] ==undefined){
            errors[idx]={}
          }
          errors[idx] [name] = {"label" : res , "value" : res == "" ? false:true};
        }
        rows[idx] [name]= value;
        
        this.setState({
          rows,errors
        });
        
       // alert(JSON.stringify(this.state));
      };
      handleAddRow = () => {
        const item = {
          dbUserId : this.state.dbUserId,
          createdBy : UserContext.userid,
          updatedBy : UserContext.userid,
          name : "",
          isActive : "Y",
          qualId: "",
          occupation :"",
          headOfFamily :"",
          grossSal:"",
          relationshipId:"",
          contactNumber : "",
          primaryBreadWinner : ""
          
        };
        this.setState({
          rows: [...this.state.rows, item],
          errors : [...this.state.errors, {}],
        });
      };
      handleRemoveRow = () => {
        
        this.setState({
          rows: this.state.rows.slice(0, -1),
          errors : this.state.errors.slice(0, -1),
        });
      };
      handleRemoveSpecificRow = (idx) => () => {
      //  alert("remove");
        const rows = [...this.state.rows]
        const errors = [...this.state.errors]
        rows.splice(idx, 1)
        errors.splice(idx, 1)
        this.setState({ rows , errors })
      }
      mySubmitHandler = (event) => {
        event.preventDefault();
        this.validateAll();
      
        // authentication response and redirect to error or dashbaord page
        this.setState({
          errors : this.state.errors
        });
        if(checkButtonForArray(this.state.errors))
          {
            if(hasFatherDetails(this.state.rows))
            {
              this.state.disabled = false;
            this.submitFamilyData();
            }
            else
            {
              this.setState({alertDialogFlag:false});
              alertDialogOptions.message=<span style={{color:"red"}}>Please Enter Father Details</span>;
              this.setState({alertDialogFlag:true});
              this.state.disabled = true;
            }
          }
          else
          {
            this.state.disabled = true;
        }
       
       
    }


    submitFamilyData()
{
    let formData = new FormData();
    let action = "";
    const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
      if (dbUserId) {
        action =  "captureAllFamilyDetails";
      } else {
        action =  "updateAllFamilyDetails";
      }
    //alert(JSON.stringify(this.state));
        
    saveFamilyDetails(action,this.state.rows).then((jsondata)=>{
            console.log(jsondata); 
            if(jsondata.appError==null){   
             // alert("data ala")   
                let jsonobjects = JSON.parse(jsondata.data);
                console.log(jsonobjects); 
                this.setState({alertDialogFlag:false});
                if(action == 'captureAllFamilyDetails')
                {

                  alertDialogOptions.message=<span style={{color:"green"}}>Family Details Saved Sucessfully</span>;
                  this.setState({alertDialogFlag:true});
                  setTimeout(() => {this.props.history.push({
                  pathname: '/dashboard/addobeneficiary',
                  state: { dbUserId: jsonobjects[0].dbUserId ,status : this.state.status , engagementId : this.state.engagementId,  tab : 3 }
                }) },3000)

                }
                else 
                {
                  alertDialogOptions.message=<span style={{color:"green"}}>Family Details Updated Sucessfully</span>;
                   this.setState({alertDialogFlag:true});
                   setTimeout(() => {this.props.history.push({
                    pathname: '/dashboard/updatebeneficiary',
                    state: { dbUserId: jsonobjects[0].dbUserId,engagementId:this.state.engagementId, status : this.state.status , tab : 3 }
                  }) },3000)
                }
              
            }  else{
                console.log("error");
            } 
         })
  
}





getFamilyData(id)
    {
        
     fetchFamilyDetails(id).then((jsondata)=>{
              console.log(jsondata); 
           
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  console.log(jsonobjects); 
                  //alert( JSON.stringify(jsonobjects));
                
                  this.setState({
                    rows: jsonobjects
                   });
                  
                 
               //  alert(JSON.stringify(this.state.rows));
              
              }  else{
                  console.log("error");
              } 
           })
     

    }
      getMasters(){

        let formData = new FormData();
        let qual  = [];
        formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
        fetch("http://playground.tatastrive.com/services-v1/qualificationservice", {
            method: "POST",
            body: formData 
            }).then(response => response.json()).then((jsondata)=>{
                console.log(jsondata); 
                if(jsondata.appError==null){     
                    let jsonobjects = JSON.parse(jsondata.data);
                    
                   jsonobjects.map(item => { qual.push({label: item.qualification, value: item.id})
                   })
                   this.setState({
                     qual : qual
                   });
                } 
                return (true);
             });
            }


     getOccupationMasters(){
              let occup = [];
              let formData = new FormData();
              formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
              fetch("http://playground.tatastrive.com/services-v1/occupationservice", {
                  method: "POST",
                  body: formData 
                  }).then(response => response.json()).then((jsondata)=>{
                      console.log(jsondata); 
                      if(jsondata.appError==null){     
                          let jsonobjects = JSON.parse(jsondata.data);
                          
                         jsonobjects.map(item => { occup.push({label: item.name, value: item.id})
                         })
                         this.setState({
                          occup : occup
                        });
                      } 
                      return (true);
                   });
                  }
                  
                  getRelationMasters(){
                      let relation = [];
                    let formData = new FormData();
                    formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
                    fetch("http://playground.tatastrive.com/services-v1/relationshipservice", {
                        method: "POST",
                        body: formData 
                        }).then(response => response.json()).then((jsondata)=>{
                            console.log(jsondata); 
                            if(jsondata.appError==null){     
                                let jsonobjects = JSON.parse(jsondata.data);
                                
                               jsonobjects.map(item => { relation.push({label: item.name, value: item.id})
                               })
                               this.setState({
                                 relation : relation
                               })
                            } 
                            return (true);
                         }).then(response => response);
                        }


      render() {

        const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
        let button;

        if (dbUserId) {
            button =   <Button variant="contained" type="submit" color="primary">
            Save
        </Button>;
        } else {
            button = <Button type="submit" variant="contained" color="secondary">Update</Button>;
        }

        return (
          <div>
            <div className="container">
              <div className="row clearfix">
                <div className="col-md-12 column">
                <form onSubmit={this.mySubmitHandler} method="post">
                <fieldset id = "roleBasedDisable">
                  <table
                    className="table table-bordered table-hover"
                    id="tab_logic"
                  >
                    <thead>
                      <tr>
                        <th className="text-center"> Name </th>
                        <th className="text-center"> Occupation </th>
                        <th className="text-center"> Contact Number </th>
                        <th className="text-center"> Head OF Family </th>
                        <th className="text-center"> Qualification </th>
                        <th className="text-center"> Relationship </th>
                        <th className="text-center"> Primary Bread Winner </th>
                        <th className="text-center"> Gross Income./Month </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.rows.map((item, idx) => (
                        <tr id="addr0" key={idx}>
                          <td width="70%">
                            <TextField
                              type="text"
                              name="name"
                              value={this.state.rows[idx].name}
                              onChange={this.handleChange(idx)}
                              helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].name != undefined ? this.state.errors[idx].name.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].name != undefined ? this.state.errors[idx].name.value : '' }
                              className="form-control"
                            />
                          </td>

                          <td>
                          <SingleSelect  onChange={this.handleSelectChange.bind(this, 'occupation',idx)} name="occupation" id="occupation"
                            value={this.state.rows[idx].occupation }
                            helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].occupation != undefined ? this.state.errors[idx].occupation.label : '' } 
                            error = {this.state.errors[idx] != undefined && this.state.errors[idx].occupation != undefined ? this.state.errors[idx].occupation.value : '' }
                            options={this.state.occup} 
                            /> 
                          </td>

                          <td>
                            <TextField
                              type="number"
                              name="contactNumber"
                              value={this.state.rows[idx].contactNumber}
                              onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                            }}
                              onChange={this.handleChange(idx)}
                              helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].contactNumber != undefined ? this.state.errors[idx].contactNumber.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].contactNumber != undefined ? this.state.errors[idx].contactNumber.value : '' }
                              className="form-control"
                            />
                          </td>
                          <td>
                          <SingleSelect  onChange={this.handleSelectChange.bind(this, 'headOfFamily',idx)} name="headOfFamily" id="headOfFamily"
                            value={this.state.rows[idx].headOfFamily || ''}
                            helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].headOfFamily != undefined ? this.state.errors[idx].headOfFamily.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].headOfFamily != undefined ? this.state.errors[idx].headOfFamily.value : '' }
                            options={this.state.hOF} 
                            /> 
                          </td>
                          <td>
                          <SingleSelect  onChange={this.handleSelectChange.bind(this, 'qualId',idx)} name="qualId" id="qualId"
                            value={this.state.rows[idx].qualId }
                            helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].qualId != undefined ? this.state.errors[idx].qualId.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].qualId != undefined ? this.state.errors[idx].qualId.value : '' }
                            options={this.state.qual} 
                            /> 
                          </td>
                          <td>
                          <SingleSelect  onChange={this.handleSelectChange.bind(this, 'relationshipId',idx)} name="relationshipId" id="relationshipId"
                            value={this.state.rows[idx].relationshipId || ''}
                            helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].relationshipId != undefined ? this.state.errors[idx].relationshipId.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].relationshipId != undefined ? this.state.errors[idx].relationshipId.value : '' }
                           options={this.state.relation} 
                            /> 
                          </td>
                          <td>
                          <SingleSelect  onChange={this.handleSelectChange.bind(this, 'primaryBreadWinner',idx)} name="primaryBreadWinner" id="primaryBreadWinner"
                            value={this.state.rows[idx].primaryBreadWinner || ''}
                            helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].primaryBreadWinner != undefined ? this.state.errors[idx].primaryBreadWinner.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].primaryBreadWinner != undefined ? this.state.errors[idx].primaryBreadWinner.value : '' }
                           options={this.state.pbw} 
                            /> 
                          </td>
                          <td>
                            <TextField
                              type="number"
                              name="grossSal"
                             value={this.state.rows[idx].grossSal}
                              onChange={this.handleChange(idx)}
                              onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)
                            }}
                              helperText = {this.state.errors[idx] != undefined && this.state.errors[idx].grossSal != undefined ? this.state.errors[idx].grossSal.label : '' } 
                               error = {this.state.errors[idx] != undefined && this.state.errors[idx].grossSal != undefined ? this.state.errors[idx].grossSal.value : '' }
                              className="form-control"
                            />
                          </td>
                          
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={this.handleRemoveSpecificRow(idx)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Input type = "button" onClick={this.handleAddRow} className="btn btn-primary" value = "Add Row" />
                  <Input type = "button" onClick={this.handleRemoveRow} className="btn btn-danger float-right" value = "Delete Row" />
                <div><br/><br/></div>
                  <div>{button}</div>
                  </fieldset>
                  </form>
                  { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
                </div>
              </div>
            </div>
          </div>
        );
      }
}

export default Family;