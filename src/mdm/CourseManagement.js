

import React, { Component } from 'react';
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import UserContext from '../components/GolbalContext';
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Card from "./../components/Card/Card.js";
import GridContainer from "./../components/Grid/GridContainer.js";
import GridItem from "./../components/Grid/GridItem.js";
import {fetchCourseDetails } from './../util/api';
class CourseManagement extends Component {
  constructor() {
    super();
    this.state = {courseDetails:[]};
      fetchCourseDetails().then((jsondata) => { 
          let courseInfo=[];
        let courseJsonObjects = JSON.parse(jsondata.data);
        for(var i=0;i<courseJsonObjects.length;i++){
            var  details =
            {    'courseName':courseJsonObjects[i].name,
                 'description':courseJsonObjects[i].description,
                 'trainingHour':courseJsonObjects[i].trainingHour,
                 'fee':courseJsonObjects[i].fee,
                 'isActive':courseJsonObjects[i].isActive

               
            }; 
            courseInfo.push(details);    
        }    
        this.setState({
            courseDetails: courseInfo
          });

       
       }); 
}




  
  render() {

   
    const columns = [
        
        {label: 'Course Name', name: 'courseName',headerStyle: {color:'#FF9800'}},
    {label: 'Description', name: 'description'},
    {label: 'Training Hour', name: 'trainingHour',headerStyle: {color:'#FF9800'}},
    {label: 'Fee', name: 'fee',headerStyle: {color:'#FF9800'}},
    {label: 'Is Active', name: 'isActive',headerStyle: {color:'#FF9800'}},
    // {label: 'Action', name: 'action',headerStyle: {color:'#FF9800'}}
     
   ]
   
    const options = {
      filterType: "dropdown",
      sortDirection: "desc",
      selectableRows : 'single',
      disableToolbarSelect:true,
      textLabels: {
        body: {
          noMatch: <span style={{color:"blue"}}>Please wait data is loading...</span>
        }
      },
    };
    



  return (
    <div>

<MUIDataTable
       title={"List Of Active Batches"}
        data={this.state.courseDetails} columns={columns} 
        options={options} 
        />
    </div>


)
}
}

export default CourseManagement ;
