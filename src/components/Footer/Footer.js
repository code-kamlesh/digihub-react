/*eslint-disable*/
import React, { Component } from 'react';
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import {
  BrowserRouter as Router,
  Link,
  
} from 'react-router-dom';
import styles from "./footerStyle.js";
import { Switch, Route, Redirect } from "react-router-dom";
const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
   
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Link to="/dashboard/ContactUs" className={classes.block}>Contact Us</Link>
            </ListItem>
            |&nbsp;
            <ListItem className={classes.inlineBlock}>
            <Link to="/dashboard/Disclaimer" className={classes.block}>Disclaimer</Link>
            </ListItem>
            |&nbsp;
    
            <ListItem className={classes.inlineBlock}>
            <Link to="/dashboard/privacypolicy" className={classes.block}>Privacy Policy</Link>
            </ListItem>
            |&nbsp;
    
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={classes.block}>
                FAQ
              </a>
            </ListItem>
            |&nbsp;
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://www.tatastrive.com"
              target="_blank"
              className={classes.a}
            >
              Tata STRIVE
            </a>
            
          </span>
        </p>
      </div>    
    </footer>
  
  );
}
