import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../assets/css/font-awesome.min.css'
import logo from "./../assets/images/tatastrivelogo.png";
import UserContext from './../components/GolbalContext'
import ComponentVisibility from './../util/ComponentVisibility';
import ForgotPassword from './ForgotPassword';
import {login,resetForgetPassword,changePassword,fetchUserScope,fectUserRoleDetails,fetchUserDetails,fetchCentersDetails,fetchCenterProgramMapping,fetchProgram,fetchComponentsByProgramIdAndRoleId} from './../util/api';
import {clearAppData} from './../util/session.js';



class Authenticate extends Component {
    constructor(props) {
        super(props);  
        this.state = {
        appError:'',token:'',action:'login',userDetails:[],roleDetails:[],scopeDetails:[],centerDetails:[]};
        this.handleInputChange = this.handleInputChange.bind(this);  
    } 

    handleInputChange(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });    
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        this.callme();
    }

    callme()
    {      

        // Get authentication
        login(this.state.token,this.state.action,this.state.email,this.state.password).then((jsondata)=>{
                if(jsondata.appError[0]==null){      
                    this.setState({appError:''}); 
                    let jsonobjects = JSON.parse(jsondata.data);
                    this.setState({userDetails :jsonobjects[1]});
                    // console.log(">>>>>>>>>>>>>>"jsonobjects[1]);
                  
                    UserContext.userid = jsonobjects[1].id;
                    UserContext.firstName = jsonobjects[1].firstName;
                    UserContext.lastName = jsonobjects[1].lastName;  
                    UserContext.userName = jsonobjects[1].userName;   
                    UserContext.token = jsonobjects[0].token;
                    var jwtTimeOut=new Date();
                    jwtTimeOut.setMinutes( jwtTimeOut.getMinutes() + 15);
                    UserContext.jwtTimeOut = jwtTimeOut;
                    UserContext.secretKey = "strive";
                    UserContext.refreshToken = jsonobjects[0].refreshToken;    

                     UserContext.sessionTime="";
                     var sessionTimeOut=new Date();
                     sessionTimeOut.setMinutes( sessionTimeOut.getMinutes() + 15);    
                     UserContext.sessionTime=sessionTimeOut;
            
                    return this;  
                }  else{
                    this.setState({userDetails:''});
                    this.setState({appError:jsondata.appError[0].errorMessage});
                    this.props.history.push('/')
                    
                }
             }).then(function(result){
                // Get User authorization - Role and Scope
                if(result.state.appError===''){
  return  fetchUserScope(UserContext.userid).then((jsondata)=>{
                        if(jsondata.appError[0]==null){      
                            let jsonobjects = JSON.parse(jsondata.data);
                            if(jsonobjects[0].roleMapId===27){
                                clearAppData();
                            }else{
                            UserContext.centerId = jsonobjects[0].centerId;
                            UserContext.roleid = jsonobjects[0].roleMapId;
                            UserContext.defaultProgramId=jsonobjects[0].programId;
                            
                            return result;
                            }
                        }  else{                        
                            return result;
                        }
                    });                       
                } else { 
                    return result
                }
             }).then(function(result){                 
                // Get Role Name
                if(result.state.appError===''){ 
                     return  fectUserRoleDetails(UserContext.roleid).then((jsondata)=>{              
                        let jsonobjects = JSON.parse(jsondata.data);    
                        console.log(jsonobjects);    
                        UserContext.roleName = jsonobjects[0].name;
                              
                        return result;                  
                    })   
                } else{ 
                       return result;
                }
            }).then(function(result){
                // Get Center Name               
                if(result.state.appError===''){      
                    let centerId = [];
                    centerId.push({ "id":UserContext.centerId});
                  return  fetchCentersDetails(JSON.stringify(centerId)).then((jsondata)=>{                  
                            let jsonobjects = JSON.parse(jsondata.data); 
                            // console.log(jsonobjects)            
                            UserContext.centerName = jsonobjects[0].name; 
                            UserContext.assessmentCenterId = jsonobjects[0].assessmentCenterId;
                            UserContext.modelId = jsonobjects[0].model;
                            return result;    
                         }) ;  
                }else{ 
                    return result;
                }
            }).then(function(result){ 
               // fetchCenterProgramMapping(UserContext.centerId).then((jsondata)=>{              
                //    let jsonobjects = JSON.parse(jsondata.data);     
                  //  UserContext.programId = jsonobjects[0].programId;   
                    let programId = [];
                    programId.push({ "id":UserContext.defaultProgramId});
                    fetchProgram(JSON.stringify(programId)).then((jsondata)=>{              
                        let jsonobjects = JSON.parse(jsondata.data);     
                        UserContext.programName=jsonobjects[0].name;
                     }) ; 

                     fetchComponentsByProgramIdAndRoleId(UserContext.defaultProgramId,UserContext.roleid).then((jsondata)=>{              
                        let jsonobjects = JSON.parse(jsondata.data);  
                         jsonobjects.map(item => {
                            ComponentVisibility[item.componentName] = item.isVisibility;
                            });
                        }) ; 
               //  }) ;  
                
                result.props.history.push('/dashboard');})
            .catch(error => {
                console.log("ZZZZZZZ1"+error);
            });
        //     alert("Hello")
        //     fetchUserDetails(UserContext.userid).then((userDetailsJsonDAta)=>{
        //       let res = JSON.parse(userDetailsJsonDAta.data)
        //       console.log(">>>>>>>>>>>>>>",res)
        //   })
    }

    render() {       
        const responseGoogle = (response) => {           
            this.setState({token:response.getAuthResponse().id_token}); 
            this.setState({action:'socialAccountLogin'});   
            this.callme();
        }

        return (
            <div class="main-bg">     
                <table width="100%"><tr bgcolor="white" ><td padding="15px" height="65" ><img src={logo} alt="logo" height="55"/></td></tr></table>
                <div class="sub-main-w3">
                    <div class="image-style">    </div>
                    <div class="vertical-tab">
                        <div id="section1" class="section-w3ls">
                            <input type="radio" name="sections" id="option1" checked ></input>
                            <label for="option1" class="icon-left-w3pvt"><span class="fa fa-user-circle" aria-hidden="false"></span>Login</label>
                            <article>
                                <form onSubmit={this.mySubmitHandler} method="post">     
                                    <h3 class="legend">Login Here </h3>
        <div class="bottom-text-w3ls" style={{ color: 'red',textAlign: 'center'}}>{this.state.appError}&nbsp; {(this.props.location.state!=null) && this.props.location.state.logoutmsg} </div>
                                    <div class="input">
                                        <span class="fa fa-envelope-o" aria-hidden="true"></span>
                                        <input type="text" placeholder="Email" name="email"  maxlength="50" onChange={this.handleInputChange} required />
                                    </div>
                                    <div class="input">
                                        <span class="fa fa-key" aria-hidden="true"></span>
                                        <input type="password" placeholder="Password" name="password"  maxlength="15" onChange={this.handleInputChange} required />
                                    </div>
                                    
                                    <button type="submit" class="btn submit">Login</button>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">
                                    <center>
                                    <GoogleLogin  
                                     //   clientId="902513042649-0ub5vfc2rbtkdndlpv26u5dnev39spf2.apps.googleusercontent.com" 
                                        clientId="948364567719-tovnvvvhfq7ndqdi7hq149de5ei7r6gv.apps.googleusercontent.com" 
                                        buttonText="Login with Google"
                                        theme="dark"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                    />
                                    </center>
                                    </div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="fill_pad6">&nbsp;</div>
                                    
                                    
                                </form>
                            </article>
                        </div>
                        <div id="section2" class="section-w3ls">
                            <input type="radio" name="sections" id="option2"></input>
                            <label for="option2" class="icon-left-w3pvt"><span class="fa fa-pencil-square" aria-hidden="false"></span>Register</label>
                            <article>

                                <form onSubmit={this.mySubmitHandler} method="post">
                                    <h3 class="legend">Register Here</h3>
                                   <div class="input">
                                        <span class="fa fa-user-o" aria-hidden="true"></span>
                                        Coming soon
                                        {/* <input type="text" placeholder="Username" name="name" required /> */}
                                    </div>
                                      {/*
                                      <div class="input">
                                        <span class="fa fa-key" aria-hidden="true"></span>
                                        <input type="password" placeholder="Password" name="password" required />
                                    </div>
                                    <div class="input">
                                        <span class="fa fa-key" aria-hidden="true"></span>
                                        <input type="password" placeholder="Confirm Password" name="password" required />
                                    </div>
                                    <button type="submit" class="btn submit">Register</button> */}
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="bottom-text-w3ls">&nbsp;</div>
                                    <div class="fill_pad4">&nbsp;</div>
                                    
                                </form>
                            </article>
                        </div>
                        <div id="section3" class="section-w3ls">
                            <input type="radio" name="sections" id="option3"/>
                            <label for="option3" class="icon-left-w3pvt"><span class="fa fa-lock" aria-hidden="false"></span>Forgot Password?</label>
                            <article>
                                    <ForgotPassword />y
                             </article>
                        </div>
                    </div>
                </div>
            </div>                
         );
    }


}

export default Authenticate;
