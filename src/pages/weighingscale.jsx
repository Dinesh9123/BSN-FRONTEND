import HRMLogo from "../assets/HRM-logo.svg";
import { useState,useRef } from "react";
import { SaveWeightData ,FetchEmployeeList,GetAutoWeightFromComService,GetEmpByID} from "../common/apiService.jsx";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/weighingscale.css"
import Select from "react-select";
import Sidebar from "../components/Sidebar.jsx"





export default function WeighingScale() {





var { showLoader, hideLoader } = useLoader();
var [activePage, setActivePage] = useState("weighingscale");
var [headerTitle, setHeaderTitle] = useState("Weighing Scale System");
var navigate = useNavigate();
var [filterValues,setfilterValues] = useState([]);
var [employeeDetails,setEmployeeDetails] = useState([]);
var [weight, setWeight] = useState("0.0");
var [formData, setFormData] = useState({ empId: "",empName: "", empRoom: ""});
var [formDatabar, setFormDatabar] = useState({ empId: "",empName: "", empRoom: "",gender:"",grade:""});
var [errors, setErrors] = useState({});
var [mode,setMode] = useState("auto");
var [isPolling, setIsPolling] = useState(true);
var [barcode, setBarcode] = useState("");
var [showProfileMenu, setShowProfileMenu] = useState(false);
var [scannedValue, setScannedValue] = useState(false);
var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");

  var portRef = useRef(null);
  var readerRef = useRef(null);
  var keepReadingRef = useRef(false);
  var modeRef = useRef("auto");
  var inputRef = useRef();

useEffect(() => {
  modeRef.current = mode;
}, [mode]);

var today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});





useEffect(() => {
      showLoader("Please wait...");
      onEmployeeListLoad();
    }, []);

useEffect(() => {
  if (!isPolling) return;
       checkConnectedPort();
 
}, [isPolling]);
useEffect(() => {
  return () => {
    keepReadingRef.current = false;

    if (readerRef.current) {
      try {
        readerRef.current.releaseLock();
      } catch (e) {}
    }
  };
}, []);

  // CONNECT SCALE
const connectScale = async () => {
  try {
     setWeight("0.0")
     setScannedValue("0.000")
    await disconnectPort();

    const port = await navigator.serial.requestPort();
    portRef.current = port;

    await port.open({ baudRate: 9600 });

    readSerial();
    showAlert("Port connected successfully !!!.");

  } catch (err) {
    console.error("Serial error:", err);
    if(err.message === "Failed to execute 'open' on 'SerialPort': Failed to open serial port."){
      showAlert("Please verify that the selected port is available and not being used by another process. Port connection failed . !!!",'ok');
      
    }else  if (err.message.includes("The port is already open.")) {
        showAlert("Port connected successfully !!!.");
        readSerial();
      } 
  }
};

const getLatestWeight = (latestWeight) => {
const pattern = /(\d+\.\d{3})/g;
  const matches = latestWeight.match(pattern);

  let weight = "";
  if (matches && matches.length > 0) {
    weight = matches[matches.length - 1]; // last match
  }

  return weight;
};
// READ SERIAL DATA
const readSerial = async () => {

  const port = portRef.current;

  if (!port || !port.readable) return;

  keepReadingRef.current = true;
  var decoder = new TextDecoder();

var reader = port.readable.getReader();
readerRef.current = reader;


  readerRef.current = reader;

  let buffer = "";

  try {

    while (keepReadingRef.current) {

      const { value, done } = await reader.read();
      if (done) break;

      if (value) {

        // ✅ FIX 1: use streaming decode
        let text = decoder.decode(value, { stream: true });

        // ✅ append raw text first
        buffer += text;

        // ✅ FIX 2: extract weight from buffer (not chunk)
        let extracted = getLatestWeight(buffer);

        if (extracted && extracted !== "") {

          console.log("text --> " + extracted);

          let weight = extracted.trim();

          // ✅ avoid unnecessary re-renders
          if (scannedValue !== weight) {
            setScannedValue(weight);

            if (modeRef.current === "auto") {
              setWeight(weight);
            }
          }

          // ✅ clear buffer after successful read
          buffer = "";
        }
      }
    }

  } catch (error) {
    console.error("Read error:", error);
  } finally {

    try {
      if (readerRef.current) {
        readerRef.current.releaseLock();
      }
    } catch (e) {}

    readerRef.current = null;
  }
};


// DISCONNECT SCALE
const disconnectPort = async () => {
  try {

    keepReadingRef.current = false;

    const reader = readerRef.current;

    if (reader) {

      try {
        await reader.cancel();
      } catch (e) {}

      try {
        reader.releaseLock();
      } catch (e) {}

      readerRef.current = null;
    }

    if (portRef.current) {

      try {
        await portRef.current.close();
      } catch (e) {}

      portRef.current = null;
    }

    console.log("Port closed successfully");

  } catch (error) {
    console.error("Error closing port:", error);
  }
};


// CHECK AUTHORIZED PORT
const checkConnectedPort = async () => {
  try {

    const ports = await navigator.serial.getPorts();

    if (ports.length === 0) {
      console.log("No authorized ports");
      showAlert("Scale is not connected to the system.Please click Connect Scale button to select scale.", "ok");
      return;
    }

    const port = ports[0];
    // setcurrentPortl(port);
    portRef.current = port;
    setScannedValue(0.000)

    console.log("Authorized port found:", port);

    try {

      await port.open({ baudRate: 9600 });

      console.log("Port opened successfully");

      readSerial();

    } catch (err) {
      readSerial();
      console.error("Port open failed:", err);
      
      if (err.message ==="Failed to open serial port") {
        showAlert("Scale is not connected to the system.Please click Connect Scale button to select scale.", "ok");
      } 
      else  if (err.message === "Failed to execute 'open' on 'SerialPort': The port is already open.") {
        console.log("Port already open");
        readSerial();
      } 
      else  if (err.message === "Failed to execute 'open' on 'SerialPort': Failed to open serial port.") {
         showAlert("Scale is not connected to the system.Please click Connect Scale button to select scale.", "ok");
          readSerial();
      }
      else {
        console.log("Error opening port: " + err.message);
      }

    }

  } catch (error) {
    console.error("Serial API error:", error);
  }
};
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
             setfilterValues(data);
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


 const handleKeyDown = (e) => {
if (e.key === "Enter") {
    try {
      const value = inputRef.current.value;

      console.log("Scanned:", value);

      inputRef.current.value = ""; 
         GetEmpByID( 
              {
                empId: value
              },
              {
                success: (res) => {
                   setBarcode("");
                    if(res.hasOwnProperty("code")){
                        var code = res.code;
                        if(code === "0"){
                          var data = res.data;
                          if(data.length > 0){
                            setFormDatabar(data[0]);
                            var emp ={}
                            emp.label = data[0].empId;
                            emp.value = data[0].empId;
                            onchangeEmpID(emp);
                            handleSelectChange(emp,"empId");
                            
                            console.log("formDatabar  ->"+formDatabar)
                          } else{
                            hideLoader();
                          showAlert(res.message, "ok");
                          }  
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
                   setBarcode("");
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

}
var onchangeEmpID = (empID) =>{
    console.log(empID)
    var value = empID.value;
    employeeDetails.map((data) =>{
        var dataEmpID = data.empId;
        setFormDatabar(data);
        if(dataEmpID === value){
            setFormData({empName : data.empName,empId : data.empId})
        }
    })
}
  var validateForm = () => {
    let t = {};
    if (!formData.empId) t.empId = true;
    if (!formData.empName) t.empName = true;
    if (!formData.empRoom) t.empRoom = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };

    var handleChange = (e) => {
    var { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
  };

  const handleSelectChange = (selectedOption, name) => {
  setFormData((prev) => ({
    ...prev,
    [name]: selectedOption ? selectedOption.value : "",
     empRoom: ""
  }));
    setErrors((prevErrors) => {
    const updatedErrors = { ...prevErrors };
    delete updatedErrors[name]; 
    delete updatedErrors["empName"] 
    return updatedErrors;
  });
  
};


var onclickSavebtn = () =>{
    if (!validateForm()) return;

    showLoader("Please wait...");
    SaveWeightData(
      {
        empId: (formData.empId).toString(),
        weight: weight,
        roomNo: formData.empRoom,
        timestamp: new Date().toISOString().slice(0, 23)
      },
      {
        success: (res) => {
             if(res.hasOwnProperty("code")){
                var code = res.code;
                if(code === "0"){
                      showAlert("Weight saved successfully !!!."); 
                      onEmployeeListLoad();  
                      setFormDatabar({ empId: "",empName: "", empRoom: "",gender:"",grade:""});
                      setBarcode("")   
                      setFormData({ empId: "",empName: "", empRoom: "",empGender:"",empGender:""});   
                      setWeight("0.0")   
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
    );
}
var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    setActivePage("dashboard");
    navigate("/"+tabName);
    hideLoader();
}
var onclicklogout = () =>{
   showLoader("Please wait ...");
    localStorage.clear();
    showAlert("Logged out successfully !!!."); 
    hideLoader();
   navigate("/");
   
}
  var filterOptionsforEmpCode = filterValues.map((data) => ({
          value:data.empId,
          label:data.empId
      
  }));


  var SetManualMode = () =>{
    setIsPolling(false);
    setMode("manual");
    setScannedValue("0.0");
    setFormData([]);
    setWeight("0.0");
    setFormDatabar({ empId: "",empName: "", empRoom: "",gender:"",grade:""});
    setBarcode("")
   setFormData(prev => ({
        ...prev,
        empName: ""
      }));
    setErrors({});

  }
    var SetAutoMode = () =>{
      setIsPolling(true);
    setMode("auto");
    setWeight("0.0")
    setScannedValue("0.0");
     setFormData([]);
     setFormDatabar({ empId: "",empName: "", empRoom: "",gender:"",grade:""});
     setBarcode("")
   setFormData(prev => ({
        ...prev,
        empName: ""
      }));
      setErrors({});


  }


var onchangebarcode = (e) => {

  // ignore key repeat
  if (e.nativeEvent && e.nativeEvent.data && e.nativeEvent.inputType === "insertText") {
    if (barcode === e.target.value) return;
  }

  setBarcode(e.target.value);
};
    return (
<div className="layout-wrapper">
      
      <Sidebar
        activePage="weighingscale"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />

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

        


        <div className="right-panel-center"> 





      <div className="weighing-card">  

        <div className="panel-toggle-wrapper">


          <button
            type="button"
            className={`panel-toggle-btn ${mode === "auto" ? "active-right" : ""}`}
            onClick={() => SetAutoMode()}
          >
            Auto
          </button>
          <button
            type="button"
            className={`panel-toggle-btn ${mode === "manual" ? "active-left" : ""}`}
            onClick={() => SetManualMode()}
          >
            Manual
          </button>

        </div>

        
        <div className="weight-display">
          <span>Current Weight : </span>
          <span className="weight">
           <div className="input-weight-div"> <input
                  type="number"
                  className="weight-input"
                  value={weight}
                  disabled={mode === "auto"}
                  onChange={(e) => setWeight(e.target.value)}
                /> <span>kg</span></div>
              
          </span>
        </div>

          <div class="form-group-box1">
            <div class="form-groupbar">
                <input
                  className="input-half-widthbar"
                  type="text"
                  placeholder="Scan barcode..."
                  ref={inputRef}
                  hidden={mode === "manual"}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
            </div>
            <div class="form-grouptoday">
                <input disabled value ={today} 
                className={`input-half-widthtoday`} 
                
                type="text" />
            </div>
            <div>

              <button onClick={connectScale}
               className="connect-scale-btn" 
               hidden = {mode === "manual"}
               >
                  Connect Scale
                </button>             
            </div>
          </div>

        {false && (<div className="right-panel-center1">

                <div className="row">
                  <div className="field">
                    <label>Employee ID : </label>
                    <input type="text" value={formDatabar.empId} />
                  </div>

                  <div className="field">
                    <label>Name : </label>
                    <input type="text" value={formDatabar.empName} />
                  </div>

                  <div className="field">
                    <label>Gender : </label>
                    <input type="text" value={formDatabar.gender} />
                  </div>
                </div>

                <div className="single-row">
                  <div className="field">
                    <label>Grade : </label>
                    <input type="text" value={formDatabar.grade}/>
                  </div>
                </div>

      </div>
)}


<div className="right-panel-centersave">

          <div className="weighing-form">
          <div class="form-group-box">
            <div class="form-group">
                 <label>Employee ID<span class="required">*</span></label>
                 <Select  className={`filter-select-wrapper ${errors.empId ? "error-input" : ""}`}   
                   isDisabled={mode === "auto"}
                   onChange={(selectedOption) => {
                    onchangeEmpID(selectedOption);
                    handleSelectChange(selectedOption,"empId");
                    }}
                    value={
                            filterOptionsforEmpCode.find(
                            (opt) => opt.value === formData.empId
                            ) || null
                        }
                   name="empId"
                   classNamePrefix="filter-select" 
                   options={filterOptionsforEmpCode}
                    placeholder="Employee ID" maxMenuHeight={200}/>
            </div>    
            <div class="form-group">
                <label>Employee Name<span class="required">*</span></label>
                <input disabled  className={errors.empName ? "error-input" : ""} 
                value={formData.empName}
                onChange={handleChange}
                 name="empName"/>
            </div>
          </div>
          <div class="form-group-box"> 
            <div class="form-group">
                <label>Room No<span className = "roomno-label"class="required">*</span></label>
                <input  className={`input-half-width  ${errors.empRoom ? "error-input" : ""}`} 
                value={formData.empRoom} 
                onChange={handleChange}
                name="empRoom"/>
            </div>
          </div>
           <div className="dashboard-save-btn-div">
             <button type = "button" onClick = {onclickSavebtn} className="btn-primary btn-tiny" >Save</button>
           </div>
        </div>
</div>




      </div>
    </div>
      </div>
    </div>


    )}