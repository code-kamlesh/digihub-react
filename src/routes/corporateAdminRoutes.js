/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Users from "./../views/Users";
import CourseManagement from "./../mdm/CourseManagement";
import CreateUser from "./../views/CreateUser";
import corporateAdminDashboard from "./../views/CorporateAdminDashboard";
import Attendance from "../views/Attendance";

const corporateAdminRoutes = [
    { 
        path: "/dashboard",
        name: "Dashboard",
        icon: Dashboard,
        component: corporateAdminDashboard,
        layout: "/dashboard",
        status: true
    },
   {
    path: "/manageusers",
    name: "Manage Users",
    icon: Store,
    component: Users,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/managecourse",
    name: "Manage Course",
    icon: Store,
    component: CourseManagement,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/createusers",
    name: "Add Users",
    icon: Store,
    component: CreateUser,
    layout: "/dashboard",
    status: true
  }
  ,
  {
    path: "/attendance",
    name: "Attendance",
    icon: Store,
    component: Attendance,
    layout: "/dashboard",
    status: true
  }
];

export default corporateAdminRoutes;
