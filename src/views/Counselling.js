import React, { Component, Fragment } from 'react';
import { useState } from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'
import { makeStyles } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Link,

} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { FormControl, InputLabel, Input, Grid, TextField } from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import InterestInventory from './InterestInventory'
import {
  fetchUserDocuments, fetchInterestInventoryCode, saveCounsellingDetails, fetchCounsellingDetails,
  fetchCoursesByHollandCode, fetchQualificationDetails, changeStudentStatus, fetchStudentDetailsByEngagementId,
  fetchCenterActiveCourses, fetchCourseDetailsByIds
} from './../util/api';
//import MasterData from './../components/MasterData.js'
import { serviceEndPoint } from './../util/serviceEndPoint';
import RefreshIcon from '@material-ui/icons/Refresh';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AlertDialog from './../util/AlertDialog';
import { isNotEmpty, validateTextField } from './../util/validation';

import underscore from 'underscore';
import { checkButton, validateToRecommend, getBusinessCaseDocument, getInterestInventory, getExperienceDetails, getBasicDetails, getAddressData, getFamilyData, getObservationData, getBusinessCaseData, getExistingBusiness, getSocioEconomicData, validateEducationData, validateSingleCounselData } from './../util/validation';
const alertDialogOptions = {
  message: ''
}

function setCode(str) {
  alert(str);
}
class Counselling extends Component {
  constructor(props) {
    super(props);
    //alert(props.history);
    this.myData = {
      qual: [],
      course: []
    };
    this.state = {
      finalCourse: "", courseData: [], reason: '', beneficiaryStatus: '', res: {}, code: '', history: props.history, result: localStorage.getItem("result"), dbUserId: props.id, name: '', basicData: {
        createdBy: UserContext.userid,
        mobilizedBy: UserContext.userid
      }, address: { createdBy: UserContext.userid, 'isActive': 'Y', 'status': 'Y', 'type': 'H' }, gameFlag: false,
      engagementId: props.engagementId, interestInventoryDocId: 0, linkedEngagementId: props.linkedEngagementId,
      rating: [
        { value: 'StrongPositive', label: 'Strong Positive' },
        { value: 'Positive', label: 'Positive' },
        { value: 'Neutral', label: 'Neutral' },
        { value: 'Negative', label: 'Negative' },
        { value: 'StrongNegative', label: 'Strong Negative' }
      ],
      status: [
        { value: 'Shortlisted', label: 'Shortlisted' },
        { value: 'Rejected', label: 'Rejected' }
      ],

      reasons: [
        { value: 'Other', label: 'Other' },
        { value: 'Not Interested', label: 'Not Interested' },
        { value: 'Got other job', label: 'Got other job' },
        { value: 'Health Issues', label: 'Health Issues' },
        { value: 'Moved to other place', label: 'Moved to other place' },
        { value: 'Not Eligible', label: 'Not Eligible' },
        { value: 'Marriage', label: 'Marriage' },
        { value: 'Higher Education', label: 'Higher Education' },
        { value: 'Maternity', label: 'Maternity' }
      ],

      coursesOfHollandCode: [],
      firstCounsellorComments: '', secondCounsellorComments: '', parentCounsellorComments: '',
      firstCounsellorRating: '', secondCounsellorRating: '', parentCounsellorRating: '',
      firstCounselorSuggestedCourse: '', secondCounselorSuggestedCourse: '', firstCounselorId: '', secondCounselorId: 0,
      alertDialogFlag: false,
      errors: {
        firstCounsellorComments: '', firstCounsellorRating: '', firstCounselorSuggestedCourse: '',
        secondCounsellorComments: '', secondCounsellorRating: '', secondCounselorSuggestedCourse: ''
      }, isSubmit: false
    };
    this.updatedData = { firstName: '' };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    //alert(UserContext.userid);
    this.getMasters()
    this.getInterestInventoryDetails();
    this.validateMandatoryData();
    this.getBasicData(this.state.dbUserId);
    fetchStudentDetailsByEngagementId(this.state.engagementId).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      this.setState({ beneficiaryStatus: jsonobjects[0].status });
      const objStatus = { 'value': jsonobjects[0].status, 'label': jsonobjects[0].status };
      this.setState({ status: underscore.uniq([...this.state.status, objStatus], true, "label") });
      this.setState({ remarks: jsonobjects[0].remarks });
      this.setState({ reason: jsonobjects[0].reason });

    });

    fetchCenterActiveCourses(UserContext.centerId).then((jsondata) => {
      let courseDetails = [];
      let centerActiveCourses = JSON.parse(jsondata.data);
      centerActiveCourses.map(item => { courseDetails.push({ id: item.courseId }) });
      this.getCourseMasters(JSON.stringify(courseDetails));
    });
  }


  getBasicData(id) {

    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "' + "viewBeneficiaryDetailsById" + '", "data" : [{"dbUserId" : ' + id + '}]}');
    try {
      return fetch(serviceEndPoint.studentServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + UserContext.token
        },
        body: formData
      }).then(response => response.json()).then((jsondata) => {
        console.log(jsondata);
        if (jsondata.appError == null) {
          let jsonobjects = JSON.parse(jsondata.data);
          this.setState({ name: jsonobjects[0].firstName + " " + jsonobjects[0].lastName });

        }
      })

    } catch (error) {

    }
  }

  validateMandatoryData() {
    getFamilyData(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['family']: result
      }
    }));
    getExperienceDetails(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['experience']: result
      }
    }));
    getBasicDetails(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['basic']: result
      }
    }));
    getInterestInventory((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId : this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['inventory']: result
      }
    }));
    getAddressData(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['address']: result
      }
    }));
    getSocioEconomicData(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['socio']: result
      }
    }));
    validateEducationData(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['education']: result
      }
    }));
  }

  getInterestInventoryDetails = (event) => {
    fetchUserDocuments((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.props.linkedEngagementId : this.props.engagementId, "InterestInventory", 'P').then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      if (jsonobjects != '') {
        this.setState({ interestInventoryDocId: jsonobjects[0].basicDocId });
      }
    });

    fetchInterestInventoryCode((UserContext.defaultProgramId == 1 || UserContext.defaultProgramId == 9) ? this.state.linkedEngagementId : this.state.engagementId).then((jsondata) => {
      let interestInventoryDetails = JSON.parse(jsondata.data);
      if (interestInventoryDetails[0] != null) {
        this.setState({ code: interestInventoryDetails[0].finalScore });

        fetchCoursesByHollandCode(interestInventoryDetails[0].finalScore).then((jsonHollandCodeData) => {
          let jsonHollandCodeObjects = JSON.parse(jsonHollandCodeData.data);
          jsonHollandCodeObjects.map(item => { this.state.coursesOfHollandCode.push({ label: (item.course).toString(), value: (item.course).toString() }) });
        });
      }
    });

    fetchCounsellingDetails(UserContext.defaultProgramId == 1 ? this.state.linkedEngagementId : this.state.engagementId).then((jsondata) => {
      let counsellingDetails = JSON.parse(jsondata.data);
      if (counsellingDetails[0] != null) {
        this.setState({ firstCounsellorComments: counsellingDetails[0].firstCounselorComments });
        this.setState({ firstCounsellorRating: counsellingDetails[0].firstCounselorRating });

        if (typeof counsellingDetails[0].secondCounselorComments != 'undefined') {
          this.setState({ secondCounsellorComments: counsellingDetails[0].secondCounselorComments });
        }

        if (typeof counsellingDetails[0].secondCounselorRating != 'undefined') {
          this.setState({ secondCounsellorRating: counsellingDetails[0].secondCounselorRating });
        }

        if (typeof counsellingDetails[0].secondCounselorSuggestedCourse != 'undefined') {
          this.setState({ secondCounselorSuggestedCourse: counsellingDetails[0].secondCounselorSuggestedCourse });
        }
        this.setState({ parentCounsellorComments: counsellingDetails[0].parentCounsellingComments });
        this.setState({ parentCounsellorRating: counsellingDetails[0].parentCounsellingRating });
        this.setState({ firstCounselorSuggestedCourse: counsellingDetails[0].firstCounselorSuggestedCourse });
        this.setState({ firstCounselorId: counsellingDetails[0].firstCounselorId });
        this.setState({ secondCounselorId: counsellingDetails[0].secondCounselorId });
        this.setState({ finalCourse: counsellingDetails[0].finalCourse });
      }
    });


  }

  getCourseMasters(ids) {
    fetchCourseDetailsByIds(ids).then((jsondata) => {
      console.log(jsondata);
      if (jsondata.appError == null) {
        let jsonobjects = JSON.parse(jsondata.data);
        jsonobjects.map(item => {
          this.myData.course.push({ label: item.name, value: item.name })
        })
        //    this.setState({courseData : jsonobjects});
        this.setState({ courseData: this.myData.course });
      }
      return (true);
    }).then(response => response);
  }

  handleInputChange(event) {

    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      basicData: {
        ...this.state.basicData,
        [name]: value
      }
    })

  }
  handleSelectChange(selectname, event) {
    this.setState({
      basicData: {
        ...this.state.basicData,
        [selectname]: event
      }
    })
    //alert(JSON.stringify(this.state));

  }

  handleFinalCourseSelectChange(selectname, event) {
    this.setState({ [selectname]: event })
  }

  handleFirstCounsellingFormInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    this.validateFirstCounsellingData(name, value);
    console.log("im here at validation the comment")
    validateTextField(value);
  }

  handleFirstCounsellingFormSelectChange(selectname, event) {
    this.setState({ [selectname]: event });
    this.validateFirstCounsellingData(selectname, event);
  }

  // Allow only alphanumeric value
  // handleRemarksInputChange
  handleRemarksInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    // console.log("im here at validating")
    // console.log(value)
    this.validateRemarksData(name, value);

  }




  handleSecondCounsellingFormInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    this.validateSecondCounsellingData(name, value);
  }

  handleSecondCounsellingFormSelectChange(selectname, event) {
    this.setState({ [selectname]: event });
    this.validateSecondCounsellingData(selectname, event);
  }

  handleParentCounsellingFormInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    // handle commnet which contain number and text
    // console.log("I here at parent")
    this.validateParentCounsellingData(name, value)
  }

  handleParentCounsellingFormSelectChange(selectname, event) {
    this.setState({ [selectname]: event });
  }

  handleStatusSelectChange(selectname, event) {
    if (event === "Shortlisted") {
      this.setState({ [selectname]: event });
      if (UserContext.defaultProgramId == 11 && this.state.firstCounselorId != "") {
        this.state.isSubmit = false;
      }
      else {
        if (this.state.firstCounselorId != "" && this.state.secondCounselorId != 0) {
          this.setState({ isSubmit: false });
        }
        else {
          this.setState({ isSubmit: true });
        }
      }
      //unreacheable 
      //console.log("if event is shortlisted "+this.state.isSubmit)
    }
    else {
      this.setState({ isSubmit: false });
      this.setState({ [selectname]: event });
      //console.log("if event is NOT shortlisted "+this.state.isSubmit)
    }
    //console.log("Normal things "+this.state.isSubmit)
  }

  handleReasonSelectChange(selectname, event) {
    this.setState({ [selectname]: event });
  }

  validateFirstCounsellingData = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'firstCounsellorComments': errors.firstCounsellorComments = validateTextField(value);
        break;
      case 'firstCounsellorRating': errors.firstCounsellorRating = validateTextField(value);
        break;
      case 'firstCounselorSuggestedCourse': errors.firstCounselorSuggestedCourse = validateTextField(value);
        break;
      default:
        break;
    }

    this.setState({ errors });
  }

  validateSecondCounsellingData = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'secondCounsellorComments': errors.secondCounsellorComments = validateTextField(value);
        break;
      case 'secondCounsellorRating': errors.secondCounsellorRating = validateTextField(value);
        break;
      case 'secondCounselorSuggestedCourse': errors.secondCounselorSuggestedCourse = validateTextField(value);
        break;
      default:
        break;
    }

    this.setState({ errors });
  }

  // 
  validateRemarksData = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'remarks': errors.RemarksComments = validateTextField(value)
    }
  }

  validateParentCounsellingData = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'parentCounsellorComments': errors.parentCounsellingComments = validateTextField(value)
        console.log(errors.parentCounsellingComments)
    }
  }

  validateFirstCounsellingForm = (errors) => {
    this.validateFirstCounsellingData("firstCounsellorComments", this.state.firstCounsellorComments);
    this.validateFirstCounsellingData("firstCounsellorRating", this.state.firstCounsellorRating);
    //  this.validateFirstCounsellingData("firstCounselorSuggestedCourse",this.state.firstCounselorSuggestedCourse);
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  validateSecondCounsellingForm = (errors) => {


    this.validateSecondCounsellingData("secondCounsellorComments", this.state.secondCounsellorComments);
    this.validateSecondCounsellingData("secondCounsellorRating", this.state.secondCounsellorRating);
    // this.validateSecondCounsellingData("secondCounselorSuggestedCourse",this.state.secondCounselorSuggestedCourse);
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }


  saveCounsellingDetails = (event) => {
    event.preventDefault();


    //    this.validateFirstCounsellingForm(this.state.errors);
    //  this.validateForm(this.state.errors);


    if (this.validateFirstCounsellingForm(this.state.errors) && this.state.firstCounselorId === "") {
      this.setState({ alertDialogFlag: false });
      let engagementId = UserContext.centerId == 760 ? this.props.linkedEngagementId : this.props.engagementId;
      let firstCounselorName = this.state.firstCounselorId === "" ? UserContext.userid : this.state.firstCounselorId;

      let data = '{"engagementId":' + engagementId + ',"firstCounselorComments":"' + this.state.firstCounsellorComments +
        '","firstCounselorRating":"' + this.state.firstCounsellorRating + '","firstCounselorSuggestedCourse":"' + this.state.firstCounselorSuggestedCourse + '","firstCounselorId":"' + firstCounselorName +
        '","parentCounsellingComments":"' + this.state.parentCounsellorComments +
        '","parentCounsellingRating":"' + this.state.parentCounsellorRating + '","parentCounselorId":"' + UserContext.userid + '","finalCourse":"' + this.state.finalCourse + '"}';
      saveCounsellingDetails(data).then((jsondata) => {
        alertDialogOptions.message = <span style={{ color: "green" }}>Counselling Comments Saved Successfully</span>;
        this.setState({ alertDialogFlag: true });

      });

    }



    if (this.state.firstCounselorId != "" && this.state.firstCounselorId != UserContext.userid) {
      if (this.validateSecondCounsellingForm(this.state.errors)) {
        this.setState({ alertDialogFlag: false });
        let secondCounselorId = this.state.secondCounselorId == 0 ? UserContext.userid : this.state.secondCounselorId;

        let engagementId = UserContext.centerId == 760 ? this.props.linkedEngagementId : this.props.engagementId;
        let data = '{"engagementId":' + engagementId + ',"firstCounselorComments":"' + this.state.firstCounsellorComments +
          '","firstCounselorRating":"' + this.state.firstCounsellorRating + '","firstCounselorSuggestedCourse":"' + this.state.firstCounselorSuggestedCourse + '","firstCounselorId":"' + this.state.firstCounselorId +
          '","secondCounselorComments":"' + this.state.secondCounsellorComments + '","secondCounselorRating":"' + this.state.secondCounsellorRating + '","secondCounselorSuggestedCourse":"' + this.state.secondCounselorSuggestedCourse +
          '","secondCounselorId":"' + secondCounselorId + '","parentCounsellingComments":"' + this.state.parentCounsellorComments +
          '","parentCounsellingRating":"' + this.state.parentCounsellorRating + '","parentCounselorId":"' + UserContext.userid + '","finalCourse":"' + this.state.finalCourse + '"}';
        saveCounsellingDetails(data).then((jsondata) => {
          alertDialogOptions.message = <span style={{ color: "green" }}>Counselling Comments Saved Successfully</span>;
          this.setState({ alertDialogFlag: true });
          this.getInterestInventoryDetails();

        });
      }
    }
  }


  mySubmitHandler = (event) => {
    event.preventDefault();
  }

  getMasters() {
    fetchQualificationDetails().then((jsondata) => {
      console.log(jsondata);
      if (jsondata.appError == null) {
        let jsonobjects = JSON.parse(jsondata.data);
        jsonobjects.map(item => {
          this.myData.qual.push({ label: item.qualification, value: (item.id).toString() })
        })
      }
      return (true);
    }).then(response => response);
  }

  goToGame() {

    window.open(<InterestInventory />, '_blank');

  }

  gameStart() { this.setState({ gameFlag: true }); }
  gameStop() {
    this.setState({ gameFlag: false });
    this.getInterestInventoryDetails();
    getInterestInventory(this.state.engagementId, this.state.dbUserId).then(result => this.setState({
      res: {
        ...this.state.res, ['inventory']: result
      }
    }));
  }

  downloadInterestInventoryDocument = (value) => {
    let formData = new FormData();
    formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":' + this.state.interestInventoryDocId + '}]}');
    fetch(serviceEndPoint.documentServiceEndPoint, {
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + UserContext.token },
      body: formData
    }).then(response => response.json()).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      var url = process.env.REACT_APP_API_ENDPOINT + "Downloads/" + jsonobjects[0].documentPath + "";
      window.open(url, "_blank");

    });
  }

  getInterestInventoryCode = (event) => {
    this.getInterestInventoryDetails();

  }


  changeStudentStatus = (event) => {
    event.preventDefault();
    let statusChangeData = '"engagementId":' + this.state.engagementId + ',"status":"' + this.state.beneficiaryStatus + '","reason":"' + this.state.reason + '","remarks":"' + this.state.remarks + '","updatedBy":"' + UserContext.userid + '"';
    changeStudentStatus(statusChangeData).then((jsondata) => {
      alertDialogOptions.message = <span style={{ color: "green" }}>Data Saved Sucessfully</span>;
      this.setState({ alertDialogFlag: true });
      setTimeout(() => { this.props.history.push({ pathname: '/dashboard/managebeneficiary', state: {} }) }, 3000)
    });
  }


  render() {

    let res = [];
    if (this.state.res.basic) {
      res.push("Basic data");
    }
    if (this.state.res.address) {
      res.push("Address details");
    }
    if (this.state.res.socio) {
      res.push("SocioEconomic details");
    }
    if (this.state.res.education) {
      res.push("Education details");
    }
    if (this.state.res.family) {
      res.push("Family details");
    }
    if (this.state.res.experience) {
      res.push("Experience details");
    }
    if (this.state.res.inventory) {
      res.push("Interest Inventory");
    }

    const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
    let button;

    if (dbUserId) {
      button = <Button variant="contained" type="submit" color="primary">
        Mobilise
      </Button>;
    } else {
      button = <Button type="submit" variant="contained" color="secondary">Update</Button>;
    }


    return (
      <div style={{ width: '100%' }}>
        {
          (res.length != 0) && <div>Below details are incomplete</div>
        }
        <ul> {res.map((item) => (
          <li><h4 style={{ fontWeight: "600", color: "red" }}> {item}</h4></li>
        ))}
        </ul>


        <form onSubmit={this.mySubmitHandler} method="post">
          <Grid container spacing={2}>
            <Grid item xs={4} sm={3}>
              <FormControl>
                <InputLabel for="aadharNo">Interest Inventory</InputLabel>
                <Input type="text" name="code" id="code" readonly onChange={this.handleInputChange} value={this.state.code || ''} />
              </FormControl>
              <RefreshIcon color="primary" size="small" onClick={this.getInterestInventoryCode}></RefreshIcon>
            </Grid>
            {this.state.interestInventoryDocId === 0 &&
              <Grid item xs={4} sm={3}>
                <FormControl>
                  <Button variant="contained" color="primary" size="small" onClick={this.gameStart.bind(this)} disabled={UserContext.roleid == 3 ? true : false}>Play Game</Button>
                </FormControl>
              </Grid>
            }

            {this.state.interestInventoryDocId != 0 &&
              <Grid item xs={4} sm={6}>
                <FormControl>
                  <Button variant="contained" color="primary" size="small"><span class="" onClick={this.downloadInterestInventoryDocument.bind(this)}>Download Interest Inventory Document</span></Button>
                </FormControl>
              </Grid>
            }
          </Grid>
        </form>

        {
          this.state.gameFlag &&
          <Fragment>
            <InterestInventory dbUserId={this.state.dbUserId} engagementId={this.state.engagementId} name={this.state.name}></InterestInventory>
            <Button variant="contained" color="primary" size="small" onClick={this.gameStop.bind(this)}>
              Stop/End Game
            </Button>
          </Fragment>
        }

        <br />






        {this.state.isSubmit != 0 &&
          <div style={{ color: 'red' }}>
            first and second counsellor details are mandatory for shortlist
          </div>
        }

        {
          (UserContext.defaultProgramId != 6 && UserContext.defaultProgramId != 8) &&
          <React.Fragment>
            <div style={{ width: '100%' }}>
              <form onSubmit={this.changeStudentStatus} method="post">
                <Paper>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        {this.state.beneficiaryStatus === "Rejected" &&
                          <TableCell>Reason</TableCell>
                        }
                        <TableCell>Comments</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Status</sup>
                          <SingleSelect name="beneficiaryStatus" id="beneficiaryStatus"
                            value={this.state.beneficiaryStatus || ""} onChange={this.handleStatusSelectChange.bind(this, 'beneficiaryStatus')}
                            options={this.state.status}
                            disabled={(this.state.beneficiaryStatus !== 'Shortlisted' && this.state.beneficiaryStatus !== 'Rejected' && this.state.beneficiaryStatus !== 'Mobilised')}
                          />
                        </TableCell>
                        {this.state.beneficiaryStatus === 'Rejected' &&
                          <TableCell component="th" scope="row" style={{ width: 100 }}>
                            <sup>Reason</sup>
                            <SingleSelect name="reason" id="reason"
                              value={this.state.reason} onChange={this.handleReasonSelectChange.bind(this, 'reason')}
                              options={this.state.reasons}
                            />
                          </TableCell>
                        }

                        <TableCell component="th" scope="row" style={{ width: 100 }}>

                          <TextField

                            name="remarks" id="remarks"
                            value={this.state.remarks} maxLength="100"
                            onChange={this.handleRemarksInputChange}
                            multiline
                            rows={0}
                            rowsMax={4}
                            error={this.state.errors.RemarksComments == '' ? false : true}
                            helperText={this.state.errors.RemarksComments}
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <Button type="submit" size="small" variant="contained" color="primary" disabled={this.state.errors.RemarksComments === "" ? false : true}>Save</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <br />

                </Paper>
              </form>
            </div>


            <div style={{ width: '100%', display: res.length != 0 ? 'none' : 'block' }}>
              <form onSubmit={this.saveCounsellingDetails} method="post">
                <Paper >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Comments</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Course</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>First counsellor Comments</sup>
                          <TextField
                            name="firstCounsellorComments" id="firstCounsellorComments"
                            value={this.state.firstCounsellorComments} maxLength="100"
                            onChange={this.handleFirstCounsellingFormInputChange}
                            multiline
                            rows={0}
                            rowsMax={4}
                            variant="outlined"
                            error={this.state.errors.firstCounsellorComments == '' ? false : true}
                            helperText={this.state.errors.firstCounsellorComments}
                            disabled={this.state.firstCounselorId === "" ? false : true}
                          />


                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Rating</sup>
                          <SingleSelect name="firstCounsellorRating" id="firstCounsellorRating"
                            value={this.state.firstCounsellorRating} onChange={this.handleFirstCounsellingFormSelectChange.bind(this, 'firstCounsellorRating')}
                            options={this.state.rating}
                            error={this.state.errors.firstCounsellorRating == '' ? false : true}
                            helperText={this.state.errors.firstCounsellorRating}
                            disabled={this.state.firstCounselorId === "" ? false : true}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Course</sup>
                          <SingleSelect name="firstCounselorSuggestedCourse" id="firstCounselorSuggestedCourse"
                            value={this.state.firstCounselorSuggestedCourse} onChange={this.handleFirstCounsellingFormSelectChange.bind(this, 'firstCounselorSuggestedCourse')}
                            options={this.state.coursesOfHollandCode}
                            error={this.state.errors.firstCounselorSuggestedCourse == '' ? false : true}
                            helperText={this.state.errors.firstCounselorSuggestedCourse}
                            disabled={this.state.firstCounselorId === "" ? false : true}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Second counsellor Comments</sup>

                          <TextField
                            name="secondCounsellorComments" id="secondCounsellorComments"
                            value={this.state.secondCounsellorComments || ""} maxLength="100"
                            onChange={this.handleSecondCounsellingFormInputChange}
                            multiline
                            rows={0}
                            rowsMax={4}
                            variant="outlined"
                            error={this.state.errors.secondCounsellorComments == '' ? false : true}
                            helperText={this.state.errors.secondCounsellorComments}
                            disabled={this.state.firstCounselorId === "" ? true : this.state.firstCounselorId == UserContext.userid ? true : false || this.state.secondCounselorId == 0 ? false : true}
                          />




                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Rating</sup>
                          <SingleSelect name="secondCounsellorRating" id="secondCounsellorRating"
                            value={this.state.secondCounsellorRating} onChange={this.handleSecondCounsellingFormSelectChange.bind(this, 'secondCounsellorRating')}
                            options={this.state.rating}
                            error={this.state.errors.secondCounsellorRating == '' ? false : true}
                            helperText={this.state.errors.secondCounsellorRating}
                            disabled={this.state.firstCounselorId === "" ? true : this.state.firstCounselorId === UserContext.userid ? true : false || this.state.secondCounselorId == 0 ? false : true}

                          />
                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Course</sup>
                          <SingleSelect name="secondCounselorSuggestedCourse" id="secondCounselorSuggestedCourse"
                            value={this.state.secondCounselorSuggestedCourse} onChange={this.handleSecondCounsellingFormSelectChange.bind(this, 'secondCounselorSuggestedCourse')}
                            options={this.state.coursesOfHollandCode}
                            error={this.state.errors.secondCounselorSuggestedCourse == '' ? false : true}
                            helperText={this.state.errors.secondCounselorSuggestedCourse}
                            disabled={this.state.firstCounselorId === "" ? true : this.state.firstCounselorId === UserContext.userid ? true : false || this.state.secondCounselorId == 0 ? false : true}
                          />
                        </TableCell>

                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Parent Counselling Comments</sup>
                          <TextField
                            multiline
                            rows={0}
                            rowsMax={4}
                            variant="outlined"
                            name="parentCounsellorComments" id="parentCounsellorComments"
                            value={this.state.parentCounsellorComments} maxLength="100"
                            onChange={this.handleParentCounsellingFormInputChange}
                            error={this.state.errors.parentCounsellingComments === '' ? false : true}
                            helperText={this.state.errors.parentCounsellingComments}

                          />
                        </TableCell>
                        {/* <p>{this.state.errors.parentCounsellingComments}</p>                    */}
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <sup>Rating</sup>
                          <SingleSelect name="parentCounsellorRating" id="parentCounsellorRating"
                            value={this.state.parentCounsellorRating} onChange={this.handleParentCounsellingFormSelectChange.bind(this, 'parentCounsellorRating')}
                            options={this.state.rating}

                          />
                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                          <SingleSelect onChange={this.handleFinalCourseSelectChange.bind(this, 'finalCourse')} name="finalCourse" id="finalCourse"
                            placeholder="Select Coures"
                            value={this.state.finalCourse || ''}
                            options={this.myData.course}
                          />
                        </TableCell>

                      </TableRow>

                    </TableBody>

                  </Table>
                  <br />
                  <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                    <Button type="submit" size="small" variant="contained" color="primary"
                      disabled={this.state.errors.parentCounsellingComments === "" ? false : true}
                    >Save</Button>
                  </Grid>

                </Paper>
              </form>
            </div>
          </React.Fragment>
        }

        {
          (this.state.alertDialogFlag) && <AlertDialog message={alertDialogOptions.message}></AlertDialog>
        }


      </div>

    );
  }

}
export default Counselling;