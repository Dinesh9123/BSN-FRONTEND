import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../css/salary.css"
import {getAllEmployeeCode,GetEmployeeSalary,GETPICKERSALARYREPORT,DownloadPickerFinalSalaryReportExcel,
  GETPICKERSALARYFINALREPORT,PICKERSALARYREPORTASEXCEL,MOVEMENTREPORTASEXCEL,MOVEMENTREPORTASPDF,
  FormMDetailedasEXCEL,FormMDetailedaspdf,FormMWeeklyaspdf,FormMWeeklyasEXCEL,GrowingAspdf,
  GrowingAsExcel,StaffSalaryaspdf,StaffSalaryasExcel
} from "../common/apiService.jsx";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Salary() {

var [activePage, setActivePage] = useState("salary");
var [headerTitle, setHeaderTitle] = useState("Employee Salary List");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();
var [showProfileMenu, setShowProfileMenu] = useState(false);
var [isPrev, setIsPrev] = useState(false);
var [isNext, setIsNext] = useState(false);
var [arrowstart, setArrowstart] = useState(0);
var [arrowend, setArrowend] = useState(0);
var [arrowfull, setArrowfull] = useState(0);
var [errors, setErrors] = useState({});
var [empIDfilterValues,setEmpIDfilterValues] = useState([]);
var today = new Date().toISOString().split("T")[0];
var prev15day = new Date();
prev15day.setDate(prev15day.getDate() - 15);
var pastDate = prev15day.toISOString().split("T")[0];
var [formData, setFormData] = useState({ empId: "",growing:"",startDate :"",endDate : ""});
var [limit, setLimit] = useState(7);
var [empCurrPage, setEmpCurrPage] = useState(0);
var [limitchange, setlimitchange] = useState(false);
var [fromPrev, setFromPrev] = useState(false);
var [isopenmodel, setIsopenmodel] = useState(false);
var [selectedEmp, setSelectedEmp] = useState(null);
var [salaryDetails,setSalaryDetails] = useState([]);
var [salaryDetailsByID,setSalaryDetailsByID] = useState([]);
var [pdfUrl,setPdfUrl] = useState(false);


var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");

const growingOPtions = [
  { value: "oldgrowing", label: "OLD GROWING" },
  { value: "newgrowing", label: "NEW GROWING" },
  { value: "realgrowing", label: "REAL GROWING" },
   { value: "real2", label: "REAL-2" }
];

var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    navigate("/"+tabName);
    hideLoader();

}
var onClickNext = () => {
  
    showLoader("Please wait...");
    setEmpCurrPage(prev => prev + 1);
};

var onClickPrev = () => {
    showLoader("Please wait...");
     setFromPrev(true);
    setEmpCurrPage(prev => (prev > 0 ? prev - 1 : 0));
};


useEffect(() => {
      showLoader("Please wait...");
      GetAllEmpCode();
    }, []);


var GetAllEmpCode = () =>{
   getAllEmployeeCode(
                   {
               success: (res) => {
                 console.log(res)
                 PopulateEmployeCodeData(res);
               },
               error: (err) => {
                 hideLoader();
                 console.error("Error ->"+err)
                 if(err.hasOwnProperty("message")){
                    showAlert(JSON.parse(err.message).message, "ok");
                 }else{
                 showAlert("Failed to Employee code details", "ok");
                 }
               },
           }
   
         )
}


var PopulateEmployeCodeData = (data) =>{
  if(data.hasOwnProperty("code")){
     var code = data.code;
     if(code === "0"){         
          var data = data.data;
          if(!data.length == 0) {
            console.log("Employee code details ->"+data[0]);
            var empfilterValue = data[0];
            var empcodeArray = []
            for (var i = 0 ; empfilterValue.length > i ; i++)
            {
              var empID = empfilterValue[i][0];
              var obj = {}
              obj.empId = empID;
              empcodeArray.push(obj)
            }
            setEmpIDfilterValues(empcodeArray);
            hideLoader();
            
            }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
     } else if(code === "1"){
      hideLoader();
      showAlert(res.message, "ok");
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


var GetEmpSalaryDetails = () =>{
   showLoader("Please wait...");
   GetEmployeeSalary(
                { 
                  page:empCurrPage,
                  size:limit,
                  empId:formData.empId.value,
                  startDate:formData.startDate,
                  endDate:formData.endDate
                },
                   {
               success: (res) => {
                 console.log(res)
                 PopulateEmployeSalaryData(res);
               },
               error: (err) => {
                 hideLoader();
                 console.error("Error ->"+err)
                 if(err.hasOwnProperty("message")){
                    showAlert(JSON.parse(err.message).message, "ok");
                 }else{
                 showAlert("Failed to Employee code details", "ok");
                 }
               },
           }
   
         )

}

var PopulateEmployeSalaryData = (data) =>{
   if(data.hasOwnProperty("code")){
     var code = data.code;
     if(code === "0"){         
          var data = data.data;
          if(!data.length == 0) {
            console.log("Employee Salary Details -->"+data[0])
            var finalData = data[0];
            if(finalData.hasOwnProperty("content")){
               var content = finalData.content;
                setSalaryDetails(content);
                var pageDtls = finalData;
              var isfirst = pageDtls.first;
              var islast  = pageDtls.last;
              var page = pageDtls.number;      
              var size = pageDtls.size;       
              var total = pageDtls.totalElements;
              var totalPages = pageDtls.totalPages;
              var elements = pageDtls.numberOfElements;
              var start = page * size + 1;
              var end = page * size + elements;

              setArrowstart(total === 0 ? 0 : start);
              setArrowend(end);
              setArrowfull(total);


              if(isfirst){
                setIsPrev(false);
              }else{
                setIsPrev(true);
              }

              if(islast){
                setIsNext(false);
              }else{
                 setIsNext(true);
              }
              hideLoader();
            }else{
              hideLoader();
              showAlert("No Records Found !!!.");      
            }
            }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
     } else if(code === "1" || code === "100" ){
      hideLoader();
      showAlert(data.message, "ok");
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
   hideLoader();
}



var PopulateAllEmpSalaryDtlsByID = (data) =>{
   if(data.hasOwnProperty("code")){
     var code = data.code;
     if(code === "0"){         
          var data = data.data;
          if(!data.length == 0) {
            console.log("Employee Salary Details -->"+data)
            setSalaryDetailsByID(data);
            setIsopenmodel(true);
            hideLoader();
            }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
     } else if(code === "1" || code === "100" ){
      hideLoader();
      showAlert(data.message, "ok");
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
   hideLoader();
}


  var filterOptionsforEmpName = empIDfilterValues.map((data) => ({
          value:data.empId,
          label:data.empId
      
  }));

var handleInputDateChange = (e) =>{
  var {name , value} = e.target;
  setFormData(prev  =>({
    ...prev,
    [name] : value
  }))
      setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}


function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

var handleSelectChange = (selectedOption, name) => {
  setFormData(prev => ({
    ...prev,               
    [name]: selectedOption  
  }));
    setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });

};

var validateForm = () => {
    let t = {};
    if (!formData.startDate) t.startDate = true;
    if (!formData.endDate) t.endDate = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };

  var validateFormforMovement = () => {
    let t = {};
    if (!formData.empId) t.empId = true;
    if (!formData.startDate) t.startDate = true;
    if (!formData.endDate) t.endDate = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };
  var validateFormforGrowing = () => {
    let t = {};
    if (!formData.growing) t.growing = true;
    if (!formData.startDate) t.startDate = true;
    if (!formData.endDate) t.endDate = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };

var GETPICKERSALARYREPORTasView = (ispreview) =>{
   console.log("GetEmployeeBarcode called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    GETPICKERSALARYREPORT(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
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

var onCLICKPICKERSALARYREPORTASEXCEL = () =>{
   console.log("onCLICKPICKERSALARYREPORTASEXCEL called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    PICKERSALARYREPORTASEXCEL(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

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
var GETPICKERSALARYFINALREPORTasView = (ispreview) =>{
   console.log("GETPICKERSALARYFINALREPORTasView called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    GETPICKERSALARYFINALREPORT(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `PICKER FINAL SALARY RESULT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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

// pdfUrl is your blob URL
var downloadPdf = (pdfUrl,name) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = name 
  document.body.appendChild(link); 
  link.click();                    
  document.body.removeChild(link); 
};




var GetPickerFinalSalaery = () =>{

   if (!validateForm()) return; 
   var empId = formData.empId?.value ? formData.empId.value : "ALL";
   var startDate = formData.startDate || "NA";
   var endDate = formData.endDate || "NA";
   var fName = `PICKER FINAL SALARY RESULT-${empId}_${startDate}_to_${endDate}.xlsx`;
   showLoader("Please wait ...");
   DownloadPickerFinalSalaryReportExcel(
    {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          
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

var GETPICKERSALARYREPORTasView = (ispreview) =>{
   console.log("GetEmployeeBarcode called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    GETPICKERSALARYREPORT(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                console.log("pdfUrl  ->"+pdfUrl.type);
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
                if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `PICKER SALARY REPORT-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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


var GETMOVEMENTREPORTASPDFasView = (ispreview) =>{
   console.log("GETMOVEMENTREPORTASPDFasView called !!!");
    if (!validateFormforMovement()) return;  
   showLoader("Please wait ...!");
    MOVEMENTREPORTASPDF(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
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
var onCLICKMOVEMENTREPORTASEXCEL = () =>{
   console.log("onCLICKMOVEMENTREPORTASEXCEL called !!!");
    if (!validateFormforMovement()) return; 
   showLoader("Please wait ...!");
    MOVEMENTREPORTASEXCEL(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate
          },
           {
            success: (pdfUrl) => {
                hideLoader();
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

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


var onCLICKFormMDetailedASEXCEL = () =>{
   console.log("onCLICKFormMDetailedASEXCEL called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    FormMDetailedasEXCEL(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `FORM M DETAILED -${empId}_${startDate}_to_${endDate}.xlsx`;
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


var onCLICKFormMWeeklyASEXCEL = () =>{
   console.log("onCLICKFormMWeeklyASEXCEL called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    FormMWeeklyasEXCEL(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

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

var onCLICStaffSalaryASEXCEL = () =>{
   console.log("onCLICStaffSalaryASEXCEL called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    StaffSalaryasExcel(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `STAFF SALARY-${empId}_${startDate}_to_${endDate}.xlsx`;
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
var onCLICKGrowingASEXCEL = () =>{
   console.log("onCLICKGrowingASEXCEL called !!!");
    if (!validateFormforGrowing()) return; 
   showLoader("Please wait ...!");
    GrowingAsExcel(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate,
                  growing:formData.growing.value
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
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `GROWING -${empId}_${startDate}_to_${endDate}.xlsx`;
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
var onCLICKFormMDetailedASPreview = (ispreview) =>{
   console.log("onCLICKFormMDetailedASEXCEL called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    FormMDetailedaspdf(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  
                  if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `FORM M DETAILED-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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

var onCLICKFormMWeeklyASPreview = (ispreview) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    FormMWeeklyaspdf(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  
                  if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `FORM M WEEKLY-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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


var onCLICKStaffSalaryASPreview = (ispreview) =>{
   console.log("onCLICKStaffSalaryASPreview called !!!");
    if (!validateForm()) return; 
   showLoader("Please wait ...!");
    StaffSalaryaspdf(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
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
                  
                  if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";

                  // Build the PDF file name
                  var fileName = `STAFF SALARY-${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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


var onCLICKGrowingASPreview = (ispreview) =>{
   console.log("onCLICKFormMWeeklyASPreview called !!!");
    if (!validateFormforGrowing()) return; 
   showLoader("Please wait ...!");
    GrowingAspdf(
          {
                  empId:formData.empId?.value ? formData.empId.value : "",
                  startDate:formData.startDate,
                  endDate:formData.endDate,
                  growing:formData.growing.value
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
                  
                  if(ispreview){
                setPdfUrl(pdfUrl);
                }else{
                  var empId = formData.empId?.value ? formData.empId.value : "ALL";
                  var startDate = formData.startDate || "NA";
                  var endDate = formData.endDate || "NA";
                  var fileName = `GROWING - ${empId}_${startDate}_to_${endDate}.pdf`;
                  downloadPdf(pdfUrl,fileName);
                }
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
<div className="layout-wrapper"> 

<aside className="layout-menu">
            <div>
              <div className="app-brand">
                <img src={HRMLogo} className="dashboard-logo" alt="HRM" />
              </div>
    
              <ul className="menu-inner left-panel">

                 <li className="menu-item">
                  <div 
                   className={`menu-link menu-parent ${activePage.includes("dashboard") ? "active" : ""}`}
                     onClick={() => {TabClick("Dashboard")}}>
                   <i class="ti ti-layout-dashboard"></i>
                    <span>Dashboard</span>
                  </div>
                </li>               
                <li className="menu-item">
                  <div 
                   className={`menu-link menu-parent ${activePage.includes("weighingscale") ? "active" : ""}`}
                     onClick={() => {TabClick("WeighingScale")}}>
                    <i class="ti ti-scale"></i>
                    <span>Weighing Scale</span>
                  </div>
                </li>
    
                <li className="menu-item">
                  <div
                    className={`menu-link menu-parent ${activePage.includes("employee") ? "active" : ""}`}
                    onClick={() => {TabClick("Employee")}}
                  >
                   <i className="menu-icon ti ti-id-badge"></i> 
                    <span>Employee</span>
                  </div>
                </li>
    
    
                 <li className="menu-item">
                  <div
                    className={`menu-link menu-parent ${activePage.includes("reports") ? "active" : ""}`}
                    onClick={() => {TabClick("Reports")}}
                  >
                    <i className="menu-icon ti ti-report-analytics"></i>
                    <span>Reports</span>
                  </div>
                </li>
    
                <li className="menu-item">
                    <div
                        className={`menu-link menu-parent ${activePage.includes("barcode") ? "active" : ""}`}
                        onClick={() => {TabClick("barcode")}}
                    >
                        <i className="menu-icon ti ti-barcode"></i>  
                        <span>Employee Barcode</span>
                    </div>
                </li>   

                <li className="menu-item">
                    <div className={`menu-link menu-parent ${salaryOpen ? "active" : ""}`}  onClick={() => {setSalaryOpen(!salaryOpen)}} >
                        <i className="menu-icon ti ti-cash"></i>
                        <span>Salary Report</span>

                        <i  className={`ti ${salaryOpen ? "ti-chevron-down" : "ti-chevron-right"}`}
                            style={{
                                marginLeft: "auto",
                                transition: "transform .3s ease",
                                transform: salaryOpen ? "rotate(0deg)" : "rotate(-0deg)"
                            }}
                        ></i>
                    </div>

                    <ul className={`submenu ${salaryOpen ? "open" : ""}`}>
                        <li className={`submenu-item ${activeSubMenu === "staff" ? "sub-active" : ""}`}  onClick={() => {setActiveSubMenu("staff"),TabClick("commonsubmenuscreen")}}>
                            <span className="submenu-bullet">•</span>
                            <span className="submenu-name">Staff Report</span>
                        </li>

                        <li className={`submenu-item ${activeSubMenu === "worker" ? "sub-active" : ""}` }  onClick={() => setActiveSubMenu("worker")}>
                            <span className="submenu-bullet">•</span>
                            <span className="submenu-name">Worker Report</span>
                        </li>

                        <li className={`submenu-item ${activeSubMenu === "movement" ? "sub-active" : ""}`}  onClick={() => setActiveSubMenu("movement")}>
                            <span className="submenu-bullet">•</span>
                            <span className="submenu-name">Movement Report</span>
                        </li>
                    </ul>
                </li>


                    <li className="menu-item">
                        <div
                            className={`menu-link menu-parent ${activePage.includes("salarysetting") ? "active" : ""}`}
                            onClick={() => {TabClick("SalarySetting")}}
                        >
                           <i className="ti ti-tool"></i>
                            <span>Salary Configurations</span>
                        </div>
                    </li> 
                    <li className="menu-item">
                        <div
                            className={`menu-link menu-parent ${activePage.includes("idcard") ? "active" : ""}`}
                            onClick={() => {TabClick("idcard")}}
                        >
                           <i className="ti ti-id-badge"></i>
                            <span>ID Card</span>
                        </div>
                    </li>

              </ul>
            </div>
          </aside>

          <div className="layout-page">  
        {/* <div className="top-header">
         <div className="headertop">
             <h3>{headerTitle}</h3>
          </div>
          <div className="profile-container">
            <div
              className="profile-circle"
              onClick={() => {setShowProfileMenu(!showProfileMenu)}}
            >
              <i className="ti ti-user"></i>
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-item">My Profile</div>
                <div className="profile-item logout" onClick={onclicklogout}>Logout</div>
              </div>
            )}
          </div>
        </div> */}
      

         <div className="salary-right-panel-centerrep">
            <div className="salary-report-card">
                <div class="salary-form-group-box">
                    <div class="salary-form-group">
                        <div className="Report_Lable"><label>Employee Code</label></div> 
                          <Select
                            className={`filter-select-wrapper ${errors.empId ? "error-input" : ""}`}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "empId")
                            }
                            value={formData.empId}
                            name="empId"
                            classNamePrefix="filter-select"
                            options={filterOptionsforEmpName}
                            placeholder="Employee Code"
                            maxMenuHeight={200}
                            isClearable
                          />

                        </div>
                       {/* <div class="salary-form-group">
                       <div className="Report_Lable"> <label>Growing</label></div>
                          <Select
                            className={`filter-select-wrapper ${errors.growing ? "error-input" : ""}`}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "growing")
                            }
                            options={growingOPtions}
                             value={formData.growing}
                            name="Growing"
                            classNamePrefix="filter-select"
                            placeholder="Growing"
                            maxMenuHeight={200}
                            isClearable
                          />

                        </div> */}
                      



                        <div className="form-group">
                            <label>
                            Date From 
                            </label>
                            <input
                            className={`input-half ${errors.startDate ? "error-input" : ""}`}
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputDateChange}
                            />
                        </div>

                        {/* Date To */}
                        <div className="form-group">
                            <label>
                            Date To 
                            </label>
                            <input
                            type="date"
                            className={`input-half ${errors.endDate ? "error-input" : ""}`}
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputDateChange}
                            />
                        </div>


              </div>



              {/* <div className="dashboard-export-btn-div">
                  <button type = "button"  onClick={OnclickExportSalary} className="btn-primary-excel btn-tiny-export">Export to Excel</button>
                 <button type = "button" className="btn-primary-pdf btn-tiny-export" >Export to PDF</button> 
                 <select
                    className="limit-select-report"
                    value={limit}
                    onChange={(e) => {setLimit(e.target.value),setEmpCurrPage(0),setlimitchange(true)}}
                  >
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                   <div className="salary-btn">
                    <button type="button" onClick={GetEmpSalaryDetails} class="btn-primary salary-btn-tiny">Generate Salary</button>
                  </div>
              </div> */}


                            
                                                      

                <div className="salary-report-table-wrapperr">
                   

                    {/* BODY TABLE */}
                    <div className="report-tbody-scroll-salary">
                      <table className="report-employee-table report-body-table">
                        <colgroup>
                          <col style={{ width: "5%" }} />
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                        </colgroup>

                        <tbody>
                              <tr className="salary-tr" key={"PICKERSALARYREPORT"} >
                                <td>01</td>
                                <td>PICKER SALARY REPORT</td>
                                <td><button type = "button"  onClick={() =>GETPICKERSALARYREPORTasView(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button"  onClick = {onCLICKPICKERSALARYREPORTASEXCEL} className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button"  onClick={() =>GETPICKERSALARYREPORTasView(false)} className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>
                              <tr className="salary-tr" key={"PICKERFINALSALARYRESULT"} >
                                <td>02</td>
                                <td>PICKER FINAL SALARY RESULT</td>
                                <td><button type = "button" onClick={() =>GETPICKERSALARYFINALREPORTasView(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button" onClick={GetPickerFinalSalaery} className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button" onClick={() =>GETPICKERSALARYFINALREPORTasView(false)}  className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>
                              <tr className="salary-tr" key={"PICKERFINALSALARYRESULT"} >
                                <td>03</td>
                                <td>FORM M DETAILED</td>
                                <td><button type = "button" disabled  onClick={()=>onCLICKFormMDetailedASPreview(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button"  onClick = {onCLICKFormMDetailedASEXCEL} className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button" disabled  onClick={()=>onCLICKFormMDetailedASPreview(false)} className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>

                              <tr className="salary-tr" key={"PICKERFINALSALARYRESULT"} >
                                <td>04</td>
                                <td>FORM M WEEKLY</td>
                                <td><button type = "button"  onClick={()=>onCLICKFormMWeeklyASPreview(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button"   onClick = {onCLICKFormMWeeklyASEXCEL} className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button"  onClick={()=>onCLICKFormMWeeklyASPreview(false)} className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>                              
                              <tr className="salary-tr" key={"MOVEMENTREPORT"} >
                                <td>05</td>
                                <td>MOVEMENT</td>
                                <td><button type = "button" onClick={()=>GETMOVEMENTREPORTASPDFasView(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button" onClick={onCLICKMOVEMENTREPORTASEXCEL}  className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button" onClick={()=>GETMOVEMENTREPORTASPDFasView(false)}   className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>  
                               <tr className="salary-tr" key={"STAFFSALARY"} >
                                <td>06</td>
                                <td>STAFF SALARY</td>
                                <td><button type = "button" onClick={()=>onCLICKStaffSalaryASPreview(true)} className="btn-primary-salary btn-tiny-export">View as PDF</button></td>
                                <td><button type = "button" onClick={onCLICStaffSalaryASEXCEL}  className="btn-primary-salary btn-tiny-export">Export to Excel</button></td>
                                <td><button type = "button" onClick={()=>onCLICKStaffSalaryASPreview(false)} className="btn-primary-salary btn-tiny-export">Export to PDF</button></td>
                              </tr>      
                                                                       
                        </tbody>
                      </table>
                    </div>
                  </div>

            </div>
         </div>


      { isopenmodel && selectedEmp && (
                <div className="modal-overlay">
                      <div className="modal-container">
                        <div className="modal-header">
                          <h3>{selectedEmp.empName} ({selectedEmp.empId}) - ({formatDate(formData.startDate) +" - "+formatDate(formData.endDate)})</h3>
                          <button onClick={() => setIsopenmodel(false)}  className="close-btn">×</button>
                        </div>

                        <div className="modal-body">
                          <table className="salary-table">
                            <thead>
                              <tr>
                                <th>Harvested Date</th>
                                <th>Harvested Time</th>
                                <th>Weight</th>
                                <th>Room No</th>
                                <th>Before 5 AM</th>
                                <th>After 5 AM</th>
                                <th>Rate/Kg</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {salaryDetailsByID.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.date}</td>
                                  <td>{item.time}</td>
                                  <td>{item.weight +" Kg"}</td>
                                  <td>{item.roomNo}</td>  
                                  <td>{item.before5AM}</td>                                
                                  <td>{item.after5AM}</td>
                                  <td>{item.rate +" rs"}</td>
                                  <td>{item.amount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                       
                        </div>

                        {/* <div className="modal-footer">
                          <div>Total Weight: {"totalWeight"} Kg</div>
                          <div>Total Amount: ₹ {"totalAmount"}</div>
                        </div> */}
                           <div class="salary-form-group-box modal-footer">
                            <div class="salary-form-group">
                                <label>Total Weight:</label>
                                <input  className={`input-half-width  `} 
                                 value={selectedEmp.totalWeight +" Kg"} 
                                 disabled
                                name="Total Weight"/>
                            </div>
                            <div class="salary-form-group">
                                <label>Total Amount: ₹</label>
                                <input  className={`input-half-width  `} 
                                value={selectedEmp.salary} 
                                disabled
                                name="Total Amount"/>
                            </div>
                          </div>
                      </div>
                    </div>

      )}

{pdfUrl && (
  <div className="pdf-modal-overlay">
    <div className="pdf-modal">

      <button
        className="pdf-close-btn"
        onClick={() => setPdfUrl(null)}
      >
        ✕
      </button>

      <iframe
          src={`${pdfUrl}#toolbar=0`}
        title="PDF Preview"
        width="100%"
        height="100%"
      />

    </div>
  </div>
)}


  </div>

</div>
 )};