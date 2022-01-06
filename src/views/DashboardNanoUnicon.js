import React, {useEffect,useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Store from "@material-ui/icons/Store";
import Accessibility from "@material-ui/icons/Accessibility";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from '@material-ui/core/Button';
import styles from "./dashboardStyle.js";
import GridItem from "../components/Grid/GridItem.js";
import GridContainer from "../components/Grid/GridContainer.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardIcon from "../components/Card/CardIcon.js";
import CardFooter from "../components/Card/CardFooter.js";
import UserContext from '../components/GolbalContext'
import { fetchBatchDetailsForBatchOwner,findNumberOfBeneficiaryInCenterByStatus} from './../util/api';

const useStyles = makeStyles(styles);
export default function DashboardPage()    {
  const classes = useStyles();
    const [totalstudents, setStudentCount] = useState(0);
    const [shortlistedstudents, setShortlistedStudentCount] = useState(0);
    const [tobereviewdstudents, settobereviewedStudentCount] = useState(0);
    const [recommondedstudents, setrecommondedStudentCount] = useState(0);
    const [enrolledstudents, setenrolledStudentCount] = useState(0);
    const [studentInfo, setStudentInfo] = useState(0);
    const [refreshDate, setRefreshDate] = useState("");
  
    
    useEffect(() => {
  
  
    fetchBatchDetailsForBatchOwner(UserContext.userid,UserContext.centerId).then((jsondata) => {     
      let activeBatches = JSON.parse(jsondata.data);
    });
  
    findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Mobilised').then((jsondata) => {     
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
  
      if(beneficiaryDetails.length>0){
        var date = beneficiaryDetails[0].refreshDate.date;
        var time = beneficiaryDetails[0].refreshDate.time;
        setRefreshDate(date.day+"-"+date.month+"-"+date.year +"   "+time.hour+":"+time.minute+":"+time.second);
      }
  
      setShortlistedStudentCount(beneficiaryDetails.length);
    });
  
  
    findNumberOfBeneficiaryInCenterByStatus(UserContext.centerId,'Recommended').then((jsondata) => {     
      let beneficiaryDetails = JSON.parse(jsondata.data);
      
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
              <Link style = {{color : 'white'}} to="/dashboard/batchedetails" >  Create Batch </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" size="small">  
              <Link style = {{color : 'white'}} to="/dashboard/managebatches" >  Manage Batches  </Link>
            </Button>
          </Card>                   
        </GridItem>

        
      </GridContainer>

     
      </div>
    );
}