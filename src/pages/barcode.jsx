import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/barcode.css"
import Sidebar from "../components/Sidebar.jsx"
import {FetchEmployeeBatchList,GetbarcodePrint,GetPreviewImg,GetEmpBybarcodeSearchID} from "../common/apiService.jsx";



export default function Barcode() {

var [activePage, setActivePage] = useState("barcode");
var [headerTitle, setHeaderTitle] = useState("Employee Barcode List");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();
var [employeeBarcodeDetails,setEmployeeBarcodeDetails] = useState([]);
var [stickerCounts, setStickerCounts] = useState({});
var [pdfUrl, setPdfUrl] = useState(null);
var [pdfprintUrl, setPdfprintUrl] = useState(null);
var [showProfileMenu, setShowProfileMenu] = useState(false);
var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");


  var [empsearchID, setEmpsearchID] = useState("");
  var [arrowstart, setArrowstart] = useState(0);
  var [arrowend, setArrowend] = useState(0);
  var [arrowfull, setArrowfull] = useState(0);
  var [empCurrPage, setEmpCurrPage] = useState(0);
  var [empCurrSize, setEmpCurrSize] = useState(7);
  var [isSearchEmpEnabled, setIsSearchEmpEnabled] = useState(false);
  var [isPrev, setIsPrev] = useState(false);
  var [isNext, setIsNext] = useState(false);
  var [reloadFlag, setReloadFlag] = useState(false);
  var [limit, setLimit] = useState(7);


useEffect(() => {
  if(isSearchEmpEnabled) return;
  showLoader("Please wait...");
   const timer = setTimeout(() => {
    showLoader("Please wait...");
    onEmployeeListLoad();
  }, 300);

  return () => clearTimeout(timer);
}, [empCurrPage, empCurrSize,limit,reloadFlag]);
useEffect(() => {
  console.log("Typing:", empsearchID); 

if(!isSearchEmpEnabled) return;
      if (!empsearchID || empsearchID.length < 1) {
          onEmployeeListLoad();
      }

      const timer = setTimeout(() => {
        console.log("Calling API with:", empsearchID); // DEBUG
        searchEmpById(empsearchID);
      }, 500);

      return () => clearTimeout(timer);

}, [empsearchID,empCurrPage]);
 var searchEmpById = (id) =>{
    if (!id){
        return;
    }
    try {
             GetEmpBybarcodeSearchID( 
                  {
                    empId: id,
                    page:empCurrPage,
                    size:empCurrSize
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

var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    navigate("/"+tabName);
    hideLoader();

}
var GetEmployeePreviewImg = (emp,callback) =>{
   console.log("GetEmployeeBarcode called !!!");
   if(stickerCounts[emp.empId] == '' || stickerCounts[emp.empId] == null){
       showAlert("Please Enter No. of Stickers", "ok");
       return;
   }
  if(stickerCounts[emp.empId] == '0' ){
       showAlert("Please Enter No. of Stickers greater then 0", "ok");
       return;
   }  
   showLoader("Please wait ...!");
    GetPreviewImg(
          {
            EmpID:emp.empId,
            Count:stickerCounts[emp.empId]
          },
           {
            success: (res) => {
              hideLoader();
              var url = URL.createObjectURL(res);
              setPdfUrl(url);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch employee list", "ok");
            },
        }

      )
}
var onEmployeeListLoad = () =>{
    console.log("onEmployeeListLoad called !!!");
    
        FetchEmployeeBatchList(
          {
                     page:empCurrPage,
                     size:empCurrSize
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
             if(data[1].hasOwnProperty("content")){
              var content = data[1].content;
              for(var i = 0 ; i < content.length ; i++){
                content[i].barcode = data[0].BarcodeDetails[content[i].empId] ;
              }
              setEmployeeBarcodeDetails(content);
              
             }
              var pageDtls = data[1];
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


var onchangeStickers = (e,empId) =>{
  setStickerCounts({ ...stickerCounts,[empId]:e.target.value})
}

var onPrint = (emp) =>{
   console.log("onPrint called !!!");
   if(stickerCounts[emp.empId] == '' || stickerCounts[emp.empId] == null){
       showAlert("Please Enter No. of Stickers", "ok");
       return;
   }
  if(stickerCounts[emp.empId] == '0' ){
       showAlert("Please Enter No. of Stickers greater then 0", "ok");
       return;
   }  

   showLoader("Please wait ...!"); 
  console.log("Base64:", emp.barcode);

    GetPreviewImg(
          {
            EmpID:emp.empId,
            Count:stickerCounts[emp.empId]
          },
           {
            success: (res) => {
              hideLoader();
              var url = URL.createObjectURL(res);
              setPdfprintUrl(url);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch employee list", "ok");
            },
        }

      )
}

var onclicklogout = () =>{
   showLoader("Please wait ...");
    localStorage.clear();
    showAlert("Logged out successfully !!!."); 
    hideLoader();
   navigate("/");
   
}
var onClickNext = () => {
  
    showLoader("Please wait...");
    setEmpCurrPage(prev => prev + 1);
};

var onClickPrev = () => {
    showLoader("Please wait...");
    setEmpCurrPage(prev => (prev > 0 ? prev - 1 : 0));

};
     return (
    <div className="layout-wrapper">
         

       <Sidebar
        activePage="barcode"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />



      <div className="layout-page">
        <div className="top-header">
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
        </div>
          <div className="employee-page">
            <div className="employee-card">
              <div className="employee-header"></div>

              <div className="employee-toolbar">
                <input
                  className="search-input"
                  value={empsearchID}
                  onChange={(e) => {
                    console.log("Input changed:", e.target.value);
                    if(e.target.value === ""){
                      setIsSearchEmpEnabled(false);
                      setReloadFlag(prev => !prev);
                    }else{
                      setIsSearchEmpEnabled(true);
                    }
                     
                    setEmpCurrPage(0);
                    setEmpsearchID(e.target.value);
                  }}
                  placeholder="Search Employee"
                />
                <div className="toolbar-actions">
                  <select
                    className="limit-select"
                    value={limit}
                    onChange={(e) => {setLimit(e.target.value),setEmpCurrPage(0);setEmpCurrSize(e.target.value)}}
                  >
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              
                            <div className="bar-arrow-div">
                              <p className="arrow-p">
                                {arrowstart} <span className="arrspan">-</span> {arrowend}{" "}
                                <span className="arrspan">of</span> {arrowfull}
                              </p>

                              <div>
                                <span onClick={onClickPrev} className={`arrow-btn ${isPrev ? "" : "Prev-hide"}`}>&#9664;</span>
                                <span onClick={onClickNext} className={`arrow-btn ${isNext ? "" : "Next-hide"}`}>&#9654;</span>
                              </div>
                            </div>
							

            <div className="bar-table-wrapper">
                <table className="employee-table header-table">
                      <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>EMPLOYEE ID</th>
                          <th>EMPLOYEE NAME</th>
                          <th className="head-align">BARCODE </th>
                          <th className="head-align">No. of Stickers</th>
                          <th className="arrow-th head-align">ACTIONS</th>
                        </tr>
                      </thead>
                    </table>
                  {/* BODY TABLE */}
                    <div className="tbody-scroll-barcode ">
                      <table className="employee-table body-table">
                        <colgroup>
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "20%" }} />
                        </colgroup>

                        <tbody>
                          {employeeBarcodeDetails.length > 0 ? (
                            employeeBarcodeDetails.map((emp, index) => (
                              <tr key={emp.empId}>
                                <td>{emp.empId}</td>
                                <td>{emp.empName}</td>
                                <td><img src={`data:image/png;base64,${emp.barcode}`} className = 'barcode-img'alt="barcode" /></td>
                                <td><input type="number" onChange={(e) =>onchangeStickers(e,emp.empId)} className = 'noofstickers' placeholder="no. of Stickers"/></td>
                                <td>
                                  <div className="action-wrapper">
                                    <button
                                      type="button"
                                      className="action-btn edit-btn"
                                      onClick={() => GetEmployeePreviewImg(emp)}
                                    >
                                      Preview
                                    </button>
                                    <button
                                      type="button"
                                      className="action-btn delete-btn"
                                      onClick={() => onPrint(emp)}
                                    >
                                      Print
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="no-records">
                                No records found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
{pdfprintUrl && (
  <div className="pdf-modal-overlay">
    <div className="pdf-modal">

      <button
        className="pdf-close-btn"
        onClick={() => setPdfprintUrl(null)}
      >
        ✕
      </button>

      <iframe
          src={`${pdfprintUrl}`}
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
