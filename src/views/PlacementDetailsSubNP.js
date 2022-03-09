import React from 'react';
import ReactDOM from 'react-dom';
import { savePlacementDetails, fetchUserDocumentsByUserIdAndTypeOfDocument, fectAddressDetailsByAddressID, fetchAddressDetailsBasedOnPincode, fetchPlacementDetailsByEngagementId, fetchAllCenter, saveAddressDetails, fetchEmployerDetails, } from '../util/api';
import { SingleSelect } from "react-select-material-ui";
import UserContext from '../components/GolbalContext'
import { FormControl, InputLabel, FormControlLabel, Input, Grid, RadioGroup, Radio, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

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
                dbUserId: props.props.id, isActive: "Y", interviewStatus: 'Not Placed',
            },
            employersDetails: [], interviewStatus: props.props.placementData.interviewStatus,

        };

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

                            { /*Incase candidate is Not Placed*/}
                                <Grid container spacing={2}>
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
                                            options={notPlacedReason}
                                        // helperText={this.state.errors.reason}
                                        // error={this.state.errors.reason === '' ? false : true}
                                        />
                                    </Grid>
                                    <br></br>
                                    {
                                        (this.state.placementData.reason == 'Rejected By Employer') &&
                                        <Grid item xs={12} sm={3}>
                                            <SingleSelect name="empId" id="empId" label="Employer Name"
                                                onChange={this.handleSelectChange.bind(this, 'empId')}
                                                value={this.state.placementData.empId || ''}
                                                // helperText={this.state.errors.empId}
                                                // error={this.state.errors.empId === '' ? false : true}
                                                options={this.state.employersDetails}
                                            />
                                        </Grid>
                                    }

                                    {
                                        (this.state.placementData.reason == 'Not Avaliable Opportunity') &&
                                        <Grid item xs={12} sm={3}>
                                            <SingleSelect name="reasonForNoOpportunity" id="reasonForNoOpportunity" label="Reason for No Opportunites"
                                                onChange={this.handleSelectChange.bind(this, 'reasonForNoOpportunity')}
                                                value={this.state.placementData.reasonForNoOpportunity || ''}
                                                // helperText={this.state.errors.reasonForNoOpportunity}
                                                // error={this.state.errors.reasonForNoOpportunity === '' ? false : true}
                                                options={notAvlOppReason}
                                            />
                                        </Grid>
                                    }


                                    {
                                        (this.state.placementData.reasonForNoOpportunity == 'Others' || this.state.placementData.reasonForNoOpportunity == 'No Employment Opportuntities') &&
                                        <Grid item xs={12} sm={3}>
                                            <FormControl>
                                                <TextField type="text" name="otherReasonInBrief" id="otherReasonInBrief" label="Please state/ brief the reason for No Opportunities"
                                                    // helperText={this.state.errors.otherReasonInBrief}
                                                    // error={this.state.errors.otherReasonInBrief === '' ? false : true}
                                                    onChange={this.handleInputChange}
                                                    value={this.state.placementData.otherReasonInBrief || ''} required
                                                />
                                            </FormControl>
                                        </Grid>
                                    }
                                </Grid>

                            <Grid container direction="row" justify="flex-end" id="btn" alignItems="flex-end">
                                <Button variant="contained" type="submit" size="small" color="primary"
                                // disabled={(this.state.buttonStatus == "Enrolled") ? false : true}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </>
        );
    }
}
export default PlacementDetailsSubEntNP;