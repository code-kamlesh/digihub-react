import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button'

import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import UserContext from '../components/GolbalContext';
import {fetchBatchDetails} from './../util/api';


export default function BatchManagement() {
    const [state, setState] = React.useState();
  const [rows, setStudentDetails] = useState([]);
  let studentInfo=[];
    function fetchActiveBatchDetails() {  
      fetchBatchDetails(UserContext.centerId).then((jsondata)=>{    
        let  batchDetails = JSON.parse(jsondata.data);  
              for(var i=0;i<batchDetails.length;i++){
              var  details =
              {    
                'batchId':batchDetails[i].batchId,
                'batchName':batchDetails[i].batchName,
                   'batchDescription':batchDetails[i].batchDescription,
                   'startDate':batchDetails[i].startDate,
                   'endDate':batchDetails[i].endDate,
                   'ojtStartDate':batchDetails[i].ojtStartDate,
                   'ojtEndDate':batchDetails[i].ojtEndDate, 
                   'centerId':batchDetails[i].centerId,
                   'batchType':batchDetails[i].batchType,
                   'freezeDate':batchDetails[i].freezeDate,
                   'action':<Link to={{
                    pathname: '/dashboard/batchedetails',
                    state: {batch:batchDetails[i] }
                  }}><EditIcon /></Link>                 
              }; 
              studentInfo.push(details);    
          }    
          setStudentDetails(studentInfo); 
       }) 
  }
  useEffect(() => {  
    fetchActiveBatchDetails();
   },[]);
   let columns;
if (UserContext.roleid==4){
 columns = [{label: 'Batch Name', name: 'batchName',options: { sortDirection: 'asc' }},
                 {label: 'Batch Description', name: 'batchDescription'},
                 {label: 'Start Date', name: 'startDate',options: { sortDirection: 'desc' }},
                 {label: 'End Date', name: 'endDate'}, 
                 {label: 'OJT Start Date', name: 'ojtStartDate'},
                 {label: 'OJT End Date', name: 'ojtEndDate'},
                 {label: 'Freeze Date', name: 'freezeDate'}
                ] 
              }
              else{
                columns = [{label: 'Batch Name', name: 'batchName',options: { sortDirection: 'asc' }},
                 {label: 'Batch Description', name: 'batchDescription'},
                 {label: 'Start Date', name: 'startDate',options: { sortDirection: 'desc' }},
                 {label: 'End Date', name: 'endDate'}, 
                 {label: 'OJT Start Date', name: 'ojtStartDate'},
                 {label: 'OJT End Date', name: 'ojtEndDate'},
                 {label: 'Freeze Date', name: 'freezeDate'},
                 {label: 'Action', name: 'action',headerStyle: {color:'#FF9800'}}               
                ] 
              }


const options = {
  filterType: "dropdown",
  responsive: "stacked",
  sortDirection: "desc",
  disableToolbarSelect:true,
  // textLabels: {
  //   body: {
  //     noMatch: <span style={{color:"blue"}}>Please wait data is loading...</span>
  //   }
  // }
};

  return (  
<div>

<Button variant="contained"  color="primary" size="small" disabled={UserContext.roleid==4?true:false}>
<Link style = {{color : 'white'}} to={{ pathname: '/dashboard/batchedetails'  
}} > Add Batch</Link>
  </Button>     


  <br></br>
  <br></br>
<MUIDataTable label={"List of Students"} data={rows} columns={columns} options={options}
      />



      </div>

      );
}