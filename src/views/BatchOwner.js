

import React, { Component } from 'react';
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import UserContext from '../components/GolbalContext';
import { fetchBatchDetailsForBatchOwner, fetchBatchDetails, fetchUserDetailsById } from './../util/api';
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';

import { FormControl , InputLabel, Input, Grid , TextField}  from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

class BatchOwner extends Component {
  constructor(props) {
    super(props);
    this.myData = { 
      activebatches : []
      
      
    };
    this.state = {batches:[]};
   
  
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleSelectChange = this.handleSelectChange.bind(this);
    this.fetchActivBatches();
    
 }

 handleInputChange(event) {
     
  const target = event.target;
  const value =  target.value;
  const name = target.name;
//   const label=target.lable;
  this.setState({
   batchData: {
      ...this.state.batchData,
      [name]: value
    }
  })
  
}
handleSelectChange(selectname, event) {

  this.setState({
   batchData: {
      ...this.state.batchData,
      [selectname]: event
    }
  })
   
  
}

handleClick = () => {
  console.log("clicked on icon!");
}




fetchActivBatches(){
  fetchBatchDetailsForBatchOwner(UserContext.userid).then((jsondata) => {
   console.log(jsondata);
    let activeB = JSON.parse(jsondata.data);
    activeB.map(item => {this.myData.activebatches.push({label: item.batchName, value: item.batchId }) });
     alert(this.myData.activebatches);
  
  }).then(response => response);
      }


  
  render() {
   // let action=<Link to="/dashboard/updatebeneficiary"><EditIcon/></Link>
  

    return (
      <form  method="post">


     <Grid item xs={12} sm={4} alignContent="center" >
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchName')} name="batchName" id="batchName"
              placeholder = "Select Batch" 
             
              options={this.myData.activebatches}
              
            />
            </Grid>
            </form>




      
    );
  }
}

export default BatchOwner ;
