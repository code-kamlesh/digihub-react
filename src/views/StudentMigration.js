import React, { Component } from 'react';
import UserContext from '../components/GolbalContext'
import { SingleSelect } from "react-select-material-ui";
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import {fetchAllStateDetails,fetchStudentDetailsBaisedOnChannel,fetchVirtualData, fetchStudentDetailsByEngagementId, updateStudentData} from './../util/api';
import MUIDataTable from "mui-datatables";
import { forEach } from 'underscore';
import { serviceEndPoint } from './../util/serviceEndPoint';
import {isSessionValid, isTokenValid} from './../util/session.js';
import { regenerateToken } from './../util/validation';

const columns = [
{label: 'Engagement Id', name: 'EngagementId',options : {
  sortDirection : 'desc'
},headerStyle: {color:'#FF9800'}},
// {label: 'Name', name: 'first_name',options : {    // not showing the value on fromt end
//   sortDirection : 'desc',display: false
// },headerStyle: {color:'#FF9800'}},
{label: 'Name', name: 'Name',headerStyle: {color:'#FF9800'}},
{label: 'Date Of Birth', name: 'Dob',headerStyle: {color:'#FF9800'}},
{label: 'Contact Number', name: 'PrimaryContactNumber',headerStyle: {color:'#FF9800'}},
{label: 'Address', name: 'PermAddressLine1',headerStyle: {color:'#FF9800'}},
{label: 'City', name: 'PermCityName',headerStyle: {color:'#FF9800'}},
{label: 'Pin code', name: 'PermPincode',headerStyle: {color:'#FF9800'}},
{label: 'Action', name: 'Action',headerStyle: {color:'#FF9800'}}
]

const options = {
      
    selectableRows : 'single',
  
    filterType: "dropdown",
    responsive: "stacked",
    sortDirection: "desc",
    disableToolbarSelect:true,
    rowsPerPage:10,
    selectableRowsOnClick: true,
//     rowsSelected : this.state.selectedIndex,
//     onRowsSelect: (allRows) => {
//         let rows = this.state.selectedIndex;
//         rows[0] = allRows[0].dataIndex;
//         this.setState({
//           rowsSelected : this.state.info[allRows[0].dataIndex],
//           selectedIndex : rows,
//           name:this.state.info[allRows[0].dataIndex].name
//         }) // this is the row in your data source       
//    },
  };
export default class StudentMigration extends Component{
    constructor(props){
        super(props);
        this.state={
           channelCreation:"",
           statelist:[],
           Selectedstate:"",
           studentInfo:[],
           studentsToDisplay:[],
           engDetailsTable: [],
           engMasterTable: [],
        }
        this.handleStateChange = this.handleStateChange.bind(this);
        this.saveStudentDetails = this.saveStudentDetails.bind(this);
        this.discardUnwantedList = this.discardUnwantedList.bind(this);
       fetchAllStateDetails().then((jsondata)=>{
                let res = JSON.parse(jsondata.data)
                console.log(res)
                res.forEach(element => {
                    this.state.statelist.push({
                        'value':element.name,
                        'label':element.name,
                    })
                });
            })

            // // Fetch student details baised on strive chaneel
            // fetchStudentDetailsBaisedOnChannel("SR-STRIVE").then((jsondata)=>{
            //     let res = JSON.parse(jsondata.data)
            //     console.log(jsondata)
            //     // console.log(res)
            // })
        
    }

    // Dropdown for state
    handleStateChange(selectname,event){
        const state = event
        this.state.Selectedstate = state;
    }

    //saving table data in student_details_table
    saveStudentDetails (engId) {
        let index = this.state.studentInfo.findIndex((data)=> data.EngagementId == engId);
        let studentToBeUpdated = this.state.studentInfo[index];
        console.log(studentToBeUpdated)
        fetchStudentDetailsByEngagementId(engId).then((jsondata)=>{
            let res = JSON.parse(jsondata.data);
            console.log(res[0])  
            if(res[0].centerId==3049){
              updateStudentData(res[0].engagementId, res[0].dbUserId, UserContext.centerId, res[0].createdBy, res[0].updatedBy, "Updated center from Virtual", res[0].status, 0, "").then((jsondata)=>{
                    let savedData = JSON.parse(jsondata.data);
                    if(savedData[0].engagementId == res[0].engagementId && savedData[0].centerId != '3049'){
                      alert("Student successfully migrated to !"+UserContext.centerName)
                    }
              });
            }
            else{
              alert('Student is already assigned to some other Center')
            }
        })
    }

// remove unwanted table data 
  async discardUnwantedList(master) {
        var dataToBeDisplayed = [];
        var studentDetails = [];
          console.log('Checkpoint 1');
           await master.map((data, id)=>{
            console.log('Checkpoint 2');
             fetchStudentDetailsByEngagementId(data.EngagementId).then((jsondata)=>{
                console.log('Checkpoint 2.5');
                let result = JSON.parse(jsondata.data)
                if(result[0].centerId=='3049'){
                  console.log("data to be saved ===> ",data)
                  var details =
                            {
                                "EngagementId": data.EngagementId,
                                "Name": data.Name ,
                                "Dob": data.Dob ,
                                "PrimaryContactNumber": data.PrimaryContactNumber ,
                                "PermAddressLine1": data.PermAddressLine1 ,
                                "PermCityName": data.PermCityName ,
                                "PermPincode": data.PermPincode ,
                                "Action":<Button variant="contained" color="primary" onClick={ () => this.saveStudentDetails(data.EngagementId) }>Save</Button>
                            }
                  dataToBeDisplayed.push(details);
                  // this.state.studentInfo.push(details);
                }
                else{
                  console.log("this data is to be deleted ===> ", data)
                  studentDetails.push(result[0]);
                  // this.state.engDetailsTable.push(data)
                }
            })
          })

          this.setState({ studentInfo : dataToBeDisplayed, studentsToDisplay: dataToBeDisplayed });
          console.log(this.state)
          console.log('Checkpoint 3');
          
    }

    //Getting the info of the table data
   getDetails(){
        var engMasterTable = [];
        var virtualData = [];
        var dataToBeDisplayed = [];
        fetchVirtualData("3049", this.state.Selectedstate).then((jsondata)=>{
            console.log('Checkpoint 0.5');
            let res = JSON.parse(jsondata.data)
            engMasterTable = res;
            this.setState({ engMasterTable : res })
            console.log("master table ===> ",engMasterTable);
            this.discardUnwantedList(engMasterTable);
            //  const x = async ()=>{
            //   console.log("hello")
            //   const wait = await this.discardUnwantedList(engMasterTable);
            // }
             res.map((data, id)=> {
            //   fetchStudentDetailsByEngagementId(data.EngagementId).then((jsondata)=>{
                console.log('Checkpoint 0.75');
            //       let result = JSON.parse(jsondata.data);  
            //       // console.log(result)
            //       this.state.engDetailsTable.push(result[0]);
            //       if(result[0].centerId=='3049'){
            //         var details =
            //           {
            //               "EngagementId": data.EngagementId,
            //               "Name": data.Name ,
            //               "Dob": data.Dob ,
            //               "PrimaryContactNumber": data.PrimaryContactNumber ,
            //               "PermAddressLine1": data.PermAddressLine1 ,
            //               "PermCityName": data.PermCityName ,
            //               "PermPincode": data.PermPincode ,
            //               "Action":<Button variant="contained" color="primary" onClick={ () => this.saveStudentDetails(data.EngagementId) }>Save</Button>
            //           }
            //         dataToBeDisplayed.push(details);
            //         this.state.engDetailsTable.push( details );
            //       }
            // })
                    var details =
                      {
                          "EngagementId": data.EngagementId,
                          "Name": data.Name ,
                          "Dob": data.Dob ,
                          "PrimaryContactNumber": data.PrimaryContactNumber ,
                          "PermAddressLine1": data.PermAddressLine1 ,
                          "PermCityName": data.PermCityName ,
                          "PermPincode": data.PermPincode ,
                          "Action":<Button variant="contained" color="primary" onClick={ () => this.saveStudentDetails(data.EngagementId) }>Save</Button>
                      }
                      virtualData.push(details);
                      // this.discardUnwantedList(virtualData)
            });
            // console.log(" details table ===> ",engDetailsTable)
            // console.log("data to display ===> "+dataToBeDisplayed)
            // this.setState({ engDetailsTable,
            //                 studentInfo: dataToBeDisplayed })
            console.log('Checkpoint 0.9');
            // this.discardUnwantedList(engMasterTable);
            this.setState({
                 studentInfo: virtualData
            });
          });

          // this.discardUnwantedList(engMasterTable, engDetailsTable);

        // console.log(this.state)
    }

    
    render(){
        return(
            <div style={{ width: '100%' }}>
            <Grid container>
            <Grid item xs={12}> </Grid>
            <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >State</InputLabel>
            <SingleSelect
              name="Selectedstate" id="Selectedstate"
            //   key={this.state.Selectedstate || ''}
              options={this.state.statelist}
              value={this.state.Selectedstate || ''}
              onChange={this.handleStateChange.bind(this, 'Selectedstate')}
            //   helperText={this.state.errors.Selectedstate != undefined ? this.state.errors.Selectedstate.label : ''}
            //   error={this.state.errors.Selectedstate != undefined ? this.state.errors.Selectedstate.value : ''}
            />
            </Grid>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={4}>
            <Button color="primary" variant="contained" onClick={this.getDetails.bind(this)}>
               Get Details
             </Button>
          </Grid>
          </Grid>
          <br /> <br />
          <br /> 
            <Grid>
            <MUIDataTable  title={"Students"} label={"List of Students"} data={this.state.studentInfo} 
            columns={columns} options={options}
            />
            </Grid>
            </div>
           
        )
    }
}