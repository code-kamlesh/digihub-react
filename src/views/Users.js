import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import UserContext from '../components/GolbalContext'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { passwordReset, fetchUsersByCenterId, fetchUserDetailsById } from './../util/api';
import {
  BrowserRouter as Router,
  Link,

} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import {Button,Grid} from '@material-ui/core';


export default function UserManagement() {
  const [state, setState] = React.useState();
  const [rows, setUserDetails] = useState([]);
  let userInfo = [];
  function fetchUserDetailsByCenterId() {
    fetchUsersByCenterId(UserContext.centerId).then((jsondata) => {
      let dbUserId = [];
      let userCenterRoleMap = JSON.parse(jsondata.data);
      userCenterRoleMap.map(item => { dbUserId.push({ id: item.userId }) });
      fetchUserDetailsById(JSON.stringify(dbUserId)).then((jsondata) => {
        let userDetails = JSON.parse(jsondata.data);
        for (var i = 0; i < userDetails.length; i++) {
          var details =
          {
            'userName': userDetails[i].userName,
            'name': userDetails[i].firstName + " " + userDetails[i].lastName,
            'dob': userDetails[i].dob,
            'action': <Link to={{
              pathname: '/dashboard/createusers',
              state: { dbUserId: userDetails[i].id }
            }}><EditIcon /></Link>,
            'passwordreset': <LockOpenIcon color="primary" onClick={doPasswordReset.bind(null, userDetails[i].id)}></LockOpenIcon>
          };
          userInfo.push(details);
        }
        setUserDetails(userInfo);
      });
    });
  }

  function doPasswordReset(dbUserId) {
    passwordReset(dbUserId).then((jsondata) => {
      alert("Password Updated Sucessfully");
    });

  }
  useEffect(() => {
    fetchUserDetailsByCenterId();
  }, []);

  const columns = [{ label: 'User Name', name: 'userName' },
  { label: 'First Name', name: 'name' },
  { label: 'Date Of Birth', name: 'dob' },
  { label: 'Action', name: 'action', headerStyle: { color: '#FF9800' } },
  { label: 'Password Reset', name: 'passwordreset', headerStyle: { color: '#FF9800' } }
  ]
  const options = {
    filterType: "dropdown",
    responsive: "scroll",
    sortDirection: "desc"
  };
  return (
    <div>

<Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button variant="contained" color="primary"
        size="small" component={Link} 
        to={{pathname:"/dashboard/createusers"}}>Add User</Button>
</Grid>
<br/>
      <MUIDataTable label={"List of Students"} data={rows} columns={columns} options={options}
      />
    </div>

  );
}