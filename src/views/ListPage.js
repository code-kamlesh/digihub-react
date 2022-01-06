import React, { Component } from 'react';


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

const useStyles = makeStyles(styles);
const courseDetails = [];
const appError = '';
export default function DashboardPage()    {

  
    const classes = useStyles();
  
      return (  
        <div>
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
        </GridContainer>
        </div>
    );
}