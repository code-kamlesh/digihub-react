import React, { Component,useEffect,useState} from 'react';


//import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
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
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import styles from "./dashboardStyle.js";
import GridItem from "./../components/Grid/GridItem.js";
import GridContainer from "./../components/Grid/GridContainer.js";
import Card from "./../components/Card/Card.js";
import CardHeader from "./../components/Card/CardHeader.js";
import CardIcon from "./../components/Card/CardIcon.js";
import CardBody from "./../components/Card/CardBody.js";
import CardFooter from "./../components/Card/CardFooter.js";
import Table from "./../components/Table/Table.js";
import UserContext from './../components/GolbalContext'

import { CommunicationCallMerge } from 'material-ui/svg-icons';
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import { fetchBatchDetailsForBatchOwner,findNumberOfBeneficiaryInCenterByStatus} from './../util/api';
const useStyles = makeStyles(styles);
var mobilizedcount =1;

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var reportDate = new Date();
reportDate.setDate(reportDate.getDate() - 1);

export default function  ChangeLeaderPage()
{

  const [NumberOfShortlistedBeneficiary, setNumberOfShortlistedBeneficiary] = useState(0);
  const [NumberOfMobilisedBeneficiary, setNumberOfMobilisedBeneficiary] = useState(0);
  const [NumberOfEnrolledBeneficiary, setNumberOfEnrolledBeneficiary] = useState(0);
  const [refreshDate, setRefreshDate] = useState("");


  useEffect(() => {

    fetchBatchDetailsForBatchOwner(UserContext.userid,UserContext.centerId).then((jsondata) => {     
      let activeBatches = JSON.parse(jsondata.data);
    // setTotalBatches(activeBatches.length);
    });

    findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Mobilised').then((jsondata) => {     
      let beneficiaryDetails = JSON.parse(jsondata.data);
      if(beneficiaryDetails.length>0){
      var date = beneficiaryDetails[0].refreshDate.date;
      var time = beneficiaryDetails[0].refreshDate.time;
      setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
    }
    setNumberOfMobilisedBeneficiary(beneficiaryDetails.length);
    });

    findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Enrolled').then((jsondata) => {     
      let beneficiaryDetails = JSON.parse(jsondata.data);

      if(beneficiaryDetails.length>0){
        var date = beneficiaryDetails[0].refreshDate.date;
        var time = beneficiaryDetails[0].refreshDate.time;
        setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
      }

      setNumberOfEnrolledBeneficiary(beneficiaryDetails.length);
    });


    findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Shortlisted').then((jsondata) => {     
      let beneficiaryDetails = JSON.parse(jsondata.data);
      
      if(beneficiaryDetails.length>0 ){
        var date = beneficiaryDetails[0].refreshDate.date;
        var time = beneficiaryDetails[0].refreshDate.time;
        setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
      }
      
      setNumberOfShortlistedBeneficiary(beneficiaryDetails.length);
    });

    



  }, []);





    const classes = useStyles();
 
        return (
        <div>

Note : Detail as of {refreshDate}
<br/>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  {/* <Cloud /> */}
                </CardIcon>
                <p className={classes.cardCategory}>No Of Students Mobilised</p>
                <h3 className={classes.cardTitle}>
                  {NumberOfMobilisedBeneficiary}
                </h3>
              </CardHeader>
                {/*  <CardFooter stats>
               <div className={classes.stats}>
                  <Warning />
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                      Get more space </a> 
                </div> 
              </CardFooter> */}
             </Card>
            </GridItem>

            <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  {/* <Cloud /> */}
                </CardIcon>
                <p className={classes.cardCategory}>No Of Students Enrolled</p>
                <h3 className={classes.cardTitle}>
                  {NumberOfEnrolledBeneficiary}
                </h3>
              </CardHeader>
                {/*  <CardFooter stats>
               <div className={classes.stats}>
                  <Warning />
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                      Get more space </a> 
                </div> 
              </CardFooter> */}
             </Card>
            </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                {/* <Code/> */}
              </CardIcon>
              <p className={classes.cardCategory}>No Of Shortlisted Students</p>
              <h3 className={classes.cardTitle}>{NumberOfShortlistedBeneficiary}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
 <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link to="/dashboard/managebeneficiary" style={{ color: 'white' }}>  Manage Beneficiary  </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link to="/dashboard/addobeneficiary" style={{ color: 'white' }}>  Add Beneficiary  </Link>
            </Button>
          </Card>                   
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link to="/dashboard/managebatches" style={{ color: 'white' }}>  Manage Batches  </Link>
            </Button>
          </Card>                   
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link to="/dashboard/mybatches" style={{ color: 'white' }}>  My Batches  </Link>
            </Button>
          </Card>                   
        </GridItem>
        
      </GridContainer>

        {/* <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
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
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
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
          </GridItem>
        </GridContainer> */}

        </div>
    );
         

}
