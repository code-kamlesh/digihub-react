import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {DropzoneArea} from 'material-ui-dropzone';
import { SingleSelect } from "react-select-material-ui";
import {TextField,Button,Grid}  from '@material-ui/core';
import {deleteDocumentById,fetchUserDocumentsByEngagementIdAndTypeOfDocument,fetchUserDocumentsByUserIdAndTypeOfDocument,
  uploadDocument} from './../util/api';
import Paper from '@material-ui/core/Paper';
import { serviceEndPoint } from './../util/serviceEndPoint';
import UserContext from '../components/GolbalContext'
import AlertDialog from './../util/AlertDialog';
import {fileTypeFromFile} from 'file-type';
const alertDialogOptions = {
  message: ''
}

export default class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         errors:false,
          typeOfProof:[],typeOfDocument:null,
        typeOfProofData:[ 
        { value: 'AgeProof', label: 'Age Proof' },
        { value: 'ApplicationForm', label: 'Application Form' },
		{ value: 'AddressProof', label: 'Address Proof' },
        { value: 'CasteCertificate', label: 'Caste Certificate' },
        { value: 'ContributionReceipt', label: 'Contribution Receipt' },
        { value: 'EducationProof', label: 'Education Proof' },
		{ value: 'FirstDayPicture', label: 'First Day Picture' },
		{ value: 'IdentificationProof', label: 'Identification Proof' },
		{ value: 'IncomeProof', label: 'Income Proof' },
        { value: 'LastDayPicture', label: 'Last Day Picture' },
		{ value: 'Loanconsent', label: 'Loan Consent from Student' },
        { value: 'Medicalfitnesscertificate', label: 'Medical fitness certificate' },
        { value: 'PhotoProof', label: 'Photo Proof' },
        { value: 'StudentPicture', label: 'Student Picture' },
        { value: 'Studentsigned', label: 'Student signed' }

      ],
      typeOfDocumentData:[ 
        { value: '8thCertificate', label: '8th Certificate' },
        { value: '10thCertificate', label: '10th Certificate' },
        { value: '12thCertificate', label: '12th Certificate' },
        { value: 'AadharCard', label: 'Aadhar Card' },
        { value: 'ApplicationForm', label: 'Application Form' },
        { value: 'BankStatement', label: 'Bank Statement' },
        { value: 'BirthCertificate', label: 'Birth Certificate' },
        { value: 'BPLCard', label: 'BPL Card' },
        { value: 'CasteCertificate', label: 'Caste certificate' },
        { value: 'ContributionReceipt', label: 'Contribution Receipt' },
        { value: 'DrivingLicense', label: 'Driving License' },
        { value: 'DiplomaCertificate', label: 'Diploma Certificate' },
		{ value: 'ElectricityBill', label: 'Electricity Bill' },
        { value: 'FatherAadharCard', label: 'Father Aadhar Card' },
        { value: 'FirstDayPicture', label: 'First Day Picture' },
        { value: 'Graduation', label: 'Graduation' },
		{ value: 'gaurdianAadharcard', label: 'Gaurdian Aadhar card' },
		{ value: 'incomeCertificate', label: 'Income Certificate' },
        { value: 'LastDayPicture', label: 'Last Day Picture' },
		{ value: 'Loanconsent', label: 'Loan Consent from Student' },
        { value: 'MedicalFitnessCertificate', label: 'Medical Fitness Certificate' },
        { value: 'MotherAadharCard', label: 'Mother Aadhar Card' },
        { value: 'NaregaCard', label: 'Narega Card' },
        { value: 'PanCard', label: 'Pan Card' },
        { value: 'Passport', label: 'Passport' },
        { value: 'PostGraduation', label: 'Post Graduation' },
        { value: 'RationCard', label: 'Ration Card' },
		{ value: 'salarycertificate', label: 'Salary Certificate' },
        { value: 'SalarySlip', label: 'Salary Slip' },
        { value: 'SpouseAadharCard', label: 'Spouse Aadhar Card' },
        { value: 'StudentSigned', label: 'Student Signed' },
        { value: 'StudentPicture', label: 'Student Picture' },
		{ value: 'TelephoneBill', label: 'Telephone Bill' },
        { value: 'VoterId', label: 'Voter Id' }   
      ],
       documents:[], engagementId : 0,documentNumber:0,file:null,fileName:'',alertDialogFlag:false,
       dbUserId:'',documentType:[],clearDropzoneArea:0};


       
if(props.id != null && props.id != undefined)
{
  this.state.dbUserId=props.id;
   this.state.engagementId=props.engagementId;
}

this.getDocuments();

}


getDocuments(){

fetchUserDocumentsByUserIdAndTypeOfDocument(this.state.dbUserId,'G').then((jsondata) => {   
let jsonobjects = JSON.parse(jsondata.data);          
// this.setState({documents: [...this.state.documents,...jsonobjects]}) 
this.setState({documents:jsonobjects});    
});

}

    
    downloadDocuments = (value) => 
    {
    let formData = new FormData();
      formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":'+value+'}]}');
      fetch(serviceEndPoint.documentServiceEndPoint, {
          method: 'post',
          headers: {
            'Authorization': 'Bearer '+UserContext.token
        }, 
          body: formData
      }).then(response => response.json()).then((jsondata)=>{
        let jsonobjects = JSON.parse(jsondata.data);
        var url=serviceEndPoint.downloadDocument+jsonobjects[0].documentPath+""; 
        window.open(url, "_blank");
       
    
      });
      }

      // Checking mime type
 onFileChangeHandler = ( files) => {
    var header = "";
    var blob = files[0]; // See step 1 above
    var fileReader = new FileReader();
     fileReader.onloadend =(e)=> {
     
      var arr = (new Uint8Array(e.target.result)).subarray(0, 2);
     
      for(var i = 0; i < arr.length; i++) {
         header += arr[i].toString(16);
      }
      console.log(header);
      
      // Check the file signature against known MIME (Magic Number)types
      // its allow png, jpg,jpeg and pdf only
      if(header === "8950" ||header === "ffd8" || header == "2550")
      {
        this.setState({file: files[0]});
        this.setState({errors : false})
      }
      else{
        alert("Please upload valid file")
        console.log(this.state)
      
        this.setState({errors : true})
        // this.setState("error")
        return; 
      }
    };
    fileReader.readAsArrayBuffer(blob);

  }

  uploadDocuments = (e) => {
    e.preventDefault();
    var localThis=this;
   this.state.documentType.map(function(documentType){
    localThis.uploadDocument(documentType);
  });

  this.setState({documentNumber:''});
  this.setState({clearDropzoneArea: this.state.clearDropzoneArea + 1});
 // this.setState({typeOfDocument:null});
  this.setState({ documentType:[]});
    
  }

  uploadDocument = (documentType) => {
 //   e.preventDefault();
// var genericDocuments=["8thCertificate","10thCertificate","12thCertificate","StudentPicture","PostGraduation","Graduation"];
var levelOfDocument="G";
// if(genericDocuments.includes(this.state.typeOfDocument)){levelOfDocument="G";}


let localThis=this;

let reader = new FileReader();
reader.readAsDataURL(this.state.file);
reader.onload = function () {
let  document = reader.result;

localThis.setState({alertDialogFlag:false});
uploadDocument(localThis.state.dbUserId,localThis.state.engagementId,documentType,levelOfDocument,localThis.state.typeOfDocument,document,localThis.state.documentNumber)
.then((jsondata) => {
      alertDialogOptions.message=<span style={{color:"green"}}>{documentType} File uploaded successfully</span>;
      localThis.setState({alertDialogFlag:true});
      localThis.getDocuments();
   })
  // .then(res => {
  //   if(res.ok) {
  //     alertDialogOptions.message=<span style={{color:"green"}}>{documentType} File uploaded successfully</span>;
  //     localThis.setState({alertDialogFlag:true});
  //     localThis.getDocuments();
  //     }
  // });
}
  }

  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
   
  }

  handleSelectChange(selectname, event) {
    this.setState({file: null})
   this.setState({[selectname]: event}); 
  }


  handleTypeOfProofSelectChange(selectname, event) {
    this.setState({file: null})
    let newVal = event;
    let stateVal = this.state.documentType;

    stateVal.indexOf(newVal) === -1
      ? stateVal.push(newVal)
      : stateVal.length === 1
        ? (stateVal = [])
        : stateVal.splice(stateVal.indexOf(newVal), 1)

        this.setState({ documentType: stateVal });
       
   }
 
  
  deleteDocument = (basicDocId) => {
  deleteDocumentById(basicDocId).then((jsondata) => {
    this.getDocuments();
 });
  
}

  render() {
    return (
      <div>


<Table  aria-label="simple table" style={{ width:"100%"}}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width:"15%"}}>Type of Document</TableCell>
            <TableCell style={{ width:"15%"}}>Type of Proof</TableCell>
            {/* <TableCell style={{ width:"15%"}}>Browse and Upload</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow >               
            <TableCell  style={{ width:"15%"}}>  
          
            <SingleSelect  isClearable={true} 
               name="typeOfDocument" id="typeOfDocument"
              options={this.state.typeOfDocumentData}
              onChange={this.handleSelectChange.bind(this, 'typeOfDocument')}
              value={this.state.typeOfDocument || ''}
            />          
            </TableCell>
            <TableCell  style={{ width:"15%"}}>   
            <SingleSelect  
              name="typeOfProof" id="typeOfProof"
              options={this.state.typeOfProofData}
              onChange={this.handleTypeOfProofSelectChange.bind(this, 'documentType')}
              value={this.state.documentType || ''}
              SelectProps={{
              multi:true
              }}
            
            />
            </TableCell>
            {/* <TableCell >  
            <TextField   type="text" name="documentNumber" id="documentNumber"
            label = "Document Number" onChange={this.handleInputChange.bind(this)}
            value={this.state.documentNumber || ''}

             />
     
            </TableCell> */}
            </TableRow>            
            <TableRow>
            <TableCell>   
            <DropzoneArea  
              name="file" id="file"
              meta
              maxFileSize={2000000} filesLimit={1} 
              showFileNames={true} 
              onChange={this.onFileChangeHandler}
              key={this.state.clearDropzoneArea}
              />
              <p  style={{color:"red"}}>Note-: Document size should not be greater than 2mb.</p>
            </TableCell>
            </TableRow>
        </TableBody>
      </Table>
<br/>

      <form onSubmit={this.uploadDocuments} method="post">
      <Grid container direction="row" justify="flex-end" alignItems="flex-end">
             <Button type="submit" variant="contained" color="primary" size="small" 
                    disabled={this.state.errors== true || this.state.file==null || this.state.typeOfDocument=='' || this.state.documentType==''?true:false}
             >Upload Document</Button>
             </Grid>

</form>
<br/>

      { 
  (this.state.documents!="") &&

<Paper>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Created On</TableCell>
          <TableCell>Document Name</TableCell>
          <TableCell>File Name</TableCell>
          <TableCell >Download</TableCell>
          <TableCell >Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.documents.map(row => (
            <TableRow key={row.basicDocId}>
              <TableCell component="th" scope="row">
          
                {row.createdOn}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.documentName}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.documentPath.split("/")[1]}
              </TableCell>
            <TableCell >                 
              <Button variant="contained" color="primary" size="small" name="download" id="download" 
             
               onClick={this.downloadDocuments.bind(this,row.basicDocId)}
              >Download</Button>
            </TableCell>            

            <TableCell >                 
              <Button variant="contained" color="primary" size="small" name="delete" id="delete" 
               onClick={this.deleteDocument.bind(this,row.basicDocId)}
              >Delete</Button>
            </TableCell>            


            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>


          }
                   { 
  (this.state.alertDialogFlag) && <AlertDialog   message={alertDialogOptions.message}></AlertDialog>
    }
 

      </div>
    )
  }
}
