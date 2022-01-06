/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import styles from "./sidebarStyle.js";
//import DashboardNavbarLinks from "./../components/Navbars/DashboardNavbarLinks.js";
import {Link} from 'react-router-dom';
const useStyles = makeStyles(styles);


export default function Sidebar(props) {
  const classes = useStyles();



  const { logo, logoText, routes } = props;
  
  function activeRoute(routeName) {
    
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
       
        listItemClasses = classNames({
            [" " + classes.blue]: activeRoute(prop.layout + prop.path)
          });
        
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
        });
        return (
          <NavLink
            to={prop.layout + prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                />
              )}
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses)}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  
  
  var brand = (
    <div className={classes.logo}>
      {/* <a
        href="https://www.tatastrive.com"
        className={classNames(classes.logoLink)}
        target="_blank"
      > */}

<Link  className={classNames(classes.logoLink)} to={{pathname: '/dashboard/dashboard'}}>
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
        </Link>
      {/* </a> */}

    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand} 
          <div className={classes.sidebarWrapper}>
          
            {links}
          </div>
          <div className={classes.background} />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={"left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper)
          }}

        >
        {brand} 
        <div className={classes.sidebarWrapper}>{links}</div>
        <div className={classes.background} />
        </Drawer>
      </Hidden>
    </div>
  );

}


Sidebar.propTypes = {
    handleDrawerToggle: PropTypes.func,
    logo: PropTypes.string,
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool
  };