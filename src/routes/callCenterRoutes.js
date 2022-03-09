import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import StudentMigration from "../views/StudentMigration";
import Settings from "../views/Settings";
import UserProfile from "../views/UserProfile";
import ChangePassword from "../views/ChangePassword";
import PlacementDetailsSubPlaced from "../views/PlacementDetailsSubPlaced";
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
      path: "/StudentMigration",
      name: "Student Migration",
      icon: Store,
      component: StudentMigration,
      layout: "/dashboard",
      status: true
    },
    { 
      path: "/PlacementDetailsSubPlaced",
      name: "Placement Details SubPlaced",
      icon: Store,
      component: PlacementDetailsSubPlaced,
      layout: "/dashboard",
      status: true
    }
    // PlacementDetailsSubPlaced
]

export default funderRoutes ;