import React from "react";
import ReactToPrint from "react-to-print";
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import blank_image from "./../assets/images/IcardBLOCKImage.PNG";
import head_image from "./../assets/images/tatastrivelogo.png";
import multiple_images_found from "./../assets/images/error_image_sample.jpg";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { TableBody } from '@material-ui/core';
import { fetchBatchDetailsByBatchId,  getReports, fetchCentersDetails, fetchBatchDetails, fetchUserDocuments, fetchEnrollmentDetailsByBatchId } from './../util/api';
import { Grid } from '@material-ui/core';
import UserContext from '../components/GolbalContext';
import { SingleSelect} from "react-select-material-ui";
import { serviceEndPoint } from './../util/serviceEndPoint';



export default class PrintIDCards extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      batchDetailsForBatchOwner: [],
      selectedBatchDetails: [],
      engagementId: [],
      studentDetails: [],
      centerAddress: '',
      urlDetails: [],
      mainArr: [],
    }

    fetchBatchDetails(UserContext.centerId).then((jsondata) => {
      let activeBatches = JSON.parse(jsondata.data)
      activeBatches.map(item => { this.state.batchDetailsForBatchOwner.push({ label: item.batchName, value: item.batchId }) });
    })

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.showData = this.showData.bind(this)
  }


  handleSelectChange(selectname, batchId) {

    //Get Enrollment Details for Batch/ Get Batch Details 
    fetchBatchDetailsByBatchId(batchId).then((batchData) => {
      let batchJsonObjects = JSON.parse(batchData.data);
      this.setState({ selectedBatchDetails: batchJsonObjects });
      fetchCentersDetails("[{\"id\":" + batchJsonObjects[0].centerId + "}]").then((jsondata) => {
        let res = JSON.parse(jsondata.data)
        let address = res[0].addressLine1 + " " + res[0].addressLine2 + " " + res[0].city + ", " + res[0].district + "-" + res[0].pincode + ", " + res[0].state
        this.setState({ centerAddress: address })
      })
    }).catch((error)=>{console.log(error)});

    //Enrollment Details by Batch Id
    fetchEnrollmentDetailsByBatchId(batchId).then((jsondata) => {
      let enrollmentDetails = JSON.parse(jsondata.data);
      this.state.engagementId.length = 0;
      enrollmentDetails.map(item => { this.state.engagementId.push({ engagementId: item.engagementId }) });
      //Get Student Details 
      getReports(1 , 20, UserContext.centerId, this.state.selectedBatchDetails[0].startDate, this.state.selectedBatchDetails[0].endDate, "Enrolled", batchId).then((jsondata)=>{
        let studentInfo = [];
        if (jsondata.data) {
          let studentDetails = JSON.parse(jsondata.data);
          for (var i = 0; i < studentDetails.length; i++) {
            if(studentDetails[i]?.studentEngagementStatus === "Enrolled"){
              var details =
              {
                'engagementId': studentDetails[i].engagementId,
                'studentId': studentDetails[i].studentId,
                'name': studentDetails[i].firstName + " " + studentDetails[i].lastName,
                'bloodGroup' : studentDetails[i].bloodGroup,
                'contact' : studentDetails[i].primaryContactNumber,
                'url' : ''
              };
              studentInfo.push(details);
            }
          }
          this.setState({ studentDetails: [] }, () => { this.setState({ studentDetails: studentInfo }) });
          studentInfo = null;
        }
      }).catch((error)=>{console.log(error)})
    }).catch((error)=>{console.log(error)});

  }

  showData() {
    
    return (
      <div>
        <ReactToPrint
          trigger={() => <Button variant="contained" color="primary">print Id card</Button>}
          content={() => this.componentRef}
        />
        <ComponentToPrint props={this.state} ref={el => (this.componentRef = el)} />
      </div>
    );

  }

  render() {

    return (

      <div>
        <Grid item xs={12} sm={4} alignContent="center" >
          <SingleSelect onChange={this.handleSelectChange.bind(this, 'batchName')} name="batchName" id="batchName"
            placeholder="Select Batch"
            options={this.state.batchDetailsForBatchOwner}
            fullWidth={true}
            style={{ "fontSize": 11 }}
          />
        </Grid>
        <br />
        {
          (this.state.studentDetails.length > 0 ) ? this.showData() : ''
        }
      </div>
    );
  }
}

export class IDCard_Front extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      studentDetails: props.props,
      url: '',
    }
       //download documents
       fetchUserDocuments(this.state.studentDetails.engagementId, "StudentPicture", "G").then((jsondata) => {
        let res = JSON.parse(jsondata.data)
          if(res?.length>1){
            res.map((student, id)=>{
          
              if(student?.isActive == 'Y'){
                let formData = new FormData();
              formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":' + student?.basicDocId + '}]}');
              fetch(serviceEndPoint.documentServiceEndPoint, {
                method: 'post',
                headers: {
                  'Authorization': 'Bearer ' + UserContext.token
                },
                body: formData
              }).then(response => response.json()).then((jsondata) => {
                  let jsonobjects = JSON.parse(jsondata.data);
                  console.log(jsonobjects);
                  var url = serviceEndPoint.downloadDocument + jsonobjects[0].documentPath + "";
                  this.setState({ url }) 
                  console.log(url);
                }).catch((error)=>{console.log(error)})
              }
              else{
                (res?.length == id) ? this.setState({ url : multiple_images_found }) : this.setState({ url : blank_image });
              }
            }) 
          }
          else{
            if(res[0]?.isActive == 'Y'){
              let formData = new FormData();
              formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":' + res[0]?.basicDocId + '}]}');
              fetch(serviceEndPoint.documentServiceEndPoint, {
                method: 'post',
                headers: {
                  'Authorization': 'Bearer ' + UserContext.token
                },
                body: formData
              }).then(response => response.json()).then((jsondata) => {
                  let jsonobjects = JSON.parse(jsondata.data);
                  console.log(jsonobjects);
                  if(jsonobjects.length>1){
                    console.log('in here');
                  }
                  var url = serviceEndPoint.downloadDocument + jsonobjects[0].documentPath + "";
                  this.setState({ url }) 
                }).catch((error)=>{console.log(error)})
            }
            else{
              this.setState({ url : blank_image });
            }
          }
          }).catch((error)=>{console.log(error)});
      
          
      
  }

  render() {

    return (
     
      <Card style={{ width: "300px", height: "500px", transform: 'rotate(90deg)', marginLeft: '150px', padding: '0px' }}>
      <Box border={3} borderRadius="1.75%" style={{ width: "300px", height: "500px"}} >
          <img src={head_image} style={{ height: "120px", width: '80%', marginLeft: '10px', marginTop: '5px', marginBottom: '5px', paddingBottom: '5px' }} />
          <img src={this.state.url || blank_image} style={{ height: "150px", width: '70%', marginLeft: '40px' }} />

          <CardContent >
            <Typography variant="subtitle2" align="center" color="textSecondary" style={{ fontSize: '20px', fontWeight: 'bold'}}>{this.state.studentDetails.studentName}</Typography>
            <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: '18px' }}>Roll No : {this.state.studentDetails.studentId}</Typography>
            <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: '18px' }}>Blood Group : {this.state.studentDetails.bloodGroup}</Typography>
            <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: '18px' }}>Valid Upto : {this.state.studentDetails.endDate}</Typography>
            <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: '18px' }}>Course : {this.state.studentDetails.batchName}</Typography>
          </CardContent>
      </Box>  
      </Card> 
     
    );
  }
}

export class IDCard_back extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      studentDetails: props.props,
    }
  }

  render() {
    return (    
      
      <Card style={{ width: "300px", height: "500px", transform: 'rotate(90deg)', marginLeft: '30px', padding: '0px' }}>
      <Box border={3} borderRadius="1.75%" style={{ width: "300px", height: "500px"}} >
          <CardContent>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '15px'}}>Contact : {this.state?.studentDetails.primaryContactNo}</Typography>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '15px' }}>Card No : {this.state?.studentDetails.studentId}</Typography>
            <br/>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '18px', border: '5px solid ', backgroundColor: '4px solid #194D33' }}>Please Note:</Typography>
            <br/>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '15px' }}>This card is not transferable if found, please send to:  </Typography>
            <br/>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '15px' }}>{this.state?.studentDetails.centerAddress}</Typography>
            <br/>
            <Typography variant="subtitle2" color="primary" style={{ fontSize: '18px', border: '2px solid #000000' }}>To join Tata Strive<br /> Give a missed call on 1800 419 2112 </Typography>
          </CardContent>
      </Box> 
      </Card>
      
    );
  }
}

export class ComponentToPrint extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      studentDetails: props.props.studentDetails,
      centerAddress: props.props.centerAddress,
      selectedBatchDetails: props.props.selectedBatchDetails,
      IDCard_front_details: [],
      IDCard_back_details: [],
    }

    this.state.studentDetails.map((student, id) => {
      this.state.IDCard_front_details[id] = { "engagementId": student.engagementId ,"batchName": this.state.selectedBatchDetails[0].batchName, "endDate": this.state.selectedBatchDetails[0].endDate, "studentName": student.name, "profilePhotoPath": student.url, "bloodGroup": student.bloodGroup, "studentId": student.studentId }
      this.state.IDCard_back_details[id] = { "primaryContactNo": student.contact, "studentId": student.studentId, "centerAddress": this.state.centerAddress}
    })

  }

  render() {
    return (
            <Table>
              <TableBody>

                  {
                    this.state.IDCard_front_details.map((frontDetails, id)=>{
                      return(
                        <TableRow>
                        <TableCell>
                        <IDCard_Front props={frontDetails}/>
                        </TableCell>
                        <TableCell>
                        <IDCard_back props={this.state.IDCard_back_details[id]}/>
                        </TableCell>
                        </TableRow>
                      );
                    })
                  }
            
              </TableBody>
            </Table>
    );
  }
}