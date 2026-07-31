
import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../css/idcard.css"
import {FetchAllEmployeeBatchList,GetEmpBySearchID,PreviewWorkerIdCard,PreviewStaffIdCard,
  DownloadStaffIdCard,DownloadWorkerIdCard
} from "../common/apiService.jsx";
import Sidebar from "../components/Sidebar.jsx"



export default function IDCard() {

var [activePage, setActivePage] = useState("idcard");
var [headerTitle, setHeaderTitle] = useState("ID Card");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();
var [showProfileMenu, setShowProfileMenu] = useState(false);


var [empList, setEmpList] = useState([]);
var [selectedempList, setSelectedEmpList] = useState([]);
var [empsearchID, setEmpsearchID] = useState("");
var [pdfUrl,setPdfUrl] = useState(false);
var [active, setActive] = useState("LANDSCAPE");
var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");

var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    navigate("/"+tabName);
    hideLoader();

}
 
var selectedEMP = [];
useEffect(() => {
  if (!empsearchID || empsearchID.length < 1) {
     showLoader("Please wait ...");
          onEmployeeListLoad();
      }
      var timer = setTimeout(() => {
        console.log("Calling API with:", empsearchID); // DEBUG
        searchEmpById(empsearchID);
      }, 200);

      return () => clearTimeout(timer);

}, [empsearchID]);
 var searchEmpById = (id) =>{
    if (!id){
        return;
    }
    try {
             GetEmpBySearchID( 
                  {
                    empId: id,
                    page:0,
                    size:10
                  },
                  {
                    success: (res) => {
                                PopulateEmployeData(res);                            
                    
                    },
                    error: () => {
                      hideLoader();
                      showAlert("No Records Found !!!.");  
                    },
                  }
                );
          } catch (err) {
          console.error(err);
           showAlert("Employee not found", "ok");
        }
 }
useEffect(() => {
  onEmployeeListLoad();
}, []);

var onEmployeeListLoad = () =>{
    console.log("onEmployeeListLoad called !!!");
    
      FetchAllEmployeeBatchList(
            {
               page:0,
               size:10
            },
           {
            success: (res) => {                 
              console.log(res)
              PopulateEmployeData(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch employee list", "ok");
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
             if(data[0][0].hasOwnProperty("employeeDetails")){
                var employeeDetails = data[0][0].employeeDetails;
                if(employeeDetails.hasOwnProperty("content")){
                    var content = employeeDetails.content;
                    setEmpList(content);
                }
                    
             }
            hideLoader();
          }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
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
}
var onClickEmplLis = (empId) =>{
    setSelectedEmpList((prev) => {
        if (prev.includes(empId)) return prev; 
        return [...prev, empId];
    });
}
var onclickClearAll = () =>{
    setSelectedEmpList([])
}
var onClickXmark = (empId) =>{
    setSelectedEmpList((prev) =>
        prev.filter((id) => id !== empId)
    );
}

var onClickPreview = () =>{
    console.log("Final ID Emp List ==>"+selectedempList);
    if(selectedempList.length === 0){
        showAlert("Please select atleast one employee !!!.");
        return;
    }
    showLoader("Please wait ...!!");
    if(active === "PORTRAIT")
    {
    PreviewStaffIdCard(
              {
                EmpIDs :selectedempList
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
                  showAlert("Failed to Generate Salary", "ok");
                },
            }
    
          )
        }
        else{
    PreviewWorkerIdCard(
              {
                EmpIDs :selectedempList
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
                  showAlert("Failed to Generate Salary", "ok");
                },
            }
    
          )          
        }
}

var onClickDownload = () =>{
    console.log("Final ID Emp List ==>"+selectedempList);
    if(selectedempList.length === 0){
        showAlert("Please select atleast one employee !!!.");
        return;
    }
    showLoader("Please wait ...!!");
    if(active === "PORTRAIT")
    {
    DownloadStaffIdCard(
              {
                EmpIDs :selectedempList
              },
               {
                success: (pdfUrl) => {
                    hideLoader();
                    if(pdfUrl.type == "json"){
                      var res = pdfUrl.data;
                            console.log("res-->"+res.code);
                            if(res === "Success")
                            {
                                console.log("res-->"+res.message);
                                showAlert("File saved successfully !!!.","ok")
                            }else{
                              showAlert("Somthing went wrong !!.","ok")
                            }
                    }
                   
                },
                error: (err) => {
                  hideLoader();
                  console.error("Error ->"+err)
                  showAlert("Failed to Generate ID Card", "ok");
                },
            }
    
          )
        }
        else{
    DownloadWorkerIdCard(
              {
                EmpIDs :selectedempList
              },
               {
                success: (pdfUrl) => {
                    hideLoader();
                     if(pdfUrl.type == "json"){
                      var res = pdfUrl.data;
                            console.log("res-->"+res.code);
                            if(res === "Success")
                            {
                                console.log("res-->"+res.message);
                                showAlert("File saved successfully !!!.","ok")
                            }else{
                              showAlert("Somthing went wrong !!.","ok")
                            }
                    }
                   
                },
                error: (err) => {
                  hideLoader();
                  console.error("Error ->"+err.data)
                  showAlert("Failed to Generate ID Card", "ok");
                },
            }
    
          )          
        }
}

 return (
<div className="id-layout-wrapper">

 
 <Sidebar
        activePage="idcard"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />



<div className="idcard-card">
 <div className="emp-container">
      <div className="emp-wrapper">
        
        {/* LEFT SIDE */}
        <div className="emp-left">
          <label className="emp-label">Employee ID</label>

          <div className="emp-dropdown">
            <input
              type="text"
              placeholder="Search employee by ID..."
              className="emp-input"
               value={empsearchID}
                onChange={(e) => {
                 setEmpsearchID(e.target.value);
                }}
            />

           <div className="emp-dropdown-list">
                {empList.map((emp) => (
                    <div
                    key={emp.empId}
                    className="emp-item"
                    onClick={() => onClickEmplLis(emp.empId)}
                    >
                    {emp.empId} - {emp.empName}
                    </div>
                ))}
                </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="emp-right">
          <div className="emp-header">
            <p>Selected Employees ({selectedempList.length})</p>
            <button  className={`emp-type-btn ${active === "LANDSCAPE" ? "active" : ""}`} onClick={() => setActive("LANDSCAPE")}>Landscape</button>
            <button  className={`emp-type-btn ${active === "PORTRAIT" ? "active" : ""}`} onClick={() => setActive("PORTRAIT")}>Portrait</button>
            <button className="emp-clear-btn"  onClick={onclickClearAll}>Clear All</button>
          </div>
<div className="right-sub1">
    
          <div className="emp-chip-container">
            { selectedempList.map((empId) => (
            <div className="emp-chip">
              {empId}
              <span  onClick={() => onClickXmark(empId)}
              className="emp-remove">×</span>
            </div>
            ))}
          </div>
    </div>
        <div className="previewdownload-div">
            <button className="pD" onClick={onClickPreview}>Preview</button>
            <button className="pD" onClick={onClickDownload}>Download</button>
        </div>
        </div>

      </div>
    </div>
    </div>
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



 )}