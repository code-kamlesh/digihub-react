import React, { Component } from 'react';
import { useState } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'
import underscore from 'underscore';
//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
//import 'bootstrap/dist/css/bootstrap.min.css';
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from '@material-ui/core/Button';
import { changeStudentStatus }from './../util/api';
  import { FormControl , FormControlLabel ,TextField, InputLabel, Input, Grid , RadioGroup, Radio}  from '@material-ui/core';
import styles from "../components/components.js"; 
import { CommunicationCallMerge } from 'material-ui/svg-icons';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
//import MasterData from './../components/MasterData.js'

class DetailsPage extends Component
{
    constructor(props) {
       super(props);
        this.state = {dbUserId : props.dbUserId , engagementId : props.engagementId , name : props.name }
    }
      
render()
{

    return (
  <div style = {{ width : '100%' , color :  '#3f51b5', backgroundColor : "beige" , fontWeight : "550" , fontFamily : "auto" , padding : "3px" , fontSize : "small"}}>
    <Grid container spacing={1}>
    <Grid item xs={12} sm={4}>
          <p>Beneficiary Id : {this.state.dbUserId} </p>
        </Grid>
        <Grid item xs={12} sm={4}>
        <p>Engagement Id : {this.state.engagementId} </p>
        </Grid>
        <Grid item xs={12} sm={4}>
        <p>Beneficiary Name : {this.state.name} </p>
        </Grid>
   </Grid>
    </div>

    );
      
}

}
export default DetailsPage;