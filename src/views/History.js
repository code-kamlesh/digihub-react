import React, { Component } from 'react';
// import React, { Component, PureComponent } from 'react';
import { Checkbox, InputLabel, Input, Grid, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import UserContext from '../components/GolbalContext'
import {fetchStudentFile,fetchBulkAllMetaDataByCenterId} from './../util/api';

const XLSX = require('xlsx')
export default class History extends Component{
    constructor(props){
        super(props)
        this.loadData();
        this.state={
            disable:false,
            metaData:[],
            studentData:[],
            status_of_File:"",
            saveButton:true,
        } 
        // this.loadData = this.loadData.bind(this) ;
    }
 loadData(){
       const response = fetchBulkAllMetaDataByCenterId(UserContext.centerId).then((jsondata) => {
            var metaData=[]
            let result = JSON.parse(jsondata.data);
            var arrData = {}
            // console.log("Bulk Meta Data : ",result)
            result[0].forEach((element ,id)=> {
                arrData=element
                // console.log(element)
                metaData=[
                    ...metaData,
                    {
                        "regId":arrData.regId,
                        "uploadFileName": arrData.uploadFileName,
                        "batchName": arrData.batchName || "NA",
                        "records":arrData.records,
                        "uploadDate":arrData.uploadDate,
                        "status": arrData.status
                    }]
            });
            // changes
            this.setState({metaData})
            // console.log("Before ",this.state.metaData)
            for(var i=0;i<this.state.metaData.length;i++){

                if(this.state.metaData[i].status === "C"){
                    metaData[i].status = "Completed" 
             }
             else if(this.state.metaData[i].status ==="P"){
                metaData[i].status = "Pending" 
             }
             else if(this.state.metaData[i].status ==="L"){
                metaData[i].status = "Not Loaded Yet" 
             }

             // Changes today 12 nov
             else if(this.state.metaData[i].status ==="V"){
                metaData[i].status = "validation Done! Upload Pending" 
             }
            }

            this.setState({metaData})
            // this.setState({metaData})
            // console.log("after ",this.state.metaData)
        })
    }

    // Download the data
    downloadFile(e,x){
        // let staus = status
        // if(staus=== "Pending" || staus === "Not Loaded Yet"){
        //     this.setState({saveButton:true})
        // }
        // else{
            let studentData=[]
            const regId= e
            const file_name =x
            // console.log(x)
            var data={}
            fetchStudentFile(regId).then((jsondata)=>{
                let res = JSON.parse(jsondata.data)
                res[0].forEach(element=>{
                    // console.log(element)
                    data= element  
                    studentData=[
                        ...studentData,{
                            "Reg_No":data.regId,
                            "First_Name":data.firstName,
                            "Middle_Name": data.middleName,
                            "Last_Name": data.lastName,
                            "Batch_Name":data.batchName,
                            "Aadhar_Number": data.aadharNo,
                            "DOB": data.dob,
                            "Gender":data.gender,
                            "Highest_Qualification":data.highestQualification,
                            "Passing_Year": data.passingYear,
                            "Address_Line_1": data.addressLine1,
                            "Village": data.villageName,
                            "Religion":data.religion,
                            "District":data.district,
                            "State": data.state,
                            "PINCODE": data.pincode,
                            "Category": data.category,
                            "Primary_Contact_Number": data.primaryContactNumber,
                            "Primary_Mail_ID": data.primaryEmailId,
                            "College_register_no":data.collegeRegisterNo,
                            "Iti_grade":data.itiGrade,
                            "Iti_trade":data.itiTrade,
                           "created_on":data.createdOn,
// removing to coloum creted by updated by
                            "Student_ID": data.studentId,
                            "Eng_ID":data.engagementId,
                            "Status":data.status,
                            "Validation_Error":data.reason, // Changes
                    }]
                    this.setState({studentData})
                    // console.log("Student data Before ", studentData)
                    // console.log(this.state.studentData[i].Status)
                    for(var i=0;i<this.state.studentData.length;i++){
                        if(this.state.studentData[i].Status === "D"){
                        // console.log(this.state.studentData[i].status) 
                        studentData[i].Status = "Upload Successfully" 
                     }
                     else if(this.state.studentData[i].Status ==="P"){
                        studentData[i].Status = "Upload Pending" 
                     }
                     else if(this.state.studentData[i].Status ==="F"){
                        studentData[i].Status = "Input Data Error" 
                     }
                     else if(this.state.studentData[i].Status ==="S"){
                        studentData[i].Status = "Upload Successfully" 
                     }
                    }
        
                    this.setState({studentData})
                    // console.log("Student data After ", studentData)
                    // console.log(studentData)
                })
                // console.log("Student data in bulk : ",res)
                const workSheet = XLSX.utils.json_to_sheet(studentData)
                const workBook = XLSX.utils.book_new()

              

                try{
                    XLSX.utils.book_append_sheet(workBook,workSheet,"download_"+regId+"_"+new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+ new Date().getYear() +".xlsx")
                    // Genrarting buffer if there is large amount of data
                    XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
    
                    // Binary String
                    XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
                    XLSX.writeFile(workBook,"download_"+regId+"_"+new Date().getDate()+"-"+(new Date().getMonth()+1)+".xlsx") 

                }
                catch(error){
                    console.log(error)
                }
                
            })
        }
        
    // }

    // Changes
    // routes to bulk upload
    routes(){
        this.props.history.push(({ pathname: '/dashboard/BulkUpload',state: {} }));
    }
    render(){

   

        return(
            <div style={{ width: '100%' }} >
            <Grid container  justify="flex-end" alignItems="flex-end">
             <Button type="submit" color="primary"  onClick={this.routes.bind(this)}>
               Bulk Upload
             </Button>
             </Grid>

            <Grid>
             <Table aria-label="simple table"  style={{ width: '100%'}}>
            <TableHead>
              <TableRow>
                <TableCell>Reg Id</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Batch Name</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Status</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
            {this.state.metaData.map((dataValue, id) => (
                    <TableRow id="tablerow">
                      <TableCell>{dataValue.regId}</TableCell>
                      <TableCell>{dataValue.uploadFileName}</TableCell>
                      <TableCell>{dataValue.batchName}</TableCell>
                      <TableCell>{dataValue.records}</TableCell>
                      <TableCell>{dataValue.uploadDate}</TableCell>
                      <TableCell>{dataValue.status}</TableCell>
                      <TableCell>{<Button size="small" variant="contained" color="primary" onClick={() => this.downloadFile
                        (dataValue.regId,dataValue.uploadFileName)} > Download </Button>}</TableCell>
                    </TableRow>))}
            </TableBody>
           </Table>

           </Grid>
            </div>
        )
    }
}