import React, { Component } from 'react';
import UserContext from '../components/GolbalContext'
import { SingleSelect } from "react-select-material-ui";
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import { updateCenterId,fetchAllStateDetails, fetchCenterByStateName, fetchStudentDataOfVirtualCenter, fetchAddressBaiedOnIdAndState, updateStudentData } from './../util/api';
import MUIDataTable from "mui-datatables";
import { forEach } from 'underscore';
import { serviceEndPoint } from './../util/serviceEndPoint';
import { isSessionValid, isTokenValid } from './../util/session.js';
import { regenerateToken } from './../util/validation';


export default class StudentMigration extends Component {
  constructor(props) {
    super(props);
    // console.log(window.location.pathname); //yields: "/js" (where snippets run)
    // console.log(window.location.href)
    // console.log(UserContext.roleid)
    this.loadDataWithoutStateSelection();
    this.state = {
      channelCreation: "",
      statelist: [],
      centerList: [],
      Selectedstate: "",
      selectedCenterId: "",
      studentInfo: [],
      selectedIndex:[],
    };
    fetchAllStateDetails().then((jsondata) => {
      let res = JSON.parse(jsondata.data)
      console.log(res)
      res.forEach(element => {
        this.state.statelist.push({
          'value': element.name,
          'label': element.name,
        })
      });
    })
  }
// loding data during redering call center role only
    loadDataWithoutStateSelection(){
      console.log(UserContext.centerState)
      // console.log(this.state.selectedstate)
      if(UserContext.roleid==8){
        this.setStudentData();
        fetchCenterByStateName(UserContext.centerState).then((jsondata) => {
          let result = JSON.parse(jsondata.data)
          var center = result.filter((key) => key.isActive == "Y")
          console.log(center)
          center.forEach(element => {
            this.state.centerList.push({
              "value": element.id,
              "label": element.name
            })
          })
        })
      }
    }
  

  // Dropdown for state
  handleStateChange(selectname, event) {
    this.setState({studentInfo:[],centerList:[], selectedCenterId:''})
    const state = event
    this.setState({ selectedstate: state })
    this.setStudentData();
    fetchCenterByStateName(event).then((jsondata) => {
      let result = JSON.parse(jsondata.data)
      var center = result.filter((key) => (key.isActive == "Y" && key.model !== 2 && key.model!==3 ) )
      console.log(center)
      center.forEach(element => {
        this.state.centerList.push({
          "value": element.id,
          "label": element.name
        })
      })
    })
  }
  // center List handler
  handleCenterChange(selectname, event) {
    this.setState({ selectedCenterId: event })
  }
setStudentData = async()=>{ 
    await fetchStudentDataOfVirtualCenter("3049").then((jsondata)=>{
      let result = JSON.parse(jsondata.data)
      let studentData = result.filter(key=>key.creationChannel=="SR-STRIVE")
      console.log("basic",studentData)
      this.setStudentAddressData(studentData)
    })
  }
  setStudentAddressData=async(studentData)=>{
    var arr = []
    let addressData=[]
    for(var i=0;i<studentData.length;i++){
      // console.log("data", studentData)
      let dbUserId = studentData[i].dbUserId
      console.log(UserContext.roleid)
      if(UserContext.roleid == 2){
        await fetchAddressBaiedOnIdAndState(dbUserId,"R",this.state.selectedstate).then((jsondata)=>{
          let res = JSON.parse(jsondata.data)
          console.log(res)
          // console.log(res[i].entityId)
          addressData[i] = res;
          
          if(addressData[i].length>0 && addressData[i][0].entityId === studentData[i].dbUserId){
            arr.push({
             "engagementId":studentData[i].engagementId,
             "firstName": studentData[i].firstName,
             "dob":studentData[i].dob,
             "PrimaryContactNumber":studentData[i].primaryContactNumber,
             "PermCityName":addressData[i][0].cityName,
             "PermPincode":addressData[i][0].pincode,
             "State":addressData[i][0].state,
           })
          }
      })
      }
      else{
        await fetchAddressBaiedOnIdAndState(dbUserId,"R",UserContext.centerState).then((jsondata)=>{
          let res = JSON.parse(jsondata.data)
          console.log(res)
          // console.log(res[i].entityId)
          addressData[i] = res;
          
          if(addressData[i].length>0 && addressData[i][0].entityId === studentData[i].dbUserId){
            arr.push({
             "engagementId":studentData[i].engagementId,
             "firstName": studentData[i].firstName,
             "dob":studentData[i].dob,
             "PrimaryContactNumber":studentData[i].primaryContactNumber,
             "PermCityName":addressData[i][0].cityName,
             "PermPincode":addressData[i][0].pincode,
             "State":addressData[i][0].state,
           })
          }
      })
      }
    }
    // console.log(addressData)
    // console.log(studentData)
    this.setState({studentInfo:arr})
  }

  savingStudentdata =async()=>{
    var count = 0
    if(this.state.selectedCenterId === ""){
      alert("Please select Center Name")
      return;
    }
       
    console.log(this.state.selectedIndex[0].dataIndex)
    for(var i=0;i<this.state.selectedIndex.length;i++){
      var data =this.state.studentInfo[this.state.selectedIndex[i].dataIndex]
      console.log("final data",data)
      console.log(this.state.selectedCenterId,UserContext.userid,data.engagementId)
        await  updateCenterId(this.state.selectedCenterId,UserContext.userid,data.engagementId).then((jsondata)=>{
                let res = JSON.parse(jsondata.data)
                count+=1;
              })      
    }
  //  this.updateCenterIdBaiesdOnEngagementId(updateStudentData);
    if(count == this.state.selectedIndex.length ){
        alert("Student Moved to Selected Center")
        this.setState({studentInfo: [] , selectedIndex:[]})
        this.setStudentData();
      }
  }
 
  render() {
    
    const columns = [
      {
        label: 'Engagement Id', name: 'engagementId', options: {
          sortDirection: 'desc'
        }, headerStyle: { color: '#FF9800' }
      },
      // {label: 'Name', name: 'first_name',options : {    // not showing the value on fromt end
      //   sortDirection : 'desc',display: false
      // },headerStyle: {color:'#FF9800'}},
      { label: 'Name', name: 'firstName', headerStyle: { color: '#FF9800' } },
      { label: 'Date Of Birth', name: 'dob', headerStyle: { color: '#FF9800' } },
      { label: 'Contact Number', name: 'PrimaryContactNumber', headerStyle: { color: '#FF9800' } },
      { label: 'City', name: 'PermCityName', headerStyle: { color: '#FF9800' } },
      { label: 'Pin code', name: 'PermPincode', headerStyle: { color: '#FF9800' } },
      { label: 'State', name: 'State', headerStyle: { color: '#FF9800' } },
      
    ]
    
    const options = {
    
      selectableRows: 'multiple',
    
      filterType: "dropdown",
      responsive: "stacked",
      sortDirection: "desc",
      disableToolbarSelect: true,
      rowsPerPage: 15,
      selectableRowsOnClick: true,
          
          onRowsSelect: (curRowSelected, allRowsSelected) => {
            console.log("---RowSelect")
            console.log("Row Selected: ", curRowSelected);
            console.log("All Selected: ", allRowsSelected);
            this.setState({selectedIndex:allRowsSelected })
            // console.log(this.state.selectedIndex)
          }
    };
    return (
     
      <div style={{ width: '100%' }}>
        
        {UserContext.roleName === "Call center" &&
         <Grid container>
         <Grid item xs={12} sm={4}>
           <InputLabel shrink={true} >State</InputLabel>
           <SingleSelect
             name="Selectedstate" id="Selectedstate"
             options={this.state.statelist}
             value={this.state.Selectedstate || ''}
             onChange={this.handleStateChange.bind(this, 'Selectedstate')}
           />
         </Grid>
       </Grid> }
       
        <br /> <br /> <br /> <br />
        
        <Grid>
          <MUIDataTable title={"Students"} label={"List of Students"} data={this.state.studentInfo}
            columns={columns} options={options}
          />
        </Grid>
        < br/>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <InputLabel shrink={true} >Center</InputLabel> 
            <SingleSelect
              name="selectedcenter" id="centerId"
              options={this.state.centerList}
              value={this.state.selectedcenterId || ''}
              onChange={this.handleCenterChange.bind(this, 'Selectedstate')}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
           <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" size="large" disabled={this.state.selectedIndex.length<=0 }
            onClick={()=>this.savingStudentdata()}>
              Moving to Center
           </Button>
        </Grid>
      </Grid>
      </div>
    )
  }
}