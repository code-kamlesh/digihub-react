

import React, { Component } from 'react';
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import UserContext from '../components/GolbalContext';
import { fetchAllStudentDataByEngagementId, calculatePercentile} from './../util/api';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import { serviceEndPoint } from './../util/serviceEndPoint';

import EditIcon from '@material-ui/icons/Edit';
import Card from "./../components/Card/Card.js";
import GridContainer from "./../components/Grid/GridContainer.js";
import GridItem from "./../components/Grid/GridItem.js";
const customStyles = {
    ShorlistedRow: {
      '& td': {backgroundColor: "#B3F9A2"}
    },
    RejectedRow: {
        '& td': {backgroundColor: "#FB8478"}
      },
    NameCell: {
      fontWeight: 900
    },
  };
class ShortlistCandidates extends Component {
  constructor() {
    super();
    this.state = {postCalculation : false , selectedIndex : []  , rowsSelected : {'dbUserId' : '', 'engagementId' : ''},
      info:[],roleid:UserContext.roleid,roleName:UserContext.roleName};
      this.formData = {engagementId:[]};    
    this.fetchStudentDetails();
   // alert(UserContext.centerId);
    
}



handleClick = () => {
  console.log("clicked on icon!");
}


calculatePercentiles = (event) => {
    event.preventDefault();
   calculatePercentile().then((jsondata)=>{ 
        this.formData.engagementId.length=0;
        this.state.info.map(item => {
            this.formData.engagementId.push({engagementId:item.engagement_id}) 
        });
        fetchAllStudentDataByEngagementId(JSON.stringify(this.formData.engagementId)).then((jsondata) => {
            let studentInfo=[];
            if(jsondata.data){
                let studentDetails = JSON.parse(jsondata.data);   
                for(var i=0;i<studentDetails.length;i++){
                if(studentDetails[i].remarks == "qualified")
                {
                    var  details =
                        {    'student_id':studentDetails[i].dbUserId,
                            'engagement_id':studentDetails[i].engagementId,
                            'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
                            'status':studentDetails[i].status,
                        }; 
                        studentInfo.push(details);    
                }
                else
                {
                        var  details =
                            {    'student_id':studentDetails[i].dbUserId,
                                'engagement_id':studentDetails[i].engagementId,
                                'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
                                'status':studentDetails[i].status,
                            }; 
                            studentInfo.push(details);    
                    
                }
                
            } 

            }    

            this.setState( 
                ()=>{this.setState({info:studentInfo,postCalculation : true})});
            studentInfo=null;  
                    });
                });
}


fetchStudentDetails() {
    let studentInfo=[];
    let requestFormData = new FormData();  
      requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"Mobilised"}]}');
    fetch(serviceEndPoint.engagementServiceEndPoint,{
    method: "POST",
    headers: {
      'Authorization': 'Bearer '+UserContext.token
  }, 
    body: requestFormData,
    }).then(response => response.json()).then((jsondata)=>{    
      let  studentDetails = JSON.parse(jsondata.data);
            for(var i=0;i<studentDetails.length;i++){
            if(studentDetails[i].remarks == "evaluated") // score = fetchTotalScore(studentDetails[i].engagementId) 
            {
                var  details =
                {   'student_id':studentDetails[i].dbUserId,
                    'engagement_id':studentDetails[i].engagementId,
                    'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
                    'status':studentDetails[i].status // ,
                    // 'percent' : score
                }; 
                studentInfo.push(details);  
            }
           
    }
    this.setState({
        info: studentInfo
      });
       
     })  
} 
  render() {
      let displayButton = "";
      if(!this.state.postCalculation )
      {
        displayButton = <Button type = "submit" id = "save" variant="contained"  color="primary" >
        Calculate Percentiles
        </Button>
      }
      if(this.state.info.length < 20)
      {
        displayButton = <h2 style = {{fontWeight : "600" , color : "red"}}> Please complete evaluation for at least 20 candidates </h2>
      }

   
   // let action=<Link to="/dashboard/updatebeneficiary"><EditIcon/></Link>
    const columns = [{label: 'Student Id', name: 'student_id',headerStyle: {color:'#FF9800'}},
    {label: 'Engagement Id', name: 'engagement_id',options : {
      sortDirection : 'desc'
    },headerStyle: {color:'#FF9800'}},
    {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
    {label: 'Status', name: 'status',headerStyle: {color:'#FF9800'}, options : {
        sortDirection : 'desc'}}]

    const options = {
      filterType: "dropdown",
    //  responsive: "scroll",
      selectableRows : 'single',
      disableToolbarSelect:true,
      // textLabels: {
      //   body: {
      //     noMatch: <span style={{color:"blue"}}>Please wait data is loading...</span>
      //   }
      // },
      rowsSelected : this.state.selectedIndex,
      onRowsSelect: (allRows) => {
          let rows = this.state.selectedIndex;
          rows[0] = allRows[0].dataIndex;
          this.setState({
            rowsSelected : this.state.info[allRows[0].dataIndex],
            selectedIndex : rows
          }) // this is the row in your data source       
     },
     setRowProps: (row) => {
        for(var i=0;i<this.state.info.length;i++){
                return {         
                    className: classnames(
                      {[this.props.classes.ShorlistedRow]: row[3] === 'Shortlisted',
                      [this.props.classes.RejectedRow]: row[3] === 'Rejected'
                      }),
                  };
        }
                },
    };
    return ( 
      <form onSubmit = {this.calculatePercentiles}>
        <MUIDataTable label={"List of Students"} data={this.state.info} columns={columns} options={options}
      />
      <br/>
      {displayButton}
    </form>
    
    );
  }
}

export default withStyles(customStyles, {name: "ShortlistCandidates.js"})(ShortlistCandidates);
