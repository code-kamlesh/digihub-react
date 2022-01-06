import React, { Component } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'

//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
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

import { Table } from 'reactstrap';
import styles from "../layouts/adminStyle.js";
import {
        Card, CardImg, CardText, CardBody,
        CardTitle, CardSubtitle, Button
      } from 'reactstrap';


const useStyles = makeStyles(styles);

//export default function PrincipalPage()  
 class Observation extends Component {
  //  const classes = useStyles();
  constructor() {
    super();
    this.state = {observationParameter:'',observationValue:'',remarks:'',StudentObservationDetails:[],appError:'',token:'',action:'captureObservations'};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {id:'',observationParameter:'',observationValue:'',remarks:'',StudentObservationDetails:[],appError:'',token:'',action:'getAllObservations'};
}

handleInputChange(event) {
        
  const target = event.target;
  const value =  target.value;
  const name = target.name;
  this.setState({
    [name]: value
  });
  
}

mySubmitHandler = (event) => {
  event.preventDefault();

  this.observations();
  
}

observations()
{
  console.log("inside");
    let formData = new FormData();

    formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"observationParameter":"'+this.state.observationParameter+'","observationValue":"'+this.state.observationValue+'","remarks":"'+this.state.remarks+'"}]}');
    try {
        return fetch("http://playground.tatastrive.com/observation-v1/observationservice", {
        method: "POST",
        body: formData
        }).then(response => response.json()).then((jsondata)=>{
          console.log(jsondata);
            if(jsondata.appError[0]==null){      
                this.setState({appError:''}); 
                let jsonobjects = JSON.parse(jsondata.data);
                this.setState({StudentObservationDetails :jsonobjects});
                console.log("observations"+jsondata);
                this.props.history.push('/');
            }  else{
                
                this.setState({StudentObservationDetails:''});
                this.setState({appError:jsondata.appError[0].errorMessage});
                this.props.history.push('/')
            }
         })
        .catch(error => {
            console.log("test"+error);
        });
    
    }  catch (error) {
        console.log("data"+error);
    }
    
}



observationsGet()
{
  console.log("inside get");
    let formData = new FormData();

    formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"id":"'+this.state.observationParameter+'","observationParameter":"'+this.state.observationParameter+'","observationValue":"'+this.state.observationValue+'","remarks":"'+this.state.remarks+'"}]}');
    try {
        return fetch("http://localhost:8080/observationservice", {
        method: "GET",
        body: formData
        }).then(response => response.json()).then((jsondata)=>{
          console.log(jsondata);
            if(jsondata.appError[0]==null){      
                this.setState({appError:''}); 
                let jsonobjects = JSON.parse(jsondata.data);
                this.setState({StudentObservationDetails :jsonobjects});
                console.log("observations"+jsondata);
                this.props.history.push('/');
            }  else{
                
                this.setState({StudentObservationDetails:''});
                this.setState({appError:jsondata.appError[0].errorMessage});
                this.props.history.push('/')
            }
         })
        .catch(error => {
            console.log("test"+error);
        });
    
    }  catch (error) {
        console.log("data"+error);
    }
    
}


renderTableData() {
  return this.state.StudentObservationDetails.map((StudentObservationDetails, index) => {
     const { id, observationParameter, observationValue, remarks } = StudentObservationDetails //destructuring
     return (
        <tr key={id}>
           <td>{id}</td>
           <td>{observationParameter}</td>
           <td>{observationValue}</td>
           <td>{remarks}</td>
        </tr>
     )
  })
}

render(){


return(


<React.Fragment>
  <form onSubmit={this.mySubmitHandler} method="post">
      <span className="formtext"><h2>Observation Details</h2></span><br></br>
        <input onChange={this.handleInputChange}
          type="text" name="observationParameter"
          placeholder="Enter observation Paratmeter" 
          required 
        />
        &nbsp; &nbsp; &nbsp; &nbsp;
<input onChange={this.handleInputChange}
          type="text" name="observationValue"
          placeholder="Enter observation Value" 
          required 
        />
 &nbsp; &nbsp; &nbsp; &nbsp;

<input  type="text" name ="remarks"
          placeholder="Enter Remarks" onChange={this.handleInputChange}
          required 
        />

        <br></br> 
        <br></br>
        <button className="btn btn-primary" type="submit" >Submit</button>
      </form>

      <form  method="get">
      <div>
            <h1 id='title'>React Dynamic Table</h1>
            <table id='StudentObservationDetails'>
               <tbody>
                  {this.renderTableData()}
               </tbody>
               <button className="btn btn-primary" onClick={this.observationsGet} >ViewList</button>
            </table>
         </div></form>
      </React.Fragment>
)


}
       
    

}

export default Observation;