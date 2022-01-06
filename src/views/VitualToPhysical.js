import React, { Component } from 'react';
import UserContext from '../components/GolbalContext'
import { SingleSelect } from "react-select-material-ui";
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import {fetchAllStateDetails,fetchStudentDetailsBaisedOnChannel,fetchVirtualData } from '../util/api';
import MUIDataTable from "mui-datatables";


const columns = [
{label: 'Engagement Id', name: 'engagement_id',options : {
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
    // selectableRowsOnClick: true,
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
export default class VitualToPhysical extends Component{
    constructor(props){
        super(props);
        this.state={
           channelCreation:"",
           statelist:[],
           Selectedstate:"",
           studentInfo:[],

          
        }
        this.handleStateChange= this.handleStateChange.bind(this);
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

    //Getting the info of the table data
    getDetails(){
        var virtualData=[];
        fetchVirtualData("3049", this.state.Selectedstate).then((jsondata)=>{
            let res = JSON.parse(jsondata.data)
            console.log(res[0])
            for(var i=0;i<res.length;i++){
                var details = 
                {
                    "engagement_id": res[i].EngagementId,
                    "Name":res[i].Name,
                    "Dob":res[i].Dob,
                    "PrimaryContactNumber":res[i].PrimaryContactNumber,
                    "PermAddressLine1":res[i].PermAddressLine1,
                    "PermCityName":res[i].PermCityName,
                    "PermPincode":res[i].PermPincode,
                    "Action":<Button variant="contained" color="primary" onClick={this.updateStudentdata()}>Save</Button>
                }
                virtualData.push(details); 
            }
            // Saving data in array 
            this.setState({
                studentInfo: virtualData
              });
        })
    }
// update student data
    updateStudentdata(){

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
            <Button color="primary" onClick={this.getDetails.bind(this)}>
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