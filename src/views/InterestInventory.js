import React, { Component } from 'react';
import pics from "./../assets/pics.json";
import './../assets/css/style.css'
import './../assets/css/c3.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl, InputLabel, Input, Grid, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import UserContext from '../components/GolbalContext'
import RowChart from './RowChart'
import domtoimage from 'dom-to-image';
import { serviceEndPoint } from './../util/serviceEndPoint';
import {saveInterestInventoryCode,fetchCoursesByHollandCode} from './../util/api';


import AlertDialog from './../util/AlertDialog';
import { BrokenImageOutlined } from '@material-ui/icons';
const alertDialogOptions = {
    message: ''
  }

class InterestInventory extends Component {

    constructor(props) {
        super(props);

        this.state = {alertDialogFlag:false,documentGenerationStatus:''};
        this.beneficiaryData = {dbUserId : props.dbUserId,engagementId:props.engagementId,saveInterestInventoryDocumentFlag:true,benificiaryName:props.name};
        window.localStorage.clear();
        if (!window.localStorage.hasOwnProperty("path")) {
            var host = window.location.host;
            window.localStorage.setItem("path", host + "/Decosystem");
        }

        if (!window.localStorage.hasOwnProperty("photocount")) {
            window.localStorage.setItem("photocount", 42);
        }


        this.state = {
            clickCounter: 0, completed: false,
            icons: [
                { id: 0, question: " Would you Like to become ", img1: "like.png", img2: "unlike.png", img3: "confused.png", active: false },
                { id: 1, question: " Do you like this", img1: "like.png", img2: "unlike.png", img3: "confused.png", active: true },
                { id: 2, question: " आप बनना चाहते हैं", img1: "like.png", img2: "unlike.png", img3: "confused.png", active: false },
                { id: 3, question: " क्या आपको यह पसंद है", img1: "like.png", img2: "unlike.png", img3: "confused.png", active: false }
            ],
            path: window.localStorage.getItem("path")

        };
        this.photocount = window.localStorage.getItem("photocount");
        if (!window.localStorage.hasOwnProperty("icons")) {
            window.localStorage.setItem("icons", JSON.stringify(this.state.icons));
        }
        this.nextImg = this.nextImg.bind(this);
        this.play();
    }
    goHome(e) {
        //$location.path("/home");
        window.opener.setCode("ABC");
        window.opener = window;
        window.close();
    }
    generateCode(dataToCheck) {
        //console.log(dataToCheck)
        var cat = ["Y", "N", "N", "N", "N", "N"];
        var responseJson = [
            { catId: 1, category: 'Realistic', letter: "R", count: 0, like: 0, unlike: 0, neutral: 0 },
            { catId: 2, category: 'Investigative', letter: "I", count: 0, like: 0, unlike: 0, neutral: 0 },
            { catId: 3, category: 'Artistic', letter: "A", count: 0, like: 0, unlike: 0, neutral: 0 },
            { catId: 4, category: 'Social', letter: "S", count: 0, like: 0, unlike: 0, neutral: 0 },
            { catId: 5, category: 'Enterprising', letter: "E", count: 0, like: 0, unlike: 0, neutral: 0 },
            { catId: 6, category: 'Conventional', letter: "C", count: 0, like: 0, unlike: 0, neutral: 0 }
        ];

        var addLike = function (c) {
            var category = c.category;
            //                responseJson.forEach(function (d, i) {
            //                    if (d.catId === c.Category) {
            //                        d.count = d.count + 1;
            //                    }
            //                });
            category.forEach(function (d, i) {
                if (d === "Y") {
                    responseJson[i].count = responseJson[i].count + 1;
                    responseJson[i].like = responseJson[i].like + 1;
                }
            });
        };

        var addUnlike = function (c) {
            var category = c.category;
            category.forEach(function (d, i) {
                if (d === "Y") {
                    responseJson[i].unlike = responseJson[i].unlike - 1;
                }
            });
        };

        var addConfused = function (c) {
            var category = c.category;
            category.forEach(function (d, i) {
                if (d === "Y") {
                    responseJson[i].neutral = responseJson[i].neutral + 1;
                }
            });
        };

        dataToCheck.forEach(function (d, i) {
            switch (d.response) {
                case "like":
                    addLike(d);
                    break;
                case "unlike":
                    addUnlike(d);
                    break;
                case "confused":
                    addConfused(d);
                    break;
            }

          //  dataToCheck[i].category = "";
        });

        var responseJson2 = responseJson.slice();
        //sort in descending order
        responseJson.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        // console.log("***** SortedJson ******");
        // console.log(JSON.stringify(responseJson));

        var topThree = responseJson.slice(0, 3);
        //            topThree = topThree.splice(3, Number.MAX_VALUE);
        // as the array is sorted in DSC. The values can be check like a=b and b=c 
        //console.log(topThree);
        if ((topThree[0].like === topThree[1].like) || (topThree[1].like === topThree[2].like)) {
            topThree.sort(function (a, b) {
                if (a.unlike > b.unlike) {
                    return 1;
                }
                if (a.unlike < b.unlike) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }
        //            else if (topThree[0].like === topThree[1].like) {
        //
        //            } else if (topThree[1].like === topThree[2].like) {
        //
        //            }
        var result = "", jo = {};
        topThree.forEach(function (d, i) {
            //                if (d.count !== 0 && i < 3)
            if (i < 3)
                result = result + d.letter;
        });
        if (result === "") {
            result = "No Interests";
        }

        this.setState({ completed: true })
        this.setState({ result: result })
        jo.result = result;
        UserContext.code = result;
        jo.data = responseJson2;
        this.setState({alertDialogFlag:false});
        saveInterestInventoryCode(this.beneficiaryData.engagementId,result,UserContext.userid).then((jsondata) => { 
            alertDialogOptions.message=<span style={{color:"green"}}>Thank you for playing the game</span>;
            this.setState({alertDialogFlag:true});
  
        });

        return jo;
    }



    UniqueArraybyOccupation(collection, keyname) {
        var output = [],
            keys = [];
        collection.map(item => {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };


    shuffleArray(categoryImagesArray) {
        for (var n = 0; n < categoryImagesArray.length - 1; n++) {
            var k = n + Math.floor(Math.random() * (categoryImagesArray.length - n));
            var temp = categoryImagesArray[k];
            categoryImagesArray[k] = categoryImagesArray[n];
            categoryImagesArray[n] = temp;
        }
        return categoryImagesArray;
    };

    removeArrayElements(categoryImagesArray) {
        for (var n = 0; n < categoryImagesArray.length; n++) {
            if (categoryImagesArray.length > 7) {
                var k = n + Math.floor(Math.random() * (categoryImagesArray.length - n));
                categoryImagesArray.splice(k, 1);
            }
            else {
                break;
            }
        }
        return categoryImagesArray;
    }

    nextImg(event, userResponse) {
        //const target = event.target;
        //const userResponse =  target.value;
        //alert(userResponse);
        //saving reponsee to json
    
        var oneImage = this.state.imagePath;
        oneImage.response = userResponse;
        const allImages = [...this.state.allImages];
        allImages[this.state.clickCounter] = oneImage;
        this.setState({allImages});
         this.state.backshow = false;


console.log("step 1");




        //loading next image or generate result
        if ((this.state.clickCounter >= this.length) || (this.state.clickCounter >= this.photocount)) {
            // console.log(photocount);

            // transfer to opinion page
            var jo = { play: this.state.allImages };
            // this.setState({
            //     responseData : this.generateCode(this.state.allImages)
            // });


            this.setState({
                responseData: this.generateCode(this.state.allImages)
            }, () => {      
                this.setState({documentGenerationStatus:"Please wait document is getting saved"})
                setTimeout(() => {this.saveInterestInventoryDocument()},3000); 
            });




            //generateResultService.setGameData(jo);
            //$location.path("/opinion");
            //alert("ended");
        } else {
            //loading next image
            this.setState({
                clickCounter: this.state.clickCounter + 1
            },()=>{
                this.setState({
                    imagePath: this.state.allImages[this.state.clickCounter]
                });
            });
            // this.setState({
            //     imagePath: this.state.allImages[this.state.clickCounter]
            // });

            console.log("step 2");

        }
    };

    onImagesLoaded() {
        var images = pics;
        //alert("oye " + JSON.stringify(images));
        var categoryA = this.UniqueArraybyOccupation(this.shuffleArray(images.A), "Occupation");
        var categoryC = this.UniqueArraybyOccupation(this.shuffleArray(images.C), "Occupation");
        var categoryE = this.UniqueArraybyOccupation(this.shuffleArray(images.E), "Occupation");
        var categoryI = this.UniqueArraybyOccupation(this.shuffleArray(images.I), "Occupation");
        var categoryR = this.UniqueArraybyOccupation(this.shuffleArray(images.R), "Occupation");
        var categoryS = this.UniqueArraybyOccupation(this.shuffleArray(images.S), "Occupation");
        var imagesArray = this.removeArrayElements(categoryA);
        imagesArray = imagesArray.concat(this.removeArrayElements(categoryC));
        imagesArray = imagesArray.concat(this.removeArrayElements(categoryE));
        imagesArray = imagesArray.concat(this.removeArrayElements(categoryI));
        imagesArray = imagesArray.concat(this.removeArrayElements(categoryR));
        imagesArray = imagesArray.concat(this.removeArrayElements(categoryS));


        //var imagesArray = images.data;
        /********* Fisher–Yates_shuffle ******/
        for (var n = 0; n < imagesArray.length - 1; n++) {
            var k = n + Math.floor(Math.random() * (imagesArray.length - n));

            var temp = imagesArray[k];
            imagesArray[k] = imagesArray[n];
            imagesArray[n] = temp;
        }
        /*************************************/

        this.state.allImages = imagesArray;
        this.length = this.state.allImages.length;
        this.length = this.length - 1;

        this.state.imagePath = this.state.allImages[this.state.clickCounter];
        //alert(this.state.imagePath.description);


        this.state.goBack = function () {
            //loading prev image
            this.state.clickCounter = this.state.clickCounter - 1;
            if (this.state.clickCounter < 0) {
                this.state.clickCounter = 0;
                this.state.backshow = true;
            }

            this.state.imagePath = this.state.allImages[this.state.clickCounter];
            //alert(this.state.allImages[this.state.clickCounter]);
        }

    };
    onError() {
        this.state.error = "Not able To load images";
    };

    play() {
        var active = function () {
            var questionTo = JSON.parse(window.localStorage.getItem("icons"));
            var one;
            questionTo.forEach(function (val) {
                if (val.active) {
                    one = val;
                }
            });
            //console.log(one);
            return one;
        };

        this.photocount = this.photocount - 1;

        this.state.isVisible = true;
        this.state.clickCounter = 0;
        this.state.one = active();
        this.state.backshow = true;
        this.state.startTime = new Date().getTime();
        // alert(JSON.stringify( pics ));
        var test = this.onImagesLoaded(this.photocount);
        //true.then(onImagesLoaded, onError);

        this.state.goHome = function () {
            //$location.path("/home");
            window.opener = window;
            window.close();
        };

        var SAVE_CALLBACK = function (fromServer) {
            var response = fromServer.data;
            this.state.sync = 'Synced';
            this.state.homeBtn = true;
        };

    }
	
     saveInterestInventoryDocument() {  
        let _this=this;
		let intInvFinnalScore = this.state.result
        var engagementId=this.beneficiaryData.engagementId;
        var dbUserId=this.beneficiaryData.dbUserId;
        var benificiaryName=this.beneficiaryData.benificiaryName;
        let coursesOfHollandCode=[];
fetchCoursesByHollandCode(this.state.result).then((jsonHollandCodeData) => { 
let jsonHollandCodeObjects = JSON.parse(jsonHollandCodeData.data);   
jsonHollandCodeObjects.map(item => {coursesOfHollandCode.push(item.course)});

});

        
      
            domtoimage.toPng(document.getElementById('chart'))
            .then(function (dataUrl) {
                    let formData = new FormData();
   
                    formData.append('data', '{"token" : "", "action" : "saveInterestInventoryDocument", "data" : [{"dbUserId":'+dbUserId+',"engagementId":'+engagementId+',"documentType":"InterestInventory","typeOfDocument":"P","documentName":"InterestInventory","base64File":"'+dataUrl+'","coursesOfHollandCode":"'+coursesOfHollandCode+'","benificiaryName":"'+benificiaryName+'","hollandCode":"'+intInvFinnalScore+'"}]}');
   
                        fetch(serviceEndPoint.documentServiceEndPoint, { 
                        method: "POST",
                         headers: {
                          'Authorization': 'Bearer '+UserContext.token         
                         }, 
                        body:formData
 
                    }).then(response => response.json());
                    _this.setState({documentGenerationStatus:"Document saved successfully"});
            
            });
    }
    render() {
        if (!this.state.completed) {
            return (
                <div class="container"  >                         
                    <br />
                    <br />
                    <div class="row" >
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h2 class="text-center strokeme">
                                <span class="glyphicon glyphicon-backward pointer pull-left" ></span>
                                {this.state.one.question}
                            </h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="imageContainer">
                            <p>{this.state.error}</p>
                            <img src={process.env.PUBLIC_URL + "/iImages/" + this.state.imagePath.description} data-text={process.env.PUBLIC_URL + "/iImages/" + this.state.imagePath.description} class="playImage img-responsive" />
                        </div>
                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <center> <Button class=" nonebtn " value='like' onClick={e => this.nextImg(e, "like")}>
                                <img src={process.env.PUBLIC_URL + "/icons/" + this.state.one.img1} class="responseImage" />
                            </Button> </center>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <center> <Button class=" nonebtn " value='unlike' onClick={e => this.nextImg(e, "unlike")}>
                                <img src={process.env.PUBLIC_URL + "/icons/" + this.state.one.img2} class="responseImage" />
                            </Button> </center>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <center>  <Button class=" nonebtn " value='confused' onClick={e => this.nextImg(e, "confused")}>
                                <img src={process.env.PUBLIC_URL + "/icons/" + this.state.one.img3} class="responseImage" />
                            </Button> </center>
                        </Grid>
                    </Grid>
                </div>

            );
        }
        else {
            return (
                
                <div class="container" id="resultDiv">
           
                    <div class="com-sm-12 col-xs-12"  >
                        <h2 class="text-center strokeme">
                            Holland Code
                    </h2>
                    </div>
                    <div class="com-sm-12 col-xs-12 " >
                        <h1 class="text-center strokeme">
                            <span class="vertical-adjust padding"> {this.state.result}</span><br />
                        </h1>
                    </div>
                    <center>
                        <div class="com-sm-12 col-xs-12 " >

                            <p id="chartAlert" class="col-sm-12 col-xs-12 ">

                            </p>
                            <div id="chart" >
                                <RowChart  data={this.state.responseData.data} />

                            </div>

                        </div>
                    </center>
                    {/* <button class="col-sm-8 loginB" value="Close" onClick={e => this.goHome(e)} >
                        <span class="glyphicon glyphicon-home" ></span>
                        <center><span class="" >Close</span></center>
                    </button> */}
                   <center><div style={{color:"orange"}}>{this.state.documentGenerationStatus}</div></center> 

                    { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
  
                </div>

            );
        }


    }
}

export default InterestInventory;