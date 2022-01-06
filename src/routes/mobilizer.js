import Dashboard from "@material-ui/icons/Dashboard";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import DashboardPage from "./../views/DashboardPageAssessor.js";
import beneficiaryListPage from "./../views/BeneficiaryList";
import UserProfile from "./../views/UserProfile";
import ChangePassword from "./../views/ChangePassword";
import addOrUpdateBeneficiary from "./../views/AddOrUpdateBeneficiary.js";
import Settings from "./../views/Settings";
import Reports from "./../views/Reports";
import DropoutManagement from "../views/DropoutManagement";
const mobilizerRoutes = [ 
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
    name: "",
   // icon: Update,
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
  }
];

export default mobilizerRoutes;
