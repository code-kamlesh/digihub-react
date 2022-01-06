import React, { Component } from 'react';
import { fetchBatchDetails,enrollStudent,changeStudentStatus,fectEnrollmentDetails,
  fetchBatchDetailsByBatchId,fetchNotCompletedBatchDetails,fetchCourseDetailsByIds,fetchAllStudentEngagementForUser,fectEnrollmentDetailsByIds } from './../util/api';
import { properties } from './../util/properties';
import UserContext from '../components/GolbalContext'
import {Button,Grid} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AlertDialog from './../util/AlertDialog';
import Box from '@material-ui/core/Box';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import Link from '@material-ui/core/Link';
import {calculateBatchFreezeDate} from './../util/util';

import {checkButton,validateToRecommend, getBusinessCaseDocument , getInterestInventory,getExperienceDetails, getBasicDetails, getAddressData , getFamilyData, getObservationData, getBusinessCaseData,getExistingBusiness,
  validateInterestInventory,getSocioEconomicData,validateEducationData,validateCounselData} from './../util/validation';



const alertDialogOptions = {
  message: ''
}

const customStyles = {
  BusinessAnalystRow: {
    '& td': {backgroundColor: "#FAA"}
  },
  NameCell: {
    fontWeight: 900
  },
};

class EnrollmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {rows: [],dbUserId:'',selectedBatchId:0,alertDialogFlag:false,
                     enrollmentDetails:[],toggleButton:'none',res : {},freezeDate:'',linkedEngagementId:props.linkedEngagementId};
       if(props.id != null && props.id != undefined)
       {
          this.state.engagementId=props.engagementId;
          this.state.dbUserId=props.id;
          this.getEnrollmentDetailsByEngagementId(props.engagementId);
          let engagementId=[];
          if(UserContext.defaultProgramId!=1){
          this.validateData(); 
        }

          let enrollmentDetailsHistory=[];
          fetchAllStudentEngagementForUser(props.id).then((jsondata) => {
            let jsonObjects = JSON.parse(jsondata.data);
            jsonObjects.map(item => { engagementId.push({engagementId: item.engagementId})});        
            fectEnrollmentDetailsByIds(JSON.stringify(engagementId)).then((jsondata) => { 
              let jsonobjects = JSON.parse(jsondata.data); 
       for (var i = 0; i < jsonobjects.length; i++) {
        var createdBy=jsonobjects[i].createdBy;     
              this.setState({selectedBatchId:jsonobjects[i].batchId},()=>{
                fetchBatchDetailsByBatchId(jsonobjects[i].batchId).then((jsondata) => { 
                  let batchJsonObjects = JSON.parse(jsondata.data);
                  if(jsonobjects!=null){
                    batchJsonObjects.map(item => {enrollmentDetailsHistory.push({batchName: item.batchName, startDate: item.startDate,
                    endDate:item.endDate,ojtStartDate:item.ojtStartDate,ojtEndDate:item.ojtEndDate,batchDescription:item.batchDescription,batchId:item.batchId,createdBy:createdBy,freezeDate:item.freezeDate})});
                    this.setState({enrollmentDetails:enrollmentDetailsHistory});
                  }   
                 });
              });               
              } 
        });
          });
    }
    this.loadCourseDetails();
    }


getEnrollmentDetailsByEngagementId(id){
  let engagementId =[];
  engagementId.push({engagementId:id});
  fectEnrollmentDetailsByIds(JSON.stringify(engagementId)).then((jsondata) => { 
    let jsonobjects = JSON.parse(jsondata.data); 
if(jsonobjects!=null && jsonobjects!=''){
    this.setState({selectedBatchId:jsonobjects[0].batchId},()=>{
      fetchBatchDetailsByBatchId(jsonobjects[0].batchId).then((jsondata) => { 
        let batchObject = JSON.parse(jsondata.data);
        if (typeof(batchObject[0].freezeDate) != "undefined" || batchObject[0].freezeDate!=''){
         this.setState({freezeDate:batchObject[0].freezeDate});        
        }
       });
    });               
}  
});
}

    getMuiTheme = () => createMuiTheme({
      overrides: {
        MUIDataTable: {
          root: {
            backgroundColor: "#AAF",
          },
          paper: {
            boxShadow: "none",
          }
        },
        MUIDataTableBodyCell: {
          root: {
            backgroundColor: "#FFF"
          }
        }
      }
    });


    loadCourseDetails = (event) => {
        let batchInfo = [];
        fetchNotCompletedBatchDetails(UserContext.centerId).then((jsondata) => {
            let batchDetails = JSON.parse(jsondata.data);
            for (var i = 0; i < batchDetails.length; i++) {                                        
                  let courseId=[];
                  let startDate=batchDetails[i].startDate;
                  let batchId=batchDetails[i].batchId;
                  let batchName=batchDetails[i].batchName;
                  let  batchDescription= batchDetails[i].batchDescription;
                  let  endDate= batchDetails[i].endDate;
                  let  ojtStartDate = batchDetails[i].ojtStartDate;
                  let  ojtEndDate =  batchDetails[i].ojtEndDate;
                  let freezeDate=batchDetails[i].freezeDate;
                  courseId.push({ id: batchDetails[i].courseId });
                  fetchCourseDetailsByIds(JSON.stringify(courseId)).then((courseDetailsJsonData)=>{
                    let courseDetails = JSON.parse(courseDetailsJsonData.data)
                         if(new Date(new Date(freezeDate).toDateString()) >= new Date(new Date().toDateString()) || new Date(new Date(startDate).toDateString())>=new Date(new Date().toDateString())) {
                          var details =
                          {
                              'batchId':batchId,
                              'batchName': batchName,
                              'batchDescription': batchDescription,
                              'startDate': startDate,
                              'endDate': endDate,
                              'ojtStartDate': ojtStartDate,
                              'ojtEndDate': ojtEndDate,
                              'freezeDate':freezeDate
                          };
                          batchInfo.push(details);
                        }
                        });
                }
                this.setState({ rows: batchInfo });
            })
    }

    handleChange = event => {
     this.setState({selectedBatchId:event.target.value});
    };  

/* Commentd this to handle the Batch Id Nul probelm. In case of bacth NOT selected an alert to be shown . SO created same function with the chnages
enroll = (event) => {
  var createdBy=0;
  this.state.enrollmentDetails.map(details => (
    createdBy=details.batchId===this.state.selectedBatchId?details.createdBy:UserContext.userid
    ));

    let enrollmentData='"engagementId":'+this.state.engagementId+',"batchId":'+this.state.selectedBatchId+',"updatedBy":'+UserContext.userid+',"createdBy":'+createdBy+'';
      let statusChangeData='"engagementId":'+this.state.engagementId+',"status":"enrolled","updatedBy":'+ UserContext.userid+'';
      this.setState({alertDialogFlag:false});
    enrollStudent(enrollmentData).then((jsondata) => { 
        changeStudentStatus(statusChangeData).then((jsondata) => { 
          alertDialogOptions.message="Data Saved Sucessfully";
          this.setState({alertDialogFlag:true});
 setTimeout(() => {this.props.history.push({pathname: '/dashboard/managebeneficiary',state: {}}) },3000)
				  
        });
		
		
    });
    }
	
	*/
	
	/* Enroll event will be called on submit.In case of bacth NOT selected an alert to be shown . SO created same function with the chnages*/
	
enroll = (event) => {
  let batchId = this.state.selectedBatchId;
  // Checking the batch id is null or not
if(batchId === 0 || batchId === undefined){
 
  alert("Please select batch");
  return;
}
  else{
    var createdBy=0;
    this.state.enrollmentDetails.map(details => (
      createdBy=details.batchId===this.state.selectedBatchId?details.createdBy:UserContext.userid
      ));
  
      let enrollmentData='"engagementId":'+this.state.engagementId+',"batchId":'+this.state.selectedBatchId+',"updatedBy":'+UserContext.userid+',"createdBy":'+createdBy+'';
      let statusChangeData='"engagementId":'+this.state.engagementId+',"status":"enrolled","updatedBy":0';
        this.setState({alertDialogFlag:false});
      enrollStudent(enrollmentData).then((jsondata) => { 
          changeStudentStatus(statusChangeData).then((jsondata) => { 
            alertDialogOptions.message="Data Saved Sucessfully";
            this.setState({alertDialogFlag:true});
          });
      });
  }
}
	

    validateData()
    {   
        getFamilyData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['family'] : result
          }
        }));

        getExperienceDetails(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['experience'] : result
          }
        }));
        getBasicDetails(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['basic'] : result
          }
        }));
        validateInterestInventory((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId:this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['inventory'] : result
          }
        }));
        getAddressData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['address'] : result
          }
        }));

        //observation is only mandatory for existing student of TS not for outside TS
        if(UserContext.defaultProgramId!=7){
        if(this.state.linkedEngagementId != 0 ){
        //  alert(this.state.linkedEngagementId)
        // getObservationData((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId:this.state.engagementId , this.state.dbUserId).then(result => this.setState({
        //   res : {
        //     ...this.state.res , ['ob'] : result
        // }
        // }))
      };   
        getBusinessCaseData((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId:this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['bc'] : result
          }
        }));
        getBusinessCaseDocument((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId:this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['document'] : result
          }
        }));
        getExistingBusiness((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId:this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['existingBusiness'] : result
          }
        }));
      }
        getSocioEconomicData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['socio'] : result
          }
        }));

        validateEducationData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['education'] : result
          }
        }));




if(UserContext.defaultProgramId!=1 && UserContext.defaultProgramId!=9){
        validateCounselData(this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['Counselling'] : result
          }
        }));

      }
    
      }


    render() {     
      
      let res = [];
      
        if(this.state.res.basic)
        {
          res.push("Basic details");
        }
        if(this.state.res.address)
        {
          res.push("Address details");
        }
        if(this.state.res.family)
        {
          res.push("Family details");
        }
        if(this.state.res.experience)
        {
          res.push("Experience details");
        }
        if(this.state.res.bc)
        {
          res.push("Business case details");
        }
        if(this.state.res.document)
        {
          res.push("Business case document not uploaded");
        }
        if(this.state.res.ob)
        {
          res.push("Observations details");
        }
        if(this.state.res.inventory)
        {
          res.push("Interest Inventory details");
        }
        if(this.state.res.existingBusiness)
        {
          res.push("Existing Business details");
        }
    
        if(this.state.res.socio)
        {
          res.push("SocioEconomic details");
        }
    
        if(this.state.res.education)
        {
          res.push("Education details");
        }
    
        if(this.state.res.Counselling)
        {
          res.push("Counselling details");
        }

        const columns = [
          //{label: 'Select A Batch', name: 'selectBatch' },
        { label: 'Batch Name', name: 'batchName' },
        { label: 'Batch Description', name: 'batchDescription' },
        { label: 'Start Date', name: 'startDate' },
        { label: 'End Date', name: 'endDate' },
        { label: 'OJT Start Date', name: 'ojtStartDate' },
        { label: 'OJT End Date', name: 'ojtEndDate' },
        { label: 'Freeze Date', name: 'freezeDate' }
        ];

        const options = {
          filterType: "dropdown",
          responsive: "stacked",
          sortDirection: "desc",
          selectableRows:"single",
          rowsPerPage:20,
          selectableRowsOnClick: true,
          disableToolbarSelect:true,
          // textLabels: {
          //   body: {
          //     noMatch: <span style={{color:"blue"}}>Please wait data is loading</span>
          //   }
          // },
          onRowsSelect: (currentRowsSelected,allRows) => {
            var index=currentRowsSelected[0].dataIndex;
            this.state.selectedBatchId=this.state.rows[index].batchId;
         },
         setRowProps: (row) => {
for(var i=0;i<this.state.enrollmentDetails.length;i++){
  return {         
    className: classnames(
      {[this.props.classes.BusinessAnalystRow]: row[0] === this.state.enrollmentDetails[i].batchName
      }),
  };
}
        },
        };

        const ToggleHistoricalBatchDetails = event =>
        { event.preventDefault();
          let value='none';
          if(this.state.toggleButton=='none'){
           value='block';
           this.setState({toggleButton:value});}
           else{this.setState({toggleButton:value});}
        }



        return (
            <div>
{ (res.length != 0) && <div>Below details are incomplete</div>}
<ul> {res.map((item) => (
    <li><h4 style = {{fontWeight : "600" , color : "red"}}> {item}</h4></li>
)) }
</ul>


<Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Link href="#" onClick={ToggleHistoricalBatchDetails}>
    View/Hide Enrolled Batch Details
  </Link>
  </Grid>

<br/>
    <Box component="div"  style={{display:this.state.toggleButton}}>
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
            <TableCell>Freeze Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.enrollmentDetails.map(row => (
            <TableRow >               
            <TableCell >   
            {row.batchName}
            </TableCell>
            <TableCell >   
            {row.batchDescription}
            </TableCell>
            <TableCell >   
            {row.startDate}
            </TableCell>
            <TableCell >   
            {row.endDate}
            </TableCell>
            <TableCell >   
            {row.ojtStartDate}
            </TableCell>
            <TableCell >   
            {row.ojtEndDate}
            </TableCell>
            <TableCell >   
            {row.freezeDate}
            </TableCell>
            </TableRow>
             ))}
        </TableBody>
      </Table>
    </Paper> 
    </Box>  
<br/>

<MUIDataTable
       title={"List Of Active Batches"}
        data={this.state.rows} columns={columns} 
        options={options} 
        />    
<br/>
                { 
  (UserContext.roleid!=4) &&         

                <Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button variant="contained" color="primary" size="small" onClick={this.enroll} 
 disabled={res.length!=0?true:this.state.freezeDate===''?false:(new Date(new Date(this.state.freezeDate).toDateString()) < new Date(new Date().toDateString()))} 
>Enroll</Button>
</Grid>

}


{ 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }


            </div>


        )
    }
}

export default withStyles(customStyles, {name: "EnrollmentDetails.js"})(EnrollmentDetails);