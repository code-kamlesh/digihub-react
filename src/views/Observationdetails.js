import React, { Component } from 'react';

import './../App.css';
import './../assets/css/login-style.css'
import './../assets/css/font-awesome.min.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { FormControlLabel , RadioGroup, Radio}  from '@material-ui/core';
import UserContext from '../components/GolbalContext'
import MUIDataTable from "mui-datatables";
import { fectUserDetails, fetchUsersByCenterId, fetchUserDetailsById,saveObservationDetails,fetchObservationdetails,
  findAllObservationdetails } from './../util/api';


class ObservationDetails extends Component
{
    constructor(props) {
       super(props);
       this.state = {disabled : false, count : 0 , rows : [] , dbUserId : props.id ,  firstName : props.name,  engagementId : props.engagementId,observationData:[{createdBy : UserContext.userid, createdOn:UserContext.createdOn, dbUserId:UserContext.dbUserId
       }]};
     // alert(this.state.createdOn);
        this.mydata = {observationssData:[],
          users:[]
         };
        this.handleInputChange = this.handleInputChange.bind(this);
       // this.getUserDetails = this.getUserDetails.bind(this);
         this.getObservationMasters();
        this.fetchObservationDetails();
        this.fetchUserDetailsByCenterId();
    }
    handleInputChange = idx => e => {
      this.setState({
        "disabled" : false
      });
      const rows = [...this.state.rows];
      const question = document.getElementById(idx).getAttribute("value");
      const { name, value } = e.target;
      rows[idx] = {};
      rows[idx] [name]= value;
      rows[idx]['parameter'] = question;
      rows[idx]['dbUserId'] = this.state.dbUserId;
      rows[idx]['createdBy'] = UserContext.userid;
      rows[idx]['createdOn'] = UserContext.createdOn;
      rows[idx]['engagementId'] = this.state.engagementId;
      rows[idx]['firstName'] = this.state.firstName;
      this.setState({
        rows
      });
      
    //  alert(JSON.stringify(this.state.rows));
    };

    mySubmitHandler = (event) => {
        event.preventDefault();
        if(this.mydata.observationssData.length == this.state.rows.length)
        {
          this.submitObservationDetails();
        }
        else
        {
          alert("Please provide value for all observation parameters.")
        }
        this.state.disabled = true;
        //document.getElementById("observation-form").reset();
       // this.refs["user-form"].form.reset()
    }
   

    submitObservationDetails()
{
 // alert("submit observtn");
 let formData = new FormData();
 let action = "";
 const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
   if (dbUserId) {
     action =  "captureObservations";
   } else {
     action =  "captureObservations";
   }
  // alert(action);
 
   //  formData.append('data','{"token" : "'+ "1234" +'", "action" : "'+  action +'", "data" : ' + JSON.stringify(this.state.rows) + '}');
 
    //  return fetch("http://playground.tatastrive.com/sservices-v1/observationservice", {
    //  method: "POST",
    //  body: formData 
    //  }).
    saveObservationDetails(action,this.state.rows).then((jsondata)=>{
         console.log(jsondata); 
        // alert(jsondata);
         if(jsondata.appError==null){      
             let jsonobjects = JSON.parse(jsondata.data);
             console.log(jsonobjects); 
           
             if(action == 'captureObservations')
             {
           
             alert("Observation Details Saved Successfully");

             }
            this.fetchObservationDetails();

             this.props.history.push({
                pathname: '/dashboard/updatebeneficiary',
                 state: { dbUserId: jsonobjects[0].dbUserId, engagementId : this.state.engagementId,status:this.props.status ,  tab : 6 }
               });
            //  this.props.history.push({
            //    pathname: '/dashboard/updatebeneficiary',
            //     state: {  tab : 7 }
            //   });
            
           

            //  else 
            //  {
              
            //    alert("Successfully Updated");
            //  }
            // // alert( this.state.rows.length);
            //  this.setState({
            //    count :  this.state.rows.values.reset
            //   });

              // this.props.history.push({
              //   pathname: '/dashboard/updatebeneficiary',
              //   state: { dbUserId: jsonobjects[0].dbUserId, engagementId : this.state.engagementId,status:this.props.status ,  tab : 5 }
              // });
           
            

         }  else{
             console.log("error");
         } 
      })
      
 
}

fetchUserDetailsByCenterId() {


  fetchUsersByCenterId(UserContext.centerId).then((jsondata) => {
    let dbUserId = [];
  let userCenterRoleMap = JSON.parse(jsondata.data);
  userCenterRoleMap.map(item => {dbUserId.push({ id: item.userId })  });
  
  fetchUserDetailsById(JSON.stringify(dbUserId)).then((jsondata) => {
    let userDetails = JSON.parse(jsondata.data);
    for (var i = 0; i < userDetails.length; i++) {
      let user = userDetails[i];
      this.mydata.users.push({label : user.firstName + " " + user.lastName , value : user.id});
     //alert(JSON.stringify(this.myData.users)) ;
     
    }
  });
});
}
    getObservationMasters(){

      // let formData = new FormData();
      // formData.append('data','{"token" : "'+ "1234" +'", "action" : "findall" , "data" : [{}]}');
      // fetch("http://playground.tatastrive.com/services-v1/observationservice", {
      //     method: "POST",
      //     body: formData 
      //     }).then(response => response.json())
          
          findAllObservationdetails().then((jsondata)=>{
              console.log(jsondata); 
             // alert(jsondata);
             //aler("check");
              if(jsondata.appError==null){     
                  let jsonobjects = JSON.parse(jsondata.data);
                  
                 jsonobjects.map(item => { this.mydata.observationssData.push({label: item.name, value: item.id})
                 })
                 this.setState({mydata : jsonobjects});
              } 
              return (true);
           }).then(response => response);
          }
  
          fetchObservationDetails() {
          
            let observationInfo=[];
            let requestFormData = new FormData();  
            // requestFormData.append('data', '{"token" : "", "action" : "viewAllObservationsForUser", "data" : [{"engagementId":'+this.state.engagementId+'}]}');
            // fetch("http://playground.tatastrive.com/sservices-v1/observationservice",{
            // method: "POST",
            // body: requestFormData, 
            // })
            fetchObservationdetails(this.state.engagementId).then((jsondata)=>{
              console.log(jsondata.data)  ; 
              let  observationDetails = JSON.parse(jsondata.data);  
             // alert(JSON.stringify(observationDetails));

                    for(let i=0;i<observationDetails.length;i++){
                      let name = "";
                      fectUserDetails(observationDetails[i].createdBy).then((jsondata) => {
                        name  =  JSON.parse(jsondata.data)[0].firstName + " " + JSON.parse(jsondata.data)[0].lastName;
                        var  details =
                     {   
                         'engagement_id':observationDetails[i].engagementId,
                         'first_name' : name,
                         'created_on':observationDetails[i].createdOn
                          
                     }; 
                     observationInfo.push(details);
                     this.setState({
                      info: observationInfo
                        });  
                  }); 
                }    
               
             }) 
        }
        
    
render()
{
  
  const columns = [{label: 'Engagement Id', name: 'engagement_id',headerStyle: {color:'#FF9800'}},
                
                 {label: 'Created On', name: 'created_on',headerStyle: {color:'#FF9800'}},
                 {label: 'Name', name: 'first_name',headerStyle: {color:'#FF9800'}}
 
   
 ]
 
  const options = {
    filterType: "dropdown",
    responsive: "scroll",
    selectableRows: false,
    sortDirection: "desc"
  };

  const dbUserId = (this.state.dbUserId == '' || this.state.dbUserId == null);
  let button;

  if (dbUserId) {
    button =   <Button variant="contained" type="submit" color="primary" >
    Save
  </Button>;
  } else {
    button = <Button type="submit" variant="contained" color="primary" >Save</Button>;
  }
  if(UserContext.roleid != 3)
  {
    return (
      
      <div style = {{ width : '100%' }}>
    
          
        <form onSubmit={this.mySubmitHandler} method="post" id="observation-form">
       
        <Paper >
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width="60%">Observation Parameter</TableCell>
                <TableCell >Observation Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {this.mydata.observationssData.map((row, idx)=> (
                <TableRow key={row.value} name ="parameter" required id="parameter">
                  <TableCell id = {idx} name="parameter" value= {row.value}>
               {row.label}
                  </TableCell>
                  <TableCell align=""> 
                  <RadioGroup row aria-label="observationValue" name="observationValue" id="observationValue" required  onChange={this.handleInputChange(idx)} >
              <FormControlLabel value="Yes"  control={<Radio/>} label="Yes"  />
              <FormControlLabel value="NO" control={<Radio/>} label="No"  />
              <FormControlLabel value="Sometimes"  control={<Radio />} label="Sometimes"    />
            </RadioGroup>
                </TableCell>            
                </TableRow>
     ))}
            </TableBody>
          </Table>
        </Paper> 
          <br/>
          {button}
          <MUIDataTable label={"List of Observation"} data={this.state.info} columns={columns} options={options}
          />
        </form>
        </div>
    
        );
  }
   else
   {
    return (
      <div style = {{ width : '100%' }}>
          <MUIDataTable label={"List of Observation"} data={this.state.info} columns={columns} options={options}
          />
        </div>
    
        );
   } 
}

}
export default ObservationDetails;
