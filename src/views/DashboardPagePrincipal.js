import React, { Component,useEffect,useState } from 'react';


//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
// @material-ui/icons

import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Button from '@material-ui/core/Button';
import styles from "./dashboardStyle.js";
import GridItem from "../components/Grid/GridItem.js";
import GridContainer from "../components/Grid/GridContainer.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardIcon from "../components/Card/CardIcon.js";
import CardBody from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter.js";
import Table from "../components/Table/Table.js";
import UserContext from '../components/GolbalContext'
import { mergeClasses } from '@material-ui/styles';
import { fetchBatchDetailsForBatchOwner,findNumberOfBeneficiaryInCenterByStatus} from './../util/api';

const useStyles = makeStyles(styles);
const courseDetails = [];
const appError = '';




export default function DashboardPage()    {

  const [totalstudents, setStudentCount] = useState(0);
  const [shortlistedstudents, setShortlistedStudentCount] = useState(0);
  const [tobereviewdstudents, settobereviewedStudentCount] = useState(0);
  const [recommondedstudents, setrecommondedStudentCount] = useState(0);
  const [enrolledstudents, setenrolledStudentCount] = useState(0);
  const [studentInfo, setStudentInfo] = useState(0);
  const [refreshDate, setRefreshDate] = useState("");

  
  useEffect(() => {
  //   let studentInfo=[];
  //   let requestFormData = new FormData();  
  //   requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenter", "data" : [{"centerId":'+UserContext.centerId+'}]}');
  //   fetch("http://playground.tatastrive.com/sservices-v1/engagement",{
  //   method: "POST",
  //   body: requestFormData,
  //   })
  //     .then(response => response.json()).then((jsondata)=>{   
  //         let  studentDetails = JSON.parse(jsondata.data);       
          
  //         setenrolledStudentCount(studentDetails.length);  
  //         setStudentInfo(studentDetails)  
  //         });

    
  //   requestFormData = new FormData();  
  //   requestFormData.append('data', '{"token" : "", "action" : "countByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"enrolled"}]}');
  //   fetch("http://playground.tatastrive.com/sservices-v1/engagement",{
  //   method: "POST",
  //   body: requestFormData,
  //   })
  //     .then(response => response.json()).then((jsondata)=>{   
  //         let  studentDetails = jsondata.data;       
          
  //         setStudentCount(studentDetails);    
  //         });

  //   requestFormData = new FormData();  
  //   requestFormData.append('data', '{"token" : "", "action" : "countByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"mobilised"}]}');
  //   fetch("http://playground.tatastrive.com/sservices-v1/engagement",{
  //   method: "POST",
  //   body: requestFormData,
  //   })
  //     .then(response => response.json()).then((jsondata)=>{   
  //         let  studentDetails = jsondata.data;       
  //         setInterestedStudentCount(studentDetails);
              
  //         });
    
  //   requestFormData = new FormData();  
  //   requestFormData.append('data', '{"token" : "", "action" : "countByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"recommend"}]}');
  //   fetch("http://playground.tatastrive.com/sservices-v1/engagement",{
  //   method: "POST",
  //   body: requestFormData,
  //   })
  //     .then(response => response.json()).then((jsondata)=>{   
  //         let  studentDetails = jsondata.data;       
  //         setrecommondedStudentCount(studentDetails);
              
  //         });

  //   requestFormData = new FormData();  
  //   requestFormData.append('data', '{"token" : "", "action" : "countByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"shortlisted"}]}');
  //   fetch("http://playground.tatastrive.com/sservices-v1/engagement",{
  //   method: "POST",
  //   body: requestFormData,
  //   })
  //     .then(response => response.json()).then((jsondata)=>{   
  //         let  studentDetails = jsondata.data;       
  //         settobereviewedStudentCount(studentDetails);
              
  //         });         

  // },


  fetchBatchDetailsForBatchOwner(UserContext.userid,UserContext.centerId).then((jsondata) => {     
    let activeBatches = JSON.parse(jsondata.data);
  // setTotalBatches(activeBatches.length);
  });

  findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Mobilised').then((jsondata) => {     
  //  alert(JSON.stringify(jsondata));
    let beneficiaryDetails = JSON.parse(jsondata.data);
    if(beneficiaryDetails.length>0){
    var date = beneficiaryDetails[0].refreshDate.date;
    var time = beneficiaryDetails[0].refreshDate.time;
    setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
  }
  setStudentCount(beneficiaryDetails.length);
  });

  findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Shortlisted').then((jsondata) => {     
    let beneficiaryDetails = JSON.parse(jsondata.data);
    //alert(JSON.stringify(jsondata));
    if(beneficiaryDetails.length>0){
      var date = beneficiaryDetails[0].refreshDate.date;
      var time = beneficiaryDetails[0].refreshDate.time;
      setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
    }

    setShortlistedStudentCount(beneficiaryDetails.length);
  });


  findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Recommended').then((jsondata) => {     
    let beneficiaryDetails = JSON.parse(jsondata.data);
   // alert(JSON.stringify(jsondata));
    if(beneficiaryDetails.length>0 ){
      var date = beneficiaryDetails[0].refreshDate.date;
      var time = beneficiaryDetails[0].refreshDate.time;
      setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
    }
    
    setrecommondedStudentCount(beneficiaryDetails.length);
  });

  
  findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Enrolled').then((jsondata) => {     
    let beneficiaryDetails = JSON.parse(jsondata.data);
    
    if(beneficiaryDetails.length>0){
      var date = beneficiaryDetails[0].refreshDate.date;
      var time = beneficiaryDetails[0].refreshDate.time;
      setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
    }
    
    setenrolledStudentCount(beneficiaryDetails.length);
  });


},
   []);


  
  const classes = useStyles();
  

    return (  
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Cloud />
                </CardIcon>
                <p className={classes.cardCategory}>Total Number of students</p>
                <h3 className={classes.cardTitle}>
                  {totalstudents}
                </h3>
              </CardHeader>
               <CardFooter stats>
                {/* <div className={classes.stats}>
                  <Warning />
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                      Get more space </a>
                </div> */}
              </CardFooter> 
             </Card>
            </GridItem>
          <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Shortlisted Students</p>
              <h3 className={classes.cardTitle}>{shortlistedstudents} </h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Code/>
              </CardIcon>
              <p className={classes.cardCategory}>Enrolled Students</p>
              <h3 className={classes.cardTitle}>{enrolledstudents}</h3>
            </CardHeader> 
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Recommonded Students</p>
              <h3 className={classes.cardTitle}>{recommondedstudents}</h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <Update />
                Just Updated
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link style = {{color : 'white'}} to="/dashboard/managebeneficiary" >  Manage Beneficiary  </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link style = {{color : 'white'}} to="/dashboard/recommend" >  Recommendation </Link>
            </Button>
          </Card>                   
        </GridItem>

        {/* <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" >  
              <Link to="/dashboard/addobeneficiary" >  Add Beneficiary  </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" >  
              <Link to="/dashboard/observation" >  Manage Observations </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" >  
              <Link to="/dashboard/managebatches" >  Manage Batches  </Link>
            </Button>
          </Card>                   
        </GridItem> */}

        
      </GridContainer>

      <GridContainer>
        {/* <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              </CardBody>
            </Card>
        </GridItem> */}
        {/* <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem> */}
        </GridContainer>
      </div>
    );


    
}

//export default DashboardPage;