import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {fetchMasterExistingBusiness,fetchAddressDetailsBasedOnPincode,saveExistingBusiness,fetchExistingBusinessDetails,submitAddressData,fetchAddressData} from './../util/api';
import {FormControlLabel, Grid , RadioGroup, Radio,TextField,Button,FormControl,InputLabel}  from '@material-ui/core';
import { SingleSelect } from "react-select-material-ui";
import Address from "./Address";
import UserContext from '../components/GolbalContext'
import underscore from 'underscore';
import AlertDialog from './../util/AlertDialog';
const alertDialogOptions = {
  message: ''
}


class ExistingBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {existingBusinessQuestions:[],answers:[],
            state : [],
            district : [],
            pincodes:[],   
            city:[],
            village:[],
            address : {id:"0",createdBy : UserContext.userid,'isActive' : 'Y','type' : 'EB' , pincode : "" , addressLine1 : "" , addressLine2 : "" , district : "" , state : "" , cityName : "", villageName : ""},
            engagementId : props.engagementId,dbUserId : props.id,
            radioValue1:'',radioValue2:'',radioValue12:'',radioValue17:'',radioValue21:'',radioValue23:'',radioValue11:'',radioValue6:'',
            mandatoryFields :[],linkedEngagementId:props.linkedEngagementId
            };
        fetchMasterExistingBusiness().then((jsondata)=>{
            var jsonObjects=JSON.parse(jsondata.data);
            this.setState({existingBusinessQuestions:jsonObjects});
         })

         fetchExistingBusinessDetails((UserContext.defaultProgramId === 1 || UserContext.defaultProgramId === 9) ?this.state.linkedEngagementId:this.state.engagementId).then((jsondata)=>{
          var jsonObjects=JSON.parse(jsondata.data);
          this.setState({answers:jsonObjects});
          for(var i=0;i<jsonObjects.length;i++)
          {
            var answer=jsonObjects[i];
            if(answer.questionId=="1" || answer.questionId=="2" || answer.questionId=="12" || answer.questionId=="17"
               || answer.questionId=="21" || answer.questionId=="23" || answer.questionId=="6" || answer.questionId=="11"){
            var radioValue="radioValue"+answer.questionId;
            this.setState({[radioValue]:answer.response});
            }           
          
          }
        })


        fetchAddressData(this.state.engagementId).then((jsondata)=>{

         let localThis=this;

          let jsonobjects = JSON.parse(jsondata.data);
          for (var i=0;i<jsonobjects.length;i++){
              if(jsonobjects[i].type=="EB"){
                Object.keys(jsonobjects[i]).forEach(function(key) {
                  localThis.setState({
                      address: {
                        ...localThis.state.address,
                        [key]: jsonobjects[i][key].toString()
                      }
                    })
                  

                    fetchAddressDetailsBasedOnPincode(jsonobjects[i].pincode).then((jsondata)=>{    
                      let jsonobjects = JSON.parse(jsondata.data);
                      let taluk=[];
                      let pincode=[]; 
                      let cityVillage=[]; 
                      let states=[];  
                      let district=[]; 
               
                      jsonobjects.map(item => { cityVillage.push({label: item.cityVillage, value: item.cityVillage})});
                      cityVillage=underscore.uniq(cityVillage,true,"label");
                      jsonobjects.map(item => {taluk.push({label: (item.taluk).toString(), value: item.taluk})});          
                      taluk=underscore.uniq(taluk,true,"label");
                      jsonobjects.map(item => {states.push({label: item.state, value: (item.state).toString()})});          
                      states=underscore.uniq(states,true,"label");
                      jsonobjects.map(item => {district.push({label: item.district, value: (item.district).toString()})});          
                      district=underscore.uniq(district,true,"label");
                      localThis.setState({
                        state : states,
                        district : district ,  
                        village :  cityVillage,
                        city : taluk
                      })
               
                     })



                })
              }
          }

        });





    }


design(row){
var data="";
if(row.data){
    data=row.data.split(":");;
}

if(row.visibility==""){
  this.state.mandatoryFields.push(row.id);
}


if(row.userInteraction=="Radio" && data.length>2){
  var answers=[...this.state.answers];
  var radioValue="";
  if(row.id=="1"){
     radioValue=this.state.radioValue1             
   }
  else if (row.id=="6"){
    radioValue=this.state.radioValue6
  }

  else if (row.id=="11"){
    radioValue=this.state.radioValue11
  }


  else if (row.id=="21"){
    radioValue=this.state.radioValue21
  }

  else if (row.id=="23"){
    radioValue=this.state.radioValue23
  }

  
  var subQuestions=document.querySelectorAll('[id^="'+row.id+'_"]');
  for(var i=0;i<answers.length;i++){ 
   if(answers[i].questionId==row.id && answers[i].response==radioValue && radioValue.includes("Yes")){        
     subQuestions.forEach(function(subQuestion) {
        subQuestion.style.display=""; 
     })      
      }
     }
  

 // this.displaySelectedData(data[0],row.id,"Radio");
    return <RadioGroup row  name={row.id} id={row.id} required  onChange={this.onRadioGroupChange.bind(this)}>
    <FormControlLabel value={data[0]}  control={<Radio/>} label={data[0]}  //onClick={this.showSubQuestions.bind(this)} 
    checked={ data[0]==radioValue} />
    <FormControlLabel value={data[1]} control={<Radio/>} label={data[1]}  //onClick={this.hideSubQuestions.bind(this)} 
    checked={data[1]==radioValue}
    />
    <FormControlLabel value={data[2]} control={<Radio/>} label={data[2]}  //onClick={this.hideSubQuestions.bind(this)} 
    checked={data[2]==radioValue}
    /></RadioGroup> 
}

else if(row.userInteraction=="Radio" && data.length>1){
  var answers=[...this.state.answers];

  var radioValue="";
  
  if(row.id=="2"){
     radioValue=this.state.radioValue2             
   }

else if(row.id=="12"){
  radioValue=this.state.radioValue12   
}

else if(row.id=="17"){
  radioValue=this.state.radioValue17   
}


   var subQuestions=document.querySelectorAll('[id^="'+row.id+'_"]');
   for(var i=0;i<answers.length;i++){ 
    if(answers[i].questionId==row.id && answers[i].response==radioValue && radioValue.includes("Yes")){        
      subQuestions.forEach(function(subQuestion) {
         subQuestion.style.display=""; 
      })      
       }
      }

  
  return  <RadioGroup row  name={row.id} id={row.id} required  onChange={this.onRadioGroupChange.bind(this)}>
    <FormControlLabel value={data[0]}  control={<Radio/>} label={data[0]}  // onClick={this.showSubQuestions.bind(this)} 
    checked={data[0]==radioValue}
    />
    <FormControlLabel value={data[1]} control={<Radio/>} label={data[1]} // onClick={this.hideSubQuestions.bind(this)} 
    checked={data[1]==radioValue}
    />
         </RadioGroup>
}


else if (row.userInteraction=="drop down"){
return    <SingleSelect  isClearable={true}  name={row.id} id={row.id}
          options={data} onChange={this.handleSelectChange.bind(this,row.id)}   key={this.displaySelectedData(row.data,row.id,"drop down")}  value={this.displaySelectedData(row.data,row.id,"drop down")}/>
}

else if (row.userInteraction=="text box"){
return  <TextField inputProps={{maxLength: row.maxLength}}  type="text" name = {row.id} id = {row.id} 
 //  key={this.displaySelectedData('',row.id,"text box")}
   onChange={this.handleInputChange.bind(this)}  value={this.displaySelectedData('',row.id,"text box")} />
}

else if(row.userInteraction=="Address"){

    return  <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
    <FormControl> 
            <TextField   type="text" name="addressLine1" id="addressLine1" label = "Address Line 1" maxLength = "20"
              value={this.state.address.addressLine1}  onChange={this.addressLine.bind(this, 'addressLine1')}/>
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
            <FormControl>
            <TextField   type="text" name="addressLine2" id="addressLine2" label = "Address Line 2" maxLength = "20" 
              value={this.state.address.addressLine2}   onChange={this.addressLine.bind(this, 'addressLine2')}/>
            </FormControl>
           </Grid>  
           <Grid item xs={12} sm={4}>
            <FormControl>
            <TextField   type="number" label = "Pincode"   name="pincode" id="pincode"  
             onChange={this.getPincodeData.bind(this, 'pincode')} value = {this.state.address.pincode || ''}/>
            </FormControl>
           </Grid>
           <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="village">Village</InputLabel>
            <SingleSelect  name="villageName" id="villageName" options={this.state.village} 
          value={this.state.address.villageName}  onChange={this.handleAddressSelectChange.bind(this, 'villageName')}/> 
           </Grid>
           <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="city">City</InputLabel>
            <SingleSelect  name="cityName" id="cityName" options={this.state.city} 
            value={this.state.address.cityName} onChange={this.handleAddressSelectChange.bind(this, 'cityName')}/> 
           </Grid>
           <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="District">District</InputLabel>
            <SingleSelect  name="district" id="district" options={this.state.district}
            value={this.state.address.district}  onChange={this.handleAddressSelectChange.bind(this, 'district')}/> 
           </Grid>
           <Grid item xs={12} sm={4}>
            <InputLabel shrink={true} for="State">State</InputLabel>
            <SingleSelect  name="state" id="state"  options={this.state.state} 
             value={this.state.address.state}  onChange={this.handleAddressSelectChange.bind(this, 'state')}/> 
           </Grid>
           </Grid>

}
}


onRadioGroupChange(event){
if(event.target.value=="No" || event.target.value=="NO" || event.target.value=="Don’t Know"){
  this.hideSubQuestions(event);
}
else{
  this.showSubQuestions(event);
}


//this.validateSubQuestions()

}

showSubQuestions(event){
   var alreadyAnswered=false;
   const answersArray = [...this.state.answers];
   var name=event.target.name
   var value=event.target.value
   var radioValue="radioValue"+name;
   this.setState({[radioValue]:value});

  for( var i = 0; i < answersArray.length; i++){
    if ( answersArray[i].questionId == name) { 
      answersArray[i].response = value;
      this.setState({ answers: answersArray });
      alreadyAnswered=true;
    }
  }


   if(!alreadyAnswered){
    var data= {"questionId":name,"response":value,"studentId":this.state.dbUserId,"engagementId":this.state.engagementId}
    this.setState({ 
   answers: [...this.state.answers, data] 
    },()=>{this.validate(name);
    })
   }

var subQuestions=document.querySelectorAll('[id^="'+name+'_"]');
subQuestions.forEach(function(subQuestion) {
    subQuestion.style.display="";
});



}

hideSubQuestions(event){


  var alreadyAnswered=false;
  const answersArray = [...this.state.answers];
  var name=event.target.name
  var value=event.target.value

  var radioValue="radioValue"+name;
  this.setState({[radioValue]:value});

  for( var i = 0; i < answersArray.length; i++){
    if (answersArray[i].questionId == name) { 
     answersArray[i].response = value;
     this.setState({ answers: answersArray });
     console.log(this.state.answers[i].response);
     alreadyAnswered=true;
  }
  }



const array = [...this.state.answers];

  if(!alreadyAnswered){
    var data= {"questionId":name,"response":value,"studentId":this.state.dbUserId,"engagementId":this.state.engagementId}
    array.push(data);
   // this.setState({answers: [...this.state.answers, data]},()=>{console.log("lenght is"+this.state.answers.length)});  

//   this.setState({ answers: array },()=>{console.log("lenght is:"+this.state.answers.length)});

  }


  var subQuestions=document.querySelectorAll('[id^="'+name+'_"]');
   let localThis=this;
  subQuestions.forEach(function(subQuestion) {
     var id =subQuestion.className.split(" ")[1];
     for( var i = 0; i < array.length; i++){
        if ( array[i].questionId == id) { 
        console.log("id value is :"+id);
          array.splice(i, 1); 
        }
      }
      subQuestion.style.display="none";
    })
    this.setState({ answers: array },()=>{this.validate(name)});
  }

getPincodeData(selectname, event) {
    let value = 0 ;
    let target = null;
    try {
      target = event.target;
      value =  target.value;
    }
   catch(e)
   {
    value =  event;
   }

      this.setState({
        address: {
          ...this.state.address,
          "pincode": value
        }
      })

   if(value.length==6){         
     fetchAddressDetailsBasedOnPincode(value).then((jsondata)=>{    
       let jsonobjects = JSON.parse(jsondata.data);
       let taluk=[];
       let pincode=[]; 
       let cityVillage=[]; 
       let states=[];  
       let district=[]; 

       jsonobjects.map(item => { cityVillage.push({label: item.cityVillage, value: item.cityVillage})});
       cityVillage=underscore.uniq(cityVillage,true,"label");
       jsonobjects.map(item => {taluk.push({label: (item.taluk).toString(), value: item.taluk})});          
       taluk=underscore.uniq(taluk,true,"label");
       jsonobjects.map(item => {states.push({label: item.state, value: (item.state).toString()})});          
       states=underscore.uniq(states,true,"label");
       jsonobjects.map(item => {district.push({label: item.district, value: (item.district).toString()})});          
       district=underscore.uniq(district,true,"label");
       this.setState({
         state : states,
         district : district ,  
         village :  cityVillage,
         city : taluk
       })

      })
    }
      
  }


  handleSelectChange(name, value) {
    var alreadyAnswered=false;
    var answersArray=[...this.state.answers];
    for(var i=0;i<answersArray.length;i++){
      if(answersArray[i].questionId==name){
        answersArray[i].response=value;
        this.setState({ answers: answersArray });
        alreadyAnswered=true;
      }
      
    }

   if(!alreadyAnswered){

    var data= {"questionId":name,"response":value,"studentId":this.state.dbUserId,"engagementId":this.state.engagementId}
    this.setState({ answers: [...this.state.answers, data] },()=>{
      this.validate(name);
    });
  }



  }



  addressLine(name, event) {
     const target = event.target;
     const value =  target.value;

this.setState({address: {
               ...this.state.address,
               [name]: value}
})
}


handleAddressSelectChange(selectname, event) {
  this.setState({
    address: {
      ...this.state.address,
      [selectname]: event
    }
  })
}

  handleInputChange(event) {
    var alreadyAnswered=false;
    const target = event.target;
    const value =  target.value;
    const name = target.name;
     var answersArray=[...this.state.answers];
    for(var i=0;i<answersArray.length;i++){
      if(answersArray[i].questionId==name){
        answersArray[i].response=value;
        this.setState({ answers: answersArray });
        alreadyAnswered=true;
      }
      
    }

   if(!alreadyAnswered){
      var data= {"questionId":name,"response":value,"studentId":this.state.dbUserId,"engagementId":this.state.engagementId}
      this.setState({ answers: [...this.state.answers, data] },()=>{ this.validate(name)});
   }
 
    }


validateMainQuestions(){
  var isSubmit=true;
  var mandatoryFields=this.getUniqueArray(this.state.mandatoryFields);
  var  response=this.state.answers;
for(var i=0;i<mandatoryFields.length;i++){
  var error="error"+mandatoryFields[i];
  var dataPresent=false;
 if(response.length>0){
  for(var j=0;j<response.length;j++){
   if(mandatoryFields[i]==response[j].questionId){
    dataPresent=true;
    document.getElementById(error).innerHTML="";
   }
  }
  if(!dataPresent){
    isSubmit=false;
   document.getElementById(error).innerHTML="Please provide data";
  }
 }
else {
  isSubmit=false;
  document.getElementById(error).innerHTML="Please provide data";

}
}
return isSubmit;
}


validateSubQuestions(){
  var isSubmit=true;
  var localThis=this;
  var answers=this.state.answers;
   for(var i=0;i<answers.length;i++){
    var answer=answers[i];
    if(answer.response.includes("Yes")){
      var subQuestions=document.querySelectorAll('[id^="'+answer.questionId+'_"]');
     subQuestions.forEach(function(subQuestion) {
        var id =subQuestion.className.split(" ")[1];
        var dataPresent=false;
        var error="error"+id;
        for(var j=0;j<answers.length;j++){
          if(answers[j].questionId==id && id!="3"){
            dataPresent=true;
            document.getElementById(error).innerHTML="";
          }
          else if(id=="3"){
if(localThis.state.address.addressLine1!="" 
&& localThis.state.address.addressLine2!="" && localThis.state.address.pincode!="" 
  &&  localThis.state.address.cityName!="" && localThis.state.address.villageName!="" && localThis.state.address.district!=""
  && localThis.state.address.state!=""
 ){
   document.getElementById("error3").innerHTML="";
   dataPresent=true;
   isSubmit=true;
}
   else {
       document.getElementById("error3").innerHTML="Please provide data"; 
       }
 

}

        }
        if(!dataPresent){
          isSubmit=false;
         document.getElementById(error).innerHTML="Please provide data";
        }
         })
    }
   }
return isSubmit;
}




validate(id){
  var answers=this.state.answers;
  for(let i=0;i<answers.length;i++){
   if(answers[i].questionId==id){
    var error="error"+id;
    document.getElementById(error).innerHTML="";
   }
  }
}


saveExistingBusiness = (event) => {
    event.preventDefault();

    this.state.address =  {
      ...this.state.address,
      'entityId': this.state.engagementId,
      "entityType" : "S"
    }

    this.validateMainQuestions();
     this.validateSubQuestions()


if(this.validateMainQuestions() && this.validateSubQuestions()){
    saveExistingBusiness(JSON.stringify(this.state.answers)).then((jsondata)=>{
      this.setState({alertDialogFlag:false});
      var jsonObjects=JSON.parse(jsondata.data);
      alertDialogOptions.message=<span style={{color:"green"}}>Data Saved Sucessfully</span>;
      this.setState({alertDialogFlag:true});
    })

    submitAddressData("updateAddress",this.state.address).then((jsondata)=>{});


    this.props.history.push({
      pathname: '/dashboard/updatebeneficiary',
      state: { dbUserId: this.state.dbUserId,engagementId:this.state.engagementId, status : this.state.status , tab : 7 }
    })

  }
  
}

  getUniqueArray(array){
    var uniqueArray = [];
    
    for(var i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}




displaySelectedData(fieldValue,id,fieldType){
   var answers=[...this.state.answers];
   var response='';
   let radioValue='';
   if(fieldType=="Radio"){
    var subQuestions=document.querySelectorAll('[id^="'+id+'_"]');
    for(var i=0;i<answers.length;i++){ 
      if(answers[i].questionId==id && answers[i].response==fieldValue){        
        subQuestions.forEach(function(subQuestion) {
           subQuestion.style.display=""; 
        })       
       return true;
         }
        }
   }

   else if(fieldType=="drop down"){
   const value =fieldValue.toString().split(":");
    for(var i=0;i<answers.length;i++){
     if(answers[i].questionId==id){
      for(var j=0;j<value.length;j++){  
        if(answers[i].response==value[j]){
          return answers[i].response;
        }
      }
     }
    }
    return "";
   }  

   else if(fieldType=="text box"){
    for(var i=0;i<answers.length;i++){
      if(answers[i].questionId==id){
        return answers[i].response;
      }
    }
    return "";
    }
}


    render() {      
        return (
            <div>
                <form onSubmit={this.saveExistingBusiness} method="post">
 
<Paper >
      <Table  aria-label="simple table" style={{ width:"100%"}}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width:"60%"}}>Question</TableCell>
            <TableCell style={{ width:"40%"}}>Response</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.existingBusinessQuestions.map(row => (
            <TableRow key={row.id} className={row.id}   id={row.subQuestionId} style={{display:row.visibility}}>
            <TableCell>
             {row.question==null?row.subQuestion:row.question} <sup><font color="red" size="4px">*</font></sup>
             </TableCell>    
              <TableCell>
               {this.design(row)}
               <div  id={"error"+row.id} style={{color:"red"}}></div>
             </TableCell>    
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper> 

<br/>

    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
<Button variant="contained" type="submit"  color="primary" size="small" >Save</Button>
</Grid>
     
 </form>

 { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }



       </div>
        )
    }
}
export default ExistingBusiness;