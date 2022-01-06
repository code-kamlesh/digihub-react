import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BasicForm from "./BasicForm.js";
import Education from "./Education.js";
import Family from "./FamilyDetails.js";
import SocioEconomic from "./SocioEconomicDetails.js";
import FamilyDetails from "./FamilyDetailsNew.js";
import Experience from "./ExperienceDetails.js";
import BusinessCase from "./BusinessCase";
import AssessorEvaluation from "./AssessorEvaluation.js";
import ObservationDetails from "./Observationdetails.js"
import UserContext from './../components/GolbalContext'
import Counselling from "./Counselling";
import Shortlist from "./Shortlist";
import Recommend from "./Recommend";
import EnrollmentDetails from "./EnrollmentDetails";
import CourseEnrollment from "./CourseEnrollment";
import DetailsPage from './DetailsPage.js'; 
import BusinessEvaluation from "./BusinessEvaluation"
import Documents from "./Documents"
import {useSelector,useDispatch} from 'react-redux';
import {updateBeneficiary} from './../datamanagement/actions.js'
import ExistingBusiness from "./ExistingBusiness.js"
import PlacementDetails from "./PlacementDetails.js"

import ComponentVisibility from './../util/ComponentVisibility';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`scrollable-force-tabpanel-${index}`}
    aria-labelledby={`scrollable-force-tab-${index}`}
    {...other}
  >
    {value === index && <Box p={3}>{children}</Box>}
  </Typography>
  );

  
}
 
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  
  return {
    id: `scrollable-force-tabpanel-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'theme.palette.background.paper',
  },
}));

export default function Mobilize(props) {


  const dispatch=useDispatch();
  if(props.location.state != null){
  dispatch(updateBeneficiary({dbUserId:props.location.state.dbUserId,engagementId:props.location.state.engagementId,
                              name:props.location.state.name,linkedEngagementId:props.location.state.linkedEngagementId,
                              status:props.location.state.status}));

  }
  const benificiary=useSelector(state=>state.beneficiay);
  const classes = useStyles();
  let [value, setValue] = React.useState(0);
  

  const handleChange = (event, newValue) => {
    try
    {
      props.location.state.tab = newValue; 
     // alert("testing"+newValue);
      props.location.state.tab = newValue;
    
    }
    catch(e)
    {
      alert("Please fill basic details first");
      newValue = 0;
    }

    setValue(newValue);

  };
  
  if(props.location.state != null){
    console.log("x" + value);
    value = props.location.state.tab;
    console.log("i" + value);
  return (
    <div className={classes.root}>
      <DetailsPage dbUserId = {props.location.state.dbUserId} engagementId = {props.location.state.engagementId} name = {props.location.state.name} />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable"
          scrollButtons="on">
          <Tab label="Basic" {...a11yProps(0)}   />
          <Tab label="SocioEconomic"  {...a11yProps(1)} />
          <Tab label="Education"  {...a11yProps(2)} />
          <Tab label="Family" {...a11yProps(3)}  />
          <Tab label="Experience" {...a11yProps(4)} />
           <Tab label="Counselling" {...a11yProps(5)}  
           />
            <Tab label="Observation" {...a11yProps(6)}  hidden = {ComponentVisibility.ObservationDetails=='N'?true:props.location.state.status != 'Mobilised' ? true : false }/>
            <Tab label="Existing Business" {...a11yProps(7)} hidden={ComponentVisibility.ExistingBusiness=='N'?true:false}/>
            <Tab label="Business Case Brief" {...a11yProps(8)} hidden={ComponentVisibility.BusinessCase=='N'?true:false}  
          //   hidden = { props.location.state.status != 'Mobilised' 
          //  ? true : false }
          />
          <Tab label="Recommend" {...a11yProps(9) }   hidden={ComponentVisibility.Recommend=='N'?true:false}/>
          <Tab label="Assessor Evaluation" {...a11yProps(10)} hidden = {ComponentVisibility.AssessorEvaluation=='N'?true:props.location.state.status == 'Mobilised' ? false : true} />
          <Tab label="Enrollment" {...a11yProps(11)} hidden = {(ComponentVisibility.EnrollmentDetails=='N'?true: (props.location.state.status == 'Shortlisted' || props.location.state.status == 'Enrolled')? false : true)} />
          <Tab label="Business Evaluation" {...a11yProps(12)} hidden = {UserContext.roleid === 3 && props.location.state.status == 'Shortlisted'  ?  false: true } />
          <Tab label="Documents" {...a11yProps(13)}/>
          <Tab label="Placement" {...a11yProps(14)} hidden = {true} />
         <Tab label="Course Enrollment" {...a11yProps(15)} hidden = {(ComponentVisibility.CourseEnrollment=='N'?true: (props.location.state.status == 'Shortlisted' || props.location.state.status == 'Enrolled')? false : true)}/> 
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} >
        <BasicForm 
        // id = {props.location.state.dbUserId} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId}  history={props.history} status={props.location.state.status} 
        id = {benificiary.dbUserId} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId}  history={props.history} status={benificiary.status} 
        />
      </TabPanel>

      <TabPanel value={value} index={1} >
      <SocioEconomic  id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history} ></SocioEconomic> 
       
    
      </TabPanel>


      <TabPanel value={value} index={2} >
       <Education 
       // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
       id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history} 
       
       />
      </TabPanel>
      {/* <TabPanel value={value} index={2}>
       <Family id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} />
      </TabPanel> */}
        <TabPanel value={value} index={3}>
       <FamilyDetails 
       // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history}
       id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history}
       />
      </TabPanel>
      <TabPanel value={value} index={4}>
       <Experience 
      // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
       id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history} 
       />
      </TabPanel>
      <TabPanel value={value} index={5}>
       <Counselling 
    //   id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
         id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} name = {benificiary.name} history={props.history}  
      />
      </TabPanel>
      <TabPanel value={value} index={6}>
      <ObservationDetails 
     //  id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history}
     id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history}
       />
      </TabPanel>


      <TabPanel value={value} index={7}>
       <ExistingBusiness  
       history={props.history}  id ={benificiary.dbUserId} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId}
       />
      </TabPanel>



      <TabPanel value={value} index={8}>
      <BusinessCase 
     // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId}
     id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId}
     />
      </TabPanel>
      <TabPanel value={value} index={9}>
       <Recommend 
     //  id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} hidden = {UserContext.roleName == 'Center Manager' ? true : false } 
      id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history} hidden = {UserContext.roleName == 'Center Manager' ? true : false }
       />
      </TabPanel>
      <TabPanel value={value} index={10}>
      <AssessorEvaluation  
     // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history}
     id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history}
      />
      </TabPanel>
      <TabPanel value={value} index={11}>
       <EnrollmentDetails 
      // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
      id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history} 
       />
      </TabPanel>
      <TabPanel value={value} index={12}>
       <BusinessEvaluation 
       // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
       id = {benificiary.dbUserId} status={benificiary.status} engagementId = {benificiary.engagementId} linkedEngagementId = {benificiary.linkedEngagementId} history={props.history}
       />
      </TabPanel>
      <TabPanel value={value} index={13}>
       <Documents  
       // history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}
       history={props.history}  id ={benificiary.dbUserId} engagementId = {benificiary.engagementId}
       />
      </TabPanel>

      <TabPanel value={value} index={14}>
       <PlacementDetails  
       // history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}
       history={props.history}  id ={benificiary.dbUserId} engagementId = {benificiary.engagementId}  status={benificiary.status}
       />
      </TabPanel>
	  
	  <TabPanel value={value} index={15}>
       <CourseEnrollment 
      // id = {props.location.state.dbUserId} status={props.location.state.status} engagementId = {props.location.state.engagementId} linkedEngagementId = {props.location.state.linkedEngagementId} history={props.history} 
      id = {benificiary.dbUserId} engagementId = {benificiary.engagementId} history={props.history} 
       />
      </TabPanel>
	  
	  
    </div>
    
  );
}
else
{
  console.log("hello");
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable"
          scrollButtons="on">
          <Tab label="Basic" {...a11yProps(0)} />
          <Tab label="SocioEconomic" {...a11yProps(1)} />
          <Tab label="Education" {...a11yProps(2)} />
          <Tab label="Family" {...a11yProps(3)} />
          <Tab label="Experience" {...a11yProps(4)} />
           <Tab label="Counselling" {...a11yProps(5)} hidden = {UserContext.roleid != 3 ? false : true } />
           <Tab label="Observation" {...a11yProps(6)}  hidden = {ComponentVisibility.ObservationDetails=='N'?true:false}/>
           <Tab label="Existing Business" {...a11yProps(7)} hidden={ComponentVisibility.ExistingBusiness=='N'?true:false}/>
           <Tab label="Business Case Brief" {...a11yProps(8)} hidden={ComponentVisibility.BusinessCase=='N'?true:false}  
          //  hidden = {UserContext.roleName == 'Center Manager'  ? true : false } 
           
           />
          <Tab label="Recommend" {...a11yProps(9) }  hidden={ComponentVisibility.Recommend=='N'?true:false}/>
          <Tab label="Assessor Evaluation" {...a11yProps(10)} hidden = {ComponentVisibility.AssessorEvaluation=='N'?true:false} />
          <Tab label="Enrollment" {...a11yProps(11)} hidden = {ComponentVisibility.EnrollmentDetails=='N'?true:false} />
          <Tab label="Business Evaluation" {...a11yProps(12)} hidden = {UserContext.roleid === 3  ?  false: true } />
          <Tab label="Documents" {...a11yProps(13)}/>
           <Tab label="Placement" {...a11yProps(14)} hidden = {true} />
		   <Tab label="Course Enrollment" {...a11yProps(15)} hidden = {ComponentVisibility.CourseEnrollment=='N'?true:false}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <BasicForm history={props.history} />
      </TabPanel>



      <TabPanel value={value} index={1} >
      <SocioEconomic   history={props.history}   id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Education history={props.history}   id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      {/* <TabPanel value={value} index={2}>
      <Family history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel> */}


<TabPanel value={value} index={3}>
       <FamilyDetails history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Experience history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Counselling history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''}  engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>    
      <TabPanel value={value} index={6}>
      <ObservationDetails    id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={7}>
       <ExistingBusiness  
       history={props.history}  id ={benificiary.dbUserId} engagementId = {benificiary.engagementId}
       />
      </TabPanel>
      <TabPanel value={value} index={8}>
      <BusinessCase  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={9}>
      <Recommend   id ={props.location.state!=null?props.location.state.dbUserId:''} history={props.history} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={10}>
      <AssessorEvaluation  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={11}>
      <EnrollmentDetails  id ={props.location.state!=null?props.location.state.dbUserId:''} history={props.history} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={12}>
       <BusinessEvaluation  history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={13}>
       <Documents  history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
      <TabPanel value={value} index={14}>
       <PlacementDetails  history={props.history}  id ={props.location.state!=null?props.location.state.dbUserId:''} engagementId = {props.location.state!=null?props.location.state.engagementId:''} />
      </TabPanel>
	   <TabPanel value={value} index={15}>
      <CourseEnrollment  id ={props.location.state!=null?props.location.state.dbUserId:''} history={props.history} engagementId = {props.location.state!=null?props.location.state.engagementId:''}/>
      </TabPanel>
 
    </div>
  );
}
}
