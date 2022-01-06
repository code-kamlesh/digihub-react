import React, { Component } from 'react';
import {fetchCentersOfUser, fetchCentersDetails, fetchRunningBatchDetails, saveCourseCovrageData,
saveCourseCovrageDatawithId, fetchsubModuleList, fetchtabledatawithModuleId, fetchcourseModuleList} from './../util/api';
import UserContext from '../components/GolbalContext'
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

export default class CourseCovrageTracker extends Component {

  constructor(props) {
    super(props)
    //state for this particular class
    this.state = {

      year: [
        { value: '1', label: 'First Year' },
        { value: '2', label: 'Second Year' },
      ],
      checked: false,
      module: [],
      errors: {},
      compDate: '',
      tableData: [],
      selectedModuleId: '',
      batchs: [],
      userId: UserContext.userid,
      selectedYear: '',
      selectedModule: '',
      batchName: '',
      createdDate: today,
      subModuleList: [],
      timeSpentList: [],
      tableError: [],
      batchId: '',
    };
    //function binding with the current instance
    this.SaveOrUpdateData = this.SaveOrUpdateData.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeRemark = this.handleChangeRemark.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.arrayProcessingFunction = this.arrayProcessingFunction.bind(this);
    // Api calling for center name 
    let centerId = [];
    let currentComponent = this;
    fetchCentersOfUser(UserContext.userid).then((jsondata) => {
      let userJsonObjects = JSON.parse(jsondata.data);
      currentComponent.setState({ userScope: userJsonObjects });
      userJsonObjects.forEach(user => {
        centerId.push({ "id": user.centerId });
      })
    }).then(function (result) {
      let centerDetails = [];
      fetchCentersDetails(JSON.stringify(centerId)).then((jsondata) => {
        let centerObjects = JSON.parse(jsondata.data);
        centerObjects.forEach(center => {
          centerDetails.push({ label: center.name, value: center.id });
        })
        currentComponent.setState({ center: centerDetails });
      });
    })
    //constructor ends
  }


  // Api calling for batch name based on center
  handleCenterChange(selectcenter, event) {
    this.setState({ [selectcenter]: event });
    this.setState({ batchId: "", batchName: "", attendanceDetails: [], batchs: [] });
    fetchRunningBatchDetails(event).then((jsondata) => {
      let studentInfo = [];
      let batchDetails = JSON.parse(jsondata.data);
      for (var i = 0; i < batchDetails.length; i++) {
        var details =
        {
          'value': batchDetails[i].batchId,
          'label': batchDetails[i].batchName
        };
        studentInfo.push(details)
      }
      //saving the data from API calls to the state adding error to identify all the compulsary fields 
      this.setState({
        batchs: studentInfo,
        tableData: [],
        errors: {
          ...this.state.errors,
          centerId: {
            'label': '',
            'value': false
          },
          batchId: {
            'label': 'Please select some option',
            'value': true
          },
          selectedYear: {
            'label': 'Please select some option',
            'value': true
          },
          selectedModule: {
            'label': 'Please select some option',
            'value': true
          }
        },
        batchId: '',
        batchName: '',
        selectedYear: '',
        module: [],
        selectedModule: ''
      });
    })
    //end of handle center change
  }

  // batch drop down 
  handleBatchChange(selectbatch, event) {
    //setting the state value to the selected batch and unfilled data as error
    this.setState({
      selectbatch: event,
      tableData: [],
      errors: {
        ...this.state.errors,
        batchId: {
          'label': '',
          'value': false
        },
        selectedYear: {
          'label': 'Please select some option',
          'value': true
        },
        selectedModule: {
          'label': 'Please select some option',
          'value': true
        }
      },
      selectedYear: '',
      module: [],
      selectedModule: '',
    });
    this.state.batchId = event;
    //end of batch change dropdown
  }

  // Year drop down
  handleSelectChangeyear(selectename, event) {
    //setting the year in state and getting the data error for the unselected
    this.setState({
      selectedYear: event,
      tableData: [],
      errors: {
        ...this.state.errors,
        selectedYear: {
          'label': '',
          'value': false
        }
      },
      module: [],
      selectedModule: ''
    })
    // API calling for coursemodule list
    fetchcourseModuleList(event).then((jsondata) => {
      let response = jsondata.data
      response = JSON.parse(response)
      response.forEach((value) => {
        value.forEach((module) => {
          this.setState({
            module: [
              ...this.state.module,
              {
                value: module.moduleName,
                label: module.moduleName,
                moduleId: module.moduleId
              }
            ]
          })
        })
      })
    })
    //end of change handle select
  }

  // module drop down
  handleSelectChangemodule(selectcenter, event) {
    let module_id = '';
    this.setState({
      [selectcenter]: event,
      remarks: "",
      compDate: "",
      checked: false,
      tableData: [],
      subModuleList: [],
      timeSpentList: [],
      errors: {
        ...this.state.errors,
        selectedModule: {
          'label': '',
          'value': false
        }
      }
    })
    this.state.module.forEach((value) => {
      if (value.value == event) {
        module_id = value.moduleId
        this.state.selectedModuleId = module_id;
      }
    })
    //this is the main function for processing and putting the data in table
    this.arrayProcessingFunction(module_id)
    //end of select change module function
  }

  arrayProcessingFunction(moduleId) {
    var tableData = []
    //fetch sub-module list
    fetchsubModuleList(moduleId, this.state.selectedYear).then((jsondata) => {
      let data = JSON.parse(jsondata.data)
      var arrData = {}
      data[0].map((element, id) => {
        arrData = element
        tableData = [
          ...tableData,
          {
            "Id": '',
            "subtopicName": arrData.subtopicName,
            "subtopicId": arrData.subtopicId,
            "remarks": '',
            "compDate": '',
            "isActive": '',
            "createdDate": '',
            "disabledStatus": ''
          }]
      })
      this.setState({ tableData })
    })
    //fetch time spent in course module table data with moduleId, batchID and is Active status(this will always remain "Y")
    fetchtabledatawithModuleId(this.state.batchId, this.state.selectedModuleId, "Y").then((jsondata) => {
      let data = JSON.parse(jsondata.data)
      var tableDataCopy = [...tableData];
      var arrData = {}
      data[0].map((element, id) => {
        arrData = element
        var index = tableDataCopy.findIndex(obj => obj.subtopicId == arrData.subtopicId)
        if (index != -1) {
          tableDataCopy[index].Id = arrData.id
          tableDataCopy[index].remarks = arrData.remarks
          tableDataCopy[index].compDate = arrData.compDate
          tableDataCopy[index].isActive = arrData.isActive
          tableDataCopy[index].createdDate = arrData.createdDate
          let createdDate = new Date(arrData.createdDate)
          let res = ((createdDate.getFullYear() !== yyyy) ? true : ((createdDate.getMonth() !== new Date().getMonth()) ? true : ((createdDate.getDate() === new Date().getDate() || createdDate.getDate() === new Date().getDate() - 1) ? false : true)))
          tableDataCopy[index].disabledStatus = res
        }
      })
      this.setState({ tableData: tableDataCopy })
    })
  }

  // handle is Active Status if checked the status is "Y" else "N"
  handleCheckChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    var tableData = [...this.state.tableData];
    var index = tableData.findIndex(obj => obj.subtopicId == name)
    tableData[index].isActive = target.checked ? "Y" : "N"
    this.setState({ tableData });
  }


  // handle change date
  handleChangeDate(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    var tableData = [...this.state.tableData];
    var index = tableData.findIndex(obj => obj.subtopicId == name)
    tableData[index].compDate = value
    this.setState({ tableData });
  }


  //handle change remarks
  handleChangeRemark(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    var tableData = [...this.state.tableData];
    var index = tableData.findIndex(obj => obj.subtopicId == name)
    tableData[index].remarks = value
    this.setState({ tableData });
  }


  // Save/ Update Data function
  SaveOrUpdateData() {

    if (this.state.batchId == "" || this.state.batchId == undefined || this.state.selectedYear == '' || this.state.selectedYear == undefined || this.state.selectedModuleId == '' || this.state.selectedModuleId == undefined) {
      alert('Each field is mandatory!');
    }

    else {
      let isSaved = true
      let isUpdated = true
      this.state.tableData.map((value, id) => {

        if (value.Id != '' && value.Id != undefined) {
          if (!value.disabledStatus) {
            saveCourseCovrageDatawithId(value.Id, UserContext.userid, this.state.batchId, value.isActive, value.subtopicId, this.state.selectedModuleId,
              this.state.createdDate, value.remarks, value.compDate).then((jsondata) => {
                let resultSave = jsondata.status
                if (resultSave === "success" && (isUpdated)) {
                  // alert('Data Updated Successfully!')
                  isUpdated = false
                }
              })
          }
        }
        else if (!(UserContext.userid == '' || UserContext.userid == undefined || this.state.batchId == ''
          || this.state.batchId == undefined || this.state.selectedModuleId == '' || this.state.selectedModuleId == undefined || value.isActive == '' || value.isActive == undefined
          || value.subtopicId == '' || value.subtopicId == undefined || this.state.createdDate == '' || this.state.createdDate == undefined
          || value.compDate == '' || value.compDate == undefined)) {
          saveCourseCovrageData(UserContext.userid, this.state.batchId, value.isActive, value.subtopicId, this.state.selectedModuleId,
            this.state.createdDate, value.remarks || '', value.compDate).then((jsondata) => {
              let resultSave = jsondata.status
              if (resultSave === "success" && (isSaved)) {
                alert('Data saved successfully!')
                isSaved = false
              }
              else {
                // console.log('')
              }
            })
        }

      })
    }
    // setTimeout(() => { this.props.history.push({ pathname: '/dashboard/courseCoverageTracker', state: {} }) }, 2500)
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <form >
          <Grid container>
            <Grid item xs={12}>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Center Name</InputLabel>
              <SingleSelect
                name="centerId" id="centerId"
                key={this.state.centerId || ''}
                options={this.state.center}
                value={this.state.centerId || ''}
                onChange={this.handleCenterChange.bind(this, 'centerId')}
                helperText={this.state.errors.centerId != undefined ? this.state.errors.centerId.label : ''}
                error={this.state.errors.centerId != undefined ? this.state.errors.centerId.value : ''}
              />
            </Grid>

            <Grid item xs={12} sm={2}></Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Batch Name</InputLabel>
              <SingleSelect
                isClearable
                name="batchId" id="batchId"
                options={this.state.batchs}
                value={this.state.batchId || ''}
                onChange={this.handleBatchChange.bind(this, 'batchId')}
                helperText={this.state.errors.batchId != undefined ? this.state.errors.batchId.label : ''}
                error={this.state.errors.batchId != undefined ? this.state.errors.batchId.value : ''}
                key={this.state.batchId || ''}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Year</InputLabel>
              <SingleSelect isClearable={true} onChange={this.handleSelectChangeyear.bind(this, 'selectedYear')}
                name="selectedYear" id="selectedYear"
                value={this.state.selectedYear || ''}
                helperText={this.state.errors.selectedYear != undefined ? this.state.errors.selectedYear.label : ''}
                error={this.state.errors.selectedYear != undefined ? this.state.errors.selectedYear.value : ''}
                options={this.state.year}
                key={this.state.selectedYear}
                disabled={(this.state.batchId == '' || this.state.batchId == undefined) ? true : false}
              />
            </Grid>

            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={4}>

              <InputLabel shrink={true} >Module</InputLabel>
              <SingleSelect isClearable={true} onChange={this.handleSelectChangemodule.bind(this, 'selectedModule')}
                name="selectedModule" id="selectedModule"
                value={this.state.selectedModule || ''}
                helperText={this.state.errors.selectedModule != undefined ? this.state.errors.selectedModule.label : ''}
                error={this.state.errors.selectedModule != undefined ? this.state.errors.selectedModule.value : ''}
                options={this.state.module}
                key={this.state.selectedModule}

              />
            </Grid>
          </Grid>
          <br />
          <br />

          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Sub Module</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Completion Date</TableCell>
                <TableCell>Remarks</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.tableData.map((dataValue, id) => (
                <TableRow id="tablerow">
                  <TableCell>
                    {id + 1}
                  </TableCell>

                  <TableCell>{dataValue.subtopicName}</TableCell>

                  <TableCell>
                    <Checkbox
                      checked={(dataValue.isActive == "Y" || dataValue.isActive == 'Y') ? true : false}
                      onChange={this.handleCheckChange}
                      name={dataValue.subtopicId}
                      color="primary"
                      id="checked"
                      //  helperText = {this.state.errors.checked != undefined ? this.state.errors.checked.label : '' } 
                      //  error = {this.state.errors.checked != undefined ? this.state.errors.checked.value : '' }
                      disabled={dataValue.disabledStatus}
                    />
                    <InputLabel shrink={true} style={{ color: "red" }} >
                      {(dataValue.isActive == "" || dataValue.isActive == undefined) ? 'In-Active' : ''}
                    </InputLabel>
                  </TableCell>

                  <TableCell>
                    <Input type="date" name={dataValue.subtopicId}
                      onChange={this.handleChangeDate}
                      value={dataValue.compDate}
                      //  helperText = {this.state.tableError[id] != undefined ? this.state.tableError[id].label : '' } 
                      error={(dataValue.compDate == "" || dataValue.compDate === undefined) ? true : false}
                      //    onMouseOut={this.SaveOrUpdateData}
                      disabled={dataValue.disabledStatus}
                    />
                    <InputLabel shrink={true} style={{ color: "red" }} >
                      {(dataValue.compDate == "" || dataValue.compDate === undefined) ? 'This field is compulsary' : ''}
                    </InputLabel>
                  </TableCell>

                  <TableCell>
                    <Input type="Data" name={dataValue.subtopicId}
                      onChange={this.handleChangeRemark}
                      // onMouseOut={this.handleChangeRemark}
                      value={dataValue.remarks}
                      disabled={dataValue.disabledStatus}
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <br />
          <Grid item xs={12} sm={2}>
            <Button variant="contained" color="primary" onClick={this.SaveOrUpdateData}
              disabled={false}
            >Save</Button>
          </Grid>
        </form>
      </div>
    )
  }
}