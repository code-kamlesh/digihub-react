import React from 'react';
import { Grid, InputLabel, Input, Button } from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import { getUdyogMitraAndSkillInstitute,fetchSkillMithraByIdAndProgramId, findInformalCourses, saveInformalEnrollmentDetails, fectEnrollmentDetails, findSkillmithraByOrgId, changeStudentStatus } from '../util/api';
import {
  getBusinessCaseDocument, getExperienceDetails, getBasicDetails, getAddressData, getFamilyData, getBusinessCaseData, getExistingBusiness,
  validateInterestInventory, getSocioEconomicData, validateEducationData, validateSingleCounselData, validateEndDate, validateStartDate
} from './../util/validation';


//since there are only two center types so this is constant 
const centerType = [
  //{ value: 'skillmithra', label: 'Skill Mithra' },
  { value: 'skillinginstitute', label: 'Skilling Institute' },
  { value: 'udhyogmithra', label: 'Udhyog Mithra' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' }
];

export default class CourseEnrollment extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      availaibleCenters: [],
      selectedCenterType: '',
      selectedAvailableCenter: '',
      endDate: '',
      startDate: '',
      errors: {},
      selectedCourseName: '',
      courseNameOptions: [],
      orgId: '',
      courseId: '',
      engagementId: props.engagementId,
      batchId: '0',
      createdBy: UserContext.userid,
      disableSelects: false,
      disableAll: false,
      res: {},
      linkedEngagementId: props.linkedEngagementId,
      dbUserId: props.id
    }
    //find informal courses so options filled are centerType and CoursesAvailable
    findInformalCourses().then((jsondata) => {
      let res = JSON.parse(jsondata.data)
      res.forEach((value) => {
        this.setState({
          courseNameOptions: [...this.state.courseNameOptions,
          {
            'label': value.name,
            'value': value.name,
            'courseId': value.id
          }]
        })
      })
    })
    //if user has already saved enrollment then fetch the details and auto populate the values
    fectEnrollmentDetails(this.state.engagementId).then((jsondata) => {
      let savedData = JSON.parse(jsondata.data)
      savedData = savedData[0]
      //if data is present then unload the data orgId, courseId etc and fetch the appropriate details
      if (savedData != undefined) {
        this.setState({
          orgId: savedData.orgId,
          batchId: savedData.batchId,
          createdBy: savedData.createdBy
        })
        //fetching the courseName from available courses by courseId from courseNameOptions
        this.state.courseNameOptions.forEach((course) => {
          if (savedData.courseId == course.courseId) {
            this.setState({
              selectedCourseName: course.value,
              courseId: course.courseId
            })
          }
        })
        this.state.disableAll = false;
        this.state.disableSelects = false;
        let startDate = new Date(savedData.startDate)
        let endDate = new Date(savedData.endDate)
        let today = new Date()
        // today = today.getFullYear() + "-" + (((today.getMonth() + 1) < 10) ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + ((today.getDate() < 10) ? "0" + today.getDate() : today.getDate());
        //disable all the selects + start Date incase date is lesser than today 
        // (startDate < today) ? this.setState({ disableSelects: true }) : this.setState({ disableSelects: false })
        // console.log(startDate.getDate()+1," today ", today.getDate()+1 ," end ", endDate.getDate()+1)
        // console.log(today+1," Startdate ",  startDate+1 ," end ", endDate+1,"")
        let diff = today.getDate() > startDate.getDate()  ?  today.getDate() - startDate.getDate()  : startDate.getDate() - today.getDate()
        // // console.log(30 - diff)
        let dateDiff = 31- diff
        // console.log(dateDiff) 
        // console.log("Start Date ",startDate.getDate()-1)
        // console.log("today Date ",(31-(today.getDate()-6)))
       
        let currentDay = new Date(startDate);
        console.log("Start ",currentDay)

        let today1 = new Date();
        today1.setDate(today.getDate() + 3);
        console.log("today ",today1)

        // let nextday1 = currentDay.setDate(startDate.getDate() + 4);
        var nextday1 = new Date(startDate);
        nextday1.setDate(startDate.getDate() + 3);
        console.log("Current day ",nextday1)
        // let nextday2 = currentDay.setDate(startDate.getDate() + 5);

        const diffTime = Math.abs(nextday1 - currentDay);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        console.log(diffDays);
        // console.log("First + ",(30-(today.getDate()- startDate.getDate())))
        // console.log("Second ",(30-(today.getDate()- startDate.getDate()))<=3)
        // if (dateDiff>7)  && diffDays < 5
        // || startDate < nextday1
        // startDate < today ||
        if( startDate < today || diffDays<4){
          console.log("Hello1")
          this.setState({
            disableSelects: true
          })
          console.log("Hello 2")
        }
        //disable all the selects + start Date incase date is lesser than today 
        // (startDate < today) ? this.setState({ disableSelects: true }) : this.setState({ disableSelects: false })
        if (endDate < today) {
          //console.log('disable All')
          this.setState({
            disableAll: true
          })
        }
        //In js month of any date when converted comes one month back so to avoid this code is written as +1 eg month[0] = "January"
        //getting the dates in proper format to populate the data i.e. yyyy-MM-dd
        
        startDate = startDate.getFullYear() + "-" + (((startDate.getMonth() + 1) < 10) ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "-" + ((startDate.getDate() < 10) ? "0" + startDate.getDate() : startDate.getDate());
        endDate = endDate.getFullYear() + "-" + (((endDate.getMonth() + 1) < 10) ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + ((endDate.getDate() < 10) ? "0" + endDate.getDate() : endDate.getDate())
        this.setState({
          startDate,
          endDate
        })
        //if orgId is present fetch all the orgName, enterType from findskillmithraByOrgId
        if (this.state.orgId != undefined || this.state.orgId != '') {
          getUdyogMitraAndSkillInstitute(this.state.orgId).then((jsondata) => {
            let response = JSON.parse(jsondata.data)
            response = response[0]
            if (response) {
              this.setState({
                selectedAvailableCenter: response.organizationName,
                selectedCenterType: response.orgType
              })
            }
            //options from getUdyogMitraAndSkillInstitute to be populated in the option in availableCenters
            fetchSkillMithraByIdAndProgramId(this.state.selectedCenterType,UserContext.defaultProgramId).then((jsondata) => {
              let res = JSON.parse(jsondata.data)
              if (res) {
                res.forEach((value) => {
                  this.setState({
                    availaibleCenters: [...this.state.availaibleCenters,
                    {
                      'label': value.organizationName,
                      'value': value.organizationName,
                      'orgId': value.orgId
                    }]
                  })
                })
              }
            })
          })
        }
      }
    })
    //validate if the prior data is filled or not
    if (UserContext.defaultProgramId != 1) {
      this.validateData();
    }
  }

  componentDidUpdate() {
    //this.handleselectedCenterType.bind(this, 'selectedCenterType')
    this.handleStartDate = this.handleStartDate.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.validateEndDate = this.validateEndDate.bind(this)
    this.validateStartDate = this.validateStartDate.bind(this)
    this.writeEmptyError = this.writeEmptyError.bind(this)
    this.verify = this.verify.bind(this)
  }

  
  validateStartDate(){
    let dateError = validateStartDate(this.state.startDate)
    if (dateError) {
      this.setState({
        errors: {
          ...this.state.errors,
          startDate: {
            'label': dateError,
            'value': true
          }
        }
      })
      return true
    }
  }

  validateEndDate(){
    let dateError = validateEndDate(this.state.endDate)
    if (dateError) {
      this.setState({
        errors: {
          ...this.state.errors,
          endDate: {
            'label': dateError,
            'value': true
          }
        }
      })
      return true
    }
  }

  //if anything comes as empty this is the error
  writeEmptyError(fieldname, error){
    this.setState({
      errors: {
        ...this.state.errors,
        [fieldname]: {
          'label': error,
          'value': true
        }
      }
    })
  }

  validateData() {

    getFamilyData(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['family']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });

    getExperienceDetails(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['experience']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });
    getBasicDetails(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['basic']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });
    validateInterestInventory((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ? this.state.linkedEngagementId : this.state.engagementId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['inventory']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });
    getAddressData(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['address']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });

    getSocioEconomicData(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['socio']: result
        }
      })
      if (result) {
        this.setState({
          disableSelects: true,
          disableAll: true
        })
      }
    });

    validateEducationData(this.state.engagementId, this.state.dbUserId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['education']: result
        }
      })
      if(result){
        this.setState({
          disableSelects : true,
          disableAll : true
        })
      }
    });

    validateSingleCounselData(this.state.engagementId).then(result => {
      this.setState({
        res: {
          ...this.state.res, ['Single Counselling']: result
        }
      })
     //console.log(result)
      if(result){
        this.setState({
          disableSelects : true,
          disableAll : true
        })
      }
    });

  }

verify() {
    //console.log(this.state)
    let isEmpty = '';
    let count = 0
    if(this.state.disableSelects){
        //For End Date if field is empty
        if (this.state.endDate == undefined || this.state.endDate === 'NaN-NaN-NaN') {
          this.writeEmptyError('endDate','Field cannot be empty')
          isEmpty = isEmpty + ' End Date \n '
        }
        else {
              this.validateEndDate(this.state.endDate) ?  (isEmpty = isEmpty + ' End Date \n') : (isEmpty = isEmpty + '')
        }
    }
    else{    
        //checking if the fields are empty or any error present
        //For Center Type if field is empty 
        if (this.state.selectedCenterType == undefined || this.state.selectedCenterType === '' || this.state.errors?.selectedCenterType?.value) {
          if(this.state.errors?.selectedCenterType?.value){
            this.writeEmptyError('selectedCenterType',this.state.errors.selectedCenterType.label)  
            count+=1
          }
          else{
            this.writeEmptyError('selectedCenterType','Field cannot be empty')
            isEmpty = isEmpty + ' Center Type \n '
          }
        }
        //For Availaible Center if field is empty 
        if (this.state.selectedAvailableCenter == undefined || this.state.selectedAvailableCenter === '' || this.state.orgId === undefined || this.state.orgId === '' || this.state.errors?.selectedCenterType?.value) {
          if(this.state.errors?.selectedAvailableCenter?.value){
            this.writeEmptyError('selectedAvailableCenter',this.state.selectedAvailableCenter.label)
            count+=1
          }
          else{
            this.writeEmptyError('selectedAvailableCenter','Field cannot be empty')
            isEmpty = isEmpty + ' Availaible Center \n '
          }
        }
        //For Course Name if field is empty 
        if (this.state.selectedCourseName === undefined || this.state.selectedCourseName === '' || this.state.courseId === undefined || this.state.courseId === '' || this.state.errors?.selectedCourseName?.value) {
          if(this.state.errors?.selectedCourseName?.value){
            this.writeEmptyError('selectedCourseName',this.state.selectedCourseName.label)
            count+=1
          }
          else{
            this.writeEmptyError('selectedCourseName','Field cannot be empty')
            isEmpty = isEmpty + ' Course Name \n '
          }
        }
        //For Start Date if field is empty
        if (this.state.startDate == undefined || this.state.startDate === 'NaN-NaN-NaN' || this.state.errors?.startDate?.value) {
          if(this.state.errors?.startDate?.value){
            this.writeEmptyError('startDate',this.state.errors.startDate.label)
            count+=1
          }
          else{
            this.writeEmptyError('startDate','Field cannot be empty')
            isEmpty = isEmpty + ' Start Date \n '
          }
        }
        //For End Date if field is empty
        if (this.state.endDate == undefined || this.state.endDate === 'NaN-NaN-NaN' || this.state.errors?.endDate?.value) {
          if(this.state.errors?.endDate?.value){
            this.writeEmptyError('endDate',this.state.errors.endDate.label)
            count+=1
          }
          else{
            this.writeEmptyError('endDate','Field cannot be empty')
            isEmpty = isEmpty + ' End Date \n '
          }
        }
    }
    if (isEmpty || count>0) {
      if(isEmpty){
        alert("Please Fill in the Following values\n" + isEmpty)
      }
      else{
        alert("There are one or more errors in the fields!")
      }
      
    }
    else {
      //console.log(this.state)
      //alert('hurray!!')
      let statusChangeData = '"engagementId":' + this.state.engagementId + ',"status":"enrolled", "updatedBy":' + UserContext.userid + '';
      //api call for saving the information   
      saveInformalEnrollmentDetails(this.state.engagementId, '0', this.state.courseId, UserContext.userid, this.state.startDate, this.state.endDate, this.state.orgId).then((jsondata) => {
        //let result = jsondata.status
        let resultSave = jsondata.status
        if(resultSave==="success"){
            //console.log('hello')
            //api to change the status to enrolled
        changeStudentStatus(statusChangeData).then((jsondata) => {
            let resultStatus = jsondata.status
            if (resultSave === "success" && resultStatus === "success") {
              alert("Successfully Enrolled")
              setTimeout(() => { this.props.history.push({ pathname: '/dashboard/managebeneficiary', state: {} }) }, 3000)
            }
            else {

              alert("Data not saved/updated successfully, Please try again!")
              //console.log('try again \n' + this.state)
            }
          })
        }
        else{
            alert("Both Start date and End date are Mandatory!")
        }
        })
    }
  }


  handleStartDate(event) {
    let dateError = validateStartDate(event.target.value)
    this.setState({
      [event.target.name]: event.target.value,
      endDate: '',
      errors: {
        ...this.state.errors,
        [event.target.name]: {
          'label': dateError ? dateError : '',
          'value': dateError ? true : false
        }
      }
    })
  }

  handleEndDate(event) {
    let dateError = validateEndDate(event.target.value)
    this.setState({
      [event.target.name]: event.target.value,
      errors: {
        ...this.state.errors,
        [event.target.name]: {
          'label': dateError ? dateError : '',
          'value': dateError ? true : false
        }
      }
    })
  }

  handleselectedCenterType(selectname, value) {
    this.setState({
      [selectname]: value,
      availaibleCenters: [],
      selectedAvailableCenter: '',
      selectedCourseName: '',
      courseId: '',
      orgId: '',
      errors: {
        ...this.state.errors,
        selectedCenterType: {
          'label': '',
          'value': false
        },
        selectedAvailableCenter: {
          'label': 'Please select some option',
          'value': true
        },
        selectedCourseName: {
          'label': 'Please select some option',
          'value': true
        }
      }
    })
    fetchSkillMithraByIdAndProgramId(value,UserContext.defaultProgramId).then((jsondata) => {
      let result = jsondata.data
      result = JSON.parse(result)
      result.forEach((center) => {
        this.setState({
          availaibleCenters: [...this.state.availaibleCenters,
          {
            'label': center.organizationName,
            'value': center.organizationName,
            'orgId': center.orgId
          }]
        })
      })
    })
  }

  handleSelectedAvailableCenter(selectname, value) {
    let orgId = ''
    this.state.availaibleCenters.forEach((center) => {
      if (center.label == value || center.value == value) {
        orgId = center.orgId;
      }
    })
    this.setState({
      [selectname]: value,
      orgId: orgId,
      selectedCourseName: '',
      courseId: '',
      errors: {
        ...this.state.errors,
        selectedAvailableCenter: {
          'label': '',
          'value': false
        },
        selectedCourseName: {
          'label': 'Please select some option',
          'value': true
        }
      }
    })
  }

  handleSelectedCourseName(selectname, value) {
    let courseId = ''
    this.state.courseNameOptions.forEach((course) => {
      if (course.label == value || course.value == value) {
        courseId = course.courseId
      }
    })
    this.setState({
      [selectname]: value,
      courseId: courseId,
      errors: {
        ...this.state.errors,
        selectedCourseName: {
          'label': '',
          'value': false
        }
      }
    })
  }

  render() {
    let res = [];
    if (this.state.res.basic) {
      res.push("Basic details");
      //console.log(this.state.res)
    }
    if (this.state.res.address) {
      res.push("Address details");
      //console.log(this.state.res)
    }
    if (this.state.res.family) {
      res.push("Family details");
      //console.log(this.state.res)
    }
    if (this.state.res.experience) {
      res.push("Experience details");
      //console.log(this.state.res)
    }
    if (this.state.res.bc) {
      res.push("Business case details");
      //console.log(this.state.res)
    }
    if (this.state.res.document) {
      res.push("Business case document not uploaded");
      //console.log(this.state.res)
    }
    if (this.state.res.ob) {
      res.push("Observations details");
      //console.log(this.state.res)
    }
    if (this.state.res.inventory) {
      res.push("Interest Inventory details");
      //console.log(this.state.res)
    }
    if (this.state.res.existingBusiness) {
      res.push("Existing Business details");
      //console.log(this.state.res)
    }
    if (this.state.res.socio) {
      res.push("SocioEconomic details");
      //console.log(this.state.res)
    }
    if (this.state.res.education) {
      res.push("Education details");
      //console.log(this.state.res)
    }
    if (this.state.res.Counselling) {
      res.push("Counselling details");
      //console.log(this.state.res)
    }
    //console.log(res)
    return (
      <div style={{ width: '100%' }}>

        {(res.length != 0) && <div>Below details are incomplete</div>}
        <ul> {res.map((item) => (
          <li><h4 style={{ fontWeight: "600", color: "red" }}> {item}</h4></li>
        ))}
        </ul>
        {/* {console.log(this.state)} */}

        <form onSubmit={this.verify}>
          <Grid container>

            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Center Type</InputLabel>
              <>
                <SingleSelect isClearable={true}
                  name="selectedCenterType" options={centerType}
                  onChange={this.handleselectedCenterType.bind(this, 'selectedCenterType')}
                  value={this.state.selectedCenterType || ''}
                  key={this.state.selectedCenterType || ''}
                  id="selectedCenterType" helperText={this.state.errors.selectedCenterType != undefined ? this.state.errors.selectedCenterType.label : ''}
                  error={this.state.errors.selectedCenterType != undefined ? this.state.errors.selectedCenterType.value : ''}
                  disabled={this.state.disableSelects ? true : false} />
              </>
            </Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Available Centers</InputLabel>
              <>
                <SingleSelect isClearable={true}
                  name="selectedAvailableCenter" options={this.state.availaibleCenters || ''}
                  onChange={this.handleSelectedAvailableCenter.bind(this, 'selectedAvailableCenter')}
                  value={this.state.selectedAvailableCenter || ''}
                  key={this.state.selectedAvailableCenter || ''}
                  id="selectedAvailableCenter" helperText={this.state.errors.selectedAvailableCenter != undefined ? this.state.errors.selectedAvailableCenter.label : ''}
                  error={this.state.errors.selectedAvailableCenter != undefined ? this.state.errors.selectedAvailableCenter.value : ''}
                  disabled={this.state.disableSelects ? true : false} />
              </>
            </Grid>

          </Grid>
          <br />
          <br />
          <Grid container>
            <Grid item xs={12} sm={4}>
              <InputLabel shrink={true} >Courses Available</InputLabel>
              <>
                <SingleSelect isClearable={true}
                  name="selectedCourseName" options={this.state.courseNameOptions}
                  onChange={this.handleSelectedCourseName.bind(this, 'selectedCourseName')}
                  value={this.state.selectedCourseName || ''}
                  key={this.state.selectedCourseName || ''}
                  id="selctedCourseName" helperText={this.state.errors.selectedCourseName != undefined ? this.state.errors.selectedCourseName.label : ''}
                  error={this.state.errors.selectedCourseName != undefined ? this.state.errors.selectedCourseName.value : ''}
                  disabled={this.state.disableSelects ? true : false} />
              </>
            </Grid>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={2}>
              <InputLabel shrink={true} >Start Date</InputLabel>
              <>
                <Input type="date" name="startDate" id="startDate"
                  value={this.state.startDate || ''}
                  onChange={this.handleStartDate}
                  // error={this.state.errors.startDate != undefined ? this.state.errors.startDate.value : ''}
                  //helperText={this.state.errors.startDate != undefined ? this.state.errors.startDate.label : ''}
                  disabled={this.state.disableSelects ? true : false} />
              </>
              <InputLabel shrink={true} style={{ color: "red" }}>{this.state.errors.startDate != undefined ? this.state.errors.startDate.label : ''}</InputLabel>
            </Grid>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={2}>
              <InputLabel shrink={true} >End Date </InputLabel>
              <>
                <Input type="date" name="endDate" id="endDate"
                  value={this.state.endDate || ''}
                  onChange={this.handleEndDate}
                  error={this.state.errors.endDate != undefined ? this.state.errors.endDate.value : ''}
                  //helperText={this.state.errors.endDate != undefined ? this.state.errors.endDate.label : ''}
                  disabled={this.state.disableAll ? true : false} />
              </>
              <InputLabel shrink={true} style={{ color: "red" }}>{this.state.errors.endDate != undefined ? this.state.errors.endDate.label : ''}</InputLabel>
            </Grid>

            <Grid item xs={12} sm={1}></Grid>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" onClick={this.verify} disabled={this.state.disableAll ? true : false}>submit</Button>
            </Grid>
          </Grid>
        </form>

      </div>
    );
  }
}