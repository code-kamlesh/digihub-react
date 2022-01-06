const beneficiaryReducer = (state={dbUserId:0,engagementId:0,name:'',linkedEngagementId:0,status:''},action) =>{

switch (action.type) {
    case 'updateBeneficiary':
           state.engagementId=action.payload.engagementId;
           state.dbUserId=action.payload.dbUserId; 
           state.name=action.payload.name;
           state.linkedEngagementId=action.payload.linkedEngagementId;
           state.status=action.payload.status;
           return state;    
           break;

    default:
        return state;
        break;
}
};
export default beneficiaryReducer;