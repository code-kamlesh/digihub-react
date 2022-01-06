import React, { Component } from 'react';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

import './App.css';


class Course extends Component {
  constructor() {
    super();
    this.state = {course:[],courcedetail:[]};
  }
 
  // Load all courses
  componentDidMount() {
    let formData = new FormData();
    formData.append('data', '{"token" : "1234",	"action" : "findall",	"data" : [{"id":"1"},{"id":"2"}]}');
    try {
        return fetch("http://playground.tatastrive.com/courseservice-v1/courseservice/getAll", {
        method: "POST",
        body: formData
      }).
      then(response => response.json()).then((jsondata)=>{
        let jsonobjects = JSON.parse(jsondata.data);
        this.setState({course :jsonobjects});
        
      })
      .catch(error => {
        console.log("ZZZZZZZ"+error);
      });
    }
    catch (error) {
      console.log("XXXXXX"+error);
    }
  }
  
  handleChnage=(event)=>{
    let selectedvalue = event.target.value;
    this.callme(selectedvalue);
  }



  callme(id)
  {
    
    let formData = new FormData();
    let jsonstring = '{"token" : "1234",	"action" : "findcourses",	"data" : [{"id":"'+id+'"}]}';
    console.log(jsonstring);
    formData.append('data', jsonstring);
    
    try {
        return fetch("http://playground.tatastrive.com/courseservice-v1/courseservice/getAll", {
        method: "POST",
        body: formData
      }).
      then(response => response.json()).then((jsondata)=>{
        console.log(jsondata);

        let jsonobjects = JSON.parse(jsondata.data);
        this.setState({courcedetail :jsonobjects});
        
      })
        
      .catch(error => {
        console.log("ZZZZZZZ"+error);
      });
      
    }
    catch (error) {
      console.log("XXXXXX"+error);
    }
    
}


render() {
  
  return (
    
    <div className="App">
    
    <label>Select course :  
      <select  onChange={this.handleChnage}>          
            {this.state.course.map(v => (
            <option value={v.id}>{v.name}</option>
      ))}
      </select>
    </label>
  
      
    <h1>Cource Details</h1> 
      
    {this.state.courcedetail.map(v => (
      <fragment >
        
        <table align="center" width="50%">
        <tr bgcolor='blue'>
            <td><label>Attribute</label></td><td><label>Value</label></td>
            
          </tr>
          <tr >
            <td><label>id</label></td><td>{v.id}</td>
          </tr>
          <tr>  
            <td><label>Name</label></td><td>{v.name}</td>
          </tr>
          <tr>
            <td><label>Description</label></td><td>{v.description}</td>
          </tr>
          <tr>
              <td><label>Status</label></td><td>{v.isActive}</td>
          </tr>
          <tr>
            <td><label>Fee</label></td><td>{v.fee}</td>
          </tr>
          <tr>
            <td><label>StudentPerBatch</label></td><td>{v.studentPerBatch}</td>
          </tr>
          <tr>
            <td><label>Training Hours</label></td><td>{v.trainingHour}</td>
          </tr>
          <tr>  
            <td><label>OJT Hours</label></td><td>{v.ojt}</td>
          </tr>
        </table>
      </fragment> 
    ))}

    </div>
    );
  }
}

export default Course;
