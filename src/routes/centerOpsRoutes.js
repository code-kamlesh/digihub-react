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
import LocalOffer from "@material-ui/icons/LocalOffer";
import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
// core components/views for Admin layout
import DashboardPage from "./../views/DashboardPageAssessor.js";
import beneficiaryListPage from "./../views/BeneficiaryList";
import UserProfile from "./../views/UserProfile";
import ChangePassword from "./../views/ChangePassword";
import addOrUpdateBeneficiary from "./../views/AddOrUpdateBeneficiary.js";
import BusinessEvaluation from "./../views/BusinessEvaluation";
import batchManagementPage from "./../views/BatchManagement.js";
import Batch from "./../views/BatchDetails.js";
import ShortlistCandidates from "./../views/ShortlistCandidates.js";
import Settings from "./../views/Settings";
import MyBatches from "./../views/MyBatches";
import AllBatches from "./../views/AllBatches";
import Reports from "./../views/Reports";
import UserContext from "../components/GolbalContext.js";
import Dropout from "../views/DropoutDetails";
import DropoutManagement from "../views/DropoutManagement";
import Attendance from "../views/Attendance";
import BulkUpload from "../views/BulkUpload";
import History from "../views/History";
import StudentMigration from "../views/StudentMigration";
import PrintIDCards from "../views/PrintIDCards";



//alert("idd"+UserContext.centerId);

const centerOpsRoutes = [

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
    status: true // done for forget password (true)
  },
  {
    path: "/addobeneficiary",
    name: "Add Beneficiary",
    icon: Update,
    component: addOrUpdateBeneficiary,
    layout: "/dashboard",
    status: false
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
    path: "/managebatches",
    name: "Manage Batches",
    icon: Store,
    component: batchManagementPage,
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
    path: "/addobeneficiary",
    name: "Add Beneficiary",
    icon: Update,
    component: addOrUpdateBeneficiary,
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
  },{
    path: "/businessevaluation",
    name: "Business Evaluation",
    icon: Store,
    component: BusinessEvaluation,
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
    path: "/allBatches",
    name: "All Batches",
    icon: LocalOffer,
    component: AllBatches,
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
    path: "/dropout",
    name: "Drop out",
    icon: Store,
    component: Dropout,
    layout: "/dashboard",
    status: false
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
    path: "/bulkupload",
    name: "Bulk Upload",
    icon: Store,
    component: BulkUpload,
    layout: "/dashboard",
    status: true
  },
  {
    path: "/History",
    name: "History",
    icon: Store,
    component: History,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/StudentMigration",
    name: "Student Migration",
    icon: Store,
    component:StudentMigration,
    layout: "/dashboard",
    status: true
  },

  {
    path: "/PrintIdCard",
    name: "Print ID Cards",
    icon: Store,
    component: PrintIDCards,
    layout: "/dashboard",
    status: true
  }

  
];

export default centerOpsRoutes;
