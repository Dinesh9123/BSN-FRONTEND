import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/reports.css"
import Select from "react-select";
import Sidebar from "../components/Sidebar.jsx"
import {FetchReportsList,DownloadPDF,DownloadExcel,FetchReportsListForFilter,GrowingAspdf,GrowingAsExcel} from "../common/apiService.jsx";



export default function Reports() {


var [activePage, setActivePage] = useState("reports");
var [headerTitle, setHeaderTitle] = useState("Reports");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();


var now = new Date();

var formatDateTimeLocal = (date, hours, minutes) => {
  var d = new Date(date);
  d.setHours(hours, minutes, 0, 0);

  // adjust to local timezone (important!)
  var offset = d.getTimezoneOffset();
  var localDate = new Date(d.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
};

var todayStart = formatDateTimeLocal(now, 0, 0);     // 00:00
var todayEnd = formatDateTimeLocal(now, 23, 59); 
var [formData, setFormData] = useState({ empId: "",empName: "", empRoom: "",growing:"",startDate :todayStart,endDate : todayEnd});
var [errors, setErrors] = useState({});
var [empNamefilterValues,setempNamefilterValues] = useState([]);
var [empRoomfilterValues,setempRoomfilterValues] = useState([]);
var [empRoomfilterValuesOLDGROWING,setempRoomfilterValuesOLDGROWING] = useState([]);
var [empRoomfilterValuesNEWGROWING,setempRoomfilterValuesNEWGROWING] = useState([]);
var [empRoomfilterValuesREALGROWING,setempRoomfilterValuesREALGROWING] = useState([]);
var [empRoomfilterValuesREAL2,setempRoomfilterValuesREAL2] = useState([]);
var [filterOptionsforEmpRoom,setfilterOptionsforEmpRoom] = useState([]);
var [weightDetails,setweightDetails] = useState([]);
var [showProfileMenu, setShowProfileMenu] = useState(false);

var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");

  var [empCurrPage, setEmpCurrPage] = useState(0);
  var [empCurrSize, setEmpCurrSize] = useState(7);
  var [isPrev, setIsPrev] = useState(false);
  var [isNext, setIsNext] = useState(false);
  var [reloadFlag, setReloadFlag] = useState(false);
  var [arrowstart, setArrowstart] = useState(0);
  var [arrowend, setArrowend] = useState(0);
  var [arrowfull, setArrowfull] = useState(0);
   var [limit, setLimit] = useState(7);

const growingOPtions = [
  { value: "oldgrowing", label: "OLD GROWING" ,start:"1",end:"42"},
  { value: "newgrowing", label: "NEW GROWING" ,start:"43",end:"61"},
  { value: "realgrowing", label: "REAL GROWING",start:"62",end:"91" },
  { value: "real2", label: "REAL-2",start:"92",end:"104" }
];
useEffect(() => {
      showLoader("Please wait...");
      onReportsListLoad();
    }, [empCurrSize]);

var onReportsListLoad = () =>{
    console.log("onReportsListLoad called !!!");
    
      // FetchReportsList(
      //      {
      //       success: (res) => {
      //         console.log(res)
      //         PopulateReportsData(res);
      //       },
      //       error: (err) => {
      //         hideLoader();
      //         console.error("Error ->"+err)
      //         showAlert("Failed to fetch Report details", "ok");
      //       },
      //   }

      // )
           FetchReportsListForFilter(
            {
           employee : formData.empName?.value || "",
           roomNo : formData.empRoom?.value || "",
           growing: formData.growing?.value || "",
           startDate : formData.startDate,
           endDate : formData.endDate,
           page:empCurrPage,
           size:empCurrSize
            },
           {
            success: (res) => {
              console.log(res)
              PopulateReportsData(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              if(err.hasOwnProperty("message")){
                setweightDetails([]);
                PopulateReportsData([]);
                 showAlert(JSON.parse(err.message).message, "ok");
              }else{
              showAlert("Failed to fetch Report details", "ok");
              }
            },
        }

      )

}

var onClickFilter = () =>{
    console.log("onClickFilter called !!!");
    console.log(formData)
    var isEmpty = Object.values(formData).some(v => typeof v === "string" ? v.trim() : v?.value);
    if(!isEmpty){
         showAlert("Please select any filter values", "ok");
         return false;
    }
    else{
          setweightDetails([]);
          onReportsListLoad();

    }
}

var PopulateReportsData = (res) =>{
  console.log("inside PopulateReportsData");
  if(res.hasOwnProperty("code")){
     var code = res.code;
     if(code === "0"){
         
          var data = res.data;
          if(!data.length == 0) {
             var data_1 = data[0];
             var filterempData = [];
             if(data_1.hasOwnProperty("Employee")){
                 var empDatalen = data_1.Employee.length;
              for ( var i = 0 ; i < empDatalen ; i++){
                        var empData = data_1.Employee[i];
                        var obj = {};
                        obj.empId = empData
                        filterempData.push(obj);
                      }
               var unique = filterempData.filter(
                  (obj, index, self) =>
                    index === self.findIndex((o) => o.empId === obj.empId)
                );

setempNamefilterValues(unique);
             }

             if(data_1.hasOwnProperty("Weight")){
              if(data_1.Weight.hasOwnProperty("content")){
                var content = data_1.Weight.content;
                if(content.length>0){
                  var content_data = content;
                  setweightDetails(content_data);          
                  var filterRoomData = [];
              var pageDtls = data_1.Weight;
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

                  if(empRoomfilterValues.length === 0){
                    var roomDatalen = data_1.EmpAndroomName.length;
                    for ( var i = 0 ; i < roomDatalen ; i++){
                        var roomData = data_1.EmpAndroomName[i];                     
                        filterRoomData.push(roomData);
                      }
                      filterRoomData = [...new Set(filterRoomData)];
                      setempRoomfilterValues(filterRoomData);
                      setfilterOptionsforEmpRoom( filterRoomData.map((data) => ({
                              value:data,
                              label:data
                          
                      })));
                      var filteredOldGrowingRooms = filterRoomData.map(Number).filter((num) => num >= 1 && num <= 42);
                      var filteredNewGrowingRooms = filterRoomData.map(Number).filter((num) => num >= 43 && num <= 61);
                      var filteredRealGrowingRooms = filterRoomData.map(Number).filter((num) => num >= 62 && num <= 91);
                      var filteredReal2Rooms = filterRoomData.map(Number).filter((num) => num >= 92 && num <= 104);
                      setempRoomfilterValuesOLDGROWING(filteredOldGrowingRooms)
                      setempRoomfilterValuesNEWGROWING(filteredNewGrowingRooms)
                      setempRoomfilterValuesREALGROWING(filteredRealGrowingRooms)
                      setempRoomfilterValuesREAL2(filteredReal2Rooms)
                  }
                 }
                }
             }
             hideLoader();
          }else{
              hideLoader();
              showAlert("No Records Found !!!.");            
          }
     } else if(code === "1"){
      hideLoader();
                setweightDetails([]);
                PopulateReportsData([]);
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
var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    setActivePage("dashboard");
    navigate("/"+tabName);
    hideLoader();

}

  var filterOptionsforEmpName = empNamefilterValues.map((data) => ({
          value:data.empId,
          label:data.empId
      
  }));



const handleSelectChange = (selectedOption, name) => {
  setFormData(prev => ({
    ...prev,
    [name]: selectedOption
  }));

  if(name == "growing"){
    filterOptionsforEmpRoom = {};
    if(selectedOption != null){
      setFormData(prev => ({
    ...prev,
    ["empRoom"]: ""
  }));
    if(selectedOption.value === "oldgrowing"){
        setfilterOptionsforEmpRoom( empRoomfilterValuesOLDGROWING.map((data) => ({
                  value:data,
                  label:data
              
          })))
    }else if(selectedOption.value === "newgrowing"){
        setfilterOptionsforEmpRoom( empRoomfilterValuesNEWGROWING.map((data) => ({
                  value:data,
                  label:data
              
          })))
    }else if(selectedOption.value === "realgrowing"){
        setfilterOptionsforEmpRoom( empRoomfilterValuesREALGROWING.map((data) => ({
                  value:data,
                  label:data
              
          })))
    }else if(selectedOption.value === "real2"){
        setfilterOptionsforEmpRoom( empRoomfilterValuesREAL2.map((data) => ({
                  value:data,
                  label:data
              
          })))
    }else{
         setfilterOptionsforEmpRoom( empRoomfilterValues.map((data) => ({
                  value:data,
                  label:data
              
          })))     
    }
  }else{
         setfilterOptionsforEmpRoom( empRoomfilterValues.map((data) => ({
                  value:data,
                  label:data
              
          })))     
    }

  }
  console.log(filterOptionsforEmpRoom)
};

var handleInputDateChange = (e) =>{
  var {name , value} = e.target;
  setFormData(prev  =>({
    ...prev,
    [name] : value
  }))
}

var downloadPDF = () =>{
      console.log("downloadPDF called !!!");
      showLoader("Please wait...");
      GrowingAspdf(
         {
           employee : formData.empName?.value || "",
           roomNo : formData.empRoom?.value || "",
           growing:formData.growing?.value || "",
           startDate : formData.startDate,
           endDate : formData.endDate,
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
                  var fileName = `GROWING - ${empId}_${startDate}_to_${endDate}.pdf`;
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

var downloadPdf = (pdfUrl,name) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = name 
  document.body.appendChild(link); 
  link.click();                    
  document.body.removeChild(link); 
};

var downloadExcel = () =>{
      console.log("downloadPDF called !!!");
      showLoader("Please wait...");
      GrowingAsExcel(
         {
           employee : formData.empName?.value || "",
           roomNo : formData.empRoom?.value || "",
           growing:formData.growing?.value || "",
           startDate : formData.startDate,
           endDate : formData.endDate,
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
var onClickNext = () => {
  
    showLoader("Please wait...");
    setEmpCurrPage(prev => prev + 1);
};

var onClickPrev = () => {
    showLoader("Please wait...");
    setEmpCurrPage(prev => (prev > 0 ? prev - 1 : 0));

};
var onclicklogout = () =>{
   showLoader("Please wait ...");
    localStorage.clear();
    showAlert("Logged out successfully !!!."); 
    hideLoader();
   navigate("/");
   
}
     return (
<div className="layout-wrapper">
    
        <Sidebar
        activePage="reports"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />

      <div className="layout-page">
         <div className="right-panel-centerrep">
            <div className="report-card">
                <div class="form-group-box">
                    <div class="form-group">
                        <label>Employee Code</label>
                          <Select
                            className={`filter-select-wrapper ${errors.empCode ? "error-input" : ""}`}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "empName")
                            }
                            value={formData.empCode}
                            name="empCode"
                            classNamePrefix="filter-select"
                            options={filterOptionsforEmpName}
                            placeholder="Employee Code"
                            maxMenuHeight={200}
                            isClearable
                          />

                        </div>

                        
                      <div class="form-group"> 
                        <label>Growing</label>
                        <Select  className={`filter-select-wrapper ${errors.growing ? "error-input" : ""}`} disabled  
                          onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "growing")
                            }
                            value={formData.growing} 
                            name="empRoom"
                            classNamePrefix="filter-select" 
                            options={growingOPtions}
                            placeholder="Growing" 
                            maxMenuHeight={200}
                            isClearable
                            />

                    </div>

                      <div class="form-group"> 
                        <label>Room Name</label>
                        <Select  className={`filter-select-wrapper ${errors.empRoom ? "error-input" : ""}`} disabled  
                          onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, "empRoom")
                            }
                            value={formData.empRoom} 
                            name="empRoom"
                        classNamePrefix="filter-select" 
                        options={filterOptionsforEmpRoom}
                            placeholder="Room Name" maxMenuHeight={200}
                            isClearable/>

                    </div>



                        <div className="form-group">
                            <label>
                            Date From 
                            </label>
                            <input
                            type="datetime-local"
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
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputDateChange}
                            />
                        </div>


              </div>


              <div className="dashboard-save-btn-div">
                 <button type = "button" className="btn-primary btn-tiny" onClick={onClickFilter}>Filter</button>
              </div>

              <div className="dashboard-export-btn-div">
                 <button type = "button" className="btn-primary-excel btn-tiny-export" onClick={downloadExcel}>Export to Excel</button>
                 <button type = "button" className="btn-primary-pdf btn-tiny-export" onClick={downloadPDF}>Export to PDF</button>
                                   <select
                    className="limit-select-report"
                    value={limit}
                    onChange={(e) => {setLimit(e.target.value),setEmpCurrPage(0);setEmpCurrSize(e.target.value)}}
                  >
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
              </div>


                            <div className="report-arrow-div">
                              <p className="arrow-p">
                                {arrowstart} <span className="arrspan">-</span> {arrowend}{" "}
                                <span className="arrspan">of</span> {arrowfull}
                              </p>

                              <div>
                                <span onClick={onClickPrev} className={`arrow-btn ${isPrev ? "" : "Prev-hide"}`}>&#9664;</span>
                                <span onClick={onClickNext} className={`arrow-btn ${isNext ? "" : "Next-hide"}`}>&#9654;</span>
                              </div>
                            </div>

                <div className="report-table-wrapper">
                    {/* HEADER TABLE */}
                    <table className="report-employee-table report-header-table">
                      <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                      </colgroup>
                      <thead className="report-table-thead">
                        <tr>
                          <th>Employee ID</th>
                          <th>Room No</th>
                          <th>Weight</th>
                          <th>Harvesting Date</th>                         
                        </tr>
                      </thead>
                    </table>

                    {/* BODY TABLE */}
                    <div className="report-tbody-scroll">
                      <table className="report-employee-table report-body-table">
                        <colgroup>
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                        </colgroup>

                        <tbody>
                          {weightDetails.length > 0 ? (
                            weightDetails.map((emp, index) => (
                              <tr key={emp.empId}>
                                <td>{emp.empId}</td>
                                <td>{emp.roomNo}</td>
                                <td>{emp.weight}</td>
                                <td>{emp.timestamp}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="no-records">
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
       </div>

       </div> 

     )};