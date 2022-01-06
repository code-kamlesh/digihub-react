import React, { Component } from 'react';
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import { fetchAllStateDetails, fetchCenterByStateName, fetchStateByZone, getReports, getStudentStrengthByCenterIdAndStudentEngagementStatus, fetchEmployerDetails, fetchBatchDetails, fetchEnrollmentDetailsByBatchId, getBatchDetailsByBatchIdandFunderId, saveBatchFunderDetails, updateBatchFunderDetails, getBatchDetailsByBatchId } from './../util/api';
import UserContext from '../components/GolbalContext'
import { SingleSelect } from "react-select-material-ui";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
let hours = String(today.getHours()).padStart(2, '0');
let minutes = String(today.getMinutes()).padStart(2, '0');
let seconds = String(today.getSeconds()).padStart(2, '0');
today = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + minutes + ':' + seconds;

export default class FundManeger extends Component {

  constructor(props) {
    super(props)
    this.state = {
      regions: [{ value: 'All', label: 'All' },
      { value: 'East', label: 'East' },
      { value: 'west', label: 'West' },
      { value: 'North', label: 'North' },
      { value: 'South', label: 'South' }],
      statelist: [],
      centerlist: [],
      centerId: "",
      funderId: "",
      funderType: "P",
      funderName: "",
      funderAccId: -1,
      accountStatus: "Active Partner",
      typeOfRelationship: "%Funding partner%",
      funderlist: [],
      errors: {},
      totalTrainees: 0,
      mappedTableData: [],
      unmappedTableData: [],
      centerName: '',
    };
    this.arrayTableData = this.arrayTableData.bind(this);
    this.sepratingTableData = this.sepratingTableData.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.updateAll = this.updateAll.bind(this);
    // should be uncommented if needed
    // this.unmapAllSecondaryBatchesIfPrimaryisUnmapped = this.unmapAllSecondaryBatchesIfPrimaryisUnmapped.bind(this);
    // this.countingNoOfStudents = this.countingNoOfStudents.bind(this);
  }

  handleRegionsChange(selectname, event) {
    this.setState({
      [selectname]: event,
      errors: {
        ...this.state.errors,
        regions: {
          'label': '',
          'value': false
        },
        Selectedstate: {
          'label': 'Please select some option',
          'value': true
        },
        centerId: {
          'label': 'Please select some option',
          'value': true
        },
        funderId: {
          'label': 'Please select some option',
          'value': true
        }
      },
      Selectedstate: '',
      statelist: [],
      centerId: '',
      centerlist: [],
      funderId: '',
      funderlist: [],
      mappedTableData: [],
      unmappedTableData: []
    })
    if (event === "All") {
      fetchAllStateDetails().then(jsondata => {
        let result = JSON.parse(jsondata.data)
        result.forEach(element => {
          this.state.statelist.push({
            "value": element.name,
            "label": element.name
          })
        });
      })
    }
    else {
      fetchStateByZone(event).then(jsondata => {
        let result = JSON.parse(jsondata.data)
        result.forEach(element => {
          this.state.statelist.push({
            "value": element.name,
            "label": element.name
          })
        });
      })
    }

  }

  // drop down for state
  handleStateChange(selectname, event) {
    this.setState({
      [selectname]: event,
      errors: {
        ...this.state.errors,
        Selectedstate: {
          'label': '',
          'value': false
        },
        centerId: {
          'label': 'Please select some option',
          'value': true
        },
        funderId: {
          'label': 'Please select some option',
          'value': true
        }
      },
      centerId: '',
      centerlist: [],
      funderId: '',
      funderlist: [],
      mappedTableData: [],
      unmappedTableData: []

    })
    fetchCenterByStateName(event).then(jsondata => {
      let result = JSON.parse(jsondata.data)
      result.forEach(element => {
        this.state.centerlist.push({
          "value": element.id,
          "label": element.name,
        })
      })
    })
  }

  // drop down for center name
  handleCenterChange(selectname, event) {
    this.setState({
      [selectname]: event,
      errors: {
        ...this.state.errors,
        centerId: {
          'label': '',
          'value': false
        },
        funderId: {
          'label': 'Please select some option',
          'value': true
        }
      },
      funderId: '',
      funderlist: [],
      mappedTableData: [],
      unmappedTableData: []
    })
    // Employer api calling to fetch funderlist
    fetchEmployerDetails(this.state.accountStatus, this.state.typeOfRelationship).then(jsondata => {
      let result = JSON.parse(jsondata.data)
      result.forEach(element => {
        this.state.funderlist.push({
          "value": element.id,
          "label": element.accountName,
          "accountid":element.accountId
        })
      })
    })
  }

  // drop down for funder list
  handleFunderChange(selectname, event) {
    let funderId = event;
    let index = this.state.batchList.findIndex((object) => object.value == funderId)
    let funderName = this.state.batchList[index].label
    let funderAccId = this.state.funderlist[index].accountid
    this.setState({
      [selectname]: event,
      errors: {
        ...this.state.errors,
        funderId: {
          'label': '',
          'value': false
        }
      },
      funderName,
      funderAccId,
      mappedTableData: [],
      unmappedTableData: []
    })
    this.arrayTableData(funderId, funderName, funderAccId)
  }

  handleRadioChange(event) {
    let value = event.target.value
    this.setState({ funderType: value });
    this.arrayTableData(this.state.funderId, this.state.funderName)
  }

  arrayTableData(funderId, funderName, funderAccId) {
    var tableData = []
      //*Uncomment this if the latest i.e. batch_id is included in the service*/
      getStudentStrengthByCenterIdAndStudentEngagementStatus(this.state.centerId, "Enrolled").then((jsondata)=>{
          let result = JSON.parse(jsondata.data)
          var arrData = {}
          result.map((element, id) => {
            arrData = element
            tableData = [
              ...tableData,
              {
                "BatchName": arrData.batchName,
                "batchId": arrData.batchId,
                "funderName": funderName,
                "startDate": arrData.startDate,
                "endDate": arrData.endDate,
                "funderId": funderId,
                "trainees": arrData.strength,
                "id": "",
                "crmFunderId": funderAccId,
                "isActive": "Y",
                "fundingType": this.state.funderType,
                "remarks": "",
                "startDate": arrData.startDate,
                "endDate": arrData.endDate,
              }]
            })
            this.sepratingTableData(tableData)
        })


    // // *This to be commented and instead the above one uncommented if batch Id is included in the service for fetching active batches as well as details from the above table */
    // fetchBatchDetails(this.state.centerId).then((jsondata) => {
    //   let result = JSON.parse(jsondata.data)
    //   var arrData = {}
    //   result.map((element, id) => {
    //     arrData = element
    //     tableData = [
    //       ...tableData,
    //       {
    //         "BatchName": arrData.batchName,
    //         "batchId": arrData.batchId,
    //         "funderName": funderName,
    //         "startDate": arrData.startDate,
    //         "endDate": arrData.endDate,
    //         "funderId": funderId,
    //         "trainees": 0,
    //         "id": "",
    //         "crmFunderId": funderAccId,
    //         "isActive": "Y",
    //         "fundingType": this.state.funderType,
    //         "remarks": "",
    //         "startDate": arrData.startDate,
    //         "endDate": arrData.endDate,
    //       }]
    //   })
    //   this.sepratingTableData(this.countingNoOfStudents(tableData));
    // })
    // *Comment till here for uncommenting batchId is included in service*/
  }

  //for getting the number of students per batchId 
  // **Comment this function if the batch Id got included in the above service*/
  // countingNoOfStudents(tableData) {
  //   // *This is as per the latest function written not accurate uncomment this if sure on the same */
  //   // tableData.map((element, id)=>{
  //   //     getStudentStrengthByCenterIdAndStudentEngagementStatus(this.state.centerId, "Enrolled").then((jsondata)=>{
  //   //             let res = JSON.parse(jsondata.data)
  //   //             res.map((data)=>{
  //   //                 if (data.batchName == element.batchName){
  //   //                     element.trainees = data.strength
  //   //                 }
  //   //             })
  //   //     })
  //   // })
  //   // *This is the most stable table data and most reliable so keeping this intact till other is sorted*/
  //   tableData.map((element, id) => {
  //     getReports(1, 20, this.state.centerId, element.startDate, element.endDate, "Enrolled", element.batchId).then((jsondata) => {
  //       if (jsondata.data) {
  //         let studentDetails = JSON.parse(jsondata.data);
  //         studentDetails.map((student, id) => {
  //           if (student.studentEngagementStatus === "Enrolled") {
  //             element.trainees += 1;
  //           }
  //         })
  //       }
  //     })
  //   })
  //   return tableData;
  // }

  //the table is then seprated to two parts mapped and unmapped table
  sepratingTableData(tableData) {
    this.setState({ mappedTableData: [], unmappedTableData: [], totalTrainees: 0 })
    var mappedTableData = [];
    var unmappedTableData = [];
    var totalTrainees = 0;
    tableData.map((element, id) => {
      //checking for the mapped validity of the table
      getBatchDetailsByBatchIdandFunderId(element.batchId, element.funderId, "Y", this.state.funderType).then((jsondata) => {
        let res = JSON.parse(jsondata.data)
        if (res[0].length > 0) {
          tableData[id].id = res[0][0].id
          tableData[id].isActive = res[0][0].isActive
          tableData[id].fundingType = res[0][0].fundingType
          tableData[id].crmFunderId = res[0][0]?.crmFunderId
          tableData[id].remarks = res[0][0].remarks
          mappedTableData = [
            ...mappedTableData,
            tableData[id]
          ]
          totalTrainees += tableData[id].trainees
          this.setState({ mappedTableData, totalTrainees })
        }
        else {
          //if not mapped then checking the type before unmapping the table data
          // if the type is primary then directly showing it in the unmapped section
          if (this.state.funderType == "P") {
            //get details by batchID if not present then add it to the unmapped table
            getBatchDetailsByBatchId(element.batchId, "Y", this.state.funderType).then((jsondata) => {
              let res = JSON.parse(jsondata.data)
              if (res[0][0] == undefined) {
                unmappedTableData = [
                  ...unmappedTableData,
                  tableData[id]
                ]
                this.setState({ unmappedTableData })
              }
            })
          }
          //if the type is secondary check the if the batches are already primarly mapped before showing in the unmapped section
          else if (this.state.funderType == "S") {
            getBatchDetailsByBatchId(element.batchId, "Y", "P").then((jsondata) => {
              let res = JSON.parse(jsondata.data)
              if (res[0][0] == undefined) {

              }
              else if (res[0][0].funderId != this.state.funderId) {
                unmappedTableData = [
                  ...unmappedTableData,
                  tableData[id]
                ]
                this.setState({ unmappedTableData })
              }
            })
          }
        }
      })
    })
  }

  //save batch funder mapping 
  saveFunderMappingDetails(batchId, funderId, crmFunderId, isActive, fundingType, createdBy, createdOn, remarks, isAll) {
    crmFunderId = crmFunderId || this.state.funderAccId
    saveBatchFunderDetails(batchId, funderId, crmFunderId, isActive, fundingType, createdBy, createdOn, remarks).then((jsondata) => {
      let res = JSON.parse(jsondata.data)
      if (res[0]?.length > 0) {
        // alert('Saved Batch for this funder successfully')
      }
    })
    if (!isAll) {
      this.arrayTableData(this.state.funderId, this.state.funderName)
    }
  }

  //this function is still not needed should be uncommented whenever needed 
  // unmapAllSecondaryBatchesIfPrimaryisUnmapped(batchId){
  //   getBatchDetailsByBatchId(batchId, "Y", "S").then((jsondata)=>{
  //     if(jsondata.status == "success"){
  //       let data = JSON.parse(jsondata.data)
  //       data[0].forEach((element)=>{
  //         this.updateFunderMappingDetails(element.id, element.batchId, element.funderId, element.crmFunderId, "N", element.remarks, today, UserContext.userid, "S", true)
  //       })
  //     }
  //   })  
  // }

  //update batch funder mapping 
  updateFunderMappingDetails(id, batchId, funderId, crmFunderId, isActive, remarks, updatedOn, updatedBy, fundingType, isAll) {
    // if(fundingType == "P"){
    //     this.unmapAllSecondaryBatchesIfPrimaryisUnmapped(batchId)
    // }
    crmFunderId = crmFunderId || this.state.funderAccId
    updateBatchFunderDetails(id, batchId, funderId, crmFunderId, isActive, remarks, updatedOn, updatedBy, fundingType).then((jsondata) => {
      let res = JSON.parse(jsondata.data)
      if (res[0]?.length > 0) {
        // alert('Data is updated successfully')
      }
    })
    if (!isAll) {
      this.arrayTableData(this.state.funderId, this.state.funderName)
    }
  }

  saveAll() {
    this.state.unmappedTableData.map((element, id) => {
      this.saveFunderMappingDetails(element.batchId, element.funderId, element.crmFunderId, element.isActive, this.state.funderType, UserContext.userid, today, "", true)
    })
    this.arrayTableData(this.state.funderId, this.state.funderName)
  }

  updateAll() {
    this.state.mappedTableData.map((element, id) => {
      this.updateFunderMappingDetails(element.id, element.batchId, element.funderId, element.crmFunderId, "N", "", today, UserContext.userid, this.state.funderType, true)
    })
    this.arrayTableData(this.state.funderId, this.state.funderName)
  }

  render() {

    return (
      <div style={{ width: '100%' }}>
        <Grid container>
          <Grid item xs={12}> </Grid>
          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Regions</InputLabel>
            <SingleSelect
              name="Selectedregion" id="Selectedregion"
              options={this.state.regions}
              value={this.state.Selectedregion || ''}
              key={this.state.Selectedregion || ''}
              onChange={this.handleRegionsChange.bind(this, 'Selectedregion')}
              helperText={this.state.errors.Selectedregion != undefined ? this.state.errors.Selectedregion.label : ''}
              error={this.state.errors.Selectedregion != undefined ? this.state.errors.Selectedregion.value : ''}
            />
          </Grid>

          <Grid item xs={12} sm={2}></Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >State</InputLabel>
            <SingleSelect
              name="Selectedstate" id="Selectedstate"
              key={this.state.Selectedstate || ''}
              options={this.state.statelist}
              value={this.state.Selectedstate || ''}
              onChange={this.handleStateChange.bind(this, 'Selectedstate')}
              helperText={this.state.errors.Selectedstate != undefined ? this.state.errors.Selectedstate.label : ''}
              error={this.state.errors.Selectedstate != undefined ? this.state.errors.Selectedstate.value : ''}
            />
          </Grid>
        </Grid>

        <br />

        <Grid container>
          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Center Name</InputLabel>
            <SingleSelect
              name="selectedcenter" id="centerId"
              options={this.state.centerlist}
              value={this.state.centerId || ''}
              onChange={this.handleCenterChange.bind(this, 'centerId')}
              helperText={this.state.errors.centerId != undefined ? this.state.errors.centerId.label : ''}
              error={this.state.errors.centerId != undefined ? this.state.errors.centerId.value : ''}
              key={this.state.centerId || ''}
            />
          </Grid>

          <Grid item xs={12} sm={2}></Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Funding Partner</InputLabel>
            <SingleSelect
              name="selectedfunder" id="funderId"
              options={this.state.funderlist}
              value={this.state.funderId || ''}
              onChange={this.handleFunderChange.bind(this, 'funderId')}
              helperText={this.state.errors.funderId != undefined ? this.state.errors.funderId.label : ''}
              error={this.state.errors.funderId != undefined ? this.state.errors.funderId.value : ''}
              key={this.state.funderId || ''}
            />
          </Grid>

        </Grid>
        <br />
        <br />
        <Grid container>
          <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} >Funding Type</InputLabel>
            <br />
            <div onChange={this.handleRadioChange.bind(this)}>
              <input type="radio" value="P" name="funderType" checked={this.state.funderType === "P"} /> Primary
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="S" name="funderType" checked={this.state.funderType === "S"} /> Supporting
            </div>
          </Grid>

          <Grid item xs={12} sm={2}></Grid>


        </Grid>

        <br /><br /><br /><br />
        <Grid container>
          <Grid item xs={12} sm={5}>
            <Typography variant="body1" id="tableTitle" component="div"> UnMapped Batches </Typography>
            <Box border={1} borderRadius="1.75%">
              <Table aria-label="simple table">

                <TableHead>
                  <TableRow>
                    <TableCell>Batch Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Trainees</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.state.unmappedTableData.map((dataValue, id) => (
                    <TableRow id="tablerow">
                      <TableCell>{dataValue.BatchName}</TableCell>
                      <TableCell>{dataValue.startDate}</TableCell>
                      <TableCell>{dataValue.endDate}</TableCell>
                      <TableCell>{dataValue.trainees}</TableCell>
                      <TableCell>{<Button variant="contained" color="primary" onClick={() => this.saveFunderMappingDetails(dataValue.batchId, dataValue.funderId, dataValue.crmFunderId, "Y", this.state.funderType, UserContext.userid, today, '', false)} > map </Button>}</TableCell>
                    </TableRow>))}
                </TableBody>

              </ Table>
            </Box>
          </Grid>

          <Grid item xs={12} sm={1}></Grid>

          <Grid item xs={12} sm={5}>
            <Typography variant="body1" id="tableTitle" component="div"> Mapped Batches </Typography>

            <Box border={1} borderRadius="1.75%">
              <Table aria-label="simple table">

                <TableHead>
                  <TableRow>
                    <TableCell>Batch Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Trainees</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.state.mappedTableData.map((dataValue, id) => (
                    <TableRow id="tablerow">
                      <TableCell>{dataValue.BatchName}</TableCell>
                      <TableCell>{dataValue.startDate}</TableCell>
                      <TableCell>{dataValue.endDate}</TableCell>
                      <TableCell>{dataValue.trainees}</TableCell>
                      <TableCell>{<Button variant="contained" color="primary" onClick={() => this.updateFunderMappingDetails(dataValue.id, dataValue.batchId, dataValue.funderId, dataValue.crmFunderId, "N", '', today, UserContext.userid, this.state.funderType, false)} > unmap </Button>}</TableCell>
                    </TableRow>))}
                </TableBody>

              </ Table>
            </Box>
          </Grid>

        </Grid>

        <br /> <br />
        <Grid container>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" disabled={(this.state.unmappedTableData == [] || this.state.unmappedTableData == undefined || this.state.unmappedTableData == "") ? true : false} onClick={this.saveAll}>Map All</Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" disabled={(this.state.mappedTableData == [] || this.state.mappedTableData == undefined || this.state.mappedTableData == "") ? true : false} onClick={this.updateAll}>Unmap All</Button>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" id="tableTitle" component="div"> Total Mapped Students : {this.state.totalTrainees} </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}