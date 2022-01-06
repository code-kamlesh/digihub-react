import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import UserContext from '../components/GolbalContext';
import {  Grid}  from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import { fetchBatchDetails ,fetchEnrollmentDetailsByBatchId,fetchAllStudentDataByEngagementId,fetchBatchDetailsByBatchId} from './../util/api';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ErrorBoundary from  './../util/ErrorBoundary';

class AllBatches extends Component {
  constructor() {
    super();
    this.state = {studentDetails:[],selectedStudentId:'',selectedEngagementId:'',selectedBatchDetails:[],selectedBeneficiaryName:''};  
    this.formData = { course : [], activebatches : [],engagementId:[],alertDialogFlag:false};    
       this.state = {batches:[]};
       this.handleSelectChange = this.handleSelectChange.bind(this);   
       fetchBatchDetails(UserContext.centerId).then((jsondata) => {     
         let activeB = JSON.parse(jsondata.data);
         activeB.map(item => {this.formData.activebatches.push({label: item.batchName, value: item.batchId }) });
       }).then(response => response);    
}

getMuiTheme = () => createMuiTheme({
  overrides: {
    MuiTableBody: {
      root: {
      
      }
    }
  },
  typography: {
    "fontSize":12,
   }
})

handleSelectChange(selectname, batchId) {

  fetchBatchDetailsByBatchId(batchId).then((batchData) => { 
    let batchJsonObjects = JSON.parse(batchData.data);
      this.setState({selectedBatchDetails :batchJsonObjects});
    

   });

fetchEnrollmentDetailsByBatchId(batchId).then((jsondata) => {
  let enrollmentDetails = JSON.parse(jsondata.data);
  this.formData.engagementId.length=0;
  enrollmentDetails.map(item => {this.formData.engagementId.push({engagementId:item.engagementId}) });
  fetchAllStudentDataByEngagementId(JSON.stringify(this.formData.engagementId)).then((jsondata) => {
    let studentInfo=[];
if(jsondata.data){
    let studentDetails = JSON.parse(jsondata.data);   
    for(var i=0;i<studentDetails.length;i++){
      var  details =
      {    'student_id':studentDetails[i].dbUserId,
          'engagement_id':studentDetails[i].engagementId,
          'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
          'status':studentDetails[i].status,
          'dob':studentDetails[i].dob
      }; 
      studentInfo.push(details);    
  } 

}    

this.setState({studentDetails:[]},()=>{this.setState({studentDetails:studentInfo})});
studentInfo=null;
}); 
});
  
}



  render() {
    const columns = [{label: 'Student Id', name: 'student_id',options: { sortDirection: 'desc' },headerStyle: {color:'#FF9800'}},
    {label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
    {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
    {label: 'Date Of Birth', name: 'dob',headerStyle: {color:'#FF9800'}},
    {label: 'Status', name: 'status',headerStyle: {color:'#FF9800'}}  
   ]

  
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      sortDirection: "desc",
      selectableRows:"single",
      rowsPerPage:10,
      selectableRowsOnClick: true,
      disableToolbarSelect:true,
      textLabels: {
        body: {
          noMatch: <span style={{color:"blue"}}>Please select batch/ another batch to load students here</span>
        }
      }
    };

    return (
      <ErrorBoundary>
      <div>
    
     <Grid item xs={12} sm={4} alignContent="center" >
     <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchName')} name="batchName" id="batchName"
              placeholder = "Select Batch"              
              options={this.formData.activebatches}
              fullWidth={true}
              style={{ "fontSize":11}}
            />
            </Grid>
            <br/>


            { (this.state.selectedBatchDetails!=null) && 

<Paper >
<Table  aria-label="simple table">
  <TableHead>
    <TableRow>
      <TableCell>Batch Name</TableCell>
      <TableCell>Batch Description</TableCell>
      <TableCell>Start Date</TableCell>
      <TableCell>End Date</TableCell>
      <TableCell>OJT Start Date</TableCell>
      <TableCell>OJT End Date</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
      <TableRow >               
      <TableCell >   
      {this.state.selectedBatchDetails[0].batchName}
      </TableCell>
      <TableCell >   
      {this.state.selectedBatchDetails[0].batchDescription}
      </TableCell>
      <TableCell >   
      {this.state.selectedBatchDetails[0].startDate}
      </TableCell>
      <TableCell >   
      {this.state.selectedBatchDetails[0].endDate}
      </TableCell>
      <TableCell >   
      {this.state.selectedBatchDetails[0].ojtStartDate}
      </TableCell>
      <TableCell >   
      {this.state.selectedBatchDetails[0].ojtEndDate}
      </TableCell>
      </TableRow>
      
  </TableBody>
</Table>
</Paper> 


            }   

               <br/> 
    <MuiThemeProvider theme={this.getMuiTheme()}>          
      <MUIDataTable
       title={"Enrolled Student list"} label={"List of Students"}
        data={this.state.studentDetails} columns={columns} 
        options={options} 
        />
    </MuiThemeProvider>
      <br/><br/>


</div>
</ErrorBoundary>   
    );
  }
}

export default AllBatches ;
