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
import DashboardPage from "./../views/DashboardPagePrincipal.js";
import beneficiaryListPage from "./../views/BeneficiaryList";
import UserProfile from "./../views/UserProfile";
import ChangePassword from "./../views/ChangePassword";
import addOrUpdateBeneficiary from "./../views/AddOrUpdateBeneficiary.js";
import BusinessEvaluation from "./../views/BusinessEvaluation";
import Recommend from "./../views/Recommend";
import Settings from "./../views/Settings";
import StudentMigration from "./../views/StudentMigration";
const principalRoutes = [
  
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
    path: "/updatebeneficiary",
    name: "",
    //icon: Update,
    component: addOrUpdateBeneficiary,
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
  },{
    path: "/businessevaluation",
    name: "Business Evaluation",
    icon: Store,
    component: BusinessEvaluation,
    layout: "/dashboard",
    status: false
  },
  {
    path: "/recommend",
    name: "Recommendation",
    icon: Store,
    component: Recommend,
    layout: "/dashboard",
    status: true
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
    path: "/StudentMigration",
    name: "Student Migration",
    icon: Store,
    component: StudentMigration,
    layout: "/dashboard",
    status: true
  },
  
];

export default principalRoutes;
