import React, { Component } from 'react';
import { render } from "react-dom";
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import callMerge from 'material-ui/svg-icons/communication/call-merge';
import UserContext from '../components/GolbalContext'
import { FormControl, InputLabel, FormControlLabel, Input, Grid, RadioGroup, Radio, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { isNotEmpty, isNotZero, validateEmail, validateContact } from './../util/validation';
import { roleBasedReadonly, checkButton } from '../util/validation';
import AlertDialog from '../util/AlertDialog';
import Paper from '@material-ui/core/Paper';
import { savePlacementDetails, deleteDocumentById, fetchUserDocumentsByUserIdAndTypeOfDocument, fectAddressDetailsByAddressID, fetchAddressDetailsBasedOnPincode, fetchPlacementDetailsByEngagementId, fetchAllCenter, saveAddressDetails, uploadDocument, fetchEmployerDetails } from '../util/api';
import MUIDataTable from "mui-datatables";
import AddressForPlacement from "./AddressForPlacement";
import underscore from 'underscore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DropzoneArea } from 'material-ui-dropzone';
import EditIcon from '@material-ui/icons/Edit';
import { serviceEndPoint } from '../util/serviceEndPoint';
import Checkbox from '@material-ui/core/Checkbox';
import { Label } from 'recharts';
import error from 'material-ui/svg-icons/alert/error';
import PlacementDetailsSubPlaced from './PlacementDetailsSubPlaced';
import PlacementDetailsSubEntNP from './PlacementDetailsSubEntNP';
import PlacementDetailsSubNP from './PlacementDetailsSubNP';

const alertDialogOptions = {
  message: ''
}

class PlacementDetails extends Component {

  constructor(props) {
    super(props);
    console.log(props.status);
    /*State starts here*/
    this.state = {
      buttonStatus: props.status,
      engagementId: props.engagementId, alertDialogFlag: false, disabled: false, flag: "0",
      errors: { /*Placed Data here*/
        domainName: '', spocName: '', spocPhoneNumber: '', spocEmailId: '', monthlyGrossSal: '',
        foodProvided: '', accommodationProvided: '', offerDate: '', offerStatus: '', joined: '',
        reason: '', otherReasonInBrief: '',
        /*Address here*/
        joiningPin: '', joiningCity: '', addressId: '',
        /*Entrepreneurship/ Self Employed*/
        noOfPeopleEmployed: '', familyBusiness: '', availedLoan: '',
        //domainName: '', monthlyGrossSal: '0'
        /*Not Placed*/
        reasonForNoOpportunity: '',
        //reason: '', otherReasonInBrief: '',
        /*General*/
        empId: 0, interviewStatus: '',},
      dbUserId: props.id, info: [],
      placementData: {
        /*Placed Data here*/
        domainName: '', spocName: '', spocPhoneNumber: '', spocEmailId: '', monthlyGrossSal: '0',
        foodProvided: '', accommodationProvided: '', offerDate: '', offerStatus: '', joined: '',
        reason: '', otherReasonInBrief: '',
        /*Address here*/
        joiningPin: '', joiningCity: '', addressId: '',
        /*Entrepreneurship/ Self Employed*/
        noOfPeopleEmployed: '0', familyBusiness: '', availedLoan: '',
        //domainName: '', monthlyGrossSal: '0'
        /*Not Placed*/
        reasonForNoOpportunity: '',
        //reason: '', otherReasonInBrief: '',
        /*General*/
        empId: 0, interviewStatus: '',
        createdBy: UserContext.userid, updatedBy: UserContext.userid, engagementId: props.engagementId, dbUserId: props.id, isActive: "Y",
      },
      center: [], centerData: [], documents: [],
      info: [{ "createdBy": UserContext.userid, "updatedBy": UserContext.userid, "isActive": "Y", "dbUserId": props.id }],
      intStatus: [
        { value: 'Placed', label: 'Placed' },
        { value: 'Entrepreneurship/ Self Employed', label: 'Entrepreneurship/ Self Employed' },
        { value: 'Not Placed', label: 'Not Placed' },
      ],
      notPlacedReason: [
        { value: 'Rejected By Employer', label: 'Rejected By Employer' },
        { value: 'Not Avaliable Opportunity', label: 'Not Avaliable Opportunity' }
      ],
      notAvlOppReason: [
        { value: 'No Employment Opportuntities', label: 'No Employment Opportuntities' },
        { value: 'Others', label: 'Others' }
      ],
      notInterestedReason: [
        { value: 'Marriage', label: 'Marriage' },
        { value: 'Migration', label: 'Migration' },
        { value: 'Less Salary', label: 'Less Salary' },
        { value: 'Others', label: 'Others' },
      ],
      domains: [
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Apparel, made ups and Furnishing', label: 'Apparel, made ups and Furnishing' },
        { value: 'Automotive', label: 'Automotive' },
        { value: 'Beauty and Wellness', label: 'Beauty and Wellness' },
        { value: 'BFSI', label: 'BFSI' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Furniture and Fittings', label: 'Furniture and Fittings' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'IT-ITeS', label: 'IT-ITeS' },
        { value: 'Management, Entrepreneurship and Preofessional Courses', label: 'Management, Entrepreneurship and Preofessional Courses' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Green Jobs', label: 'Green Jobs' },
        { value: 'Telecom', label: 'Telecom' },
        { value: 'Tourism and Hospitality', label: 'Tourism and Hospitality' }
      ],
      yesOrNo: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ],
      OfferStatus: [
        { value: 'Accepted', label: 'Accepted' },
        { value: 'Rejected', label: 'Rejected' }
      ],
      typeOfDocument: null, file: null,
      typeOfDocumentData: [
        { value: 'Offer Letter', label: 'Offer Letter' },
        { value: 'Joining Letter', label: 'Joining Letter' },
        { value: 'Pay Slip', label: 'Pay Slip' },
        { value: 'Bank Statement', label: 'Bank Statement' },
        { value: 'Email From Employer', label: 'Email From Employer' },
        { value: 'Workplace Picture', label: 'Workplace Picture' },
        { value: 'ID card', label: 'ID card' },
        { value: 'Letter from HR', label: 'Letter from HR' },
        { value: 'Student Declaration', label: 'Student Declaration' },
        { value: 'Pic Of Business', label: 'Pic Of Business' },
        { value: 'Registration Certificate', label: 'Registration Certificate' },
        { value: 'MSME Registration Certificate', label: 'MSME Registration Certificate' },
        { value: 'Three Party Certificate', label: 'Three Party Certificate' }
      ],
      address: { entityId: props.engagementId, createdBy: UserContext.userid, 'isActive': 'Y', 'type': 'PD',
                 'entityType': 'S', pincode: "", addressLine1: "", addressLine2: "", district: "", state: "",
                  cityName: "", villageName: "" },
      state: [], district: [], pincodes: [], city: [], village: [], engagementId: props.engagementId
    };
    /*State ends here*/
    this.formData = { state: [], district: [], pincodes: [], city: [], village: [] };
    /*function call for masters*/
    this.getCenterMasters();
    this.getDocuments();
    /*binding for functions*/
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateAppropriateCheckBoxes = this.validateAppropriateCheckBoxes.bind(this);
    this.CheckForDocuments = this.CheckForDocuments.bind(this);
    /*fetch placement details if already present for the existing user*/
    if (props.id != null && props.id != undefined) {
      this.fetchPlacementdetailsFouUser(props.engagementId);
    }

  }
  /*Constructor ends here*/

  componentDidMount() {
    roleBasedReadonly();
  }

  getDocuments() {
    //**Set the state as empty or null initially to be refilled back so as not to create multiple copies of the same user Docs */
    this.setState({ documents: [] })
    fetchUserDocumentsByUserIdAndTypeOfDocument(this.state.dbUserId, 'PD').then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      console.log(jsonobjects)
      this.setState({ documents: [...this.state.documents, ...jsonobjects] })
    });
  }

  deleteDocument = (basicDocId) => {
    //**For deleting a particular element if deleted then check for the updated row */
    deleteDocumentById(basicDocId).then((jsondata) => {
      if (jsondata.status == "success") {
        let data = JSON.parse(jsondata.data)
        //** uncomment the below if an alert for deleting the document is required */
        // this.setState({ alertDialogFlag: false });
        //       alertDialogOptions.message = <span style={{ color: "green" }}>Document is Deleted Sucessfully</span>;
        // this.setState({ alertDialogFlag: true });
        this.getDocuments();
      }
      else {
        this.setState({ alertDialogFlag: false });
        alertDialogOptions.message = <span style={{ color: "red" }}>Document cannot be deleted, please try again!</span>;
        this.setState({ alertDialogFlag: true });
      }
    })
  }

  handleEditChange(obj) {
    obj.authenticationAndConsent = (obj?.authenticationAndConsent == "true") ? true : false;
    obj.documentsUploaded = (obj?.documentsUploaded == "true") ? true : false;
    this.setState({
      placementData: obj
    }, () => {
      if (this.state.placementData.interviewStatus === 'Placed'
        || this.state.placementData.interviewStatus === 'Entrepreneurship/ Self Employed') {
        this.getAddressDetailsByAddressID(this.state.placementData.addressId)
        if (this.state.placementData.interviewStatus === 'Placed') {
          // console.log('check the boxes here placed')
          // if (this.state.placementData.documentsUploaded) {
          //   document.getElementById('documentsUploadedPlaced').click();
          // }
          // if (this.state.placementData.authenticationAndConsent) {
          //   document.getElementById('authenticationAndConsent').click();
          // }
        }
      }
    });
  }

  getAddressDetailsByAddressID(addressId) {
    fectAddressDetailsByAddressID(addressId).then((jsondata) => {
      let addressDetails = JSON.parse(jsondata.data);
      this.setState({
        address: addressDetails[0]
      }, () => { this.getAddressdataBasedOnPin(this.state.address.pincode) });
    })
  }

  getAddressdataBasedOnPin(pincode) {
    fetchAddressDetailsBasedOnPincode(pincode).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      let taluk = [];
      let pincode = [];
      let cityVillage = [];
      let states = [];
      let district = [];

      this.formData.village.length = 0;
      this.formData.pincodes.length = 0;
      this.formData.city.length = 0;
      this.formData.state.length = 0;
      this.formData.district.length = 0;

      jsonobjects.map(item => { cityVillage.push({ label: item.cityVillage, value: item.id }) });
      cityVillage = underscore.uniq(cityVillage, true, "label");
      cityVillage.map(item => { this.formData.village.push({ label: item.label, value: (item.label).toString() }) });
      this.setState({ village: this.formData.village });

      jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
      taluk = underscore.uniq(taluk, true, "label");
      taluk.map(item => { this.formData.city.push({ label: item.label, value: (item.label).toString() }) });
      this.setState({ city: this.formData.city });

      jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
      states = underscore.uniq(states, true, "label");
      states.map(item => { this.formData.state.push({ label: item.label, value: (item.value).toString() }) });
      this.setState({ state: this.formData.state }, () => { /*console.log(this.state.state)*/ });

      jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
      district = underscore.uniq(district, true, "label");
      district.map(item => { this.formData.district.push({ label: item.label, value: (item.value).toString() }) });
      this.setState({ district: this.formData.district });
    })
  }


  handleSelectChangeDoc(selectname, event) {
    this.setState({ [selectname]: event });
  }

  handlePlacementSelectChange(selectname, event) {
    this.setState({
      placementData: {
        ...this.state.placementData,
        [selectname]: event
      }
    });
    this.validate(selectname, event);
  }


  handleSelectChange(selectname, event) {
    let value = 0;
    let target = null;
    try {
      target = event.target;
      value = target.value;
    }
    catch (e) {
      value = event;
    }

    this.setState({
      "disabled": false
    });

    this.setState({
      placementData: {
        ...this.state.placementData,
        [selectname]: event
      }
    })

    if (this.state.placementData.interviewStatus === 'Not Placed') {
      this.validateNotPlaced(selectname, event);
    }

    else if (this.state.placementData.interviewStatus === 'Entrepreneurship/ Self Employed') {
      this.validateEntrepreneurship(selectname, event);
      let typeOfDocumentData = [
      { value: 'Pic Of Business', label: 'Pic Of Business' },
      { value: 'MSME Registration Certificate', label: 'MSME Registration Certificate' },
      { value: 'Registration Certificate', label: 'Registration Certificate' }
      ];
      this.setState({
        typeOfDocumentData
      });
    }

    else if (this.state.placementData.interviewStatus === 'Placed' ) {
      this.validatePlacedAndOfferNotTaken(selectname, event);
     
      let typeOfDocumentData = [{ value: 'Offer Letter', label: 'Offer Letter' },
      { value: 'Joining Letter', label: 'Joining Letter' },
      { value: 'Pay Slip', label: 'Pay Slip' },
      { value: 'Bank Statement', label: 'Bank Statement' },
      { value: 'Email From Employer', label: 'Email From Employer' },
      { value: 'Workplace Picture', label: 'Workplace Picture' },
      { value: 'ID card', label: 'ID card' },
      { value: 'Letter from HR', label: 'Letter from HR' }];

      this.setState({
        typeOfDocumentData
      });
      console.log('point 0.2')
      // if (selectname == "joined" && event == "Yes") {
        // let DocToBeChecked = ['Joining Letter', 'Pay Slip', 'Bank Statement', 'Email From Employer', 'Workplace Picture', 'ID card', 'Letter From HR'];
        // let raiseError = true;
        // DocToBeChecked.map((element, id) => {
        //   console.log('point 0.4')
        //   this.state.documents.map((document, id) => {
        //     console.log('pass by me everytime')
        //     console.log('errors here ===> ', this.state.errors)
        //     console.log("raise error here ===> ",raiseError)
        //     if (document.documentName == element) {
        //       this.state.errors.additionalDocuments = '';
        //       raiseError = false
        //     }
        //     else if (element == 'Letter From HR' && raiseError) {
        //       this.state.errors.additionalDocuments = 'Please upload appropriate Documents to continue';
        //     }
        //   })
        // })
      // }
    }


  }

  handleInputChange(event) {
   
    const target = event.target;
    let value = target.value;
    const name = target.name;
    console.log('value ', value, ' name ', name)
    this.setState({
      "disabled": false
    });

    //   this.setState({
    //     errors: {
    //       ...this.state.errors,
    //       [name] : {
    //         'label' : "" ,
    //         'value' : false
    //       }
    //     }
    // });
 
    this.setState({
      placementData: {
        ...this.state.placementData,
        [name]: value
      }
    });

    if (this.state.placementData.interviewStatus === 'Entrepreneurship/ Self Employed') {
      this.validateEntrepreneurship(name, value);
      console.log(this.state.errors)
    }

    else if (this.state.placementData.interviewStatus === 'Placed') {
      this.validatePlacedAndOfferNotTaken(name, value);
      console.log(this.state.errors)
    }

    else if (this.state.placementData.interviewStatus === 'Not Placed'){
      this.validateNotPlaced(name, value);
      console.log(this.state.errors)
    }
  }

  handleCheckboxChange = (event) => {
    let target = event.target;
    let name = target.name;
    let idName = target.id;
    console.log(idName)

    // if (event.target.name == 'documentsUploaded') {
    //   this.state.errors.documentsUploaded = '';
    // }
    // else if (name == 'authenticationAndConsent') {
    //   this.state.errors.documentsUploaded = '';
    //   this.state.errors.authenticationAndConsent = '';
    // }
    // else if (name == 'familyConsent') {
    //   this.state.errors.familyConsent = '';
    // }

    this.validateAppropriateCheckBoxes(idName)

    this.setState({
      placementData: {
        ...this.state.placementData,
        [event.target.name]: event.target.checked
      }
    })

  };

  CheckForDocuments(docName) {
    this.state.documents.map((element, id) => {
      if (element.documentType == docName)
        return true;
      else
        return false;
    })
  }

  validateAppropriateCheckBoxes = (name) => {
    console.log('point 2')
    console.log('here')
    let errors = this.state.errors;
    console.log(this.state.documents)
    //*Check if any documents are uploaded if not send to the else part if yes check the type and then check the appropriate documents*//
    if (this.state.documents.length > 0) {

      if (name == "documentsUploaded") {
        console.log('point 3')
        // console.log('placed documents to be checked here')
        // this.state.documents.map((element, id) => {
        //   // console.log(element)
        //   var isPresent = (element.documentType == "Offer Letter" || element.documentType == "Joining Letter" || element.documentType == "Pay Slip" || element.documentType == "Bank Statement" || element.documentType == "Email From Employer" || element.documentType == "Workplace Picture" || element.documentType == "ID card" || element.documentType == "Letter from HR")
        //   let errors = this.state.errors;
        //   if (isPresent) {
        //     errors.documentsUploaded = '';
        //   }
        //   else {
        //     errors.documentsUploaded = 'Please upload the document before clicking the checkbox!';
        //   }
        // })
        let docList = ['Offer Letter', 'Joining Letter', 'Pay Slip', 'Bank Statement', 'Email From Employer', 'Workplace Picture', 'ID card', 'Letter from HR'];
        docList.map((element) => {
          let ans = this.CheckForDocuments(element);
          console.log("some value here ===> ", ans)
          if (this.CheckForDocuments(element)) {
            this.state.errors.documentsUploaded = '';
          }
          else if ((element == 'Letter from HR')) {
            console.log('reached here!!!')
            // this.state.errors.documentsUploaded = 'Please upload the document before clicking the checkbox!';
          }
        })
      }

      else if (name == "authenticationAndConsent") {
        console.log('point 4')
        // console.log('placed documents to be checked here')
        // if (errors.documentsUploaded) {
        //   errors.authenticationAndConsent = 'Please upload the document before clicking the checkbox!';
        // }
        // else {
        //   errors.authenticationAndConsent = '';
        // }

      }

      else if (name == "documentsUploadedEntrepreneurship") {
        console.log('point 5')
        // console.log('entrepreneurship documents to be checked here')

        // this.state.documents.map((element, id) => {
        //   // console.log(element)
        //   var isPresent = (element.documentType == "Registration Certificate")
        //   let errors = this.state.errors;
        //   if (isPresent) {
        //     errors.documentsUploaded = '';
        //   }
        //   else {
        //     errors.documentsUploaded = 'Please upload the document before clicking the checkbox!';
        //   }
        // })
        if (this.CheckForDocuments('Registration Certificate') || this.CheckForDocuments('Pic Of Business') || this.CheckForDocuments('MSME Registration Certificate')) {
          errors.documentsUploaded = '';
        }
        else {
          // errors.documentsUploaded = 'Please upload the document before clicking the checkbox!';
        }
      }

    }
    else {
      console.log('point 6')
      // alert('Please upload the document before clicking the checkbox!');
      // errors.name = 'Please upload documents before proceeding here!';
    }
    this.setState({ errors });

  }


  fetchPlacementdetailsFouUser(engagementId) {

    let placementInfo = [];
    // console.log('point here')
    fetchPlacementDetailsByEngagementId(engagementId).then((jsondata) => {
      // alert(JSON.stringify(jsondata));
      let placementDetailsOfUser = JSON.parse(jsondata.data);
      for (var i = 0; i < placementDetailsOfUser.length; i++) {
        var details =
        {   // 'employer_name':placementDetailsOfUser[i].employerName,
          'interview_status': placementDetailsOfUser[i].interviewStatus,
          'Reason': placementDetailsOfUser[i].reason,
          // 'annual_sal': placementDetailsOfUser[i].annualSal,
          'action': <EditIcon style={{ color: "blue" }} onClick={this.handleEditChange.bind(this, placementDetailsOfUser[i])} />
        };
        // console.log('placement details here ===> ', placementDetailsOfUser[i])
        placementInfo.push(details);
      }
      // console.log('plcament Info ===> ', placementInfo)
      this.setState({
        info: placementInfo
      });
    })


  }



  getCenterMasters(ids) {
    //** Fetch employer details based on placement partner*//
    fetchEmployerDetails('Active Partner', '%Placement Partner%').then((jsondata) => {
      console.log("employer data ===> ",jsondata)
      if (jsondata.appError == null) {
        let jsonObjects = JSON.parse(jsondata.data);
        jsonObjects.map(item => {
          this.state.center.push({ label: item.accountName, value: item.id })
        })
      }
      return (true);
    }).then(response => response);
  }


  mySubmitHandler = (event) => {
    // alert("check");
    console.log('point 0')
    event.preventDefault();
    this.state.disabled = true;
    console.log(this.state.placementData.interviewStatus)
    this.validate("interviewStatus", this.state.placementData.interviewStatus);
    console.log('This is the part of error')
    if (this.state.errors.interviewStatus === '') {

      if (this.state.placementData.interviewStatus === 'Placed') {
        console.log('point 1')
                /*the following is the validation for general form*/
        this.validatePlacedAndOfferNotTaken("empId", this.state.placementData.empId);
        this.validatePlacedAndOfferNotTaken("domainName", this.state.placementData.domainName);
        this.validatePlacedAndOfferNotTaken("spocName", this.state.placementData.spocName);
        this.validatePlacedAndOfferNotTaken("designation", this.state.placementData.designation);
        this.validatePlacedAndOfferNotTaken("spocPhoneNumber", this.state.placementData.spocPhoneNumber);
        this.validatePlacedAndOfferNotTaken("spocEmailId", this.state.placementData.spocEmailId);
        this.validatePlacedAndOfferNotTaken("monthlyGrossSal", this.state.placementData.monthlyGrossSal);
        this.validatePlacedAndOfferNotTaken("accommodationProvided", this.state.placementData.accommodationProvided);
        this.validatePlacedAndOfferNotTaken("foodProvided", this.state.placementData.foodProvided);
        this.validatePlacedAndOfferNotTaken("offerDate", this.state.placementData.offerDate);
        this.validatePlacedAndOfferNotTaken("offerStatus", this.state.placementData.offerStatus);
        if (this.state.placementData.offerStatus=='Accepted'){
          this.validatePlacedAndOfferNotTaken("joined", this.state.placementData.joined);
        }
        else if (this.state.placementData.offerStatus=='Rejected'){
          this.validatePlacedAndOfferNotTaken("reasonJobRejected", this.state.placementData.reasonJobRejected);
          this.validatePlacedAndOfferNotTaken("otherReasonInBrief", this.state.placementData.otherReasonInBrief);
        }
        // this.validatePlacedAndOfferNotTaken("documentsUploaded", this.state.placementData.documentsUploaded);
        // this.validatePlacedAndOfferNotTaken("authenticationAndConsent", this.state.placementData.authenticationAndConsent);
        // this.validateAppropriateCheckBoxes("documentsUploaded");
        // this.validateAppropriateCheckBoxes("authenticationAndConsent");
        //         /*the following is the validation for address*/
        this.validateAddress("pincode", this.state.address.pincode);
        this.validateAddress("villageName", this.state.address.villageName);
        this.validateAddress("cityName", this.state.address.cityName);
        this.validateAddress("state", this.state.address.state);
        this.validateAddress("district", this.state.address.district);

        let errorsExist = true;
        Object.values(this.state.errors).forEach(
          (val) => {
            val.length > 0 && (errorsExist = false)
          }
        );
        if (errorsExist) {
          this.submitPlacementDetails();
        }
        else {
          console.log(this.state.errors)
          // alert('Please upload the document before clicking the checkbox!');
        }
      }
      //**If Not placed then check reason if provided then submit details else alert  */
      else if (this.state.placementData.interviewStatus === 'Not Placed') {
        this.validateNotPlaced("reason", this.state.placementData.reason);
        this.validateNotPlaced("empId", this.state.placementData.empId);
        this.validateNotPlaced("reasonForNoOpportunity", this.state.placementData.reasonForNoOpportunity);
        this.validateNotPlaced("otherReasonInBrief", this.state.placementData.otherReasonInBrief);
        let errorsExist = true;
        Object.values(this.state.errors).forEach(
          (val) => val.length > 0 && (errorsExist = false)
        );
        if (errorsExist) {
          this.submitPlacementDetails();
        }
        else {
          console.log(this.state.errors)
          // alert('Please upload the document before clicking the checkbox!');
        }
      }
      //**If the status is Entrepreneurship check the checkboxes for documents uploaded*/
      else if (this.state.placementData.interviewStatus === 'Entrepreneurship/ Self Employed') {
                  /*the following is the validation of the form data for enterpreneurship*/
        this.validateEntrepreneurship("domainName", this.state.placementData.domainName);
        this.validateEntrepreneurship("noOfPeopleEmployed", this.state.placementData.noOfPeopleEmployed);
        this.validateEntrepreneurship("familyBusiness", this.state.placementData.familyBusiness);
        this.validateEntrepreneurship("availedLoan", this.state.placementData.availedLoan);
        this.validateEntrepreneurship("monthlyGrossSal", this.state.placementData.monthlyGrossSal);
                  /*the following is the validation for address*/
         this.validateAddress("pincode", this.state.address.pincode);
         this.validateAddress("villageName", this.state.address.villageName);
         this.validateAddress("cityName", this.state.address.cityName);
         this.validateAddress("state", this.state.address.state);
         this.validateAddress("district", this.state.address.district);
                  /*validation of appropriate checkboxes*/
     // this.validateEntrepreneurship("documentsUploaded", this.state.placementData.documentsUploaded);
        this.validateAppropriateCheckBoxes("documentsUploadedEntrepreneurship");
        let errorsExist = true;
        Object.values(this.state.errors).forEach(
          (val) => val.length > 0 && (errorsExist = false));
        if (errorsExist) {
          this.submitPlacementDetails();
        }
        else {
          // alert('Please upload the document before clicking the checkbox!');
        }
      }
      //**Else if nothing is from the selected try to save the data for the same if possible (this condition may not be arising ever but just in case) */
      else {
        this.submitPlacementDetails();
      }
    }
    //*authentication response and redirect to error or dashbaord page*/
    this.setState({
      errors: this.state.errors,
    });
    if (checkButton(this.state.errors)) {

    }
    else {
      this.state.disabled = true;
    }
  }


  validate = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'interviewStatus': {
        errors.interviewStatus = isNotEmpty(value);
        if(value=="Placed"){
            this.state.errors = {
                        /*Placed Data here*/
              domainName: '*', spocName: '*', spocPhoneNumber: '*', spocEmailId: '', monthlyGrossSal: '*',
              foodProvided: '*', accommodationProvided: '*', offerDate: '*', offerStatus: '*', joined: '',
              reason: '', otherReasonInBrief: '',
                        /*Address here*/
              joiningPin: '*', joiningCity: '*', addressId: '**', empId: 0, interviewStatus: '',
            }
        }
        else if(value=="Entrepreneurship/ Self Employed"){
            this.state.errors = {
                        /*Address here*/
              joiningPin: '*', joiningCity: '*', addressId: '*',
                        /*Entrepreneurship/ Self Employed*/
              noOfPeopleEmployed: '*', familyBusiness: '*', availedLoan: '*', interviewStatus: '',
            }
        }
        else if(value=="Not Placed"){
              this.state.errors = {
                          /*Not Placed*/
                  reasonForNoOpportunity: '*', reason: '', otherReasonInBrief: '', empId: '', interviewStatus: '',
          }
        }
        console.log(value)
      }
        break;
      default:
        break;
    }
    this.setState({ errors });
  }


  validateEntrepreneurship = (name, value) => {
    console.log("name ===> ", name, " value ===> ", value)
    let errors = this.state.errors;
    switch (name) {
      case 'noOfPeopleEmployed': errors.noOfPeopleEmployed = isNotZero(value);
        break;
      case 'domainName': errors.domainName = isNotEmpty(value);
        break;
      case 'familyBusiness' : errors.familyBusiness = isNotEmpty(value);
        break;
      case 'availedLoan' : errors.availedLoan = isNotEmpty(value);
        break;
      case 'monthlyGrossSal' : errors.monthlyGrossSal = isNotZero(value);
        break;
      case 'documentsUploaded': {
        if (value) {
          errors.documentsUploaded = "";
          this.CheckForDocuments('documentsUploadedEntrepreneurship');
        }
        else {
          errors.documentsUploaded = 'Please upload the appropriate documents to continue';
        }
        break;
      }
      default:
        break;
    }
    this.setState({ errors });
  }

  validateNotPlaced = (name, value) => {
    console.log("name ===> ", name, " value ===> ", value)
    let errors = this.state.errors;
    switch (name) {
      case 'reason': errors.reason = isNotEmpty(value);
        break;
      case 'empId': errors.reasonForNoOpportunity = isNotZero(value);
        break;
      case 'reasonForNoOpportunity': errors.reasonForNoOpportunity = isNotEmpty(value);
        break;
      case 'otherReasonInBrief': errors.otherReasonInBrief = isNotEmpty(value);
        break;
      default:
        break;
    }
    this.setState({ errors });
  }


  validatePlacedAndOfferNotTaken = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case  'empId': errors.empId = isNotEmpty(value);
        break;
      case  'domainName': errors.domainName = isNotEmpty(value);
        break;
      case  'spocName': errors.spocName = isNotEmpty(value);
        break;
      case  'spocEmailId': errors.spocEmailId = validateEmail('secondaryEmailId', value);
        break;
      case  'spocPhoneNumber': errors.spocPhoneNumber = validateContact(name, value);
        break;
      case  'monthlyGrossSal': errors.monthlyGrossSal = isNotZero(value);
        break;
      case  'accommodationProvided' : errors.accommodationProvided = isNotEmpty(value);
        break;
      case  'foodProvided' : errors.foodProvided = isNotEmpty(value);
        break;
      case  'offerDate': errors.offerDate = isNotEmpty(value);
        break;
      case  'offerStatus': errors.offerStatus = isNotEmpty(value);
        break;
      case  'joined': errors.joined = isNotEmpty(value);
        break;
      case  'reasonForNoOpportunity': errors.reasonForNoOpportunity = isNotEmpty(value);
        break;
      case  'otherReasonInBrief': errors.otherReasonInBrief = isNotEmpty(value);
        break;
      case  'reason': errors.reason = isNotEmpty(value);
        break;
      case  'reasonForRejection': errors.reasonForRejection = isNotEmpty(value);
        break;
      case  'documentsUploaded': {
        // if (value) {
        //   errors.documentsUploaded = "";
        //   this.CheckForDocuments('documentsUploaded');
        // }
        // else {
        //   errors.documentsUploaded = 'Please upload the appropriate documents to continue';
        // }
        // break;
      }
      case  'authenticationAndConsent': {
        // if (value) {
        //   errors.authenticationAndConsent = "";
        //   this.CheckForDocuments('authenticationAndConsent');
        // }
        // else {
        //   errors.authenticationAndConsent = 'Please upload the appropriate documents to continue';
        // }
        // break;
      }
      default: console.log('all clear');
        break;
    }
    this.setState({ errors });
  }


  validateAddress = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'pincode': errors.pincode = isNotEmpty(value);
        break;
      case 'villageName': errors.village = isNotEmpty(value);
        break;
      case 'cityName': errors.cityName = isNotEmpty(value);
        break;
      case 'state': errors.state = isNotEmpty(value);
        break;
      case 'district': errors.district = isNotEmpty(value);
        break;
      default:
        break;
    }
    this.setState({ errors });
  }


  handleAddressInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      address: {
        ...this.state.address,
        [name]: value
      }
    })
    this.validate(name, value);
  }
  handleAddressSelectChange(selectname, event) {
    this.setState({
      address: {
        ...this.state.address,
        [selectname]: event
      }
    })

    this.validateAddress(selectname, event);
  }

  handleTypeOfProofSelectChange(selectname, event) {

    let newVal = event;
    let stateVal = this.state.documentType;

    stateVal.indexOf(newVal) === -1
      ? stateVal.push(newVal)
      : stateVal.length === 1
        ? (stateVal = [])
        : stateVal.splice(stateVal.indexOf(newVal), 1)

    this.setState({ documentType: stateVal });

  }

  downloadDocuments = (value) => {
    let formData = new FormData();
    formData.append('data', '{"token" : "", "action" : "downloadDocument", "data" : [{"basicDocId":' + value + '}]}');
    fetch(serviceEndPoint.documentServiceEndPoint, {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + UserContext.token
      },
      body: formData
    }).then(response => response.json()).then((jsondata) => {
      let jsonobjects = JSON.parse(jsondata.data);
      var url = serviceEndPoint.downloadDocument + jsonobjects[0].documentPath + "";
      window.open(url, "_blank");
    });
  }

  uploadDocuments = (e) => {
    e.preventDefault();
    var levelOfDocument = "G";
    // console.log('dample here')
    let localThis = this;

    let reader = new FileReader();
    reader.readAsDataURL(this.state.file);
    reader.onload = function () {
      let document = reader.result;

      localThis.setState({ alertDialogFlag: false });
      uploadDocument(localThis.state.dbUserId, localThis.state.engagementId, localThis.state.typeOfDocument, 'PD', localThis.state.typeOfDocument, document, "").then((jsondata) => {
        //**Only if the student's data is successfully saved then display the message and update the documents list else display NOT uploaded message */
        if (jsondata.status == "success") {
          localThis.setState({ alertDialogFlag: false });
          alertDialogOptions.message = <span style={{ color: "green" }}>Document is Saved Sucessfully</span>;
          localThis.setState({ alertDialogFlag: true });
          localThis.getDocuments();
        }
        else {
          localThis.setState({ alertDialogFlag: false });
          alertDialogOptions.message = <span style={{ color: "red" }}>Document is NOT SAVED Please Check the uploaded Documents</span>;
          localThis.setState({ alertDialogFlag: true });
        }
      });

    }

  }

  onFileChangeHandler = (files) => { this.setState({ file: files[0] }); }

  getPincodeData(selectname, event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      address: {
        ...this.state.address,
        [name]: value
      }
    })
    this.validateAddress(name, value);
    if (value.length == 6) {

      fetchAddressDetailsBasedOnPincode(value).then((jsondata) => {
        let jsonobjects = JSON.parse(jsondata.data);
        let taluk = [];
        let pincode = [];
        let cityVillage = [];
        let states = [];
        let district = [];

        this.formData.village.length = 0;
        this.formData.pincodes.length = 0;
        this.formData.city.length = 0;
        this.formData.state.length = 0;
        this.formData.district.length = 0;

        jsonobjects.map(item => { cityVillage.push({ label: item.cityVillage, value: item.id }) });
        cityVillage = underscore.uniq(cityVillage, true, "label");
        cityVillage.map(item => { this.formData.village.push({ label: item.label, value: (item.label).toString() }) });
        this.setState({ village: this.formData.village });

        jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
        taluk = underscore.uniq(taluk, true, "label");
        taluk.map(item => { this.formData.city.push({ label: item.label, value: (item.label).toString() }) });
        this.setState({ city: this.formData.city });



        jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
        states = underscore.uniq(states, true, "label");
        states.map(item => { this.formData.state.push({ label: item.label, value: (item.value).toString() }) });
        this.setState({ state: this.formData.state }, () => { /*console.log(this.state.state)*/ });

        jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
        district = underscore.uniq(district, true, "label");
        district.map(item => { this.formData.district.push({ label: item.label, value: (item.value).toString() }) });
        this.setState({ district: this.formData.district });
      })
    }

  }



  submitPlacementDetails() {
    this.getDocuments();
    if (this.state.placementData.interviewStatus === 'Placed'
      || this.state.placementData.interviewStatus === 'Entrepreneurship/ Self Employed') {
      // console.log(" checkpoint 2 ")
      saveAddressDetails(JSON.stringify(this.state.address)).then((jsondata) => {
        let jsonobjects = JSON.parse(jsondata.data);
        //alert(jsonobjects[0].id);
        this.setState({
          placementData: {
            ...this.state.placementData,
            'addressId': jsonobjects[0].id
          }
        }, () => { this.saveAllDetails() });
        this.setState({ alertDialogFlag: false });
        alertDialogOptions.message = <span style={{ color: "green" }}>Placement Details Saved Sucessfully</span>;
        this.setState({ alertDialogFlag: true });
      });

    }
    else {
      this.saveAllDetails();
    }
  }

  saveAllDetails() {
    // console.log(" checkpoint 3 ")
    // console.log(this.state.placementData)
    savePlacementDetails(this.state.placementData).then((jsondata) => {
      this.fetchPlacementdetailsFouUser(this.state.engagementId);
      if (jsondata.appError == null || jsondata.status == 'success') {
        let jsonobjects = JSON.parse(jsondata.data);
        //alert(JSON.stringify(jsonobjects));  
        // console.log(jsonobjects);
        this.setState({ alertDialogFlag: false });
        alertDialogOptions.message = <span style={{ color: "green" }}>Placement Details Saved Sucessfully</span>;
        this.setState({ alertDialogFlag: true });

      }
      else {
        console.log('error', this.state.errors)
        this.setState({ alertDialogFlag: false });
        alertDialogOptions.message = <span style={{ color: "red" }}>Please upload the appropriate documents for saving the placement details!</span>;
        this.setState({ alertDialogFlag: true });
      }
    })
  }



  render() {
    const columns = [
      { label: 'Interview Status', name: 'interview_status', headerStyle: { color: '#FF9800' } },
      { label: 'Reason', name: 'Reason', headerStyle: { color: '#FF9800' } },
      // { label: 'Annual Salary', name: 'annual_sal', headerStyle: { color: '#FF9800' } },
      { label: 'Action', name: 'action', headerStyle: { color: '#FF9800' } }
    ]

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      sortDirection: "desc",
      selectableRows: 'single',
      disableToolbarSelect: true,
      rowsPerPage: 10,
      selectableRowsOnClick: true,



    };

    let button;
    button = <Grid container direction="row" justify="flex-end" id="btn" alignItems="flex-end">  <Button variant="contained" type="submit" size="small" color="primary"
    disabled={(this.state.buttonStatus == "Enrolled") ? false : true}
    >
      Save
    </Button></Grid>


    return (
      <div style={{ width: '100%' }}>
        <form onSubmit={this.mySubmitHandler} method="post">
          <fieldset id="roleBasedDisable">
            <Grid item xs={12} sm={3}>
              <SingleSelect name="interviewStatus" id="interviewStatus" label="Interview Status"
                onChange={this.handlePlacementSelectChange.bind(this, 'interviewStatus')}
                value={this.state.placementData.interviewStatus || ''}
                helperText={this.state.errors.interviewStatus}
                error={this.state.errors.interviewStatus === '' ? false : true}
                options={this.state.intStatus}
              />
            </Grid>
            {/*If the status is placed*/}
            <div style={{ display: (this.state.placementData.interviewStatus === "Placed" ? "block" : "none") }}>
              {/* <Grid id="hideData" container spacing={2}>
                <Grid item xs={12}>
                  <FormControl>
                  </FormControl>
                </Grid>
                <br></br>


                <Grid item xs={12} sm={3}>
                  <SingleSelect name="empId" id="empId" label="Employer Name"
                    onChange={this.handleSelectChange.bind(this, 'empId')}
                    value={this.state.placementData.empId || ''}
                    helperText={this.state.errors.empId}
                    error={this.state.errors.empId === '' ? false : true}
                    options={this.state.center}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="domainName" id="domainName" label="Domain"
                    onChange={this.handleSelectChange.bind(this, 'domainName')}
                    value={this.state.placementData.domainName || ''}
                    helperText={this.state.errors.domainName}
                    error={this.state.errors.domainName === '' ? false : true}
                    options={this.state.domains} />
                </Grid>

                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}></Grid>

                <Grid item xs={12} sm={3} id="interviewRemark">
                  <FormControl>
                    <TextField type="text" name="spocName" id="spocName"
                      label="Employer SPOC Name"
                      onChange={this.handleInputChange}
                      value={this.state.placementData.spocName || ''}
                      helperText={this.state.errors.spocName}
                      error={this.state.errors.spocName === '' ? false : true}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} id="interviewRemark">
                  <FormControl>
                    <TextField type="number" name="spocPhoneNumber" id="spocPhoneNumber"
                      label="SPOC contact NO."
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                      }}
                      onChange={this.handleInputChange}
                      value={this.state.placementData.spocPhoneNumber || ''}
                      helperText={this.state.errors.spocPhoneNumber}
                      error={this.state.errors.spocPhoneNumber === '' ? false : true}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} id="interviewRemark">
                  <FormControl>
                    <TextField type="text" name="spocEmailId" id="spocEmailId"
                      label="SPOC email Id"
                      onChange={this.handleInputChange}
                      value={this.state.placementData.spocEmailId || ''}
                      helperText={this.state.errors.spocEmailId}
                      error={this.state.errors.spocEmailId === '' ? false : true}
                    />
                  </FormControl>
                </Grid>

                <Grid items xs={12} sm={3} />

                <Grid item xs={12} sm={3} id="annualSal">
                  <FormControl>
                    <TextField type="number" name="monthlyGrossSal" id="monthlyGrossSal"
                      label="Monthly Gross Salary"
                      helperText={this.state.errors.monthlyGrossSal}
                      error={this.state.errors.monthlyGrossSal === '' ? false : true}
                      onChange={this.handleInputChange}
                      value={this.state.placementData.monthlyGrossSal || ''}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="accommodationProvided" id="accommodationProvided" label="Accommodation Provided"
                    onChange={this.handleSelectChange.bind(this, 'accommodationProvided')}
                    value={this.state.placementData.accommodationProvided || ''}
                    options={this.state.yesOrNo}
                    helperText={this.state.errors.accommodationProvided}
                    error={this.state.errors.accommodationProvided === '' ? false : true}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="foodProvided" id="foodProvided" label="Food Provided"
                    onChange={this.handleSelectChange.bind(this, 'foodProvided')}
                    value={this.state.placementData.foodProvided || ''}
                    options={this.state.yesOrNo}
                    helperText={this.state.errors.foodProvided}
                    error={this.state.errors.foodProvided === '' ? false : true}
                  />
                </Grid>

                <Grid item xs={12} sm={3} id="offerDate">
                  <TextField id="date" name="offerDate" id="offerDate" onChange={this.handleInputChange}
                    label="Offer Date" value={this.state.placementData.offerDate || ''}
                    helperText={this.state.errors.offerDate}
                    error={this.state.errors.offerDate === '' ? false : true}
                    type="date"
                    inputProps={{ max: new Date().toISOString().slice(0, 10) }}
                    InputLabelProps={{
                      shrink: true,
                    }} />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="offerStatus" id="offerStatus" label="Offer Status"
                    onChange={this.handleSelectChange.bind(this, 'offerStatus')}
                    value={this.state.placementData.offerStatus || ''}
                    options={this.state.OfferStatus}
                    helperText={this.state.errors.offerStatus}
                    error={this.state.errors.offerStatus === '' ? false : true}
                  />
                </Grid>
                <InputLabel shrink={true} style={{ color: "red" }} >
                  {(this.state.errors.additionalDocuments || '')}
                </InputLabel>

                {(this.state.placementData.offerStatus == "Rejected") ?
                  <Grid item xs={12} sm={3}>
                    <SingleSelect name="reasonJobRejected" id="reasonJobRejected" label="Reason For Job Rejection"
                      onChange={this.handleSelectChange.bind(this, 'reason')}
                      value={this.state.placementData.reason || ''}
                      options={this.state.notInterestedReason}
                      helperText={this.state.errors.reason}
                      error={this.state.errors.reason === '' ? false : true}
                    />
                  </Grid> :
                  (this.state.placementData.offerStatus == "Accepted") && <Grid item xs={12} sm={3}>
                    <SingleSelect name="joined" id="joined" label="Joined"
                      onChange={this.handleSelectChange.bind(this, 'joined')}
                      value={this.state.placementData.joined || ''}
                      options={this.state.yesOrNo}
                      helperText={this.state.errors.joined}
                      error={this.state.errors.joined === '' ? false : true}
                    />
                  </Grid>}

                {(this.state.placementData.reason == "Others") && <Grid item xs={12} sm={6}>
                  <FormControl>
                    <TextField type="text" name="otherReasonInBrief" id="otherReasonInBrief" label="Please state the reason for Rejection"
                      helperText={this.state.errors.otherReasonInBrief}
                      error={this.state.errors.otherReasonInBrief === '' ? false : true}
                      onChange={this.handleInputChange}
                      value={this.state.placementData.otherReasonInBrief || ''}
                    />
                  </FormControl>
                </Grid>}
             

                <Grid item xs={12}>
                  <FormControl>
                    <h6 style={{ fontWeight: 'bold' }}>Job Location</h6>
                  </FormControl>


                </Grid>

                <AddressForPlacement
                  pincodeName="pincode" pincodeId="pincode" pincodeOnChange={this.getPincodeData.bind(this, 'pincode')} pincodeValue={this.state.address.pincode || ''} pincodeHelperText={this.state.errors.pincode} pincodeError={this.state.errors.pincode == '' ? false : true}
                  villageName="villageName" villageId="villageName" villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')} villageData={this.state.village} villageValue={this.state.address.villageName || ''} villageHelperText={this.state.errors.village} villageError={this.state.errors.village == '' ? false : true}
                  cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''} cityData={this.state.city} cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')} cityNameHelperText={this.state.errors.cityName} cityNameError={this.state.errors.cityName == '' ? false : true}
                  stateName="state" stateId="state" stateData={this.state.state} stateValue={this.state.address.state || ''} stateInputValue={this.handleAddressSelectChange.bind(this, 'state')} stateHelperText={this.state.errors.state} stateError={this.state.errors.state == '' ? false : true}
                  districtName="district" districtId="district" districtValue={this.state.address.district || ''} districtData={this.state.district} districtInputValue={this.handleAddressSelectChange.bind(this, 'district')} districtHelperText={this.state.errors.district} districtError={this.state.errors.district == '' ? false : true}
                />

                <Grid item xs={12} sm={6} >
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckboxChange}
                        name="documentsUploaded"
                        id="documentsUploaded"
                        color="primary"
                      />
                    }
                    label="I have uploaded appropriate Evidence"
                  />
                  <InputLabel shrink={true} style={{ color: "red" }} >
                    {(this.state.errors.documentsUploaded || '')}
                  </InputLabel>

                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckboxChange}
                        name="authenticationAndConsent"
                        id="authenticationAndConsent"
                        color="primary"
                      />
                    }
                    label="Have gone though the placement evidence and Authentic for both data and evidence"
                  />
                  <InputLabel shrink={true} style={{ color: "red" }} >
                    {(this.state.errors.authenticationAndConsent || '')}
                  </InputLabel>
                </Grid>
                <br />
              </Grid>*/}
                <PlacementDetailsSubPlaced props={this.props}/>
            </div>
                   
            {/* Incase if a candidate has opted for entrepreneurship/ self Employed */}
            <div id="entrepreneurship" style={{ display: (this.state.placementData.interviewStatus === "Entrepreneurship/ Self Employed" ? "block" : "none") }}>
              {/* <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl>
                  </FormControl>
                </Grid>
                <br></br>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="domainName" id="domainName" label="Domain"
                    onChange={this.handleSelectChange.bind(this, 'domainName')}
                    value={this.state.placementData.domainName || ''}
                    helperText={this.state.errors.domainName}
                    error={this.state.errors.domainName === '' ? false : true}
                    options={this.state.domains} />
                </Grid>

                <Grid item xs={12} sm={3} id="studentRemark">
                  <FormControl>
                    <TextField type="text" name="noOfPeopleEmployed" id="noOfPeopleEmployed" label="No. of people employed"
                      helperText={this.state.errors.noOfPeopleEmployed}
                      error={this.state.errors.noOfPeopleEmployed === '' ? false : true}
                      onChange={this.handleInputChange}
                      value={this.state.placementData.noOfPeopleEmployed || ''}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                      }} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} />

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="familyBusiness" id="familyBusiness" label="Is it a Family Business"
                    onChange={this.handleSelectChange.bind(this, 'familyBusiness')}
                    value={this.state.placementData.familyBusiness || ''}
                    helperText={this.state.errors.familyBusiness}
                    error={this.state.errors.familyBusiness === '' ? false : true}
                    options={this.state.yesOrNo} />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SingleSelect name="availedLoan" id="availedLoan" label="Availed Loan"
                    onChange={this.handleSelectChange.bind(this, 'availedLoan')}
                    value={this.state.placementData.availedLoan || ''}
                    helperText={this.state.errors.availedLoan}
                    error={this.state.errors.availedLoan === '' ? false : true}
                    options={this.state.yesOrNo} />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl>
                    <TextField type="number" name="monthlyGrossSal" id="monthlyGrossSal"
                      label="Monthly Gross Income"
                      helperText={this.state.errors.monthlyGrossSal}
                      error={this.state.errors.monthlyGrossSal === '' ? false : true}
                      onChange={this.handleInputChange}
                      value={this.state.placementData.monthlyGrossSal || ''}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl>
                    <h6 style={{ fontWeight: 'bold' }}>Job Location</h6>
                  </FormControl>
                </Grid>
                <AddressForPlacement
                  pincodeName="pincode" pincodeId="pincode" pincodeOnChange={this.getPincodeData.bind(this, 'pincode')} pincodeValue={this.state.address.pincode || ''} pincodeHelperText={this.state.errors.pincode} pincodeError={this.state.errors.pincode == '' ? false : true}
                  villageName="villageName" villageId="villageName" villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')} villageData={this.state.village} villageValue={this.state.address.villageName || ''} villageHelperText={this.state.errors.village} villageError={this.state.errors.village == '' ? false : true}
                  cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''} cityData={this.state.city} cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')} cityNameHelperText={this.state.errors.cityName} cityNameError={this.state.errors.cityName == '' ? false : true}
                  stateName="stateName" stateId="stateName" stateData={this.state.state} stateValue={this.state.address.state || ''} stateInputValue={this.handleAddressSelectChange.bind(this, 'state')} stateHelperText={this.state.errors.state} stateError={this.state.errors.state == '' ? false : true}
                  districtName="district" districtId="district" districtValue={this.state.address.district || ''} districtData={this.state.district} districtInputValue={this.handleAddressSelectChange.bind(this, 'district')} districtHelperText={this.state.errors.district} districtError={this.state.errors.district == '' ? false : true}
                />

                <Grid item xs={12} sm={6} >
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCheckboxChange}
                        name="documentsUploaded"
                        id="documentsUploadedEntrepreneurship"
                        color="primary"
                      // value={(this.state.placementData.documentsUploaded == "true" || this.state.placementData.documentsUploaded) ? true : false}
                      // required={true}
                      />
                    }
                    label="I have uploaded appropriate Evidence"
                  />
                  <InputLabel shrink={true} style={{ color: "red" }} >
                    {(this.state.errors.documentsUploaded || '')}
                  </InputLabel>
                </Grid>
                <br />
              </Grid> */}
              <PlacementDetailsSubEntNP props={this.state} />
            </div>

            {/*Incase a candidate has opted for not being placed or the candidate is not placed*/}
            <div style={{ display: (this.state.placementData.interviewStatus === "Not Placed" ? "block" : "none") }}>
              {/* <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl>
                  </FormControl>
                </Grid>
              </Grid>
              <br></br>

              <Grid id="hideData" container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <SingleSelect name="reason" id="reason" label="Reason"
                    onChange={this.handleSelectChange.bind(this, 'reason')}
                    value={this.state.placementData.reason || ''}
                    options={this.state.notPlacedReason}
                    helperText={this.state.errors.reason}
                    error={this.state.errors.reason === '' ? false : true}
                  />
                </Grid>
                <br></br>
                {
                  (this.state.placementData.reason == 'Rejected By Employer') &&
                  <Grid item xs={12} sm={3}>
                    <SingleSelect name="empId" id="empId" label="Employer Name"
                      onChange={this.handleSelectChange.bind(this, 'empId')}
                      value={this.state.placementData.empId || ''}
                      helperText={this.state.errors.empId} n
                      error={this.state.errors.empId === '' ? false : true}
                      options={this.state.center}
                    />
                  </Grid>
                }

                {
                  (this.state.placementData.reason == 'Not Avaliable Opportunity') &&
                  <Grid item xs={12} sm={3}>
                    <SingleSelect name="empId" id="empId" label="Reason for No Opportunites"
                      onChange={this.handleSelectChange.bind(this, 'reasonForNoOpportunity')}
                      value={this.state.placementData.reasonForNoOpportunity || ''}
                      helperText={this.state.errors.reasonForNoOpportunity}
                      error={this.state.errors.reasonForNoOpportunity === '' ? false : true}
                      options={this.state.notAvlOppReason}
                    />
                  </Grid>
                }


                {
                  (this.state.placementData.reasonForNoOpportunity == 'Others' || this.state.placementData.reasonForNoOpportunity == 'No Employment Opportuntities') &&
                  <Grid item xs={12} sm={3}>
                    <FormControl>
                      <TextField type="text" name="otherReasonInBrief" id="otherReasonInBrief" label=  "Please state/ brief the reason for No Opportunities"
                        helperText={this.state.errors.otherReasonInBrief}
                        error={this.state.errors.otherReasonInBrief === '' ? false : true}
                        onChange={this.handleInputChange}
                        value={this.state.placementData.otherReasonInBrief || ''}
                      />
                    </FormControl>
                  </Grid>
                }
              </Grid> */}
                          <PlacementDetailsSubNP props={this.state} />
            </div>



            {/*button*/}
          </fieldset>
        </form>
        <form onSubmit={this.uploadDocuments} method="post">
          <Table aria-label="simple table" style={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "25%" }}>Type of Document</TableCell>

                <TableCell style={{ width: "20%" }}>Browse and Upload</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <InputLabel shrink={true} style={{ color: "GrayText" }} >
                *Note : After Uploading the document if the checkbox still does not works, return to the screen after visiting some other screen!
              </InputLabel>
              <TableRow >
                <TableCell >

                  <SingleSelect isClearable={true}
                    name="typeOfDocument" id="typeOfDocument"
                    options={this.state.typeOfDocumentData}
                    onChange={this.handleSelectChangeDoc.bind(this, 'typeOfDocument')}
                    value={this.state.typeOfDocument || ''}
                  />
                </TableCell>

                <TableCell>
                  <DropzoneArea
                    name="file" id="file"
                    maxFileSize={200000} filesLimit={1} showFileNames={true}
                    onChange={this.onFileChangeHandler}
                  // key={this.state.clearDropzoneArea}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid container direction="row" justify="flex-end" alignItems="flex-end">
            <Button type="submit" variant="contained" color="primary" size="small"
              disabled={this.state.file == null || this.state.typeOfDocument == '' ? true : false}
            >Upload Document</Button>
          </Grid>
        </form>



        <br></br><br></br><br></br><br></br><br></br><br></br>
        <MUIDataTable id="dtb" title={"List Of Placement Details"} label={"List of Placement Details "} columns={columns} data={this.state.info} options={options} />
        <br /><br />
        <InputLabel>List Of Uploaded Document</InputLabel>
        <br />
        {
          (this.state.documents != "") &&

          <Paper>
            <Table aria-label="simple table">
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

                        onClick={this.downloadDocuments.bind(this, row.basicDocId)}
                      >Download</Button>
                    </TableCell>

                    <TableCell >
                      <Button variant="contained" color="primary" size="small" name="delete" id="delete"
                        onClick={this.deleteDocument.bind(this, row.basicDocId)}
                      >Delete</Button>
                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>


        }

        {
          (this.state.alertDialogFlag) && <AlertDialog message={alertDialogOptions.message}></AlertDialog>
        }


      </div>

    );
  }

}

export default PlacementDetails;