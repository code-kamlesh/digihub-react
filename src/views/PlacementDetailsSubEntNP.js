import React from 'react';
import ReactDOM from 'react-dom';
import { savePlacementDetails, fetchUserDocumentsByUserIdAndTypeOfDocument, fectAddressDetailsByAddressID, fetchAddressDetailsBasedOnPincode, fetchPlacementDetailsByEngagementId, fetchAllCenter, saveAddressDetails, fetchEmployerDetails, } from '../util/api';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import { FormControl, InputLabel, FormControlLabel, Input, Grid, RadioGroup, Radio, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddressForPlacement from "./AddressForPlacement";
import Checkbox from '@material-ui/core/Checkbox';
import { isNotEmpty } from './../util/validation';
import underscore from 'underscore';

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
const yesOrNo = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
]
const notPlacedReason = [
    { value: 'Rejected By Employer', label: 'Rejected By Employer' },
    { value: 'Not Avaliable Opportunity', label: 'Not Avaliable Opportunity' }
]
const notAvlOppReason = [
    { value: 'No Employment Opportuntities', label: 'No Employment Opportuntities' },
    { value: 'Others', label: 'Others' }
]

class PlacementDetailsSubEntNP extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.props.placementData)
        this.state = {
            placementData: {
                domainName: '', noOfPeopleEmployed: '', familyBusiness: '', availedLoan: '',
                monthlyGrossSal: '', reason: '', empId: '', reasonForNoOpportunity: '',
                otherReasonInBrief: '',  
                /*Address here*/
                joiningPin: '', joiningCity: '', addressId: '',
                /*General data*/
                createdBy: UserContext.userid, updatedBy: UserContext.userid, engagementId: props.props.engagementId,
                dbUserId: props.props.id, isActive: "Y", interviewStatus: 'Entrepreneurship/ Self Employed',
            },
            errors: {
                /*Address here*/
                joiningPin: '', joiningCity: '', addressId: '', pincode: '', village: '', state: '',
                cityName: '', district: '',
                /*Placement data here*/
                domainName: '', noOfPeopleEmployed: '', familyBusiness: '', availedLoan: '',
                monthlyGrossSal: '', reason: '', empId: '', reasonForNoOpportunity: '',
                otherReasonInBrief: '',
            },
            addressId: '',
            address: {
                entityId: props.props.engagementId, createdBy: UserContext.userid, 'isActive': 'Y', 'type': 'PD',
                'entityType': 'S', pincode: "", addressLine1: "", addressLine2: "", district: "", state: "",
                cityName: "", villageName: ""
            },
            employersDetails: [],
            interviewStatus: props.props.placementData.interviewStatus,
            
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

    handleSelectChange = (selectname, event) => {
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
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl>
                                    </FormControl>
                                </Grid>
                                <br></br>

                                <Grid item xs={12} sm={3}>
                                    <SingleSelect name="domainName" id="domainName" label="Domain"
                                        onChange={this.handleSelectChange.bind(this, 'domainName')}
                                        value={this.state.placementData.domainName || ''}
                                        // helperText={this.state.errors.domainName}
                                        // error={this.state.errors.domainName === '' ? false : true}
                                        options={domains} />
                                </Grid>

                                <Grid item xs={12} sm={3} id="studentRemark">
                                    <FormControl>
                                        <TextField type="text" name="noOfPeopleEmployed" id="noOfPeopleEmployed" label="No. of people employed"
                                            // helperText={this.state.errors.noOfPeopleEmployed}
                                            // error={this.state.errors.noOfPeopleEmployed === '' ? false : true}
                                            onChange={this.handleInputChange}
                                            value={this.state.placementData.noOfPeopleEmployed || ''}
                                            onInput={(e) => {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                                            }} required />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} />

                                <Grid item xs={12} sm={3}>
                                    <SingleSelect name="familyBusiness" id="familyBusiness" label="Is it a Family Business"
                                        onChange={this.handleSelectChange.bind(this, 'familyBusiness')}
                                        value={this.state.placementData.familyBusiness || ''}
                                        // helperText={this.state.errors.familyBusiness}
                                        // error={this.state.errors.familyBusiness === '' ? false : true}
                                        options={yesOrNo} />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <SingleSelect name="availedLoan" id="availedLoan" label="Availed Loan"
                                        onChange={this.handleSelectChange.bind(this, 'availedLoan')}
                                        value={this.state.placementData.availedLoan || ''}
                                        // helperText={this.state.errors.availedLoan}
                                        // error={this.state.errors.availedLoan === '' ? false : true}
                                        options={yesOrNo} />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <FormControl>
                                        <TextField type="number" name="monthlyGrossSal" id="monthlyGrossSal"
                                            label="Monthly Gross Income"
                                            // helperText={this.state.errors.monthlyGrossSal}
                                            // error={this.state.errors.monthlyGrossSal === '' ? false : true}
                                            onChange={this.handleInputChange}
                                            value={this.state.placementData.monthlyGrossSal || ''}
                                            onInput={(e) => {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                                            }} required
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>

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
                                {/* {(this.state.errors.documentsUploaded || '')} */}
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
export default PlacementDetailsSubEntNP;