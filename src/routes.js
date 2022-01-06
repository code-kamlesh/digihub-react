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

// core components/views for Admin layout
import DashboardPage from "./views/DashboardPage.js";
import ListPage from "./views/ListPage.js";
import DetailsPage from "./views/DetailsPage.js";
import addOrUpdateBeneficiary from "./views/AddOrUpdateBeneficiary.js";
import batchManagementPage from "./views/BatchManagement.js";
import ObservationPage from "./views/Observation.js";
import beneficiaryListPage from "./views/BeneficiaryList";
import Users from "./views/Users";
import CreateUser from "./views/CreateUser";
import educationDetailPage from "./views/Education";
import familyDetailPage from "./views/FamilyDetails";
import experienceDetailPage from "./views/ExperienceDetails";
import InterestInventory from "./views/InterestInventory";
import UserProfile from "./views/UserProfile";
import ChangePassword from "./views/ChangePassword";
import Batch from "./views/BatchDetails";
import FundManger from "./views/FundManger";
import Settings from "./views/Settings";

const dashboardRoutes = [
  
  { 
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/managebeneficiary",
    name: "Manage Beneficiary",
    icon: LocalOffer,
    component: beneficiaryListPage,
    layout: "/dashboard",
    status: true
  },
  
  {
    path: "/addobeneficiary",
    name: "Add Beneficiary",
    icon: Update,
    component: addOrUpdateBeneficiary,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/updatebeneficiary",
    name: "Update Beneficiary",
    icon: Update,
    component: addOrUpdateBeneficiary,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/managebatches",
    name: "Manage Batches",
    icon: Store,
    component: batchManagementPage,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/batchedetails",
    name: "Add Batches",
    icon: Store,
    component: Batch,
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
    path: "/createusers",
    name: "Add Users",
    icon: Store,
    component: CreateUser,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/userprofile",
    name: "User Profile",
    icon: Store,
    component: UserProfile,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/changepassword",
    name: "Change Password",
    icon: Store,
    component: ChangePassword,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/settings",
    name: "Settings",
    icon: Store,
    component: Settings,
    layout: "/dashboard",
    status: false
  },
];

export default dashboardRoutes;
