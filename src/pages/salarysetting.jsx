
import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../css/salarysetting.css"
import {getActiveSalaryConfigValues,SetNewSalaryConfigurations,UploadExcelWeightData,uploadContractorAmountData
  ,uploadDeductionData,uploadDriverAttendanceData,uploadDeductionsData
} from "../common/apiService.jsx";
import { IconAlertCircle } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar.jsx"

export default function SalarySetting() {

var [activePage, setActivePage] = useState("sal-setting");
var [headerTitle, setHeaderTitle] = useState("Salary Configurations");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();
var [showProfileMenu, setShowProfileMenu] = useState(false);
var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");


var [mode,setMode] = useState("Import");
var [errors, setErrors] = useState({});
var [importerrors, setImporterrors] = useState({});
var [importCSerrors, setImportCSerrors] = useState({});
var [importSDerrors, setImportSDerrors] = useState({});
var [importDAerrors, setImportDAerrors] = useState({});
var [importDerrors, setImportDerrors] = useState({});
var [formData1, setFormData1] = useState({ startDate: "", endDate: "",cuttOffbefore:"",cuttOffafter:""});
var [formData2, setFormData2] = useState({ startDate: "", endDate: "",before5AM:"",after5AM:""});
var [importdata, setImportdata] = useState({ date: "", isfile:"",before5AM:"",after5AM:""});
var [importCSdata, setImportCSdata] = useState({ date: "", isfile:""});
var [importSDdata, setImportSDdata] = useState({ month: "", deduction:"",isfile:""});
var [importDAdata, setImportDAdata] = useState({ month: "", isfile:""});
var [importDdata, setImportDdata] = useState({isfile:""});
var [fileKey, setFileKey] = useState(Date.now());
var [fileCSKey, setFileCSKey] = useState(Date.now());
var [fileSDKey, setFileSDKey] = useState(Date.now());
var [fileDAKey, setFileDAKey] = useState(Date.now());
var [fileDKey, setFileDKey] = useState(Date.now());


var deductionOPtions = [
  { value: "ESI", label: "ESI" },
  { value: "PF", label: "PF" },
  { value: "ADVANCE", label: "ADVANCE" },
  { value: "STORE", label: "STORE" },
  { value: "BANK PAID", label: "BANK PAID" }
];
useEffect(() => {
showLoader("Please wait...");
 GetActiveSalaryConfiguration();
}, []);


var GetActiveSalaryConfiguration = () =>{
  getActiveSalaryConfigValues(
           {
            success: (res) => {
              console.log(res)
              PopulateActiveSalaryConfigValues(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch Configuration details", "ok");
            },
        }

      )
}

var PopulateActiveSalaryConfigValues =  (res) =>{
    if(res.hasOwnProperty("code")){
     var code = res.code;
     if(code === "0"){
          var data = res.data;
          if(!data.length == 0) { 
            data[0].startDate = data[0].startDate.split("T")[0];   
            setFormData1(data[0])
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

var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    navigate("/"+tabName);
    hideLoader();

}

var handleInputDateChange = (e) =>{
  var {name , value} = e.target;
  setFormData2(prev  =>({
    ...prev,
    [name] : value
  }))
      setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}
var handleInputImportDateChange = (e) =>{
  var {name , value} = e.target;
  setImportdata(prev  =>({
    ...prev,
    [name] : value
  }))
      setImporterrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}
var handleInputImportCSDateChange = (e) =>{
  var {name , value} = e.target;
  setImportCSdata(prev  =>({
    ...prev,
    [name] : value
  }))
      setImportCSerrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}

var handleInputImportSDDateChange = (e) =>{
  var {name , value} = e.target;
  setImportSDdata(prev  =>({
    ...prev,
    [name] : value
  }))
      setImportSDerrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}

var handleInputImportDADateChange = (e) =>{
  var {name , value} = e.target;
  setImportDAdata(prev  =>({
    ...prev,
    [name] : value
  }))
      setImportDAerrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
}
  var handleChange = (e) => {
    var { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
  };
  var handleChangeImportField = (e) => {
    var { name, value } = e.target;
    setImportdata({ ...importdata, [name]: value });
    setImporterrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
  };

 

  var handleImportfileChange = (e) => {
    var  file = e.target.files[0];
    var fileName = file.name;
     if(fileName.includes("Weights.xlsx")){
      var splitdate = importdata.date.split("-");
      var r_date = splitdate[2]+"-"+splitdate[1]+"-"+splitdate[0];
      if(fileName.includes(r_date)){
        if(fileName === r_date+"_Weights.xlsx"){
              setImportdata({
              ...importdata,
              isfile: file
            });
              setImporterrors((prev) => {
                var t = { ...prev };
                delete t["isfile"];
                return t;
              });
               }else{
         e.target.value = "";
        showAlert("Selected Date and File prefix Date is different !!!.","ok");
            return;
      }
    }else{
       e.target.value = "";
       showAlert("Please select selected date file !!!.","ok");
       return;
    }

  }else{
     e.target.value = "";
     showAlert("Please select Weights name file !!!.","ok");
            return;
  }
  };

var handleImportCSfilecheck = (e) =>{
  if(importCSdata.date === null || importCSdata.date === ""){
    e.preventDefault();
       showAlert("Please select date before uploading the file !!!.","ok");
       let t = {};
        if (!importCSdata.date) t.date = true;
        setImportCSerrors(t);
       return false;
  }
}
var handleImportSDfilecheck = (e) =>{
  if(importSDdata.date === null || importSDdata.date === ""){
    e.preventDefault();
       showAlert("Please select date before uploading the file !!!.","ok");
       let t = {};
        if (!importSDdata.date) t.date = true;
        setImportSDerrors(t);
       return false;
  }
}

var handleImportDAfilecheck = (e) =>{
  if(importDAdata.date === null || importDAdata.date === ""){
    e.preventDefault();
       showAlert("Please select date before uploading the file !!!.","ok");
       let t = {};
        if (!importSDdata.date) t.date = true;
        setImportDAerrors(t);
       return false;
  }
}
var handleImportDfilecheck = (e) =>{
  if(importDAdata.date === null || importDAdata.date === ""){
    e.preventDefault();
       showAlert("Please select date before uploading the file !!!.","ok");
       let t = {};
        if (!importSDdata.date) t.date = true;
        setImportDAerrors(t);
       return false;
  }
}
var handleImportfilecheck = (e) =>{
  if(importdata.date === null || importdata.date === ""){
    e.preventDefault();
       showAlert("Please select date before uploading the file !!!.","ok");
       let t = {};
        if (!importdata.date) t.date = true;
        setImporterrors(t);
       return false;
  }
}
  var handleImportCSfileChange = (e) => {
    var  file = e.target.files[0];
    var fileName = file.name;
    if(fileName.includes("ContractorSalary.xlsx")){
      var splitdate = importCSdata.date.split("-");
      var r_date = splitdate[2]+"-"+splitdate[1]+"-"+splitdate[0];
      if(fileName.includes(r_date)){
        if(fileName === r_date+"_ContractorSalary.xlsx"){
            setImportCSdata({
            ...importCSdata,
            isfile: file
          });
            setImportCSerrors((prev) => {
              var t = { ...prev };
              delete t["isfile"];
              return t;
            });
      }else{
         e.target.value = "";
        showAlert("Selected Date and File prefix Date is different !!!.","ok");
            return;
      }
    }else{
       e.target.value = "";
       showAlert("Please select selected date file !!!.","ok");
       return;
    }

  }else{
     e.target.value = "";
     showAlert("Please select ContractorSalary name file !!!.","ok");
            return;
  }
  };


    var handleImportSDfileChange = (e) => {
       var  file = e.target.files[0];
         setImportSDdata({
            ...importSDdata,
            isfile: file
          });
            setImportSDerrors((prev) => {
              var t = { ...prev };
              delete t["isfile"];
              return t;
            });
            console.log(importSDerrors)
    }
    var handleImportDAfileChange = (e) => {
       var  file = e.target.files[0];
         setImportDAdata({
            ...importDAdata,
            isfile: file
          });
            setImportDAerrors((prev) => {
              var t = { ...prev };
              delete t["isfile"];
              return t;
            });
            console.log(importDAerrors)
    }

       var handleImportDfileChange = (e) => {
       var  file = e.target.files[0];
         setImportDdata({
            ...importDdata,
            isfile: file
          });
            setImportDerrors((prev) => {
              var t = { ...prev };
              delete t["isfile"];
              return t;
            });
            console.log(importDerrors)
    }
  var validateForm = () => {
    let t = {};
    if (!formData2.startDate) t.startDate = true;
    if (!formData2.endDate) t.endDate = true;
    if (!formData2.before5AM) t.before5AM = true;
    if (!formData2.after5AM) t.after5AM = true;
    if (!formData2.after5AM) t.after5AM = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };
const onclickuploadbtn = () => {
  if (!validateImportForm()) return;

  showLoader("Processing your file, Please wait ...");

  const file = importdata.isfile;
  if (!file) return hideLoader();

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const filteredData = jsonData.map(row => ({
      empId: row.ID,
      Weight: row.SALARY
    }));

    console.log("Excel Data:", filteredData);

    hideLoader();
    showLoader("Uploading Data to Server, Please wait ...");

    // function to call the API
    const callUploadAPI = (isFirst = true, isOK = null) => {
      if(isOK == "yes"){
        showLoader("Processing with New Values, Please wait ...");
      }else if(isOK == "no"){
        showLoader("Processing with Existing Values, Please wait ...");  
      }else{
        showLoader("Processing Data, Please wait ...");
      }
      UploadExcelWeightData(
        {
          startDate: importdata.date + "T00:00:00",
          endDate: importdata.date + "T23:59:59",
          before5AM: importdata.before5AM,
          after5AM: importdata.after5AM,
          excelData: filteredData,
          isFirst:isFirst,
          isOK:isOK
        },
        {
          success: (res) => {
            hideLoader();

            if (res.hasOwnProperty("code")) {
              const code = res.code;

              switch (code) {
                case "0":{
                          showAlert("File Imported Successfully !!!.");
                          setImportdata({ date: "", isfile: "", before5AM: "", after5AM: "" });
                          setFileKey(Date.now());
                          setImporterrors([{}]);
                          // var failedData = res.data.length;
                          // if(failedData > 0){
                          //   showAlert(`Employees Id not Punched in for the Date ${importdata.date}. Failed Records: ${res.data}`, "ok");
                          // }
                          break;
                       }

                case "110":
                  showConfirm(
                    `The selected date already has values in system (${formatDate(res.data[0].startDate.split("T")[0])} 00:00:00 - ${formatDate(res.data[0].endDate.split("T")[0])} 23:59:59, Before 5 AM: Rs ${res.data[0].before5AM}, After 5 AM: Rs ${res.data[0].after5AM}). Are you sure you want to update them?`,
                    () => callUploadAPI(false, 'yes'),  
                    () => callUploadAPI(false, 'no')  
                  );
                  break;

                case "-101":
                  showAlert(res.message, "ok");
                  break;

                case "401":
                  localStorage.setItem("token", "");
                  showAlert("Invalid Session !!!", "ok");
                  navigate("/");
                  break;

                default:
                  showAlert("Something went wrong, please contact administration !!!.");
              }

            } else {
              showAlert("Something went wrong, please contact administration !!!.");
            }
          },
          error: () => {
            hideLoader();
            showAlert("Failed to add Weight");
          }
        }
      );
    };

    callUploadAPI(true, null);
  };

  reader.readAsArrayBuffer(file);
};


var handleSelectChange = (selectedOption, name) => {
   setImportSDdata(prev => ({
    ...prev,               
    [name]: selectedOption  
  }));
    setImportSDerrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
  console.log(importSDdata)
}


const onclickuploadSDbtn = () => {
  if (!validateImportSDForm()) return;

  showLoader("Processing your file, Please wait ...");

  const file = importSDdata.isfile;
  if (!file) {
    hideLoader();
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const filteredData = jsonData
  .filter(row => row.ID !== null && row.ID !== undefined && row.ID !== "")
  .map(row => ({
    empId: row.ID,
    amount: row[importSDdata.deduction?.value]
  }));

    console.log("Excel Data:", filteredData);
var t = {}
   t.deduction = importSDdata.deduction?.value;
   t.month = importSDdata.month;

    uploadDeductionData(
      {
        data: t,
        excelData: filteredData
      },
      {
        success: (res) => {
          hideLoader();

          if (res.hasOwnProperty("code")) {
            const code = res.code;

            switch (code) {
              case "0":
                showAlert("File Imported Successfully !!!.");
                setImportSDdata({ month: "",deduction:"",isfile:""});
                setFileSDKey(Date.now());
                setImportSDerrors([{}]);
                break;

              case "-101":
                showAlert(res.message, "ok");
                break;

              case "401":
                localStorage.setItem("token", "");
                showAlert("Invalid Session !!!", "ok");
                navigate("/");
                break;

              default:
                showAlert("Something went wrong, please contact administration !!!.");
            }
          } else {
            showAlert("Something went wrong, please contact administration !!!.");
          }
        },
        error: () => {
          hideLoader();
          showAlert("Failed to add Deduction");
        }
      }
    );
  };

  reader.readAsArrayBuffer(file);
};

const onclickuploadDAbtn = () => {
  if (!validateImportDAForm()) return;

  showLoader("Processing your file, Please wait ...");

  const file = importDAdata.isfile;
  if (!file) {
    hideLoader();
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });


const [year, month] = importDAdata.month.split("-").map(Number);

// next month
let nextMonth = month + 1;
let nextYear = year;

if (nextMonth === 13) {
  nextMonth = 1;
  nextYear++;
}

// build ordered headers: 21 → 30, then 1 → 20
const lastDay = new Date(year, month, 0).getDate();
const headers = [
  ...Array.from({ length: lastDay - 20 }, (_, i) => (21 + i).toString()), // 21–30
  ...Array.from({ length: 20 }, (_, i) => (i + 1).toString())   // 1–20
];

const filteredData = jsonData
  .filter(row => row.ID)
  .map(row => ({
    empId: row.ID,
    attendance: headers.reduce((acc, h) => {
      const value = row[h] ?? row[Number(h)];

        let useMonth = month;
        let useYear = year;

        // 1–20 goes to next month
        if (parseInt(h) <= 20) {
          useMonth = nextMonth;
          useYear = nextYear;
        }

        const day = h.padStart(2, "0");
        const mm = String(useMonth).padStart(2, "0");

        acc.push({
          date: `${day}-${mm}-${useYear}`,
          value:value
        });

      return acc;
    }, [])
  }));
    console.log("Excel Data:", filteredData);
var t = {}
   t.month = importDAdata.month;

    uploadDriverAttendanceData(
      {
        excelData: filteredData
      },
      {
         success: (res) => {
                hideLoader();
                 if(res.status === "0"){
                  showAlert("Driver Attendance imported successfully !!! ..");
                  setImportDAdata({isfile:"",month:""});
                  setFileDAKey(Date.now());
                  setImportDAerrors([{}]);
                }else{
                   showAlert(res.message,"ok")
                }
                  
               
              },
        error: () => {
          hideLoader();
          showAlert("Failed to add Driver Attendance");
        }
      }
    );
  };

  reader.readAsArrayBuffer(file);
};



const onclickuploadDbtn = () => {
  if (!validateImportDForm()) return;

  showLoader("Processing your file, Please wait ...");

  const file = importDdata.isfile;
  if (!file) {
    hideLoader();
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });


    console.log("Excel Data:", jsonData);
var t = {}
   t.month = importDdata.month;

    uploadDeductionsData(
      {
        excelData: jsonData
      },
      {
        success: (res) => {
          hideLoader();

          if (res.hasOwnProperty("status")) {
            const code = res.status;

            switch (code) {
              case "0":
                showAlert("File Imported Successfully !!!.");
                setImportDdata({isfile:""});
                setFileDKey(Date.now());
                setImportDerrors([{}]);
                break;

              case "-101":
                showAlert(res.message, "ok");
                break;

              case "401":
                localStorage.setItem("token", "");
                showAlert("Invalid Session !!!", "ok");
                navigate("/");
                break;

              default:
                showAlert("Something went wrong, please contact administration !!!.");
            }
          } else {
            showAlert("Something went wrong, please contact administration !!!.");
          }
        },
        error: () => {
          hideLoader();
          showAlert("Failed to upload Deductions");
        }
      }
    );
  };

  reader.readAsArrayBuffer(file);
};


const onclickuploadCSbtn = () => {
  if (!validateImportCSForm()) return;

  showLoader("Processing your file, Please wait ...");

  const file = importCSdata.isfile;
  if (!file) {
    hideLoader();
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const filteredData = jsonData
  .filter(row => row.ID !== null && row.ID !== undefined && row.ID !== "")
  .map(row => ({
    empId: row.ID,
    amount: row.SALARY
  }));

    console.log("Excel Data:", filteredData);

    uploadContractorAmountData(
      {
        date: importCSdata.date,
        excelData: filteredData
      },
      {
        success: (res) => {
          hideLoader();

          if (res.hasOwnProperty("code")) {
            const code = res.code;

            switch (code) {
              case "0":
                showAlert("File Imported Successfully !!!.");
                setImportCSdata({ date: "", isfile: ""});
                setFileCSKey(Date.now());
                setImportCSerrors([{}]);
                break;

              case "-101":
                showAlert(res.message, "ok");
                break;

              case "401":
                localStorage.setItem("token", "");
                showAlert("Invalid Session !!!", "ok");
                navigate("/");
                break;

              default:
                showAlert("Something went wrong, please contact administration !!!.");
            }
          } else {
            showAlert("Something went wrong, please contact administration !!!.");
          }
        },
        error: () => {
          hideLoader();
          showAlert("Failed to add Weight");
        }
      }
    );
  };

  reader.readAsArrayBuffer(file);
};


var validateImportForm = () => {
    let t = {};
    if (!importdata.date) t.date = true;
    if (!importdata.isfile) t.isfile = true;
    setImporterrors(t);
    return Object.keys(t).length === 0;
  };
var validateImportSDForm = () => {
    let t = {};
    if (!importSDdata.month) t.month = true;
    if (!importSDdata.deduction) t.deduction = true;
    if (!importSDdata.isfile) t.isfile = true;
    setImportSDerrors(t);
    return Object.keys(t).length === 0;
  };

  var validateImportDAForm = () => {
    let t = {};
    if (!importDAdata.month) t.month = true;
    if (!importDAdata.isfile) t.isfile = true;
    setImportDAerrors(t);
    return Object.keys(t).length === 0;
  };

   var validateImportDForm = () => {
    let t = {};
    if (!importDdata.isfile) t.isfile = true;
    setImportDerrors(t);
    return Object.keys(t).length === 0;
  };

  var validateImportCSForm = () => {
    let t = {};
    if (!importCSdata.date) t.date = true;
    if (!importCSdata.isfile) t.isfile = true;
    setImportCSerrors(t);
    return Object.keys(t).length === 0;
  };
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}
var onclickupdateConfigbtn = () =>{
    if (!validateForm()) return;
showLoader("Please wait...");
      SetNewSalaryConfigurations(
        {
            startDate: (formData2.startDate).toString()+"T00:00:00",
            endDate: (formData2.endDate).toString()+"T23:59:59",
            before5AM: (formData2.before5AM).toString(),
            after5AM: (formData2.after5AM).toString(),
            timestamp: new Date().toISOString().slice(0, 23),
            isActive:true
        },
          {
           success: (res) => {
             if(res.hasOwnProperty("code")){
                var code = res.code;
                if(code === "0"){
                      showAlert("Configuration saved successfully !!!."); 
                      setFormData2({ startDate: "", endDate: "",before5AM:"",after5AM:""});
                      GetActiveSalaryConfiguration ();                        
                      setErrors([{}]);
                }else if(code === "-101"){
                   hideLoader();
                   showAlert(res.message, "ok");

                } else if(code === "401"){
                    hideLoader();
                    localStorage.setItem("token", "");
                    showAlert("Invalid Session !!! .", "ok");
                    navigate("/");
                }
                else{
                  hideLoader();
                  showAlert("Somthing went wrong , Please contact administration !!!.");      
                }

              }else{
                hideLoader();
                showAlert("Somthing went wrong , Please contact administration !!!.");
              }
         
        },
        error: () => {
          hideLoader();
          showAlert("Failed to add Weight");  
        },
     }

      )
}



  var SetActiveUploadeScreen = () =>{
    setMode("Import");
    setFormData2({});
    setErrors({});
    setImportdata({});
    setImporterrors({});

  }
    var SetSalaryConfigScreen = () =>{
         setMode("SalaryConfig");
         setFormData2({});
         setErrors({});
         getActiveSalaryConfigValues();
  }


 return (
<div className="layout-wrapper">

<Sidebar
        activePage="sal-setting"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />

          <div className="layout-page">
            <div className="right-panel-center-ss">
            <div className="weighing-card-ss">
                <div className="panel-toggle-wrapper-ss">
                    <button
                        type="button"
                        className={`panel-toggle-btn-ss ${mode === "Import" ? "active-left" : ""}`}
                        onClick={() => SetActiveUploadeScreen()}
                    >
                        Imports
                    </button>
                    <button
                        type="button"
                        className={`panel-toggle-btn-ss ${mode === "SalaryConfig" ? "active-right" : ""}`}
                        onClick={() => SetSalaryConfigScreen()}
                    >
                        Salary Adjustments
                    </button>

                </div>
  {mode === "SalaryConfig" && (
     <div>
            <div class="top-header-ss">
                <div class="headertop-ss"><h3>Active Configurations</h3></div>
                  <div class="form-group-box-ss">
                     <div className="form-group">
                            <label>
                            Date From 
                            </label>
                            <input
                            type="date"
                            name="startDate"
                            disabled
                            value={formData1.startDate}
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
                            disabled
                            name="endDate"
                            value={formData1.endDate}
                            onChange={handleInputDateChange}
                            />
                        </div>
                    </div>
                    <div class="form-group-box-ss">
                            <div class="form-group">
                                <label>Cutt Off Before, Rate(Rs) :<span className = "roomno-label"class="required">*</span></label>
                                <input  className={`input-half ${errors.empRoom ? "error-input" : ""}`} 
                                value={formData1.cuttOffbefore} 
                                disabled
                                onChange={handleChange}
                                name="empRoom"/>
                            </div>
                        
                        <div class="form-group">
                            <label>Cutt Off After, Rate(Rs) :<span className = "roomno-label"class="required">*</span></label>
                            <input  className={`input-half  ${errors.empRoom ? "error-input" : ""}`} 
                            value={formData1.cuttOffafter} 
                            disabled
                            onChange={handleChange}
                            name="empRoom"/>
                        </div>
                  </div>
              </div>


               

                 {/* <button type = "button"  onClick = {onclickupdateConfigbtn} className="btn-primary btn-tiny-ss" >Update Configurations</button> */}
   </div>
   )}

   {mode === "Import" && (
    <div>
        
        <div class="top-header-ss">
                <h3>Weights</h3>
                <div className="import-section">
                <div className="form-group">
                            <label>
                            Date From :<span className = "roomno-label"class="required">*</span>
                            </label>
                            <input
                            className={`input-half ${importerrors.date ? "error-input" : ""}`}
                            type="date"
                            name="date"
                            value={importdata.date}
                            onChange={handleInputImportDateChange}
                            />
                        </div>

                        <div className="form-group">
                          <label>
                            Import File :<span className="roomno-label required">*<span className="samplefilename">Sample File: DD-MM-YYYY_Weights.xlsx</span></span>
                          </label>

                          <input
                            type="file"
                            key={fileKey}
                            accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            className={`input-half ${importerrors.isfile ? "error-input" : ""}`}
                            onChange={handleImportfileChange}
                            onClick={handleImportfilecheck}
                            name="isfile"
                          />
                        </div>
                        <div className="form-group-ss ">
                           <button type = "button"  onClick = {onclickuploadbtn} className="btn-primary btn-tiny-ss" >Upload</button>
                          </div>
                        </div>
                        
                       
        </div>



        <div class="top-header-ss">
          <h3>Contractor Salary</h3>
          <div className="import-section">
              <div className="form-group">
                <label>
                Date From :<span className = "roomno-label"class="required">*</span>
                </label>
                <input
                className={`input-half ${importCSerrors.date ? "error-input" : ""}`}
                type="date"
                name="date"
                value={importCSdata.date}
                onChange={handleInputImportCSDateChange}
                />
              </div>
              <div className="form-group">
                <label>
                Import File :<span className="roomno-label required">* <span className="samplefilename">Sample File: DD-MM-YYYY_ContractorSalary.xlsx</span></span>
                </label>
                <input
                type="file"
                key={fileCSKey}
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className={`input-half ${importCSerrors.isfile ? "error-input" : ""}`}
                onChange={handleImportCSfileChange}
                onClick={handleImportCSfilecheck}
                name="isfile"
                />
              </div>
              <div className="form-group-ss">
                <button type = "button"  onClick = {onclickuploadCSbtn} className="btn-primary btn-tiny-ss" >Upload</button>
                </div>
          </div>
  
</div>



        {/* <div class="top-header-ss">
          <h3>Staff Salary Deduction</h3>
          <div className="import-section">
              <div className="form-group">
                <label>
                Month :<span className = "roomno-label"class="required">*</span>
                </label>
                <input
                className={`input-half ${importSDerrors.month ? "error-input" : ""}`}
                type="month"
                name="month"
                value={importSDdata.month}
                onChange={handleInputImportSDDateChange}
                />
              </div>
              <div class="form-group"> 
                        <label>Deduction</label>
                        <Select  className={`filter-select-wrapper ${importSDerrors.deduction ? "error-input" : ""}`}     
                          onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "deduction")
                            }
                            value={importSDdata.deduction} 
                            name="deduction"
                            classNamePrefix="filter-select" 
                            options={deductionOPtions}
                            placeholder="Deduction" 
                            maxMenuHeight={200}
                            isClearable
                             menuPlacement="top" 
                            />

                    </div>
              <div className="form-group">
                <label>
                Import File :<span className="roomno-label required">* </span>
                </label>
                <input
                type="file"
                key={fileSDKey} 
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className={`input-half ${importSDerrors.isfile ? "error-input" : ""}`}
                onChange={handleImportSDfileChange}
                onClick={handleImportSDfilecheck}
                name="isfile"
                />
              </div>
              <div className="form-group">
               <button type = "button"  onClick = {onclickuploadSDbtn} className="btn-primary btn-tiny-ssSD" >Upload</button>
              </div>
          </div>
         
        </div> */}


 <div class="top-header-ss">
          <h3>Driver Attendance</h3>
          <div className="import-section">
              <div className="form-group">
                <label>
                Month :<span className = "roomno-label"class="required">*</span>
                </label>
                <input
                className={`input-half ${importDAerrors.month ? "error-input" : ""}`}
                type="month"
                name="month"
                value={importDAdata.month}
                onChange={handleInputImportDADateChange}
                />
              </div>
              <div className="form-group">
                <label>
                Import File :<span className="roomno-label required">* </span>
                </label>
                <input
                type="file"
                key={fileDAKey} 
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className={`input-half ${importDAerrors.isfile ? "error-input" : ""}`}
                onChange={handleImportDAfileChange}
                onClick={handleImportDAfilecheck}
                name="isfile"
                />
              </div>
              <div className="form-group">
               <button type = "button"  onClick = {onclickuploadDAbtn} className="btn-primary btn-tiny-ss" >Upload</button>
              </div>
          </div>
         
        </div>


 <div class="top-header-ss">
          <h3>Manual Deductions</h3>
          <div className="import-section">
              
              <div className="form-group">
                <label>
                Import File :<span className="roomno-label required">* </span>
                </label>
                <input
                type="file"
                key={fileDKey} 
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className={`input-half ${importDerrors.isfile ? "error-input" : ""}`}
                onChange={handleImportDfileChange}
                onClick={handleImportDfilecheck}
                name="isfile"
                />
              </div>
                <div className="form-group"></div>
              <div className="form-group">
               <button type = "button"  onClick = {onclickuploadDbtn} className="btn-primary btn-tiny-ss" >Upload</button>
              </div>
          </div>
         
        </div>


    </div>
   )}

            </div>
           </div>

          </div>






</div>
 )};