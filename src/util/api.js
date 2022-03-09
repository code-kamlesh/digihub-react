import { serviceEndPoint } from './../util/serviceEndPoint';
import UserContext from './../components/GolbalContext'
import {isSessionValid, isTokenValid} from './../util/session.js';
import { regenerateToken } from './validation';


export async function fetchMasterSalutation() {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "findall" , "data" : [{}]}');
    return fetch(serviceEndPoint.salutationServiceEndPoint, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function fetchAllCenter() {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "findall" , "data" : [{}]}');
    return fetch(serviceEndPoint.centerServiceEndPoint, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function fetchMasterGenderDetails() {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "findall" , "data" : [{}]}');
    return fetch(serviceEndPoint.genderServiceEndPoint, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function fetchPincodeData(pincode) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findpincode", "data" : [{"pincode":' + pincode + '}]}');
    return fetch(serviceEndPoint.cityVillageServiceEndPoint, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function businessCaseSaveOrUpdate(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "save", "data" : ' + data + '}');
   return fetch(serviceEndPoint.businessCaseEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchBusinessCaseMetaData(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "get", "data" : [{"engagementId":' + engagementId + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.businessCaseEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchBusinessCaseQuestions() {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : []}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.businessCaseBriefMdmService, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchUserDocuments(engagementId,documentType,typeOfDocument) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "fetchDocumentDetailsByUserIdAndDocumentType", "data" : [{"engagementId":'+engagementId+',"documentType":"'+documentType+'","typeOfDocument":"'+typeOfDocument+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return fetch(serviceEndPoint.documentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function fetchBatchDetails(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getActiveBatches", "data" : [{"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.batchDetailsServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}
export async function fetchBatchDetailsForBatchOwner(batchOwner,centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getActiveBatchesForBatchOwner", "data" : [{"domainFacilitator":'+batchOwner+',"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.batchDetailsServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}



export async function fetcRoleDetails() {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchAll", "data" : []}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.roleServiceEndPoint,{
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;   
}

export async function passwordReset(dbUserId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "passwordReset", "data" : [{"id":'+dbUserId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;    
}


export async function enrollStudent(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "enrolltobatch", "data" : [{'+data+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.enrollmentServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    },
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}


export async function changeStudentStatus(data) {
    if(isSessionValid()){
    try{
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "updateStatus", "data" : [{'+data+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    catch(e)
    {
        console.log(e);
    }
}
return null;
}

export async function fectEnrollmentDetails(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchEnrollmentDetails", "data" : [{"engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.enrollmentServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function fectUserDetails(userId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchUserDetails", "data" : [{"id" : ' + userId + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}

export async function fectUserNameFromId(userId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchUserDetails", "data" : [{"id" : ' + userId + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json()).then((jsondata)=>{

        let jsonobjects = JSON.parse(jsondata.data);
        alert(jsonobjects[0].firstName);
        return jsonobjects[0].firstName;
           
         });
        }
        return null;     
}

export async function fectUserRoleDetails(roleId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getRoleDetails", "data" : [{"id":"'+roleId+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.roleServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function fectAddressDetails(id) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "viewAllAddressForEntity", "data" : [{"entityId" : ' + id + ' , "entityType" : "U"}]}');
    if(!isTokenValid()) 
        await regenerateToken();

   return  fetch(serviceEndPoint.addressServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}
// address for placement
export async function fectAddressDetailsByAddressID(id) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "viewAddressById", "data" : [{"id" : ' + id + ' }]}');
    if(!isTokenValid()) 
        await regenerateToken();

   return  fetch(serviceEndPoint.addressServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function fetchAllStateDetails() {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : [{}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.stateServiceEndPoint,{
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function changePassword(userId,newPassword) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "changePassword" +'", "data" : [{"id" : ' + userId + ',"password" : "' +newPassword + '"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}


export async function fetchAddressDetailsBasedOnPincode(pincode) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "findpincode", "data" : [{"pincode":'+pincode+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.cityVillageServiceEndPoint,{
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;    
}

export async function saveUserDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "saveUserDetails", "data" : ['+data+']}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}

export async function saveAddressDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "updateAddress", "data" : ['+data+']}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.addressServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function sendResetPasswordLink(userName) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "resetPassword", "data" : [{"userName":"'+userName+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function fetchUsersByCenterId(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "findUsersByCenterId", "data" : [{"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function fetchUserDetailsById(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchUserDetailsById", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function fetchUserDetails(id) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "fetchUserDetails", "data" : [{"id" : ' + id + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;   
}


export async function mapUserToRole(userId,centerId,roleId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "saveUserCenterRoleMapDetails", "data" : [{"userId":'+userId+',"centerId":'+centerId+',"roleId":'+roleId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
 return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}


export async function fetchEnrollmentDetailsByBatchId(batchId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "fetchEnrollmentDetailsByBatchId", "data" : [{"batchId":'+batchId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.enrollmentServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;    
}
export async function fetchAllStudentDataByEngagementId(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "fetchAllStudentDataByEngagementId", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
  return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;   
}

export async function captureStudentEngagementDetails(dbUserId,centerId,userid) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "captureStudentEngagement", "data" :[{"dbUserId"  : ' + dbUserId + ' , "centerId" : ' + centerId + ', "createdBy" : ' + userid + ', "remarks" : "","status" : "mobilised"}]}');
    
    if(!isTokenValid()) 
        await regenerateToken();
 return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}

export async function captureStudentEngagementDetailsB(dbUserId,centerId,userid,engId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "captureStudentEngagement", "data" :[{"dbUserId"  : ' + dbUserId + ' , "centerId" : ' + centerId + ', "createdBy" : ' + userid + ',"linkedEngagementId" : ' + engId + ', "remarks" : "","status" : "mobilised"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
 return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}


export async function isCurrentPasswordValid(userName,currentPassword) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "isCurrentPasswordValid", "data" :[{"userName"  : "' + userName + '" , "password":"'+currentPassword+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;  
}



export async function fetchBatchDetailsByBatchId(batchId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "getBatchDetailsByBatchId", "data" :[{"batchId"  : "' + batchId + '"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return  fetch(serviceEndPoint.batchDetailsServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function BusinessIdeaEvaluationSaveOrUpdate(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
   requestFormData.append('data', '{"token" : "", "action" : "saveBusinessIdeaEvaluationDetails", "data" : ' + data + '}');
   if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.businessCaseEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function FetchFinalScoreForBusinessIdea(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
   requestFormData.append('data', '{"token" : "", "action" : "calculateFinalScore", "data" : [{"engagementId":' + engagementId + '}]}');
   if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.businessCaseEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchBusinessIdeaEvaluationData(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "getBusinessIdeaEvaluationDetails", "data" : [{"engagementId":' + engagementId + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.businessCaseEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchCourseDetails() {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : [{}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.courseServiceEndPoint, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function saveInterestInventoryCode(engagementId,finalScore,createdBy) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "captureInterestInventory", "data" : [{"engagementId":' + engagementId + ',"finalScore":"' + finalScore + '","createdBy":'+createdBy+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.interestinventoryServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function fetchInterestInventoryCode(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "viewInterestInventoryByEngId", "data" : [{"engagementId":' + engagementId + '}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.interestinventoryServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function fetchCentersOfUser(id) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "getAllUserScopes", "data" : [{"userId":'+UserContext.userid+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.userProfileServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function fetchCentersDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findcenter", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.centerServiceEndPoint, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function fetchRoleDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "getRoleDetails", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.roleServiceEndPoint, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function setDefaultSettings(userId,roleMapId,centerId,programId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "setDefaultSettings", "data" : [{"userId":'+userId+',"roleMapId":'+roleMapId+',"centerId":'+centerId+',"programId":'+programId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.userProfileServiceEndPoint, {
        method: "POST",
        body: requestFormData,
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
    }).then(response => response.json());
}
return null;
}


// export async function saveEducationDetails(data){
//     if(isSessionValid()){
//         let formData = new FormData();
//         formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "captureAllEducation" +'", "data" : ' + JSON.stringify(this.state.rows) + '}');
//         return fetch(serviceEndPoint.educationServiceEndPoint, {
//         method: "POST",
//         headers: {
//           'Authorization': 'Bearer '+Cookies.get('token')
//       },  
//         body: formData  
//         }).then(response => response.json());
//     }
//     return null;
//     }
   


export async function saveCounsellingDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "save", "data" : ['+data+']}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.counsellingServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}


export async function fetchCounsellingDetails(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "get", "data" : [{"engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.counsellingServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}


export async function fetchCoursesByHollandCode(hollandCode) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findCoursesByHollandCode", "data" : [{"hollandcode":"'+hollandCode+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.interestinventoryServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}



export async function findByAadharNo(aadharNo) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "isAadharNoDuplicate", "data" : [{"aadharNo":"'+aadharNo+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.studentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
    }
    return null;
}


export async function searchByAadharNo(aadharNo) {
  if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "searchByAadharNumber", "data" : [{"aadharNo":"'+aadharNo+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.studentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}


export async function searchByFirstNameAndLastNameAnddobAndPrimaryContactNumberAndPrimaryEmailId(firstName,lastName,dob,primaryContactNumber,primaryEmailId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "searchByFirstNameAndLastNameAnddobAndPrimaryContactNumberAndPrimaryEmailId", "data" : [{"firstName":"'+firstName+'","lastName":"'+lastName+'","dob":"'+dob+'","primaryContactNumber":"'+primaryContactNumber+'","primaryEmailId":"'+primaryEmailId+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return fetch(serviceEndPoint.studentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
    }
    return null;
}



export async function fetchStudentDetailsByEngagementId(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "viewStudentEngagementById", "data" : [{"engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return fetch(serviceEndPoint.engagementServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}


export async function fetchNotCompletedBatchDetails(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getNotCompletedBatches", "data" : [{"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.batchDetailsServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}



export async function login(token,action,email,password) {
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "'+token+'", "action" : "'+action+'", "data" : [{"userName":"'+email+'","password":"'+password+'"}]}');
    return  fetch(serviceEndPoint.loginService,{
     method: "POST",
     body: requestFormData,
     }).then(response => response.json()); 
}



export async function fetchUserScope(userid) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getUserScope", "data" : [{"userId":"'+userid+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json()); 
    }
    return null;
}

export async function fetchBasicData(id)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewBeneficiaryDetailsById" +'", "data" : [{"dbUserId" : ' + id + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.studentServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        },    
          body: formData 
          }).
          then(response => response.json())
}
return null;
}
export async function fetchAddressData(id)
{
    if(isSessionValid()){
    let formData2 = new FormData();
          formData2.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllAddressForEntity" +'", "data" : [{"entityId" : ' + id + ' , "entityType" : "S"}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.addressServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData2 
          }).then(response => response.json())
}
return null;
}


export async function subMitBasicData(action , data)
{
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : [' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.studentServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      },  
        body: formData 
        }).then(response => response.json())
}
return null;
}

export async function submitAddressData(action, data)
{
    if(isSessionValid()){
    let formData = new FormData();
       formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : [' + JSON.stringify(data) + ']}');
       if(!isTokenValid()) 
        await regenerateToken();
         return fetch(serviceEndPoint.addressServiceEndPoint, {
         method: "POST",
         headers: {
           'Authorization': 'Bearer '+UserContext.token
       },  
         body: formData 
         }).then(response => response.json())
}
return null;
}

export async function submitEducationData(action,data)
{
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : ' + JSON.stringify(data) + '}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.educationServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      },  
        body: formData  
        }).then(response => response.json())
}
return null;
}

export async function fetchEducationData(id)
{
    if(isSessionValid()){
    let formData = new FormData();
         formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllEducationForUser" +'", "data" : [{"dbUserId" : ' + id + '}]}');
         if(!isTokenValid()) 
        await regenerateToken();
         return fetch(serviceEndPoint.educationServiceEndPoint, {
         method: "POST",
         headers: {
           'Authorization': 'Bearer '+UserContext.token
       }, 
         body: formData 
         }).then(response => response.json())
}
return null;
}


export async function saveBatchDetails(action, data)
{
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" :[' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.batchDetailsServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      }, 
        body: formData 
        }).then(response => response.json())
}
return null;
}

export async function saveObservationDetails(action, data)
{
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : ' + JSON.stringify(data) + '}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.observationServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      }, 
        body: formData 
        }).then(response => response.json())
}
return null;
}

export async function fetchObservationdetails(engagementId)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllObservationsForUser" +'", "data" : [{"engagementId":'+engagementId+'}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.observationServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}

export async function fetchFamilydetails(dbUserId)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllFamilyDetailsForUser" +'", "data" : [{"dbUserId":'+dbUserId+'}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.familyServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}




export async function saveFamilyDetails(action, data)
{if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : ' + JSON.stringify(data) + '}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.familyServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      }, 
        body: formData 
        }).then(response => response.json())
}
return null;
}
export async function fetchFamilyDetails(id)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllFamilyDetailsForUser" +'", "data" : [{"dbUserId" : ' + id + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.familyServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}

export async function fetchPlacementDetailsByEngagementId(engagementId)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewPlacementDetailsByEngagementId" +'",  "data" : [{"engagementId" : ' + engagementId + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.placementServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}
export async function fetchExperienceDetails(id)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllExperienceForUser" +'", "data" : [{"dbUserId" : ' + id + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.experienceServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}

//Socio Details added ashish
export async function saveSocioDetails(action, data)
{
   
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" :[ ' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.socioeconomicServiceEndPoint, {
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: formData 
     }).then(response => response.json())
}
return null;
}


export async function saveExpDetails(action, data)
{
   
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" :[ ' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.experienceServiceEndPoint, {
 method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: formData 
     }).then(response => response.json())
}
return null;
}


export async function savePlacementDetails(data)
{
   
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "save" , "data" :[ ' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.placementServiceEndPoint, {
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: formData 
     }).then(response => response.json())
}
return null;
}

//ashish new screen family
export async function saveFamilyDetailsNew(action, data)
{
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : [' + JSON.stringify(data) + ']}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.familyServiceEndPoint, {
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: formData 
     }).then(response => response.json())
}
return null;
}

export async function fetchExpDetails(id)
{
    if(isSessionValid()){
     let formData = new FormData();
     formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewAllExperienceForUser" +'", "data" : [{"dbUserId" : ' + id + '}]}');
     if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.experienceServiceEndPoint, {
       method: "POST",
       headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
       body: formData 
       }).then(response => response.json())
}
return null;
}

//ashish socio economic
export async function fetchSocioDetails(id)
{
    if(isSessionValid()){
     let formData = new FormData();
     formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "viewSocioEconomicById" +'", "data" : [{"dbUserId" : ' + id + '}]}');
     if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.socioeconomicServiceEndPoint, {
       method: "POST",
       headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
       body: formData 
       }).then(response => response.json())
}
return null;
}



export async function fetchEvaluationData(eng)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "viewByEngagementId", "data" : [{ "engagementId" : ' + eng + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
         return fetch(serviceEndPoint.evaluationServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}


export async function fetchKnackScore(id)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "get", "data" : [{ "engagementId" : ' + id + '}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.knackServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json());
}
return null;
}
export async function saveEvaluationData(data)
{if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "captureAllEvaluationDetails" +'", "data" : ' + JSON.stringify(data) + ' }');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.evaluationServiceEndPoint, {
    method: "POST",
    headers: {
      'Authorization': 'Bearer '+UserContext.token
  }, 
    body: formData 
    }).then(response => response.json())
}
return null;

}


export async function fetchStudentDataForList(role)
{if(isSessionValid()){
    let requestFormData = new FormData();  
    if ( role===3){
      requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenterAndMultipleStatus", "data" : [{"centerId":'+UserContext.centerId+'}]}');
    }
    else{
      requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenter", "data" : [{"centerId":'+UserContext.centerId+'}]}');
    }
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.engagementServiceEndPoint,{
            method: "POST",
            headers: {
              'Authorization': 'Bearer '+UserContext.token
          },
            body: requestFormData,
            }).then(response => response.json())
      
       
}
return null;
}

export async function calculatePercentile()
{
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "calculatePercentile", "data" : [{"createdBy":'+UserContext.userid+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.evaluationServiceEndPoint,{
  method: "POST",
  headers: {
    'Authorization': 'Bearer '+UserContext.token
}, 
  body: requestFormData,
  }).then(response => response.json())
}
return null;
}


export async function findNumberOfBeneficiaryInCenterByStatus(centerId,studentEngagementStatus) {
    if(isSessionValid()){
      let requestFormData = new FormData();
      requestFormData.append('data', '{"token" : "", "action" : "NumberOfBeneficiaryInCenterByStatus", "data" : [{"centerId":"'+centerId+'","studentEngagementStatus":"'+studentEngagementStatus+'"}]}');
      if(!isTokenValid()) 
          await regenerateToken();
      return fetch(serviceEndPoint.dashboardService, {
          method: "POST",
          body: requestFormData
      }).then(response => response.json());
  }
  return null;
  }



  export async function fetchQualificationDetails() {
    if(isSessionValid()){
      let requestFormData = new FormData();
      requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : [{}]}');
      if(!isTokenValid()) 
          await regenerateToken();
      return fetch(serviceEndPoint.qualificationServiceEndPoint, {
          method: "POST",
          body: requestFormData
      }).then(response => response.json());
  }
  return null;
  }


  export async function fetchUserDocumentsByEngagementId(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "fetchDocumentDetailsByEngagementId", "data" : [{"engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.documentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function fetchUserDocumentsByEngagementIdAndTypeOfDocument(engagementId,typeOfDocument) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "fetchDocumentDetailsByEngagementIdAndDocumentType", "data" : [{"engagementId":'+engagementId+',"typeOfDocument":"'+typeOfDocument+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.documentServiceEndPoint, {
  
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchUserDocumentsByUserIdAndTypeOfDocument(dbUserId,typeOfDocument) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "getDocumentDetailsByUserIdAndDocumentType", "data" : [{"dbUserId":'+dbUserId+',"typeOfDocument":"'+typeOfDocument+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.documentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function deleteDocumentById(basicDocId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "deleteDocument", "data" : [{"basicDocId":'+basicDocId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return fetch(serviceEndPoint.documentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}




export async function fetchCenterCapacity() {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : [{}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.centerCapacity, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}




export async function fetchBusinessIdeaEvaluationQuestions() {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findall", "data" : [{}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.businessIdeaEvaluation, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function findAllObservationdetails()
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "findall" +'", "data" : [{}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.masterObservation, {
          method: "POST",
          body: formData 
          }).then(response => response.json())
}
return null;
}


export async function fetchCenterActiveCourses(centerId)
{
    if(isSessionValid()){
    let formData = new FormData();
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "getActiveCourse" +'", "data" : [{"centerId" :'+centerId+'}]}');
          if(!isTokenValid()) 
        await regenerateToken();
          return fetch(serviceEndPoint.centerService, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json())
}
return null;
}


export async function fetchCourseDetailsByIds(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findcourse", "data" :'+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.courseServiceEndPoint, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function uploadDocument(dbUserId,engagementId,documentType,typeOfDocument,documentName,document,documentNumber) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "captureDocDetails", "data" : [{"dbUserId":'+dbUserId+',"engagementId":'+engagementId+',"documentType":"'+documentType+'","typeOfDocument":"'+typeOfDocument+'","documentName":"'+documentName+'","base64File":"'+document+'","documentNo":"'+documentNumber+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.documentServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        },
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function fetchMasterExistingBusiness() {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "fetchAll" , "data" : [{}]}');
    return fetch(serviceEndPoint.mdmExistingBusiness, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function saveExistingBusiness(data) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "saveExistingBusinessDetails" , "data" : '+data+'}');
    
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.existingBusiness, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        },
        body: formData,
    }).then(response => response.json());
}
return null;
}


export async function fetchExistingBusinessDetails(engagementId) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "fetchExistingBusinessDetails" , "data" :[{"engagementId":'+engagementId+'}]}');
    
    if(!isTokenValid()) 
        await regenerateToken();
    return fetch(serviceEndPoint.existingBusiness, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        },
        body: formData,
    }).then(response => response.json());
}
return null;
}

export async function fetchCenterCapacityByIds(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findCapacityByCenter", "data" :'+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.centerCapacity, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function fetchAllStudentEngagementForUser(dbUserId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "viewAllStudentEngagementForUser", "data" :[{"dbUserId":'+dbUserId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.engagementServiceEndPoint, {
        method: "POST",
        body: requestFormData,
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }
    }).then(response => response.json());
}
return null;
}



export async function fectEnrollmentDetailsByIds(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "fetchEnrollmentDetailsByEngagementId", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
    return  fetch(serviceEndPoint.enrollmentServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}



export async function fetchCenterProgramMapping(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findCenterProgramMapping", "data" :[{"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.centerProgramMapping, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}

export async function fetchProgram(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "findprogram", "data" :'+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.programservice, {
        method: "POST",
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}



export async function fetchComponentsByProgramIdAndRoleId(programId,roleId) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "fetchByProgramIdAndRoleId", "data" :[{"programId":'+programId+',"roleId":'+roleId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.programrolecomponentmapping, {
        method: "POST",
         headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
        body: requestFormData,
    }).then(response => response.json());
}
return null;
}


export async function fetchUsersByCenterIdAndRoleMapId(centerId,roleMapId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "findUsersByCenterIdAndRoleMapId", "data" : [{"centerId":'+centerId+',"roleMapId":'+roleMapId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.userProfileServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function fetchEmployerDetails(accountStatus,typeOfRelationship) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "findByAccountStatusAndTypeOfRelationshipLike" , "data" : [{"accountStatus":"'+accountStatus+'","typeOfRelationship":"'+typeOfRelationship+'"}]}');
    return fetch(serviceEndPoint.employerservice, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function getReports(pageNumber,pageSize,centerId,startDate,endDate,studentEngagementStatus,batchId) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "viewData" , "data" : [{"pageNumber":"'+pageNumber+'","pageSize":"'+pageSize+'","centerId":"'+centerId+'","startDate":"'+startDate+'","endDate":"'+endDate+'","studentEngagementStatus":"'+studentEngagementStatus+'","batchId":'+batchId+'}]}');
    return fetch(serviceEndPoint.reportservice, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}


export async function downloadReports(pageNumber,pageSize,centerId,startDate,endDate,studentEngagementStatus,batchId) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "' + "1234" + '", "action" : "downloadExcel" , "data" : [{"pageNumber":"'+pageNumber+'","pageSize":"'+pageSize+'","centerId":"'+centerId+'","startDate":"'+startDate+'","endDate":"'+endDate+'","studentEngagementStatus":"'+studentEngagementStatus+'","batchId":'+batchId+'}]}');
    return fetch(serviceEndPoint.reportservice, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

export async function fetchStudentDropoutDetailByEngagementId(engagementId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "viewDropout", "data" : [{"engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.dropoutServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

export async function saveDropoutDetails(effortSpent,engagementId,createdBy) {
    if(isSessionValid()){
    let requestFormData = new FormData();
    requestFormData.append('data', '{"token" : "", "action" : "saveDropout", "data" : [{"effortSpent":"'+effortSpent+'","engagementId":"'+engagementId+'","createdBy":"'+createdBy+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
     return fetch(serviceEndPoint.dropoutServiceEndPoint, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
        body: requestFormData
    }).then(response => response.json());
}
return null;
}


export async function markDropout(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "markdropout", "data" : [{'+data+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    },
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}


export async function updateReadyForDropout(engagementId,readyForDropout) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "updateStudentEngagementDetails", "data" : [{"readyForDropout":"'+readyForDropout+'","engagementId":'+engagementId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    },
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}



export async function fetchAllStudentDataByEngagementIdAndReadyForDropout(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "fetchAllStudentDataByEngagementIdAndReadyForDropout", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
  return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;   
}



export async function fetchAttendanceDetailsByAttendanceDateAndBatchId(batchId,attendanceDate) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data','{"token" : "'+ "1234" +'", "action" : "viewAttendanceByBatchIdAndAttendanceDate", "data" :[{"batchId":'+batchId+',"attendanceDate":"'+attendanceDate+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
  return  fetch(serviceEndPoint.attendanceServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;   
}

export async function fetchRunningBatchDetails(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getRunningBatches", "data" : [{"centerId":'+centerId+'}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.batchDetailsServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}

export async function saveAttendanceDetails(data) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "updateAllAttendance", "data" : '+data+'}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.attendanceServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null; 
}


export async function findSkillmithraByOrgId(orgId){
    if (isSessionValid()) {
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "findSkillMithrasByOrgId", "data" :[{ "orgId" : "'+orgId+'" }]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.udyogmitraandskillinstitute, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}


export async function getUdyogMitraAndSkillInstitute(orgType) {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "findSkillMithras", "data" :[{"orgType" : "'+ orgType +'" }]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.udyogmitraandskillinstitute, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function findInformalCourses() {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "findCoursesByType", "data" : [{"type" : "informal"}]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.courseServiceEndPoint, {
            method: "POST",
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function saveInformalEnrollmentDetails(engagementId, batchId, courseId, updatedBy, startDate, endDate, orgId ) {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "enrolltocourse", "data" : [{"engagementId":"'+engagementId+'","batchId":"'+batchId+'","courseId":"'+courseId+'","updatedBy":"'+updatedBy+'","startDate":"'+startDate+'" , "endDate":"'+endDate+'","orgId":"'+orgId+'"}]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.enrollmentServiceEndPoint, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}


// api for module list
export async function fetchcourseModuleList(selectedYear){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "getModuleNameByYear", "data" :[{"year" : " '+selectedYear+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// API for sub Module list in table

export async function fetchsubModuleList(moduleId,selectedYear){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data','{ "token" : "", "action" : "getSubtopicNameByYearAndModuleId", "data" : [{"moduleId": "'+moduleId+'", "year":"'+selectedYear+'"}]}')
        
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}
// API for loading table data
export async function fetchtabledata(batchId , isActive){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "GetCourseModuleDetailsByBatchIdAndIsActiveStatus", "data" :[{"batchId" : " '+batchId+'", "isActive" : "'+isActive+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// API for saved data if value id ic nor there

export async function saveCourseCovrageData(userId, batchId, isActive, subtopicId, moduleId, createdDate, remarks, compDate) {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        // {"engagementId":"'+engagementId+'","batchId":"'+batchId+'","courseId":"'+courseId+'","updatedBy":"'+updatedBy+'","startDate":"'+startDate+'" , "endDate":"'+endDate+'","orgId":"'+orgId+'"}]}
        requestFormData.append('data', '{"token" : "", "action" : "SaveCourseModuleDetails", "data" : [{"userId":"'+userId+'", "batchId":"'+batchId+'", "isActive":"'+isActive+'", "moduleId":"'+moduleId+'", "subtopicId":"'+subtopicId+'", "createdDate":"'+createdDate+'", "remarks":"'+remarks+'", "compDate":"'+compDate+'"}]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// Api calling for data saving when value id is present

export async function saveCourseCovrageDatawithId(id,userId, batchId, isActive, subtopicId, moduleId, createdDate, remarks, compDate) {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        // {"engagementId":"'+engagementId+'","batchId":"'+batchId+'","courseId":"'+courseId+'","updatedBy":"'+updatedBy+'","startDate":"'+startDate+'" , "endDate":"'+endDate+'","orgId":"'+orgId+'"}]}
        requestFormData.append('data', '{"token" : "", "action" : "SaveCourseModuleDetails", "data" : [{"id":"'+id+'", "userId":"'+userId+'", "batchId":"'+batchId+'", "isActive":"'+isActive+'", "moduleId":"'+moduleId+'", "subtopicId":"'+subtopicId+'", "createdDate":"'+createdDate+'", "remarks":"'+remarks+'", "compDate":"'+compDate+'"}]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// API call for submodule list

export async function fetchSubModulename(batchId, isActive){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "GetCourseModuleDetailsByBatchIdAndIsActiveStatus " , "data" :[{"batchId":"'+batchId+'", "isActive" : "'+isActive+'"}]}')
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker,{
            method:"post",
            header:{
                'Authorization': 'Bearer ' + UserContext.token 
            }
        }).then(response => response.json())
    }
    return null;
}

//API for loading table data for Course Coverage
export async function fetchtabledatawithModuleId(batchId, moduleId, isActive){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "", "action" : "findByBatchIdAndModuleIdAndIsActive", "data" :[{"batchId" : "'+batchId+'", "moduleId": "'+moduleId+'","isActive" : "'+isActive+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.coursecoveragetracker,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// fetching Centers By State Name

export async function fetchCenterByStateName(state) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data', '{"token" : "", "action" : "findallCenterbyState" , "data" : [{"state" : "'+state+'"}]}');    
    return fetch(serviceEndPoint.centerServiceEndPoint, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

// ============ Api for Funder Mapping


export async function getBatchDetailsByBatchId(batchId, isActive, fundingType){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "getFunderMappingByBatchIdAndIsActiveStatusAndFundingType", "data" :[{"batchId" :"'+batchId+'", "isActive":"'+isActive+'", "fundingType":"'+fundingType+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.fundermapping,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function getBatchDetailsByFunderId(funderId, isActive, fundingType){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "getFunderMappingByFunderIdAndIsActiveStatusAndFundingType", "data" :[{"funderId" :"'+funderId+'", "isActive":"'+isActive+'", "fundingType":"'+fundingType+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.fundermapping,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function getBatchDetailsByBatchIdandFunderId(batchId, funderId, isActive, fundingType){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "getFunderMappingByBatchIdAndFunderIdAndIsActiveStatusAndFundingType", "data" :[{"batchId" :"'+batchId+'", "funderId" :"'+funderId+'", "isActive":"'+isActive+'", "fundingType":"'+fundingType+'"}]}');
 
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.fundermapping,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}


// Fetching baised on Zone
export async function fetchStateByZone(zone) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "findstatebyzone", "data" : [{"zone":"'+zone+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.stateServiceEndPoint,{
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function saveBatchFunderDetails(batchId, funderId, crmFunderId, isActive, fundingType, createdBy, createdOn, remarks){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "saveFunderMappingDetails", "data" :[{"batchId": '+batchId+', "funderId": '+funderId+', "crmFunderId": "'+crmFunderId+'", "isActive": "'+isActive+'", "fundingType": "'+fundingType+'", "createdBy": '+createdBy+', "createdOn": "'+createdOn+'", "remarks": "'+remarks+'"}]}');
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.fundermapping,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function updateBatchFunderDetails(id, batchId, funderId, crmFunderId, isActive, remarks, updatedOn, updatedBy, fundingType){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "UpdateExistingFunderMapping", "data" :[{"id": '+id+', "batchId": '+batchId+', "funderId": '+funderId+',  "crmFunderId": "'+crmFunderId+'", "isActive": "'+isActive+'", "fundingType": "'+fundingType+'", "updatedBy": '+updatedBy+', "updatedOn": "'+updatedOn+'", "remarks": "'+remarks+'"}]}');
        if(!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.fundermapping,{
            method : "POST",
            headers:{
                'Authorization': 'Bearer ' + UserContext.token
            },
            body : requestFormData,
        }).then(response => response.json());
    }
    return null;
}

export async function getStudentStrengthByCenterIdAndStudentEngagementStatus( centerId, studentEngagementStatus) {
    if(isSessionValid()){
    let formData = new FormData();
    formData.append('data','{"token" : "1234", "action" : "viewStrengthByEngagementStatus" , "data" : [{ "centerId": "'+centerId+'", "studentEngagementStatus": "'+studentEngagementStatus+'" }]}');
    return fetch(serviceEndPoint.reportservice, {
        method: "POST",
        body: formData
    }).then(response => response.json());
}
return null;
}

// Informal sector

// {"token" : "", "action" : "findSkillMithrasByOrgIdAndProgramId", "data" :[{"orgType" : "udhyogmithra","programId":5}]}

export async function fetchSkillMithraByIdAndProgramId(orgType,programId) {
    if (isSessionValid()) {
        let requestFormData = new FormData();
        requestFormData.append('data', '{"token" : "1234", "action" : "findSkillMithrasByOrgIdAndProgramId" , "data" : [{ "orgType": "'+orgType+'", "programId": "'+programId+'" }]}');
        if (!isTokenValid())
            await regenerateToken();
        return fetch(serviceEndPoint.udyogmitraandskillinstitute, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json());
    }
    return null;
}

// Buil upload

// changes(add batch name)
export async function saveBulkStudentData(RegId, firstName, lastName, middleName, dob, aadharNo, batchName,highestQualification, passingYear, gender, religion, category, primaryContactNumber, primaryEmailId,collegeRegisterNo,itiGrade,itiTrade,addressLine1, villageName, district, state , pincode, createdOn,createdBy,status,remarks,reason) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "1234", "action" : "saveStudentDataBulk", "data" : [{ "regId" : "'+RegId+'", "firstName": "'+firstName+'", "lastName" : "'+lastName+'", "middleName": "'+middleName+'", "dob" : "'+dob+'", "aadharNo": "'+aadharNo+'","batchName" : "'+batchName+'", "highestQualification" : "'+highestQualification+'", "passingYear": "'+passingYear+'", "gender" : "'+gender+'", "religion": "'+religion+'", "category" : "'+category+'", "primaryContactNumber": "'+primaryContactNumber+'", "primaryEmailId" : "'+primaryEmailId+'", "collegeRegisterNo": "'+collegeRegisterNo+'","itiGrade": "'+itiGrade+'","itiTrade": "'+itiTrade+'","addressLine1": "'+addressLine1+'", "villageName" : "'+villageName+'", "district": "'+district+'", "state" : "'+state+'", "pincode": "'+pincode+'",  "createdOn": "'+createdOn+'", "createdBy" : "'+createdBy+'", "status" : "'+status+'","remarks" : "'+remarks+'","reason" : "'+reason+'"}] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}


export async function saveBulkMetaData(uploadFileName, uploadDate, activity, batchName, batchId, records, status, centerName, centerId,modelId, uploadedBy,remarks) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "saveMetaDataBulk", "data" : [{ "uploadFileName" : "'+uploadFileName+'", "uploadDate" : "'+uploadDate+'", "activity" : "'+activity+'", "batchName" : "'+batchName+'", "batchId" : "'+batchId+'", "records" : "'+records+'", "status" : "'+status+'", "centerName" : "'+centerName+'", "centerId" : "'+centerId+'","modelId" : "'+modelId+'","uploadedBy" : "'+uploadedBy+'","remarks" : "'+remarks+'" }] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}



// Get Bulk data for History page
export async function fetchBulkData() {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getAllMetaDataBulk", "data" : [{  }] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}



export async function fetchStudentFile(regId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getStudentDataByRegIdBulk", "data" : [{  "regId" : "'+regId+'"  }] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

// show baised on center id in upload meta data table
export async function fetchBulkAllMetaDataByCenterId(centerId) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "getMetaDataByCenterIdBulk", "data" : [{ "centerId" : '+centerId+' }] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

// Changes
export async function saveBulkMetaDataAgain(regId,uploadFileName, uploadDate, activity, batchName, batchId, records, status, centerName, centerId,modelId, uploadedBy,remarks) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "saveMetaDataBulk", "data" : [{ "regId" : "'+regId+'","uploadFileName" : "'+uploadFileName+'", "uploadDate" : "'+uploadDate+'", "activity" : "'+activity+'", "batchName" : "'+batchName+'", "batchId" : "'+batchId+'", "records" : "'+records+'", "status" : "'+status+'", "centerName" : "'+centerName+'", "centerId" : "'+centerId+'","modelId" : "'+modelId+'","uploadedBy" : "'+uploadedBy+'","remarks" : "'+remarks+'" }] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.bulkupload,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }

    return null;
}

// Virtual to physical
export async function fetchStudentDetailsBaisedOnChannel(channel) {
    if(isSessionValid()){
    let requestFormData = new FormData(); 
    requestFormData.append('data', '{"token" : "", "action" : "viewAllStudentsBasedOnCreationChannel", "data" :[{"creationChannel": "'+channel+'"}] }');
    if(!isTokenValid()) 
        await regenerateToken();
   return  fetch(serviceEndPoint.studentServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}
// export async function fetchVirtualData(centerId, presState) {
//     if(isSessionValid()){
//     let requestFormData = new FormData();  
//     requestFormData.append('data', '{"token" : "", "action" : "viewDataByCenterId", "data" : [{ "centerId" : '+centerId+' , "presState" : "'+presState+'" }] }');
//     if(!isTokenValid()) 
//         await regenerateToken();                                                                      
//    return  fetch(serviceEndPoint.reportservice,{
//      method: "POST",
//      headers: {
//         'Authorization': 'Bearer '+UserContext.token
//     }, 
//      body: requestFormData,
//      }).then(response => response.json());
//     }
//     return null;
// }

export async function fetchVirtualData(centerId, permState, creationChannel) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "viewDataByCenterIdAndCreationChannel", "data" : [{ "centerId" : '+centerId+' , "permState" : "'+permState+'" ,"creationChannel":"'+creationChannel+'"}] }');
    if(!isTokenValid()) 
        await regenerateToken();                                                                      
   return  fetch(serviceEndPoint.reportservice,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}

// to save the data in student engagement table
export async function updateStudentData(engagementId, dbUserId,centerId,createdBy,updatedBy,remarks,status,linkedEngagementId,reason) {
    if(isSessionValid()){
    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "updateStudentEngagement", "data" : [{ "engagementId" : '+engagementId+' , "dbUserId" : '+dbUserId+' , "centerId" : '+centerId+' , "createdBy" : '+createdBy+',"updatedBy" : '+updatedBy+',"remarks" : "'+remarks+'","status" : "'+status+'", "linkedEngagementId" : '+linkedEngagementId+' ,"reason" : "'+reason+'", }] }');
    if(!isTokenValid()) 
        await regenerateToken();                                                                      
   return  fetch(serviceEndPoint.engagementServiceEndPoint,{
     method: "POST",
     headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
     body: requestFormData,
     }).then(response => response.json());
    }
    return null;
}
// for forget password
export async function CheckIfUserWithDetailsExists (emailAddress,userName) {

    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "CheckIfUserWithDetailsExists", "data" : [{  "emailAddress" : "'+emailAddress+'","userName" : "'+userName+'" }] }');
    
   return  fetch(serviceEndPoint.loginService,
   {
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());  
  return null;
}


export async function ResetPasswordWithoutLoggingIn (id,password) {

    let requestFormData = new FormData();  
    requestFormData.append('data', '{"token" : "", "action" : "ResetPasswordWithoutLoggingIn", "data" : [{  "id" : "'+id+'","password" : "'+password+'" }] }');
    
   return  fetch(serviceEndPoint.loginService,
   {
     method: "POST",
     body: requestFormData,
     }).then(response => response.json());  
  return null;
}

// for virtual student list
export async function fetchStudentDataOfVirtualCenter(centerId)
{if(isSessionValid()){
    let requestFormData = new FormData();  
   
      requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenter", "data" : [{"centerId":"'+centerId+'"}]}');
    if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.engagementServiceEndPoint,{
            method: "POST",
            headers: {
              'Authorization': 'Bearer '+UserContext.token
          },
            body: requestFormData,
            }).then(response => response.json())
}
return null;
}
// Address baised on entity id and state and premanant state
export async function fetchAddressBaiedOnIdAndState(entityId,type,state){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data','{"token":"","action":"viewAddressByEntityIdAndTypeAndState","data":[{"entityId":"'+entityId+'","type":"'+type+'","state":"'+state+'"}]}')
        if(!isTokenValid()) 
        await regenerateToken();
        return fetch(serviceEndPoint.addressServiceEndPoint,{
            method: "POST",
            headers: {
              'Authorization': 'Bearer '+UserContext.token
          },
            body: requestFormData,
            }).then(response => response.json())
    }
    return null;
}
// updating center id in student engagement table
export async  function updateCenterId(centerId,updatedBy ,engagementId){
    if(isSessionValid()){
        let requestFormData = new FormData();
        requestFormData.append('data','{"token":"","action":"updateCenterIdBaisedOnEngagementId","data":[{"centerId":"'+centerId+'","updatedBy":"'+updatedBy+'","engagementId":"'+engagementId+'"}]}');
        if(!isTokenValid())
        await regenerateToken();
        return fetch(serviceEndPoint.engagementServiceEndPoint,{
            method:"POST",
            header:{
                'Authorization': 'Bearer'+UserContext.token
            },
            body: requestFormData,
        }).then(response => response.json())
    }
    return null;
}
