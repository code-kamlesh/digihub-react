import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import Settings from "../views/Settings";
import UserProfile from "../views/UserProfile";
import ChangePassword from "../views/ChangePassword";
import Dashboard from "@material-ui/icons/Dashboard";
const changePasswordRoutes = [

  {
    path: "/",
    name: "Change Password",
    icon: Dashboard,
    component: ChangePassword,
    layout: "/dashboard",
    status: true
  },
  
]

export default changePasswordRoutes ;