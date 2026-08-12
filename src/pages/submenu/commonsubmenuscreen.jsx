import HRMLogo from "../../assets/HRM-logo.svg";
import { useState, useEffect } from "react";
import { showAlert, showConfirm } from "../../common/alert/alertService.jsx";
import { useLoader } from "../../common/loader/loaderService.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import "../../css/commonsubmenuscreen.css";
import { IconAlertCircle } from "@tabler/icons-react";
import Sidebar from "../../components/Sidebar.jsx";
import Cards from "../submenu/card.jsx";
import PopScreen from "../submenu/popscreen.jsx";
import indiaData from "../../data/CountryStateDistrict.js";

import {
    FetchDepartmentList,
    FetchEmployeeList,
    MOVEMENTREPORTASPDF,
    MOVEMENTREPORTASEXCEL,
    StaffSalaryaspdf,
    StaffSalaryasExcel,
    GETPICKERSALARYREPORT,
    PICKERSALARYREPORTASEXCEL,
    GETPICKERSALARYFINALREPORT,
    DownloadPickerFinalSalaryReportExcel,
    FormMDetailedaspdf,
    FormMDetailedasEXCEL,
    FormMWeeklyaspdf,
    FormMWeeklyasEXCEL,
    DAILYMOVEMENTREPORTASPDF,
    DAILYMOVEMENTREPORTASEXCEL,
    GROUPSUMMARYDETAILSASPDF,
    GROUPSUMMARYDETAILSASEXCEL,
    FinalizeStaffSalaryReport,
    FinalizeWorker15DaysSalaryReport,
    DownloadExcel
} from "../../common/apiService.jsx";


export default function SubScreen() {

    var { showLoader, hideLoader } = useLoader();
    var navigate = useNavigate();
    var location = useLocation();

    var [salaryOpen, setSalaryOpen] = useState(true);
    var [activeSubMenu, setActiveSubMenu] = useState("");
    var [activePage, setActivePage] = useState("salary");
    var [showPopup, setShowPopup] = useState(false);
    var [selectedReport, setSelectedReport] = useState("");
    var [workerDepartment, setWorkerDepartment] = useState([]);
    var [staffDepartment, setStaffDepartment] = useState([]);
    var [workerDesignation, setWorkerDesignation] = useState([]);
    var [staffDesignation, setStaffDesignation] = useState([]);
    var [deprtdesifnation, setDeprtdesifnation] = useState([]);
    var [employeeDetails, setEmployeeDetails] = useState([]);
    var [pdfUrl, setPdfUrl] = useState(false);
    var [firstStaffFinalizedMonthandYear, setFirstStaffFinalizedMonthandYear] = useState([]);
    var [lastStaffFinalizedMonthandYear, setLastStaffFinalizedMonthandYear] = useState([]);
    var [firstWorkerFinalizedMonthandYear, setFirstWorkerFinalizedMonthandYear] = useState([]);
    var [lastWorkerFinalizedMonthandYear, setLastWorkerFinalizedMonthandYear] = useState([]);


var TabClick = (tabName) => {
    navigate("/" + tabName);
};
var handleCardClick = (report) => {
    setSelectedReport(report.name);
    setShowPopup(true);
};

var s_categoryOptions = [
  {value: "Staff", label: "Staff"}
]
var w_categoryOptions = [
  {value: "Worker", label: "Worker"}
]
var categoryOptions = [
  {value: "Staff", label: "Staff"},
  {value: "Worker", label: "Worker"},
  {value: "Driver", label: "Driver"},
  {value: "Security", label: "Security"}
]
 var stateOptions = indiaData.map(item => ({
              label: item.state.toUpperCase(),
              value: item.state.toUpperCase()
            }));

var genderOptions = [
  { value: "Male", label: "Male"},
  { value: "Female", label: "Female"},
  { value: "Transgender", label: "Transgender"}
];

var movementReports = [
    {name: "Movement",icon: "ti ti-arrows-exchange",color: "blue", },
    {name: "Daily Movement", icon: "ti ti-calendar-event",color: "green",},
    {name: "InPunch Movement",icon: "ti ti-fingerprint",color: "orange",},
];
var movementConfig = {
    required: { 
        category: false, department: false, designation: false,state: false, code: true, name: false, gender: false, fromDate: true,toDate: true, listwith: false
    },
    visible: {fromDate: true, toDate: true,listwith:false}
};
var DailymovementConfig = {
    required: { 
        category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: false, listwith: false
    },
    visible: {fromDate: true, toDate: false,listwith:false}
};

var InpunchmovementConfig = {
    required: { 
        category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: false, listwith: false
    },
    visible: {fromDate: true, toDate: false,listwith:true}
};



var staffReports = [
    {name: "Staff Salary",icon: "ti ti-wallet",color: "blue"},
];
var staffConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};





var workerReports = [
    {name: "Picler Salary", icon: "ti ti-coins", color: "blue"},
    {name: "Picker Final Salary", icon: "ti ti-file-check", color: "green"},
    {name: "Form M Detailed", icon: "ti ti-file-description", color: "orange"},
    {name: "Form M Weekly", icon: "ti ti-calendar-week", color: "purple"},
    {name: "Group Summary", icon: "ti ti-report-analytics", color: "teal"},
];
var workerPSConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};
var workerPFSConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};
var workerFMDConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};
var workerFMWConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};
var workerGSConfig = {
    required: {category: false, department: false, designation: false,state: false, code: false, name: false, gender: false, fromDate: true,toDate: true, listwith: false},
     visible: {fromDate: true, toDate: true,listwith:false}
};

useEffect(() => {
  showLoader("Please wait...");
   onloadDepartment();
   onEmployeeListLoad();
}, []);

var onEmployeeListLoad = () =>{
    console.log("onEmployeeListLoad called !!!");
    
      FetchEmployeeList(
           {
            success: (res) => {
              console.log(res)
              PopulateEmployeData(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch employee details", "ok");
            },
        }

      )

}
var PopulateEmployeData = (res) =>{
  console.log("inside PopulateEmployeData");
  if(res.hasOwnProperty("code")){
     var code = res.code;
     if(code === "0"){
          var data = res.data;
          if(!data.length == 0) {
             setEmployeeDetails(data);
             hideLoader();
          } else if(code === "401"){
              hideLoader();
              localStorage.setItem("token", "");
              showAlert("Invalid Session !!! .", "ok");
              navigate("/");
          }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
     } else if(code === "1"){
      hideLoader();
     }else if(code === "401"){
                    hideLoader();
                    localStorage.setItem("token", "");
                    showAlert("Invalid Session !!! .", "ok");
                    navigate("/");
      }else{
      hideLoader();
      showAlert("Somthing went wrong , Please contact administration !!!.");      
     }

  }else{
    hideLoader();
    showAlert("Somthing went wrong , Please contact administration !!!.");
  }
}

var onloadDepartment = () =>{
    console.log("onloadDepartment called !!!");
    
      FetchDepartmentList(
           {
            success: (res) => {                 
              console.log(res)
              PopulateDepartmentData(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch department list", "ok");
            },
        }

      )

}

var PopulateDepartmentData = (res) =>{
  console.log("inside PopulateDepartmentData" +res);
  if(res.code === "0"){
    var data = res.data[0].department;
    var worker_data = res.data[0].salaryCode;
    var firstStaffFinalizedMonthandYear_ = res.data[0].firstStaffFinalizedMonthandYear;
    var lastStaffFinalizedMonthandYear_ = res.data[0].lastStaffFinalizedMonthandYear;
    var firstWorkerFinalizedMonthandYear_ = res.data[0].firstWorkerFinalizedMonthandYear;
    var lastWorkerFinalizedMonthandYear_ = res.data[0].lastWorkerFinalizedMonthandYear;
    setFirstStaffFinalizedMonthandYear(firstStaffFinalizedMonthandYear_);
    setLastStaffFinalizedMonthandYear(lastStaffFinalizedMonthandYear_);
    setFirstWorkerFinalizedMonthandYear(firstWorkerFinalizedMonthandYear_);
    setLastWorkerFinalizedMonthandYear(lastWorkerFinalizedMonthandYear_);
    setDeprtdesifnation(data);

const w_departmentOptions = [
    ...new Map(
        data
            .filter(item => item.category === "WORKER")
            .map(item => [
                item.departmentname,
                {
                    value: item.departmentname,
                    label: item.departmentname
                }
            ])
    ).values()
];

const w_designationOptions = worker_data.map(item => ({
    value: item.code,
    label: item.code.toString()
}));

const s_departmentOptions = [
    ...new Map(
        data
            .filter(item => item.category === "STAFF")
            .map(item => [
                item.departmentname,
                {
                    value: item.departmentname,
                    label: item.departmentname
                }
            ])
    ).values()
];

const s_designationOptions = [
    ...new Map(
        data
            .filter(item => item.category === "STAFF")
            .map(item => [
                item.designation,
                {
                    value: item.designation,
                    label: item.designation
                }
            ])
    ).values()
];   
                            
     setStaffDepartment(s_departmentOptions);
     setStaffDesignation(s_designationOptions);
     setWorkerDepartment(w_departmentOptions);
     setWorkerDesignation(w_designationOptions)
     hideLoader();
  }else{
     hideLoader();
     showAlert("Failed to fetch department list", "ok");
  }
}


var GETMOVEMENTREPORTASPDFasView = (filters) =>{
   console.log("GETMOVEMENTREPORTASPDFasView called !!!");
   showLoader("Please wait ...!");
    MOVEMENTREPORTASPDF(
          {
              filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message,"ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message,"ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                  
                setPdfUrl(pdfUrl);
              }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var GETMOVEMENTREPORTASPDF = (filters) =>{
   console.log("GETMOVEMENTREPORTASPDF called !!!");
   showLoader("Please wait ...!");
    MOVEMENTREPORTASPDF(
          {
               filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                  console.log("res-->"+res.code);
                  if(res.code === "1")
                    {
                      console.log("res-->"+res.message);
                      showAlert(res.message,"ok")
                    }else if(res.code === "100"){
                      console.log("res-->"+res.message);
                      showAlert(res.message,"ok")
                    }else{
                        showAlert("Somthing went wrong !!.","ok")
                    }
                }else{
                var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";
                  var fileName = `MOVEMENT REPORT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}
var GETMOVEMENTREPORTASEXCEL = (filters) =>{
   console.log("GETMOVEMENTREPORTASEXCEL called !!!");
   showLoader("Please wait ...!");
    MOVEMENTREPORTASEXCEL(
           {
               filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                  console.log("res-->"+res.code);
                  if(res.code === "1")
                    {
                      console.log("res-->"+res.message);
                      showAlert(res.message,"ok")
                    }else if(res.code === "100"){
                      console.log("res-->"+res.message);
                      showAlert(res.message,"ok")
                    }else{
                        showAlert("Somthing went wrong !!.","ok")
                    }
                }else{
                var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";
                  var fileName = `MOVEMENT REPORT-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(pdfUrl,fileName);
                }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }
      )
}

var DAILYMOVEMENTREPORTASPDFasView = (filters) =>{
   console.log("DAILYMOVEMENTREPORTASPDFasView called !!!");
   
   showLoader("Please wait ...!");
    DAILYMOVEMENTREPORTASPDF(
          {
              filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message,"ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message,"ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                  
                setPdfUrl(pdfUrl);
              }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var DAILYMOVEMENTREPORTASPDFD = (filters) =>{
   console.log("DAILYMOVEMENTREPORTASPDF called !!!");
   showLoader("Please wait ...!");
    DAILYMOVEMENTREPORTASPDF(
          {
               filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                  console.log("res-->"+res.code);
                  if(res.code === "1")
                    {
                      console.log("res-->"+res.message);
                      showAlert(res.message,"ok")
                    }else if(res.code === "100"){
                      console.log("res-->"+res.message);
                      showAlert(res.message+" for selected Dates!!","ok")
                    }else{
                        showAlert("Somthing went wrong !!.","ok")
                    }
                }else{
                var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";
                  var fileName = `PICKER SALARY REPORT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}
var DAILYMOVEMENTREPORTASEXCELD = (filters) =>{
   console.log("DAILYMOVEMENTREPORTASEXCEL called !!!");
   showLoader("Please wait ...!");
    DAILYMOVEMENTREPORTASEXCEL(
          {
                filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";

                  // Build the PDF file name
                  var fileName = `MOVEMENT-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(pdfUrl,fileName);
               
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var base64toBlob = (base64) => {
  try {
         base64 = base64.replace(/^data:application\/pdf;base64,/, "");
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error converting base64 to blob:", error);
    showAlert("Failed to convert PDF data.", "ok");
  }
}
var base64ToExcelBlob = (base64) => {
  try {
    base64 = base64.replace(
      /^data:application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet;base64,/,
      ""
    );

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error converting base64 to Excel blob:", error);
    showAlert("Failed to convert Excel data.", "ok");
  }
};

var downloadPdf = (pdfUrl,name) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = name 
  document.body.appendChild(link); 
  link.click();                    
  document.body.removeChild(link); 
};

var FinalizeStaffSalary = (filters) =>{
   console.log("onCLICKStaffSalaryASPreview called !!!");
   showConfirm("Are you sure you want to Finalize the Staff Salary Report ?", () =>{
   showLoader("Please wait ... Finalizing Staff Salary !");
            FinalizeStaffSalaryReport(
                  {
                        filters
                  },
                  {
                    success: (res) => {
                        hideLoader();
                        if(res.status === "0"){
                          setFirstStaffFinalizedMonthandYear(res.date.firstStaffFinalizedMonthandYear);
                          setLastStaffFinalizedMonthandYear(res.date.lastStaffFinalizedMonthandYear);
                          setFirstWorkerFinalizedMonthandYear(res.date.firstWorkerFinalizedMonthandYear);
                          setLastWorkerFinalizedMonthandYear(res.date.lastWorkerFinalizedMonthandYear);
                          showAlert(res.message, "ok");
                        }else{
                          showAlert(res.message,"ok")
                        }
                          
                      
                      },
                    error: (err) => {
                      hideLoader();
                      console.error("Error ->"+err)
                      showAlert("Failed to Generate Salary", "ok");
                    },
                  })
          });
}

var FinalizeWorker15DaysSalary = (filters) =>{
   console.log("onCLICKStaffSalaryASPreview called !!!");
   showConfirm("Are you sure you want to Finalize the Worker Salary Report ?", () =>{
   showLoader("Please wait ... Finalizing Worker Salary !");
            FinalizeWorker15DaysSalaryReport(
                  {
                        filters
                  },
                  {
                    success: (res) => {
                        hideLoader();
                        if(res.status === "0"){
                          setFirstStaffFinalizedMonthandYear(res.date.firstStaffFinalizedMonthandYear);
                          setLastStaffFinalizedMonthandYear(res.date.lastStaffFinalizedMonthandYear);
                          setFirstWorkerFinalizedMonthandYear(res.date.firstWorkerFinalizedMonthandYear);
                          setLastWorkerFinalizedMonthandYear(res.date.lastWorkerFinalizedMonthandYear);
                          showAlert(res.message, "ok");
                        }else{
                          showAlert(res.message,"ok")
                        }
                          
                      
                      },
                    error: (err) => {
                      hideLoader();
                      console.error("Error ->"+err)
                      showAlert("Failed to Generate Salary", "ok");
                    },
                  })
          });
}


var StaffSalaryasView = (filters) =>{
   console.log("onCLICKStaffSalaryASPreview called !!!");
   showLoader("Please wait ...!");
    StaffSalaryaspdf(
          {
                 filters
          },
           {
            success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                   setPdfUrl(blobUrl);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
          })
}

var StaffSalaryaspdfD = (filters) =>{
   console.log("onCLICKStaffSalaryASPreview called !!!");
   showLoader("Please wait ...!");
    StaffSalaryaspdf(
          {
                  filters
          },
           {
             success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `STAFF SALARY-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var StaffSalaryasExcelD = (filters) =>{
   console.log("onCLICStaffSalaryASEXCEL called !!!");
   showLoader("Please wait ...!");
    StaffSalaryasExcel(
          {
                  filters
          },{
          success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64ToExcelBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `STAFF SALARY-${empId}_${startDate}_to_${endDate}.xlsx`;
                   downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}


var PICKERSALARYREPORTView = (filters) =>{
   console.log("PICKERSALARYREPORTView called !!!");
   showLoader("Please wait ...!");
    GETPICKERSALARYREPORT(
          {
                  filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                setPdfUrl(pdfUrl);                
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var GETPICKERSALARYREPORTasPDF = (filters) =>{
   console.log("GETPICKERSALARYREPORTasPDF called !!!");
   showLoader("Please wait ...!");
    GETPICKERSALARYREPORT(
          {
                  filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `PICKER SALARY REPORT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}
var PICKERSALARYREPORTasEXCEL = (filters) =>{
   console.log("PICKERSALARYREPORTasEXCEL called !!!");
   showLoader("Please wait ...!");
    PICKERSALARYREPORTASEXCEL(
          {
                 filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                 if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message,"ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message,"ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `PICKER SALARY REPORT-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(pdfUrl,fileName);
                }
               
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var PICKERSALARYFINALREPORTasView = (formData) =>{
   console.log("GETPICKERSALARYFINALREPORTasView called !!!");
   showLoader("Please wait ...!");
    GETPICKERSALARYFINALREPORT(
          {
                  empId:formData.code ? formData.code : "",
                  startDate:formData.fromDate,
                  endDate:formData.toDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                 if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message+" for selected Dates!!","ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message+" for selected Dates!!","ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                setPdfUrl(pdfUrl);
              }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert(err.message, "ok");
            },
        }

      )
}


var PICKERSALARYFINALREPORTasPDF = (formData) =>{
   console.log("GETPICKERSALARYFINALREPORTasView called !!!");
   showLoader("Please wait ...!");
    GETPICKERSALARYFINALREPORT(
          {
                  empId:formData.code ? formData.code : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                 if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message+" for selected Dates!!","ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message+" for selected Dates!!","ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                  var empId = formData.code?.value ? formData.code.value : "ALL";
                  var startDate = formData.fromDate || "NA";
                  var endDate = formData.toDate || "NA";

                  // Build the PDF file name
                  var fileName = `PICKER FINAL SALARY RESULT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                
              }
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert(err.message, "ok");
            },
        }

      )
}


var PICKERSALARYFINALREPORTasEXCEL = (formData) =>{ 
   var empId = formData.code?.value ? formData.code.value : "ALL";
   var startDate = formData.fromDate || "NA";
   var endDate = formData.toDate || "NA";
   var fName = `PICKER FINAL SALARY RESULT-${empId}_${startDate}_to_${endDate}.xlsx`;
   showLoader("Please wait ...");
   DownloadPickerFinalSalaryReportExcel(
    {
                  empId:formData.code ? formData.code : "",
                  startDate:formData.fromDate,
                  endDate:formData.toDate
          
    },{
      fileName: fName
    },
                   {
               success: (pdfUrl) => {
                 console.log(pdfUrl)
                 hideLoader();
                  if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message+" for selected Dates!!","ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message+" for selected Dates!!","ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else if(pdfUrl.type == "file"){
                    hideLoader();
                }
                
                else{
                  showAlert("Somthing went wrong !!.","ok")
                }
               },
               error: (err) => {
                 hideLoader();
                 console.error("Error ->"+err)
                 if(err.hasOwnProperty("message")){
                    showAlert(err.message, "ok");
                 }else{
                 showAlert("Failed to Employee code details", "ok");
                 }
               },
           }
   
         )
}

var FormMDetailedASPreview = (filters) =>{
   console.log("onCLICKFormMDetailedASEXCEL called !!!");
   showLoader("Please wait ...!");
    FormMDetailedaspdf(
          {
                filters
          },
           {            
            success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                   setPdfUrl(blobUrl);
                }else{
                   showAlert(res.message,"ok")
                }               
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },       
          
        }

      )
}

var FormMDetailedASPDF = (filters) =>{
   console.log("onCLICKFormMDetailedASEXCEL called !!!");
   showLoader("Please wait ...!");
    FormMDetailedaspdf(
          {
                 filters
          },
          {
             success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `FORM-M-DETAILED-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
			
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var FormMDetailedASEXCEL = (filters) =>{
   console.log("onCLICKFormMDetailedASEXCEL called !!!");
   showLoader("Please wait ...!");
    FormMDetailedasEXCEL(
          {
                  filters
          },
           {
             success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64ToExcelBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `FORM-M-DETAILED-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var FormMWeeklyASPreview = (filters) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
   showLoader("Please wait ...!");
    FormMWeeklyaspdf(
          {
            filters
          },
           {
            success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                   setPdfUrl(blobUrl);
                }else{
                   showAlert(res.message,"ok")
                }               
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}


var FormMWeeklyASPDF = (filters) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
   showLoader("Please wait ...!");
    FormMWeeklyaspdf(
          {
                 filters
          },
           {
            success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `Group Summary-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var FormMWeeklyASEXCELD = (filters) =>{
   console.log("onCLICKFormMWeeklyASEXCEL called !!!");
   showLoader("Please wait ...!");
    FormMWeeklyasEXCEL(
          {
                 filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                 if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message,"ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message,"ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                   var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";

                  // Build the PDF file name
                  var fileName = `Form M Weekly-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(pdfUrl,fileName);
                }
               
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}


var GroupSummaryASPreview = (filters) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
   showLoader("Please wait ...!");
    GROUPSUMMARYDETAILSASPDF(
          {
            filters
          },
           {
            success: (res) => {
              hideLoader();
                  if(res.status === "0"){
                    var base64String = res.data;
                    var blobUrl = base64toBlob(base64String);
                    console.log("blobUrl-->"+blobUrl);
                    setPdfUrl(blobUrl);
                  }else{
                    showAlert(res.message,"ok")
                  }       
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate report", "ok");
            },
        }

      )
}


var GroupSummaryASPDF = (filters) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
   showLoader("Please wait ...!");
    GROUPSUMMARYDETAILSASPDF(
          {
                 filters
          },
           {
            success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  var base64String = res.data;
                  var blobUrl = base64toBlob(base64String);
                  console.log("blobUrl-->"+blobUrl);
                  var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.startDate || "NA";
                  var endDate = filters.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `Group Summary-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(blobUrl,fileName);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}

var GroupSummaryASEXCELD = (filters) =>{
   console.log("onCLICKFormMWeeklyASEXCEL called !!!");
   showLoader("Please wait ...!");
    GROUPSUMMARYDETAILSASEXCEL(
          {
                 filters
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                 if(pdfUrl.type == "json"){
                  var res = pdfUrl.data;
                        console.log("res-->"+res.code);
                        if(res.code === "1")
                        {
                        console.log("res-->"+res.message);
                        showAlert(res.message,"ok")
                        }else if(res.code === "100"){
                         console.log("res-->"+res.message);
                         showAlert(res.message,"ok")
                        }else{
                         showAlert("Somthing went wrong !!.","ok")
                        }
                }else{
                   var empId = filters.code?.value ? filters.code.value : "ALL";
                  var startDate = filters.fromDate || "NA";
                  var endDate = filters.toDate || "NA";

                  // Build the PDF file name
                  var fileName = `Form M Weekly-${empId}_${startDate}_to_${endDate}.xlsx`;
                  downloadPdf(pdfUrl,fileName);
                }
               
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to Generate Salary", "ok");
            },
        }

      )
}


return (
    <div className="salary-report-layout">

        <Sidebar
            activePage="salary"
            activeSubMenu={activeSubMenu}
            salaryOpen={salaryOpen}
            setSalaryOpen={setSalaryOpen}
            setActiveSubMenu={setActiveSubMenu}
            TabClick={TabClick}
        />

        <main className="salary-report-content">

            {/* ================= MOVEMENT REPORTS ================= */}

            <section className="salary-report-section salary-report-section-movement">

                <div className="salary-report-section-header">

                    <div className="salary-report-section-heading">
                        <h2 className="salary-report-section-title">
                            Movement Reports
                        </h2>

                        <span className="salary-report-section-subtitle">
                            Attendance and employee movement related reports
                        </span>
                    </div>

                    <div className="salary-report-section-count">
                        {movementReports.length} Reports
                    </div>

                </div>

                <div className="salary-report-cards-area">
                    <Cards
                        reports={movementReports}
                        onCardClick={handleCardClick}
                    />
                </div>

            </section>


            {/* ================= STAFF REPORTS ================= */}

            <section className="salary-report-section salary-report-section-staff">

                <div className="salary-report-section-header">

                    <div className="salary-report-section-heading">
                        <h2 className="salary-report-section-title">
                            Staff Reports
                        </h2>

                        <span className="salary-report-section-subtitle">
                            Staff salary and payroll related reports
                        </span>
                    </div>

                    <div className="salary-report-section-count">
                        {staffReports.length} Report
                    </div>

                </div>

                <div className="salary-report-cards-area">
                    <Cards
                        reports={staffReports}
                        onCardClick={handleCardClick}
                    />
                </div>

            </section>


            {/* ================= WORKER REPORTS ================= */}

            <section className="salary-report-section salary-report-section-worker">

                <div className="salary-report-section-header">

                    <div className="salary-report-section-heading">
                        <h2 className="salary-report-section-title">
                            Worker Reports
                        </h2>

                        <span className="salary-report-section-subtitle">
                            Worker salary, Form M and summary reports
                        </span>
                    </div>

                    <div className="salary-report-section-count">
                        {workerReports.length} Reports
                    </div>

                </div>

                <div className="salary-report-cards-area">
                    <Cards
                        reports={workerReports}
                        onCardClick={handleCardClick}
                    />
                </div>

            </section>


            {/* ========================================================= */}
            {/* MOVEMENT REPORT POPUPS                                    */}
            {/* ========================================================= */}

            {showPopup && selectedReport === "Movement" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={movementConfig}
                    categoryOptions={categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDesignation}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={GETMOVEMENTREPORTASPDFasView}
                    onPdf={GETMOVEMENTREPORTASPDF}
                    onExcel={GETMOVEMENTREPORTASEXCEL}
                    ReportType="MOVEMENT"
                />
            )}


            {showPopup && selectedReport === "Daily Movement" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={DailymovementConfig}
                    categoryOptions={categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={staffDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={DAILYMOVEMENTREPORTASPDFasView}
                    onPdf={DAILYMOVEMENTREPORTASPDFD}
                    ReportType="MOVEMENT"
                />
            )}


            {showPopup && selectedReport === "InPunch Movement" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={InpunchmovementConfig}
                    categoryOptions={categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={staffDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={DAILYMOVEMENTREPORTASPDFasView}
                    onPdf={DAILYMOVEMENTREPORTASPDFD}
                    ReportType="MOVEMENT"
                />
            )}


            {/* ========================================================= */}
            {/* STAFF REPORT POPUP                                       */}
            {/* ========================================================= */}

            {showPopup && selectedReport === "Staff Salary" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={staffConfig}
                    categoryOptions={s_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={staffDepartment}
                    designationOptions={staffDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onFinalize={FinalizeStaffSalary}
                    onPreview={StaffSalaryasView}
                    onPdf={StaffSalaryaspdfD}
                    onExcel={StaffSalaryasExcelD}
                    ReportType="STAFF"
                    firstFinalizedMonthandYear={
                        firstStaffFinalizedMonthandYear
                    }
                    lastFinalizedMonthandYear={
                        lastStaffFinalizedMonthandYear
                    }
                />
            )}


            {/* ========================================================= */}
            {/* WORKER REPORT POPUPS                                     */}
            {/* ========================================================= */}

            {showPopup && selectedReport === "Picler Salary" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={workerPSConfig}
                    categoryOptions={w_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={PICKERSALARYREPORTView}
                    onPdf={GETPICKERSALARYREPORTasPDF}
                    onExcel={PICKERSALARYREPORTasEXCEL}
                    ReportType="WORKER"
                />
            )}


            {showPopup && selectedReport === "Picker Final Salary" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={workerPFSConfig}
                    categoryOptions={w_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={PICKERSALARYFINALREPORTasView}
                    onPdf={PICKERSALARYFINALREPORTasPDF}
                    onExcel={PICKERSALARYFINALREPORTasEXCEL}
                    ReportType="WORKER"
                />
            )}


            {showPopup && selectedReport === "Form M Detailed" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={workerFMDConfig}
                    categoryOptions={w_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onPreview={FormMDetailedASPreview}
                    onPdf={FormMDetailedASPDF}
                    onExcel={FormMDetailedASEXCEL}
                    ReportType="WORKER"
                />
            )}


            {showPopup && selectedReport === "Form M Weekly" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={workerFMWConfig}
                    categoryOptions={w_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={deprtdesifnation}
                    employeeDetails={employeeDetails}
                    onFinalize={FinalizeWorker15DaysSalary}
                    onPreview={FormMWeeklyASPreview}
                    onPdf={FormMWeeklyASPDF}
                    onExcel={FormMWeeklyASEXCELD}
                    ReportType="WORKER"
                    SReportType="Form M Weekly"
                    firstFinalizedMonthandYear={
                        firstWorkerFinalizedMonthandYear
                    }
                    lastFinalizedMonthandYear={
                        lastWorkerFinalizedMonthandYear
                    }
                />
            )}


            {showPopup && selectedReport === "Group Summary" && (
                <PopScreen
                    title={selectedReport}
                    onClose={() => setShowPopup(false)}
                    config={workerGSConfig}
                    categoryOptions={w_categoryOptions}
                    stateOptions={stateOptions}
                    genderOptions={genderOptions}
                    departmentOptions={workerDepartment}
                    designationOptions={workerDesignation}
                    deprtdesifnation={workerDesignation}
                    employeeDetails={employeeDetails}
                    onPreview={GroupSummaryASPreview}
                    onPdf={GroupSummaryASPDF}
                    onExcel={GroupSummaryASEXCELD}
                    ReportType="WORKER"
                />
            )}

        </main>


        {/* ========================================================= */}
        {/* PDF PREVIEW                                               */}
        {/* ========================================================= */}

        {pdfUrl && (
            <div className="salary-report-pdf-overlay">

                <div className="salary-report-pdf-modal">

                    <button
                        className="salary-report-pdf-close"
                        onClick={() => setPdfUrl(null)}
                    >
                        ✕
                    </button>

                    <iframe
                        src={`${pdfUrl}#toolbar=0`}
                        title="PDF Preview"
                        className="salary-report-pdf-frame"
                    />

                </div>

            </div>
        )}

    </div>
)};