import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import FundManeger from "../views/FundManger";
import Settings from "../views/Settings";
import UserProfile from "../views/UserProfile";
import ChangePassword from "../views/ChangePassword";

const funderRoutes = [

  
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
      path: "/funder",
      name: "Funder",
      icon: Store,
      component: FundManeger,
      layout: "/dashboard",
      status: true
    }

]

export default funderRoutes ;