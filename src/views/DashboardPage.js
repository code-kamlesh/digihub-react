import React, { Component } from 'react';


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
import GridItem from "./../components/Grid/GridItem.js";
import GridContainer from "./../components/Grid/GridContainer.js";
import Card from "./../components/Card/Card.js";
import CardHeader from "./../components/Card/CardHeader.js";
import CardIcon from "./../components/Card/CardIcon.js";
import CardBody from "./../components/Card/CardBody.js";
import CardFooter from "./../components/Card/CardFooter.js";
import Table from "./../components/Table/Table.js";
import UserContext from './../components/GolbalContext'
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles(styles);
const courseDetails = [];
const appError = '';


function callme()
    {
        
        
    }

export default function DashboardPage()    {

  console.log("Funder mappping")
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
                <p className={classes.cardCategory}>Customer</p>
                <h3 className={classes.cardTitle}>
                  {UserContext.firstName}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Warning />
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                      Get more space </a>
                </div>
              </CardFooter>
             </Card>
            </GridItem>
          <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Process</p>
              <h3 className={classes.cardTitle}>{UserContext.lastName} </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Code/>
              </CardIcon>
              <p className={classes.cardCategory}>Learning</p>
              <h3 className={classes.cardTitle}>{UserContext.roleName}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Finance</p>
              <h3 className={classes.cardTitle}>{UserContext.centerName}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>  
            <Button variant="contained" color="primary" >  
              <Link to="/dashboard/managebeneficiary" >  Manage Beneficiary  </Link>
            </Button>
          </Card>                   
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
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
        </GridItem>

        
      </GridContainer>

      <GridContainer>
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
        </GridContainer>
      </div>
    );
}

//export default DashboardPage;