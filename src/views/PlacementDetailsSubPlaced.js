import React from 'react';
import './../App.css';
import './../assets/css/login-style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import { FormControl, InputLabel, FormControlLabel, Input, Grid, RadioGroup, Radio, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddressForPlacement from "./AddressForPlacement";
import Checkbox from '@material-ui/core/Checkbox';
import { savePlacementDetails, fetchUserDocumentsByUserIdAndTypeOfDocument, fectAddressDetailsByAddressID, fetchAddressDetailsBasedOnPincode, fetchPlacementDetailsByEngagementId, fetchAllCenter, saveAddressDetails, fetchEmployerDetails, } from '../util/api';
import { isNotEmpty, isNotZero, validateEmail, validateContact } from './../util/validation';
import underscore from 'underscore';


const OfferStatus = [
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' }
]
const yesOrNo = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
]
const domains = [
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
]
const employmentType = [
    { value: 'FTE/ Onroll', label: 'FTE/ Onroll' },
    { value: 'Contract/ Offroll', label: 'Contract/ Offroll' },
    { value: '3rd Party', label: '3rd Party' }
]
const notInterestedReason = [
    { value: 'Marriage', label: 'Marriage' },
    { value: 'Migration', label: 'Migration' },
    { value: 'Less Salary', label: 'Less Salary' },
    { value: 'Others', label: 'Others' }
]


class PlacementDetailsSubPlaced extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.props)
        /*State starts here*/
        this.state = {
            placementData: {
                empId: '', domainName: '', employmentType: '', thirdPartyEmp: '', spocName: '',
                spocPhoneNumber: '', spocEmailId: '', monthlyGrossSal: '', accommodationProvided: '',
                foodProvided: '', offerDate: '', offerStatus: '', joined: '', reasonJobRejected: '',
                otherReasonInBrief: '',
                /*Address here*/
                joiningPin: '', joiningCity: '', addressId: '',
                /*General data*/
                createdBy: UserContext.userid, updatedBy: UserContext.userid, engagementId: props.props.engagementId,
                dbUserId: props.props.id, isActive: "Y", interviewStatus: 'Placed',
            },
            errors: {
                /*Address here*/
                joiningPin: '', joiningCity: '', addressId: '', pincode: '', village: '', state: '',
                cityName: '', district: '',
                /*Placement data here*/
                empId: '', domainName: '', employmentType: '', thirdPartyEmp: '',
                spocName: '', spocPhoneNumber: '', spocEmailId: '', monthlyGrossSal: '',
                accommodationProvided: '', foodProvided: '', offerDate: '', offerStatus: '',
                joined: '', reasonJobRejected: '', otherReasonInBrief: '',
            },
            addressId: '',
            address: {
                entityId: props.props.engagementId, createdBy: UserContext.userid, 'isActive': 'Y', 'type': 'PD',
                'entityType': 'S', pincode: "", addressLine1: "", addressLine2: "", district: "", state: "",
                cityName: "", villageName: ""
            },
            employersDetails: [],
            info: [],
            documents: [],
            message: '',
        };
        this.formData = { state: [], district: [], pincodes: [], city: [], village: [] };
        /*fetch placement details for user if present from earlier*/
        if (props.props.id != null && props.props.id != undefined) {
            console.log('here')
            this.fetchPlacementdetailsFouUser(props.props.engagementId);
        }
        else {
            console.log('No Employment Data for the user with selected option found!')
        }

        /*fetch employer details*/
        fetchEmployerDetails('Active Partner', '%Placement Partner%').then((jsondata) => {
            console.log("employer data ===> ", jsondata)
            if (jsondata.appError == null) {
                let jsonObjects = JSON.parse(jsondata.data);
                jsonObjects.map(item => {
                    this.state.employersDetails.push({ label: item.accountName, value: item.id })
                })
            }
        });

        /*fetch list of documents*/
        fetchUserDocumentsByUserIdAndTypeOfDocument(props.props.id, 'PD').then((jsondata) => {
            let jsonobjects = JSON.parse(jsondata.data);
            console.log(jsonobjects)
            this.setState({ documents: [...this.state.documents, ...jsonobjects] })
        });
    }

    submitAddressDetails = () => {
        saveAddressDetails(JSON.stringify(this.state.address)).then((jsondata) => {
            let jsonobjects = JSON.parse(jsondata.data);
            this.setState({
                'addressId': jsonobjects[0].id
            });
        });
    }

    validateFormData = (name, value) => {
        let errors = this.state.errors;
        switch (name) {
            case 'empId': errors.empId = isNotEmpty(value);
                break;
            case 'domainName': errors.domainName = isNotEmpty(value);
                break;
            case 'spocName': errors.spocName = isNotEmpty(value);
                break;
            case 'spocEmailId': errors.spocEmailId = validateEmail('secondaryEmailId', value);
                break;
            case 'spocPhoneNumber': errors.spocPhoneNumber = validateContact(name, value);
                break;
            case 'monthlyGrossSal': errors.monthlyGrossSal = isNotZero(value);
                break;
            case 'accommodationProvided': errors.accommodationProvided = isNotEmpty(value);
                break;
            case 'foodProvided': errors.foodProvided = isNotEmpty(value);
                break;
            case 'offerDate': errors.offerDate = isNotEmpty(value);
                break;
            case 'offerStatus': errors.offerStatus = isNotEmpty(value);
                break;
            case 'joined': errors.joined = isNotEmpty(value);
                break;
            case 'reasonForNoOpportunity': errors.reasonForNoOpportunity = isNotEmpty(value);
                break;
            case 'otherReasonInBrief': errors.otherReasonInBrief = isNotEmpty(value);
                break;
            case 'reason': errors.reason = isNotEmpty(value);
                break;
            case 'reasonForRejection': errors.reasonForRejection = isNotEmpty(value);
                break;
            default:
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

    handleAddressInputChange = (event) => {
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
    }


    handleAddressSelectChange = (selectname, event) => {
        this.setState({
            address: {
                ...this.state.address,
                [selectname]: event
            }
        })
        this.validateAddress(selectname, event);
    }


    getPincodeData = (selectname, event) => {
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
                cityVillage.map(item => {
                    this.formData.village.push({
                        label: item.label, value: (item.label).toString()
                    })
                });
                this.setState({ village: this.formData.village });

                jsonobjects.map(item => { taluk.push({ label: item.taluk, value: item.id }) });
                taluk = underscore.uniq(taluk, true, "label");
                taluk.map(item => {
                    this.formData.city.push({
                        label: item.label, value: (item.label).toString()
                    })
                });
                this.setState({ city: this.formData.city });

                jsonobjects.map(item => { states.push({ label: item.state, value: item.id }) });
                states = underscore.uniq(states, true, "label");
                states.map(item => {
                    this.formData.state.push({
                        label: item.label, value: (item.value).toString()
                    })
                });
                this.setState({ state: this.formData.state }, () => { /*console.log(this.state.state)*/ });

                jsonobjects.map(item => { district.push({ label: item.district, value: item.id }) });
                district = underscore.uniq(district, true, "label");
                district.map(item => {
                    this.formData.district.push({
                        label: item.label, value: (item.value).toString()
                    })
                });
                this.setState({ district: this.formData.district });
            })
        }

    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        var errorsExist = true;
        Object.values(this.state.errors).forEach(
            (errorValue) => {
                if(errorValue.length>0){
                    console.log("error length ==> ", errorValue.length)
                    alert('Please fill all the fields before proceeding ')
                    errorValue.length > 0 && (errorsExist = false)
                }
            }
        );
        if(errorsExist) {
            this.submitAddressDetails();
        }
        else{
            console.log('one or more errors are in the form please check the errors before submitting the form!')
        }
    }

    submitPlacedAddressDetails = () => {
        saveAddressDetails(JSON.stringify(this.state.address)).then((jsondata) => {
            let jsonobjects = JSON.parse(jsondata.data);
            //alert(jsonobjects[0].id);
            this.set.state({
              placementData: {
                ...this.state.placementData,
                'addressId': jsonobjects[0].id
              }
            }, () => {this.savePlacedFormDetails();});
        })
    }

    savePlacedFormDetails = () => {
        savePlacementDetails(this.state.placementData).then((jsondata) => {
            if (jsondata.appError == null || jsondata.status == 'success') {
                let jsonobjects = JSON.parse(jsondata.data);
                console.log(jsonobjects)
            }
        })
    }

    fetchPlacementdetailsFouUser(engagementId) {
        let placementInfo = [];
        // console.log('point here')
        fetchPlacementDetailsByEngagementId(engagementId).then((jsondata) => {
            // alert(JSON.stringify(jsondata));
            let placementDetailsOfUser = JSON.parse(jsondata.data);
            for (var i = 0; i < placementDetailsOfUser.length; i++) {
                if (placementDetailsOfUser[i].interviewStatus == "Placed") {
                    console.log(placementDetailsOfUser[i])
                    this.state.placementData.empId = placementDetailsOfUser[i]?.empId;
                    this.state.placementData.domainName = placementDetailsOfUser[i]?.domainName;
                    // this.state.placementData.employmentType = placementDetailsOfUser[i]?.employmentType;
                    // this.state.placementData.thirdPartyEmp = placementDetailsOfUser[i]?.thirdPartyEmp;
                    this.state.placementData.spocName = placementDetailsOfUser[i]?.spocName;
                    this.state.placementData.spocPhoneNumber = placementDetailsOfUser[i]?.spocPhoneNumber;
                    this.state.placementData.spocEmailId = placementDetailsOfUser[i]?.spocEmailId;
                    this.state.placementData.monthlyGrossSal = placementDetailsOfUser[i]?.monthlyGrossSal;
                    this.state.placementData.accommodationProvided = placementDetailsOfUser[i]?.accommodationProvided;
                    this.state.placementData.foodProvided = placementDetailsOfUser[i]?.foodProvided;
                    this.state.placementData.offerDate = placementDetailsOfUser[i]?.offerDate;
                    this.state.placementData.offerStatus = placementDetailsOfUser[i]?.offerStatus;
                    this.state.placementData.joined = placementDetailsOfUser[i]?.joined;
                    this.state.placementData.reasonJobRejected = placementDetailsOfUser[i]?.reasonJobRejected;
                    this.state.placementData.otherReasonInBrief = placementDetailsOfUser[i]?.otherReasonInBrief;
                }
            }
        })
    }

    handleSelectChange = (selectname, event) => {
        this.validateFormData(selectname, event);
        this.setState({
            placementData: {
                ...this.state.placementData,
                [selectname]: event
            }
        });
        console.log("value ====> ", this.state)
    }

    handleInputChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        this.validateFormData(name, value);
        this.setState({
            placementData: {
                ...this.state.placementData,
                [name]: value
            }
        });
        console.log("value ====> ", this.state)
    }

    render() {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <form onSubmit={this.mySubmitHandler} method="post">
                        <Grid id="hideData" container spacing={2}>
                            <Grid item xs={12}>
                            </Grid>
                            <br></br>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="empId" id="empId" label="Employer Name"
                                    onChange={this.handleSelectChange.bind(this, 'empId')}
                                    value={this.state.placementData.empId || ''}
                                    helperText={this.state.errors.empId}
                                    error={this.state.errors.empId === '' ? false : true}
                                    options={this.state.employersDetails} 
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="domainName" id="domainName" label="Domain"
                                    onChange={this.handleSelectChange.bind(this, 'domainName')}
                                    value={this.state.placementData.domainName || ''}
                                    helperText={this.state.errors.domainName}
                                    error={this.state.errors.domainName === '' ? false : true}
                                    options={domains} />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="employmentType" id="employmentType" label="Employment Type"
                                    onChange={this.handleSelectChange.bind(this, 'employmentType')}
                                    value={this.state.placementData.employmentType || ''}
                                    // helperText={this.state.errors.domainName}
                                    // error={this.state.errors.domainName === '' ? false : true}
                                    options={employmentType} />
                            </Grid>

                            {(this.state.placementData.employmentType == '3rd Party') ? <Grid item xs={12} sm={3}>
                                <SingleSelect name="thirdPartyEmp" id="thirdPartyEmp" label="3rd Party Employers"
                                    onChange={this.handleSelectChange.bind(this, 'thirdPartyEmp')}
                                    value={this.state.placementData.thirdPartyEmp || ''}
                                    // helperText={this.state.errors.thirdPartyEmp}
                                    // error={this.state.errors.thirdPartyEmp === '' ? false : true}
                                    options={this.state.employersDetails} 
                                />
                            </Grid> : <Grid item xs={12} sm={3}></Grid>}

                            <Grid item xs={12} sm={3} id="interviewRemark">
                                <FormControl>
                                    <TextField type="text" name="spocName" id="spocName"
                                        label="Employer SPOC Name"
                                        onChange={this.handleInputChange}
                                        value={this.state.placementData.spocName || ''}
                                        helperText={this.state.errors.spocName}
                                        error={this.state.errors.spocName === '' ? false : true} required
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3} id="interviewRemark">
                                <FormControl>
                                    <TextField type="number" name="spocPhoneNumber" id="spocPhoneNumber"
                                        label="SPOC contact No."
                                        onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                        }}
                                        onChange={this.handleInputChange}
                                        value={this.state.placementData.spocPhoneNumber || ''}
                                        helperText={this.state.errors.spocPhoneNumber}
                                        error={this.state.errors.spocPhoneNumber === '' ? false : true} required
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
                                        }} required                                    
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="accommodationProvided" id="accommodationProvided" label="Accommodation Provided"
                                    onChange={this.handleSelectChange.bind(this, 'accommodationProvided')}
                                    value={this.state.placementData.accommodationProvided || ''}
                                    options={yesOrNo}
                                    helperText={this.state.errors.accommodationProvided}
                                    error={this.state.errors.accommodationProvided === '' ? false : true} 
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="foodProvided" id="foodProvided" label="Food Provided"
                                    onChange={this.handleSelectChange.bind(this, 'foodProvided')}
                                    value={this.state.placementData.foodProvided || ''}
                                    options={yesOrNo}
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
                                    }}  required/>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <SingleSelect name="offerStatus" id="offerStatus" label="Offer Status"
                                    onChange={this.handleSelectChange.bind(this, 'offerStatus')}
                                    value={this.state.placementData.offerStatus || ''}
                                    options={OfferStatus}
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
                                        onChange={this.handleSelectChange.bind(this, 'reasonJobRejected')}
                                        value={this.state.placementData.reason || ''}
                                        options={notInterestedReason}
                                        helperText={this.state.errors.reason}
                                        error={this.state.errors.reason === '' ? false : true}
                                    />
                                </Grid> :
                                (this.state.placementData.offerStatus == "Accepted") && <Grid item xs={12} sm={3}>
                                    <SingleSelect name="joined" id="joined" label="Joined"
                                        onChange={this.handleSelectChange.bind(this, 'joined')}
                                        value={this.state.placementData.joined || ''}
                                        options={yesOrNo}
                                        helperText={this.state.errors.joined}
                                        error={this.state.errors.joined === '' ? false : true}
                                    />
                                </Grid>}

                            {(this.state.placementData.reasonJobRejected == "Others" && this.state.placementData.offerStatus == "Rejected") && <Grid item xs={12} sm={6}>
                                <FormControl>
                                    <TextField type="text" name="otherReasonInBrief" id="otherReasonInBrief" label="Please state the reason for Rejection"
                                        helperText={this.state.errors.otherReasonInBrief}
                                        error={this.state.errors.otherReasonInBrief === '' ? false : true}
                                        onChange={this.handleInputChange}
                                        value={this.state.placementData.otherReasonInBrief || ''} required
                                    />
                                </FormControl>
                            </Grid>}

                            <br /><br /><br />
                            {/* <PlacementDetailsAddress parentCallback={this.callbackFunction}/><Grid container spacing={2}> */}
                            <Grid item xs={12}></Grid> <Grid item xs={12}></Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <h6 style={{ fontWeight: 'bold' }}>Job Location</h6>
                                </FormControl>
                            </Grid>

                            <AddressForPlacement
                                pincodeName="pincode" pincodeId="pincode"
                                pincodeOnChange={this.getPincodeData.bind(this, 'pincode')}
                                pincodeValue={this.state.address.pincode || ''}
                                pincodeHelperText={this.state.errors.pincode} pincodeError={this.state.errors.pincode == '' ? false : true}
                                villageName="villageName" villageId="villageName"
                                villageInputValue={this.handleAddressSelectChange.bind(this, 'villageName')}
                                villageData={this.state.village} villageValue={this.state.address.villageName || ''}
                                villageHelperText={this.state.errors.village} villageError={this.state.errors.village == '' ? false : true}
                                cityName="cityName" cityId="cityName" cityValue={this.state.address.cityName || ''}
                                cityData={this.state.city}
                                cityInputValue={this.handleAddressSelectChange.bind(this, 'cityName')}
                                cityNameHelperText={this.state.errors.cityName} cityNameError={this.state.errors.cityName == '' ? false : true}
                                stateName="state" stateId="state" stateData={this.state.state}
                                stateValue={this.state.address.state || ''}
                                stateInputValue={this.handleAddressSelectChange.bind(this, 'state')}
                                stateHelperText={this.state.errors.state} stateError={this.state.errors.state == '' ? false : true}
                                districtName="district" districtId="district" districtValue={this.state.address.district || ''}
                                districtData={this.state.district}
                                districtInputValue={this.handleAddressSelectChange.bind(this, 'district')}
                                districtHelperText={this.state.errors.district} districtError={this.state.errors.district == '' ? false : true}
                            />


                        </Grid>
                        <br /><br />
                        <Grid item xs={12} sm={6} >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // onChange={this.handleCheckboxChange}
                                        name="documentsUploaded" id="documentsUploaded"
                                        color="primary" required
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
                                        // onChange={this.handleCheckboxChange}
                                        name="authenticationAndConsent" id="authenticationAndConsent"
                                        color="primary" required
                                    />
                                }
                                label="Have gone though the placement evidence and Authentic for both data and evidence"
                            />
                            <InputLabel shrink={true} style={{ color: "red" }} >
                                {(this.state.errors.authenticationAndConsent || '')}
                            </InputLabel>
                        </Grid>

                        <Grid container direction="row" justify="flex-end" id="btn" alignItems="flex-end">
                            <Button variant="contained" type="submit" size="small" color="primary"
                            // disabled={(this.state.buttonStatus == "Enrolled") ? false : true}
                            >
                                Save
                            </Button>
                        </Grid>
                    </form>
                </div>
            </>
        );
    }
}

export default PlacementDetailsSubPlaced;