import UserContext from '../components/GolbalContext';
import { regenerateToken } from './validation';
export function isSessionValid() 
{
    var currentDateTime=new Date();
    if(UserContext.sessionTime.getTime() >= currentDateTime.getTime()){
        regenerateToken();
        var sessionTimeOut=new Date();
        sessionTimeOut.setMinutes( sessionTimeOut.getMinutes() + 15);    
        UserContext.sessionTime=sessionTimeOut;
        return true;  
      }
    
      if(UserContext.sessionTime.getTime() <= currentDateTime.getTime()){  
       UserContext.sessionTime="";UserContext.userid="";
       UserContext.firstName="";UserContext.lastName="";
       UserContext.roleid="";UserContext.roleName="";
       UserContext.centerId="";UserContext.centerName="";
       UserContext.dbUserId="";UserContext.token="";
       UserContext.userName="";UserContext.defaultRoleId="";UserContext.refreshToken=""
       window.location.pathname="/";
       return false; 
      }   
}
export function isTokenValid()
{
  var currentDateTime=new Date();
  if(UserContext.jwtTimeOut.getTime() < currentDateTime.getTime()){
    return false;
  }
  else
  {
    return true;
  }
}

export function clearAppData()
{
       UserContext.sessionTime="";UserContext.userid="";
       UserContext.firstName="";UserContext.lastName="";
       UserContext.roleid="";UserContext.roleName="";
       UserContext.centerId="";UserContext.centerName="";
       UserContext.dbUserId="";UserContext.token="";
       UserContext.userName="";UserContext.defaultRoleId="";UserContext.refreshToken=""
       window.location.pathname="/";
}