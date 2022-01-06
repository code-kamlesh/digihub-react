import React, { Component } from 'react';

import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'

import Card from "./../components/Card/Card.js";
import GridContainer from "./../components/Grid/GridContainer.js";
import GridItem from "./../components/Grid/GridItem.js";

import Button from '@material-ui/core/Button';
import { changeStudentStatus , fetchBusinessIdeaEvaluationData, FetchFinalScoreForBusinessIdea }from './../util/api';
  import { FormControl , FormControlLabel ,TextField, InputLabel, Input, Grid , RadioGroup, Radio}  from '@material-ui/core';

import UserContext from '../components/GolbalContext'
import {checkButton, getBusinessCaseDocument ,getExperienceDetails, getBasicDetails, getAddressData , getFamilyData, getObservationData, getBusinessCaseData,getExistingBusiness,
  validateInterestInventory,getSocioEconomicData,validateEducationData} from './../util/validation';
import MUIDataTable from "mui-datatables";
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import { serviceEndPoint } from './../util/serviceEndPoint';

//import MasterData from './../components/MasterData.js'


const customStyles = {
  ShorlistedRow: {
    '& td': {backgroundColor: "#B3F9A2"}
  },
  RejectedRow: {
      '& td': {backgroundColor: "#F80606"}
    },
  NameCell: {
    fontWeight: 900
  },
};
class Recommend extends Component
{
    constructor(props) {
       super(props);
     
        this.state = {valid : true , res : {} , selectedIndex : [] , rowsSelected : {'dbUserId' : '', 'engagement_id' : ''},disabled : false , flag : "0" ,errors : {},bieData:[], info:[],linkedEngagementId: props.linkedEngagementId, engagementData : {},engagementId : props.engagementId,dbUserId : props.id, recommendData : {action : "" ,remarks : "" , actionedBy : UserContext.userid ,roleid:UserContext.roleid,roleName:UserContext.roleName}}
        this.handleInputChange = this.handleInputChange.bind(this);
       
        if(props.id != null && props.id != undefined)
        {
          this.state.engagementId=props.engagementId;
          this.getRecommendData(this.state.engagementId);
          this.state.linkedEngagementId=props.linkedEngagementId;
          this.setState({
            linkedEngagementId: {
              ...this.state.linkedEngagementId
             
            }
          })
        } this.fetchStudentDetails();
    }

    componentDidMount()
    {
      if(UserContext.roleid == 4)
      {

        getBasicDetails(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['basic'] : result
          }
        }));
        getSocioEconomicData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['socio'] : result
          }
        }));

        validateEducationData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['education'] : result
          }
        }));

        getFamilyData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['family'] : result
          }
        }));

        getExperienceDetails(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['experience'] : result
          }
        }));

//observation is only mandatory for existing student of TS not for outside TS
        
        if(this.state.linkedEngagementId != 0 &&  this.state.linkedEngagementId!=null ){
          //  alert(this.state.linkedEngagementId)
           getObservationData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
             res : {
               ...this.state.res , ['ob'] : result
           }
           }))};
       
        validateInterestInventory(this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['inventory'] : result
          }
        }));
        getAddressData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['address'] : result
          }
        }));

        

        getExistingBusiness(this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['existingBusiness'] : result
          }
        }));
        getBusinessCaseData(this.state.engagementId , this.state.dbUserId).then(result => this.setState({
          res : {
            ...this.state.res , ['bc'] : result
          }
        }));
        getBusinessCaseDocument(this.state.engagementId).then(result => this.setState({
          res : {
            ...this.state.res , ['document'] : result
          }
        }));

      
      

      


      }
    }


    handleInputChange(event) {
      this.setState({
        "disabled" : false
      });
        const target = event.target;
        const value =  (target.value);
        const name = target.name;
        this.setState({
          recommendData: {
            ...this.state.recommendData,
            [name]: value
          }
        })
        this.setState({
          errors: {
            ...this.state.errors,
            [name] : {
              'label' : "" , 
              'value' : false
            }
          }
      });
      }
      validateAll() 
      {
        var json = this.state.recommendData;
        var errors = this.state.errors;
        Object.keys(json).forEach(function(key) {
            if(json[key] == undefined || json[key] == '' )
            {
              let res = "Please fill out this field";
                errors[key] = {
                    'label' : res , 
                    'value' : res == "" ? false : true 
                  }
           }
        });
            this.state.errors = errors;
            if(checkButton(this.state.errors))
            {
              this.state.disabled = false;
            }
            else
            {
              this.state.disabled = true;
          }
      }
      getRecommendData(eng)
      {
        let formData = new FormData();
      //alert(JSON.stringify(this.state));
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "viewStudentEngagementById", "data" : [{ "engagementId" : ' + eng + '}]}');
          return fetch(serviceEndPoint.engagementServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json()).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  this.setState({engagementData :jsonobjects[0]});
                  console.log(jsonobjects);  
              }  else{
                  console.log("error");
              } 
           })
      }
      mySubmitHandler3 = event => {

        event.preventDefault();
        this.validateAll();
        this.setState({
          errors : this.state.errors
        });
        if(this.state.recommendData.remarks != "" && this.state.recommendData.action != "" )
        {
          this.submitEngagement(this.state.dbUserId,this.state.engagementId);
        }
        else
        {
          alert("Please enter remarks and valid action");
        }
      }
    mySubmitHandler = (event) => {
        event.preventDefault();
        this.submitRecomendation(this.state.rowsSelected.dbUserId,this.state.rowsSelected.engagement_id);
    }


    mySubmitHandler1 = (event) => {
      event.preventDefault();
     // this.validateAll();
     // this.submitRecomendation(this.state.rowsSelected.dbUserId);
     this.submitRejection(this.state.rowsSelected.dbUserId);
      
      
  }
    fetchStudentDetails() {
      this.setState({info: []});
      let studentInfo=[];
      let requestFormData = new FormData();  
        requestFormData.append('data', '{"token" : "", "action" : "viewAllByCenterAndStatus", "data" : [{"centerId":'+UserContext.centerId+',"status":"Shortlisted"}]}');
      fetch(serviceEndPoint.engagementServiceEndPoint,{
      method: "POST",
      headers: {
        'Authorization': 'Bearer '+UserContext.token
    }, 
      body: requestFormData,
      }).then(response => response.json()).then((jsondata)=>{  
        let score;  
        let  studentDetails = JSON.parse(jsondata.data);  
              for(let i=0;i<studentDetails.length;i++){
               FetchFinalScoreForBusinessIdea(studentDetails[i].engagementId).then((jsondata)=>{

                score = jsondata.data;
              //  alert(score);
                if(score != -1 )
                {
                 // alert("alalal");
                     var  details =
                       { 'engagement_id':studentDetails[i].engagementId,  
                           'name' :studentDetails[i].firstName+" "+studentDetails[i].lastName,
                           'dbUserId':studentDetails[i].dbUserId,
                           'score':score
                       }; 
                  studentInfo.push(details);  
                  
                  this.setState({
                   info: studentInfo
                     
                   })
                }
               });   
          }    
       })  
  }
  
   // function for recomendation

   submitRecomendation(dbUserId,linkedEngagementId){
    // alert("recomend");
    let formData = new FormData();
   
        formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "captureStudentEngagement" +'", "data" : [{ "dbUserId"  : ' + dbUserId + ' , "centerId" : ' + UserContext.assessmentCenterId + ', "createdBy" : ' + UserContext.userid + ', "remarks" : "Recommended","status" : "Mobilised","linkedEngagementId" : '+linkedEngagementId+'} ]}');
        //alert(JSON.stringify(formData));
          fetch(serviceEndPoint.engagementServiceEndPoint, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer '+UserContext.token
      }, 
        body: formData 
        }).then(response => response.json()).then((jsondata)=>{
            console.log(jsondata); 
         
            if(jsondata.appError==null){      
                let jsonobjects = JSON.parse(jsondata.data);
                this.setState({count1 :jsonobjects});
                console.log(jsonobjects);  
                this.fetchStudentDetails();
            }  else{
                console.log("error");
            } 
         })

        
    let statusChangeData='"engagementId":'+this.state.rowsSelected.engagement_id+',"status": "' +"Recommended" +  '","updatedBy":' + UserContext.userid + ', "remarks" : "Recommended"' ;
    //alert(statusChangeData);
    changeStudentStatus(statusChangeData).then((jsondata) => { 
      //alert("changed status"+statusChangeData);
        console.log(jsondata.data);
            alert("Status changed successfully");
            this.props.history.push({
              pathname: '/dashboard/recommend'
            });
            
      });
   }

   // Function for Rejection

   submitRejection(){
//alert("reject");
    let statusChangeData='"engagementId":'+this.state.rowsSelected.engagement_id+',"status": "' +"Not Recommended" +  '","updatedBy":' + UserContext.userid + ', "remarks" : "Rejected  "' ;
    //alert(statusChangeData);
    changeStudentStatus(statusChangeData).then((jsondata) => { 
      //alert(statusChangeData);
        console.log(jsondata.data);
            alert("Status changed successfully");
            this.fetchStudentDetails();
            
      });
   }

   

submitEngagement(dbUserId,engId)
{
 
  let newStatus = "";
  //document.getElementById("save").setAttribute("disabled", true);
    if(this.state.recommendData.action == "Recommended" && UserContext.roleid === 3)
    {
      let formData = new FormData();
      //alert(JSON.stringify(this.state));
          //formData.append('data', '{"token" : "'+this.state.token+'", "action" : "'+this.state.action+'", "data" : [{"userName":"'+this.state.email+'","password":"'+this.state.password+'"}]}');
          formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  "captureStudentEngagement" +'", "data" : [{ "dbUserId"  : ' + dbUserId + ' , "centerId" : ' + "760" + ', "createdBy" : ' + UserContext.userid + ', "remarks" : " ","status" : "Mobilised","linkedEngagementId" : '+engId+'} ]}');
         // alert(formData);
           fetch(serviceEndPoint.engagementServiceEndPoint, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData 
          }).then(response => response.json()).then((jsondata)=>{
              console.log(jsondata); 
              if(jsondata.appError==null){      
                  let jsonobjects = JSON.parse(jsondata.data);
                  this.setState({count1 :jsonobjects});
                  console.log(jsonobjects);  
              }  else{
                  console.log("error");
              } 
           })
    }
   if(UserContext.roleid === 3)
   {
     newStatus = this.state.recommendData.action;
   }
   else
   {
  //  newStatus = this.state.recommendData.action == "Recommended" ? "Shortlisted" : "Mobilised" ;
   
if(this.state.recommendData.action === "Recommended"){newStatus="Shortlisted"}
else if(this.state.recommendData.action === "Not Recommended"){newStatus="Rejected"}
}
    let statusChangeData='"engagementId":'+this.state.engagementId+',"status": "' +newStatus +  '","updatedBy":' + UserContext.userid + ', "remarks" : "' + this.state.recommendData.remarks + '"' ;
    //alert(statusChangeData);
    changeStudentStatus(statusChangeData).then((jsondata) => { 
      //alert(statusChangeData);
        console.log(jsondata.data);
            alert("Status changed successfully");
            this.props.history.push({
              pathname: '/dashboard/managebeneficiary'
            });
      });

}
render()
{
  let res = [];
  if(UserContext.roleid == 4)
  {
    if(this.state.res.basic)
    {
      res.push("Basic details");
    }
    if(this.state.res.address)
    {
      res.push("Address details");
    }
    if(this.state.res.family)
    {
      res.push("Family details");
    }
    if(this.state.res.experience)
    {
      res.push("Experience details");
    }
    if(this.state.res.bc)
    {
      res.push("Business case");
    }
    if(this.state.res.document)
    {
      res.push("Business case document not uploaded");
    }
    if(this.state.res.ob)
    {
      res.push("Observations details");
    }
    if(this.state.res.inventory)
    {
      res.push("Interest Inventory details");
    }
    if(this.state.res.existingBusiness)
    {
      res.push("Existing Business details");
    }

    if(this.state.res.socio)
    {
      res.push("SocioEconomic details");
    }

    if(this.state.res.education)
    {
      res.push("Education details");
    }


  }
  const columns = [
  {label: 'Engagement Id', name: 'engagement_id',options : {
    sortDirection : 'desc'
  },headerStyle: {color:'#FF9800'}},
  {label: 'Name', name: 'name',headerStyle: {color:'#FF9800'}},
 {label: 'Percent', name: 'score',headerStyle: {color:'#FF9800'}}
  
   
 ]
 
  const options = {
    filterType: "dropdown",
  //  responsive: "scroll",
    sortDirection: "desc",
    selectableRows : 'single',
    disableToolbarSelect:true,
    // textLabels: {
    //   body: {
    //     noMatch: <span style={{color:"blue"}}>Please wait data is loading...</span>
    //   }
    // },
    rowsSelected : this.state.selectedIndex,
    onRowsSelect: (allRows) => {
        let rows = this.state.selectedIndex;
        rows[0] = allRows[0].dataIndex;
        this.setState({
          rowsSelected : this.state.info[allRows[0].dataIndex],
          selectedIndex : rows
        }) // this is the row in your data source       
   },


   setRowProps: (row) => {
    for(var i=0;i<this.state.info.length;i++){
     // alert(row[0]);
            return {         
                className: classnames(
                  {[this.props.classes.ShorlistedRow]: row[2] > 40,
                  [this.props.classes.RejectedRow]: row[2] < 40
                  }),
              };
    }
            },
  };


  const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
  let button;
  let displayText;
    button =   <Button id = "save" variant="contained" type="submit" color="primary" disabled = {this.state.disabled}>
    Save
  </Button>;

      if(this.state.engagementData.status == "Recommended" && UserContext.roleid === 3)
      {
        displayText = 
        <Grid item xs={12} sm={8}>
          <h2>Already Recommended</h2>
          </Grid>;
          button = "";
      }
      else if(this.state.engagementData.status == "Shortlisted" && UserContext.roleName == "Change leader/Facilitator")
      {
        displayText = 
        <Grid item xs={12} sm={8}>
          <h2>Already Shortlisted</h2>
          </Grid>;
          button = "";
      }
      else if(this.state.engagementData.status == "Not Recommended" )
      {
        displayText =
        <Grid item xs={12} sm={8}>
        <h2>Already Rejected</h2>
        </Grid>;
        button = "";
      }
      
      else{
        displayText =
          <Grid item xs={12} sm={8}>
          <FormControl>
          <RadioGroup row aria-label="recommend" name="action"  onChange={this.handleInputChange}>
          <FormControlLabel value="Recommended" control={<Radio />} label="Approve" />
          <FormControlLabel value="Not Recommended" control={<Radio />} label="Reject" />
        </RadioGroup>
            </FormControl>
      </Grid>;
      }
       if(res.length != 0)
      {
        
      button = <ul> {res.map((item) => (
        <li><h4 style = {{fontWeight : "600" , color : "red"}}> {item}</h4></li>
    )) }
  </ul>
      }
   if (UserContext.roleid === 3){
    return (
  <div style = {{ width : '100%' }}>
    
    <MUIDataTable  title={"Evaluation Completed Student list"} label={"List of Students"} data={this.state.info} columns={columns} options={options}
      />
      { 
            (this.state.info.length!=0) &&
      <GridContainer> 
    
<form onSubmit={this.mySubmitHandler} method="post">
<GridItem xs={12} sm={6} md={12}>
  
              <Card>  
                <Button variant="contained" type="submit" color="primary"  size="small" disabled={this.state.rowsSelected.engagement_id==null?true:false} >  
               
                Recommend 
                </Button>
              </Card>                   
            </GridItem>
            
</form>

<form onSubmit={this.mySubmitHandler1} method="post">

            <GridItem xs={12} sm={6} md={3}>
              <Card>  
                <Button variant="contained" type="submit" color="primary"  size="small" disabled={this.state.rowsSelected.engagement_id==null?true:false}  >  
                  Reject
                </Button>
              </Card>                   
            </GridItem>
        </form>
   
            </GridContainer>
   }
   </div>

    );
      }
      else{
        return(
        <div style = {{ width : '100%' }}>
        <form onSubmit={this.mySubmitHandler3} method="post">
       <Grid container spacing={2}>
        
            <Grid item xs={12} sm={6}>
             <FormControl>
              <TextField type = "text"
                label="Remarks"
                name = "remarks"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText = {this.state.errors.remarks != undefined ? this.state.errors.remarks.label : '' } 
              error = {this.state.errors.remarks != undefined ? this.state.errors.remarks.value : '' }
                onChange={this.handleInputChange}
              />
          </FormControl>   
            </Grid>
            <Grid item xs={12} sm={6}>
              </Grid>
             {displayText}
            
          </Grid>
    
          <br/>
          { 
  (res.length != 0) && <div>Below details are incomplete</div>
    }

          
          {button}
        
        </form>
        </div>
        );

      }
}

}
export default withStyles(customStyles, {name: "Recommend.js"})(Recommend) ;