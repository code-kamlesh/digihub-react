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
import DashboardPage from "./../views/ChangeLeaderPage";
import addOrUpdateBeneficiary from "./../views/AddOrUpdateBeneficiary.js";
import batchManagementPage from "./../views/BatchManagement.js";
import beneficiaryListPage from "./../views/BeneficiaryList";
import UserProfile from "./../views/UserProfile";
import ChangePassword from "./../views/ChangePassword";
import Batch from "./../views/BatchDetails";
import MyBatches from "./../views/MyBatches";
import Settings from "./../views/Settings";
import BeneficiarySearchPage from "./../views/BeneficiarySearchPage";
import Reports from "./../views/Reports";
import DropoutManagement from "../views/DropoutManagement";
import Attendance from "../views/Attendance";
import CourseCoverageTracker from "../views/CourseCoverageTracker";
import StudentMigration from "../views/StudentMigration";



const changeLeaderRoutes = [
  
  { 
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/mybatches",
    name: "My Batches",
    icon: LocalOffer,
    component: MyBatches,
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
    name: "",
   // icon: Update,
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
    status: false
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
  {
    path: "/beneficiarySearchPage",
    name: "Beneficiary Search",
    icon: Store,
    component: BeneficiarySearchPage,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/reports",
    name: "Reports",
    icon: LocalOffer,
    component: Reports,
    layout: "/dashboard",
    status: true
   },
  {
    path: "/dropoutManagement",
    name: "Dropout Management",
    icon: LocalOffer,
    component: DropoutManagement,
    layout: "/dashboard",
    status: true
   },
  {
    path: "/attendance",
    name: "Attendance",
    icon: Store,
    component: Attendance,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/CourseCoverageTracker",
    name: "CourseCoverageTracker",
    icon: Store,
    component: CourseCoverageTracker,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/StudentMigration",
    name: "Student Migration",
    icon: Store,
    component:StudentMigration,
    layout: "/dashboard",
    status: true
  },

];

export default changeLeaderRoutes;
