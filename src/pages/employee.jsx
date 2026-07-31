import "../css/employee.css";
import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { createEmployee ,FetchAllEmployeeBatchList,updateEmployeeApi,DeleteEmployeeList,GetEmpBySearchID} from "../common/apiService.jsx";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import indiaData from "../data/CountryStateDistrict.js"
import Sidebar from "../components/Sidebar.jsx"

export default function Employee() {

  
  var nonMan = ["pan","bloodGroup","dateofLeft","dateofRejoin","foodAllowed","addressLine1",
    "addressLine2","country","state","district","townCity","primaryContactNumber",
    "secondaryContactNumber","email","postalCode"];
  var { showLoader, hideLoader } = useLoader();
  const [headerTitle, setHeaderTitle] = useState("Employee");
  var navigate = useNavigate();
  var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");

  var [activePage, setActivePage] = useState("employee-list");
  var [limit, setLimit] = useState(7);
  var [errors, setErrors] = useState({});
  var [employeeDetails,setEmployeeDetails] = useState([]);
  var [filterValues,setfilterValues] = useState([]);
  var [departmentfilterValues,setDepartmentfilterValues] = useState([]);
  var [designationfilterValues,setDesignationfilterValues] = useState([]);
  var [editbtn,setEditbtn] = useState(false);
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
  var [showProfileMenu, setShowProfileMenu] = useState(false);
  var [category,setCategory] = useState("Import");

  var [passportFile, setPassportFile] = useState(Date.now());
  var [previewUrl, setPreviewUrl] = useState(null);
  var [districtOptions, setDistrictOptions] = useState([]);
  var [stateOptions, setStateOptions] = useState([]);
  var [showModal, setShowModal] = useState(false);
  var [fullTimeWorkHours, setFullTimeWorkHours] = useState(0);
  var [isFromEdit,setIsFromEdit] = useState(false);

  var [departmentOpt , setDepartmentOpt] = useState({});
  var [designationOpt , setDesignationOpt] = useState({});
  var [configObj , setConfigObj] = useState({});



var salaryTypeOptions = [
  {value: "Monthly", label: "Monthly"},
  {value: "Weekly", label: "Weekly"}
]
var genderOptions = [
  { value: "Male", label: "Male"},
  { value: "Female", label: "Female"},
  { value: "Transgender", label: "Transgender"}
];

var maritalStatusOptions = [
  { value: "Unmarried", label: "Unmarried"},
  { value: "Married", label: "Married"}
];

var yesNoOptions = [
  {value: "Yes", label: "Yes"},
  {value: "No", label: "No"}
]


var categoryOptions = [
  {value: "Staff", label: "Staff"},
  {value: "Worker", label: "Worker"},
  {value: "Driver", label: "Driver"},
  {value: "Security", label: "Security"}
]
var bloodGroupOptions = [
  { value: "O Positive", label: "O Positive"},
  { value: "A Positive", label: "A Positive"},
  { value: "A Negetive", label: "A Negetive"},
  { value: "B Positive", label: "B Positive"},
  { value: "B Negetive", label: "B Negetive"},
  { value: "AB Positive", label: "AB Positive"},
  { value: "AB Negetive", label: "AB Negetive"}
];


var countryOptions = [
  {value: "INDIA", label: "INDIA"}
]

var getTodayDate = () => {
  var today = new Date();
  return today.toISOString().split("T")[0];
};
var wageTypeOptions = [
  {value: "Shift", label: "Shift"},
  {value: "Contract", label: "Contract"},
  {value: "Pieces", label: "Pieces"}
]
var [formValues, setformValues] = useState({
        employeeDetails:{
              empId:"",
              empName:"",
              category:"",
              birthDate:"",
              age:"",
              gender:"",
              bloodGroup:"",
              fatherName:"",
              passportSizePhoto:"",
              dateOfJoinning:"",
              department:"",
              designation:"",
              salaryType:"",
              dateofLeft:"",
              dateofRejoin:"",
              foodAllowed:"",
              wageType:"",
              maritalStatus:"",
              aadhar:"",
              pan:""
            },            
        basicInformation:{
              salaryStaff:"",
              oTAmount:"",
              salaryWorker:"",
              basic:"",
              hRA:"",
              incentive:"",
              netSalary:"",
              effectivefrom:""
        },
        contactInformation:{
              addressLine1:"",
              addressLine2:"",
              country:"",
              state:"",
              district:"",
              townCity:"",
              primaryContactNumber:"",
              secondaryContactNumber:"",
              email:"",
              postalCode:""
        }
});



useEffect(() => {
  if(isSearchEmpEnabled) return;
  showLoader("Please wait...");
  onEmployeeListLoad();
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
             GetEmpBySearchID( 
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
    setActivePage("dashboard");
    navigate("/"+tabName);
    hideLoader();
    

}

  var filterOptionsforEmpCode = filterValues.map((data) => ({
          value:data.empId,
          label:data.empId
      
  }));



var filterOptionsForEmpGender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" }
];


var filterOptionsForEmpGrade = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" }
];

var getMimeType = (base64) => {
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  return "image/jpeg"; // default
};
  var onEdit =(emp) => {
    
      showLoader("Please wait ...!");
      setIsFromEdit(true)
     var currEmpDetails = emp;
     setTimeout(() => {
      console.log(currEmpDetails);
      setformValues(currEmpDetails);
      var base64 = currEmpDetails.employeeDetails.passportSizePhoto;
      setPreviewUrl(base64);
      removeErrorIndication();
 var seen = new Set();
      var selectedOption = currEmpDetails.employeeDetails.category;
      filterOptionsforDepartmnet = departmentfilterValues
              .filter((data) => data?.category?.toLowerCase() === selectedOption.value.toLowerCase())
              .filter((data) => {
                  const name = data?.departmentname?.toLowerCase();
                  if (seen.has(name)) return false;
                  seen.add(name);
                  return true;
              })
              .map((data) => ({
                  value: data.departmentname,
                  label: data.departmentname
              }));
              setDepartmentOpt(filterOptionsforDepartmnet)
              console.log(departmentOpt)
            if(selectedOption.value.toLowerCase() === "staff"){
              filterOptionsforDesignation = departmentfilterValues
              .filter((data) => data?.category?.toLowerCase() === selectedOption.value.toLowerCase())
              .map((data) => ({
                        value:data.designation,
                        label:data.designation
                    
                }));
             }else{
                filterOptionsforDesignation = designationfilterValues.map((data) => ({
                          value:data.code,
                          label:data.code
                      
                  }));
             }
             setDesignationOpt(filterOptionsforDesignation)

        var country = currEmpDetails.contactInformation.country;

          if (country?.value === "INDIA") {
            var stateOptions = indiaData.map(item => ({
              label: item.state.toUpperCase(),
              value: item.state.toUpperCase()
            }));

            setStateOptions(stateOptions);
          } else {
            setStateOptions([]);
          }

          var selectedState = currEmpDetails.contactInformation.state;
     if (country?.value === "INDIA" && selectedState != "" && selectedState != null) {
           districtOptions =
              indiaData
                .find(item => item.state.toUpperCase() === selectedState?.value)
                ?.districts.map(d => ({
                  label: d.toUpperCase(),
                  value: d.toUpperCase()
                })) || [];

                setDistrictOptions(districtOptions);
              }          
     
      setEditbtn(true);
      setHeaderTitle("Employee Create")
      setActivePage("employee-add");
      hideLoader();
      },50);

  }

  var onDelete = (emp) =>{
    showConfirm("Are you sure you want to delete the employee - " + emp.employeeDetails.empName +" ?.", () => deleteEmployee(emp));
      hideLoader();
       
  }

  var deleteEmployee =(emp) =>{
    setEmpCurrPage(0);
    setEmpCurrSize(limit);
    console.log("Delete empl");
     showLoader("Please wait ...!");
        DeleteEmployeeList(
          {
           empId: emp.employeeDetails.empId,
          },
           {
            success: (res) => {
              if(res.hasOwnProperty("code")){
                    var code = res.code;
                    if(code === "0"){
                          setEmpsearchID("")
                          setIsSearchEmpEnabled(false)      
                          setReloadFlag(prev => !prev);
                          hideLoader();
                           onEmployeeListLoad();
                          showAlert("Employee deleted successfully !! ", "ok");
                      }else if(code === "1"){
                              hideLoader();
                              showAlert("Deletion Failed - "+res.message);            
                          }
                    }else{
                      hideLoader();
                      showAlert("Somthing went wrong , Please contact administration !!!.");      
                    }
              
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to failed employee ", "ok");


            },
        }

      )
     hideLoader(); 


  }



  var handleChange = (e) => {
    var { name, value } = e.target;
    setErrors((prev) => {
      var t = { ...prev };
      delete t[name];
      return t;
    });
  };

  // var validateForm = () => {
  //   let t = {};
  //   if (!formData.empId) t.empId = true;
  //   if (!formData.empName) t.empName = true;
  //   if (!formData.gender) t.gender = true;
  //   if (!formData.grade) t.grade = true;
  //   if (!formData.department) t.department = true;
  //   if (!formData.designation) t.designation = true;
  //    if (!formData.aadhaarNo) t.aadhaarNo = true;
  //   setErrors(t);
  //   return Object.keys(t).length === 0;
  // };

var onEmployeeListLoad = () =>{
    console.log("onEmployeeListLoad called !!!");
    
      FetchAllEmployeeBatchList(
            {
               page:empCurrPage,
               size:empCurrSize
            },
           {
            success: (res) => {
              setActivePage("employee-list");
              	 
              console.log(res)
              PopulateEmployeData(res);
            },
            error: (err) => {
              hideLoader();
              console.error("Error ->"+err)
              showAlert("Failed to fetch employee list", "ok");

              // showAlert({ type: "confirm",message: "Are you sure?", onConfirm: () => deleteEmployee(),});
              // showAlert({type: "auto", message: "Saved successfully",});


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
          if(data[0].length > 0){
             if(data[0][0].hasOwnProperty("employeeDetails")){      
                var _data = data[0][0].employeeDetails;
                if(_data.hasOwnProperty("content")){
                  var content = _data.content;
                  
                  setfilterValues(content);
                  
                }
                  var pageDtls = _data;
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

                 var employeeDetailsArr =  data[0][0].employeeDetails.content;
                 var basicInformationArr = data[0][0].basicInformation;
                 var contactArr = data[0][0].contactInformation;
                 setFullTimeWorkHours(data[0][0].fullTimeWorkHours)
                 setConfigObj(JSON.parse(data[0][0].configObj));
                 var fullDetails = []
                 
                   try{
       var dropDownlist = ["gender","maritalStatus","category","department","designation",
       "bloodGroup","country","state","district","salaryType","foodAllowed","wageType"]
                employeeDetailsArr.forEach((eDitem, index) => {
                  var EmpId = eDitem.empId;
                  var Obj = {};
                 employeeDetailsArr.forEach((eDIitem, index) => {
                    if(eDIitem.empId === EmpId){
                       Object.keys(eDIitem).forEach(key => { 
                           dropDownlist.forEach((item, index) => {
                            if(key === item){
                              if(eDIitem[key] === null || eDIitem[key] === "")
                              {
                                eDIitem[key] = "";
                                Obj["employeeDetails"] = eDIitem
                              }else{
                                var optObj = {}
                                optObj.label = eDIitem[key]
                                optObj.value = eDIitem[key];
                                eDIitem[key] = optObj;
                                }
                                Obj["employeeDetails"] = eDIitem
                              }
                          });
                        });
                       
                    }
                   }); 

                   basicInformationArr.forEach((bIitem, index) => {
                    if(bIitem.empId === EmpId){
                              Obj["basicInformation"] = bIitem;
                    }
                   });
                 
                  contactArr.forEach((cIitem, index) => {
                    if(cIitem.empId === EmpId){
                       Object.keys(cIitem).forEach(key => { 
                           dropDownlist.forEach((item, index) => {
                            if(key === item){
                             if(cIitem[key] === null || cIitem[key] === "")
                              {
                                cIitem[key] = "";
                                Obj["contactInformation"] = cIitem
                              }else{
                              var optObj = {}
                              optObj.label = cIitem[key]
                              optObj.value = cIitem[key];
                              cIitem[key] = optObj;
                               }
                               Obj["contactInformation"] = cIitem
                              }
                          });
                        });
                       
                    }
                   });                 
                   fullDetails.push(Obj);
                });
              }catch(e){
                    console.error(e);
                  }

     
                console.log(fullDetails)
                setEmployeeDetails(fullDetails);
                 
                hideLoader();
              }else{
                  hideLoader();
                  showAlert("No Records Found !!!.");            
              }
            }
             if(data[0][0].hasOwnProperty("DepartmentReords")){  
                var departmentReords = data[0][0].DepartmentReords;
                setDepartmentfilterValues(departmentReords);
             }
              if(data[0][0].hasOwnProperty("SalaryCode")){  
                var salaryCode = data[0][0].SalaryCode;
                setDesignationfilterValues(salaryCode);
             }            
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


var CreateEmpPanel = () =>{
   showLoader("Please wait ...!");
   console.log(employeeDetails);
   setIsFromEdit(false);
   setPreviewUrl(null)
    setEditbtn(false);
    removeErrorIndication();
    removeFeildExistingData();
   setHeaderTitle("Employee Create")
   setActivePage("employee-add");
   console.log(employeeDetails);
   hideLoader();
}

var EmployeeList = () =>{
  showLoader("Please wait ...!");
  setHeaderTitle("Employee")
  setActivePage("employee-list")
   console.log(employeeDetails);
   hideLoader();
}

var onClickNext = () => {
  
    showLoader("Please wait...");
    setEmpCurrPage(prev => prev + 1);
};

var onClickPrev = () => {
    showLoader("Please wait...");
    setEmpCurrPage(prev => (prev > 0 ? prev - 1 : 0));

};
var validateForm = () => {
  var t = {};   
  var count = 0;
Object.keys(formValues).forEach((tabs) => {
  var m = {};

  Object.keys(formValues[tabs]).forEach((key) => {
    if (!formValues[tabs][key]) {

      if (!nonMan.includes(key)) {
      if (count === 0) {

        let el = null;

        let temp =
          document.querySelector(`[name="${key}"]`) ||
          document.getElementById(key);

        if (temp && temp.type !== "hidden") {
          el = temp;
        }

        if (!el) {
          const labels = document.querySelectorAll("label");

          for (let lbl of labels) {
            if (lbl.innerText.toLowerCase().includes(key.toLowerCase())) {
              const container = lbl.closest(".form-group");
              if (container) {
                el = container.querySelector(".filter-select__control");
              }
              if (el) break;
            }
          }
        }

        if (!el) {
          el = document.querySelector(`[class*="${key}"]`);
        }

        if (el) {

          let parent = el;
          let scrollParent = null;

          while (parent) {
            if (parent.scrollHeight > parent.clientHeight) {
              scrollParent = parent;
              break;
            }
            parent = parent.parentElement;
          }

          if (scrollParent) {
            const parentRect = scrollParent.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            scrollParent.scrollTo({
              top: scrollParent.scrollTop + (elRect.top - parentRect.top) - 100,
              behavior: "smooth"
            });
          } else {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }

          setTimeout(() => {
            if (el.classList && el.classList.contains("filter-select__control")) {
              el.click();
            } else {
              el.focus();
              if (el.type === "date" && el.showPicker) {
                el.showPicker();
              }
            }
          }, 400);

          count = 1;
        }
      }

        m[key] = true;
      }
    }
  });

  t[tabs] = m;
});

 delete t.employeeDetails.grade;
 delete t.employeeDetails.dateofCreation;
  delete t.basicInformation.otamount;
   delete t.basicInformation.hra;
   delete t.employeeDetails.passportSizePhoto 
   delete t.employeeDetails.age 

 if(formValues.employeeDetails.category?.value)
 {
       var category = formValues.employeeDetails.category.value;
       if(category === "Worker"){
          delete t.basicInformation.basic;
          delete t.basicInformation.hRA;
          delete t.basicInformation.incentive;
          delete t.basicInformation.salaryStaff;
          delete t.basicInformation.netSalary;
       }else if(category === "Staff"){
         delete t.basicInformation.salaryWorker;
         delete t.basicInformation.oTAmount;
       }
       var category = formValues.employeeDetails.designation.value;
       if(category === "DRIVER"){
        delete t.basicInformation.hRA;
        delete t.basicInformation.incentive;
       }
 }
 if(formValues.employeeDetails.designation?.value)
 {
   var designation = formValues.employeeDetails.designation.value;
  if(designation === 100){
    delete t.basicInformation.salaryWorker;
    delete t.basicInformation.oTAmount;
  }
 }
  console.log(t);
delete t.employeeDetails.id;
delete t.employeeDetails.isActive;
delete t.basicInformation.empId;
delete t.basicInformation.id;
delete t.contactInformation.empId;
delete t.contactInformation.id;
delete t.basicInformation.effectiveto;
delete t.basicInformation.workerSalaryCode;
delete t.basicInformation.category;
delete t.basicInformation.isActive;
delete t.basicInformation.createdDate;

  setErrors(t);

  var hasTrueValue = (obj) => {
    return Object.values(obj).some(value => {
      if (value && typeof value === "object") {
        return hasTrueValue(value);
      }
      return value === true;
    });
  };

  return !hasTrueValue(t); 
};
 var removeErrorIndication = () => {
    var t = {};   
    Object.keys(formValues).forEach((tabs) =>{  
      var m = {};
       Object.keys(formValues[tabs]).forEach((key) =>{
             m[key] = false;
       })   
       t[tabs] = m;    
    })
   console.log(t);
    setErrors(t);
     console.log(employeeDetails);
    return Object.keys(t).length === 0;
  };
 var removeFeildExistingData = () => {
    var t = {};   
   var newValue = JSON.parse(JSON.stringify(formValues));
    Object.keys(newValue).forEach((tabs) =>{ 
       Object.keys(newValue[tabs]).forEach((key) =>{
        if(key === "oTAllowed"){
          newValue[tabs][key] = false;
        }else{
             newValue[tabs][key] = "";
        }
       })     
    })
   console.log(newValue);
   console.log(employeeDetails);
   setformValues(newValue);
    console.log(employeeDetails);
  };

var fileToBase64 = (file, callback) => {
  if (!file) return callback(null);

  var reader = new FileReader();

  reader.onload = () => callback(reader.result);
  reader.onerror = () => callback(null);

  reader.readAsDataURL(file);
};


  var addEmployee = () => {
    if (!validateForm()) return;

    showLoader("Please wait...");

    
     const headers = ["employeeDetails","contactInformation","basicInformation"];

const data = {};

headers.forEach((section) => {
  const original = formValues[section];

  // 🔥 deep clone to avoid mutating state
  const cloned = JSON.parse(JSON.stringify(original));

  Object.keys(cloned).forEach((key) => {
    const val = cloned[key];

    // convert only react-select objects
    if (val && typeof val === "object" && "value" in val) {
      cloned[key] = val.value;
    }
  });

  data[section] = cloned;
});

// 👉 use `data` for API
console.log("Final Payload:", data);

    
    createEmployee(
      {
        data:data

      },
      {
        success: (res) => {
            if(res.hasOwnProperty("code")){
                var code = res.code;
                if(code === "0"){
                      showAlert("Employee saved successfully !!!."); 
                      setEmpsearchID("")
                      setIsSearchEmpEnabled(false) 
                      setReloadFlag(prev => !prev);
                      setHeaderTitle("Employee")
                      setActivePage("employee-list");
	                    removeFeildExistingData();
                } else if(code === "401"){
                    hideLoader();
                    localStorage.setItem("token", "");
                    showAlert("Invalid Session !!! .", "ok");
                    navigate("/");
                } else if(code === "1"){
                    hideLoader();
                    showAlert(res.message, "ok");
                    console.log(formValues);
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
          showAlert("Failed to add employee");  
        },
      }
    );
  };
var updateEmployee =() =>{
  console.log("inside updateEmployee")
  if (!validateForm()) return;

     showLoader("Please wait...");

    try{
      var headers = ["employeeDetails","contactInformation","basicInformation"]
      var data = {};
      
      for(var i = 0 ; i < headers.length ; i++){
      var t = formValues[headers[i]]
      
      Object.keys(t).forEach((key) => {
        console.log(key)
          if(typeof t[key] === "object" && key != "grade"){
            console.log(t[key]);
            t[key] = t[key]?.value;
          }
      });
      data[headers[i]] = t
    }
  } catch(e){
    console.error(e);
    hideLoader();
  }
    updateEmployeeApi(
      {
          data:data

      },
      {
        success: (res) => {
            if(res.hasOwnProperty("code")){
              var code = res.code;
              if(code === "0"){
                showAlert("Employee updated successfully !!!."); 
                setEmpsearchID("")
                setIsSearchEmpEnabled(false)      
                setReloadFlag(prev => !prev);

                setHeaderTitle("Employee")
                setActivePage("employee-list");
	 
              
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
          showAlert("Failed to update employee");  
        },
      }
    );
}

var onclicklogout = () =>{
   showLoader("Please wait ...");
    localStorage.clear();
    showAlert("Logged out successfully !!!."); 
    hideLoader();
   navigate("/");
   
}
useEffect(() => {
  showLoader("Please wait...");
  setEmpCurrPage(0);
  onEmployeeListLoad();
},[]);


  var filterOptionsforDepartmnet = {}
   var filterOptionsforDesignation = {}

 var calculateAge = (dob) => {
  var birthDate = new Date(dob);
  var today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  // adjust if birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

  var handleInputDateChange = (e,objName) =>{       
        formValues[objName][e.target.name] = e.target.value;
       
        console.log(formValues);

        var name = e.target.name;
        if(name === "birthDate"){
          var value =  e.target.value;
          var age = calculateAge(value);
          console.log(age);
          formValues[objName]["age"] = age;
        }
 setformValues(formValues);
      setErrors((prev) => {
        var t = { ...prev };
        t[objName][e.target.name] = false;
        return t;
      });
      console.log(errors)
  };

var handleInputChange = (e, objName) => {
  var tagName = e.target.name;
  var value = e.target.value;

  setformValues((prev) => {
    var updatedSection = {
      ...prev[objName],
      [tagName]: value
    };

    if (tagName === "salaryStaff") {
      updatedSection["effectivefrom"] = "";
      if(formValues.employeeDetails?.designation?.value === "DRIVER" ){
           updatedSection["netSalary"] = value;
           updatedSection["basic"] = value;
      }else{
          var salaryWorkerVal = parseInt(value) || 0;
          var basic_ = parseFloat(configObj.basic.replace('%', '')) / 100;
          var hra_ = parseFloat(configObj.hra.replace('%', '')) / 100;
          var inc_ = parseFloat(configObj.incentive.replace('%', '')) / 100;
          var basic = (salaryWorkerVal * basic_ ).toFixed(2);
          var hRA = (salaryWorkerVal * hra_).toFixed(2);
          var incentive = (salaryWorkerVal * inc_).toFixed(2);

          updatedSection["basic"] = basic;
          updatedSection["hRA"] = hRA;
          updatedSection["incentive"] = incentive
      }
    }


    if (
      (tagName === "basic" ||
      tagName === "hRA" ||
      tagName === "incentive" ||
      tagName =="salaryStaff" ) && (formValues.employeeDetails?.designation?.value != "DRIVER")
    ) {
      var basic_Val = parseFloat(updatedSection["basic"]) || 0;
      var hRA_Val = parseFloat(updatedSection["hRA"]) || 0;
      var incentive_Val = parseFloat(updatedSection["incentive"]) || 0;

      var netSalary = basic_Val + incentive_Val + hRA_Val;

      updatedSection["netSalary"] = netSalary;
    }

    return {
      ...prev,
      [objName]: updatedSection
    };
  });

  // 👉 Error handling
  setErrors((prev) => {
    var t = { ...prev };

    if (!t[objName]) {
      t[objName] = {};
    }

    t[objName][tagName] = false;

    
console.log(formValues)
    return t;
  });
};


var handleImportfileChange = (e,objName) => {
    var  file = e.target.files[0];
    var fileName = file.name;
     fileToBase64(file, (base64) => {
        console.log(base64);
        formValues[objName][e.target.name] =  base64;
     });
       setPreviewUrl(URL.createObjectURL(file));
        setformValues(formValues);
        console.log(formValues);

      setErrors((prev) => {
        var t = { ...prev };
        t[objName][e.target.name] = false;
        return t;
      });

}
  var handleSelectChange = (selectedOption, tagName,objName) => {
        formValues[objName][tagName] = selectedOption
        if(tagName === "category" && selectedOption != null){
          formValues.employeeDetails.department = ""
          formValues.employeeDetails.designation = ""
          setCategory(selectedOption.value);
          console.log(departmentfilterValues);
          var seen = new Set();

            filterOptionsforDepartmnet = departmentfilterValues
              .filter((data) => data?.category?.toLowerCase() === selectedOption.value.toLowerCase())
              .filter((data) => {
                  const name = data?.departmentname?.toLowerCase();
                  if (seen.has(name)) return false;
                  seen.add(name);
                  return true;
              })
              .map((data) => ({
                  value: data.departmentname,
                  label: data.departmentname
              }));
              setDepartmentOpt(filterOptionsforDepartmnet)
              console.log(departmentOpt)
            if(selectedOption.value.toLowerCase() === "staff"){
              filterOptionsforDesignation = departmentfilterValues
              .filter((data) => data?.category?.toLowerCase() === selectedOption.value.toLowerCase())
              .map((data) => ({
                        value:data.designation,
                        label:data.designation
                    
                }));
             }else{
                filterOptionsforDesignation = designationfilterValues.map((data) => ({
                          value:data.code,
                          label:data.code
                      
                  }));
             }
             setDesignationOpt(filterOptionsforDesignation)
        }
        if(tagName === "designation"){
           if(formValues.employeeDetails?.category?.value.toLowerCase() != "staff"){
            var selectedv = selectedOption.value;
            var result = designationfilterValues.find(item => item.code === selectedv);
            formValues.basicInformation.salaryWorker =  result.amount;
            formValues.basicInformation.effectivefrom = ""; 
            formValues.basicInformation.oTAmount =  (parseFloat(result.amount) / parseFloat(fullTimeWorkHours))||0;
           }
        }
        if (tagName === "country") {

          formValues.contactInformation.state = null;
          formValues.contactInformation.district = null;

          var country = formValues.contactInformation.country;

          if (country?.value === "INDIA") {
            var stateOptions = indiaData.map(item => ({
              label: item.state.toUpperCase(),
              value: item.state.toUpperCase()
            }));

            setStateOptions(stateOptions);
          } else {
            setStateOptions([]);
          }
        }
        if(tagName === "state"){
          setDistrictOptions({})
          formValues.contactInformation.district = "";
           var selectedState = formValues.contactInformation.state;

           districtOptions =
              indiaData
                .find(item => item.state.toUpperCase() === selectedState?.value)
                ?.districts.map(d => ({
                  label: d.toUpperCase(),
                  value: d.toUpperCase()
                })) || [];

                setDistrictOptions(districtOptions);
        }
        console.log(formValues)
        setformValues(formValues);

        setErrors((prev) => {
          var t = { ...prev };
          t[objName][tagName] = false;
          return t;
        });

};

  return (
    <div className="layout-wrapper">
     
   <Sidebar
        activePage="employee-list"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />

   <div className="main-addEmp">
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
        </div>

        {activePage === "employee-list" && (
          <div className="employee-page">
            <div className="employee-card">
              {/*<div className="employee-header">
                <h4>Filter</h4>
                <div className="filter-row">
                  // <select className="filter-select" size={5}>
                   //  <option>Employee code</option>
                   // { filterValues.map((data) =>(
                  //    <option>{data.empId}</option>
                   // ))}
                  </select> 
                  <Select  classNamePrefix="filter-select" className="filter-select-wrapper" options={filterOptionsforEmpCode} placeholder="Employee code" maxMenuHeight={200}/>
                  <Select  classNamePrefix="filter-select" className="filter-select-wrapper" options={filterOptionsForEmpGender} placeholder="Gender" maxMenuHeight={200}/>
                  <Select  classNamePrefix="filter-select" className="filter-select-wrapper" options={filterOptionsForEmpGrade} placeholder="Grade" maxMenuHeight={200}/>
                  
                </div> 
              </div>*/}

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

                  <button className="export-btn">Export</button>

                  <button
                    className="add-btn"
                    onClick={CreateEmpPanel}
                  >
                    <span>+</span> Add Employee
                  </button>
                </div>
              </div>

                            <div className="emp-arrow-div">
                              <p className="arrow-p">
                                {arrowstart} <span className="arrspan">-</span> {arrowend}{" "}
                                <span className="arrspan">of</span> {arrowfull}
                              </p>

                              <div>
                                <span onClick={onClickPrev} className={`arrow-btn ${isPrev ? "" : "Prev-hide"}`}>&#9664;</span>
                                <span onClick={onClickNext} className={`arrow-btn ${isNext ? "" : "Next-hide"}`}>&#9654;</span>
                              </div>
                            </div>

                  <div className="emp-table-wrapper"> 
                    {/* HEADER TABLE */}
                    <table className="employee-table header-table">
                      {/* <colgroup>
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "30%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "21%" }} />
                      </colgroup> */}
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>EMPLOYEE CODE</th>
                          <th>EMPLOYEE NAME</th>
                          <th>GENDER</th>
                          <th>CATEGORY</th>
                          <th>DEPARTMENT</th>
                          <th>DESIGNATION</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                    </table>

                    {/* BODY TABLE */}
                    <div className="tbody-scrollemp">
                      <table className="employee-table body-table">
                        {/* <colgroup>
                          <col style={{ width: "8%" }} />
                          <col style={{ width: "18%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "15%" }} />
                          <col style={{ width: "15%" }} />
                          <col style={{ width: "19%" }} />
                        </colgroup> */}

                        <tbody>
                          {employeeDetails.length > 0 ? (
                            employeeDetails.map((emp, index) => (
                              <tr key={emp.employeeDetails.empId}>
                                <td>{empCurrPage * empCurrSize + index + 1}</td>
                                <td>{emp.employeeDetails.empId}</td>
                                <td>{emp.employeeDetails.empName}</td>
                                <td>{emp.employeeDetails?.gender?.value ? emp.employeeDetails.gender.value : emp.employeeDetails?.gender}</td>
                                <td>{emp.employeeDetails?.category?.value ? emp.employeeDetails.category.value : emp.employeeDetails?.category}</td>
                                <td>{emp.employeeDetails?.department?.value ? emp.employeeDetails.department.value : emp.employeeDetails?.department}</td>
                                <td>{emp.employeeDetails?.designation?.value ? emp.employeeDetails.designation.value : emp.employeeDetails?.designation}</td>
                                <td>
                                  <div className="action-wrapper">
                                    <button
                                      type="button"
                                      className="action-btn edit-btn"
                                      onClick={() => onEdit(emp)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="action-btn delete-btn"
                                      onClick={() => onDelete(emp)}
                                    >
                                      Delete
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
        )}

        {activePage === "employee-add" && (
          <div className="Scroll">
          <div className="right-panel-container-main">
            <div className="form-card">
              <div className="form-header-box-addemp">
                <p>EMPLOYEE INFO</p>
              </div>

    <div className="employee-form_Add">
      <div className="img-frm-left">
          <div className="img-frm-left-sub">
            <div className="form-group-box">
                <div className="form-group">
                  <label>
                  Employee Code<span className="required">*</span>
                  </label>
                  <input
                  name="empId"
                  value={formValues.employeeDetails.empId}
                  placeholder="Employee Code"
                  type="number"
                  disabled={isFromEdit}
                  className={errors.employeeDetails.empId ? "error-input" : ""}
                  onChange={(e) =>
                  handleInputChange(e,"employeeDetails")
                  }
                  />
                </div>
                <div className="form-group">
                  <label>
                  Employee Name<span className="required">*</span>
                  </label>
                  <input
                  name="empName"
                  value={formValues.employeeDetails.empName}
                  placeholder="Employee Name"
                  className={errors.employeeDetails.empName ? "error-input" : ""}
                  onChange={(e) =>
                  handleInputChange(e,"employeeDetails")
                  }
                  />
                </div>
                <div className="form-group">
                  <label>
                  Category<span className="required">*</span>
                  </label>
                  <Select
                  className={`filter-select-wrapper ${errors.employeeDetails.category ? "error-input" : ""}`}
                  value={formValues.employeeDetails.category}
                  name="category"
                  classNamePrefix="filter-select"
                  placeholder="(Category)"
                  isClearable
                  maxMenuHeight={200}
                  options={categoryOptions}
                  onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "category","employeeDetails")
                  }
                  />
                </div>
            </div>
            <div className="form-group-box">
                
                 <div className="form-group">
                    <label>
                    Birth Date<span className="required">*</span> 
                    </label>
                    <input
                    className={`input-half ${errors.employeeDetails.birthDate ? "error-input" : ""}`}
                    type="date"
                    name="birthDate"
                    value={formValues.employeeDetails.birthDate}
                    onChange={(e) =>
                              handleInputDateChange(e,"employeeDetails")
                            }
                    />
                </div>
                <div className="form-group">
                  <label>
                  Age<span className="required">*</span>
                  </label>
                  <input
                  name="age"
                  value={formValues.employeeDetails.age}
                  placeholder="Age"
                   disabled={true}
                  className={errors.employeeDetails.age ? "error-input" : ""}
                  onChange={(e) =>
                  handleInputChange(e,"employeeDetails")
                  }
                  />
                </div>
                <div className="form-group">
                  <label>
                  Gender<span className="required">*</span>
                  </label>
                  <Select
                  className={`filter-select-wrapper ${errors.employeeDetails.gender ? "error-input" : ""}`}
                  value={formValues.employeeDetails.gender}
                  name="gender"
                  classNamePrefix="filter-select"
                  options={genderOptions}
                  placeholder="(Gender)"
                  isClearable
                  maxMenuHeight={200}
                   menuPlacement="top" 
                    menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 })
                  }}  
                  onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "gender","employeeDetails")
                  }
                  />
                </div>

                
            </div>

          <div className="form-group-box">
            <div className="form-group">
                <label>
                Blood Group
                </label>
                <Select
                className={`filter-select-wrapper ${errors.employeeDetails.bloodGroup ? "error-input" : ""}`}
                value={formValues.employeeDetails.bloodGroup}
                name="bloodGroup"
                classNamePrefix="filter-select"
                options={bloodGroupOptions}
                placeholder="(Blood Group)"
                isClearable
                maxMenuHeight={200}
                menuPlacement="top" 
                onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "bloodGroup","employeeDetails")
                }
                />
            </div>
                <div className="form-group">
                    <label>
                    Father Name<span className="required">*</span>
                    </label>
                    <input
                    name="fatherName"
                    value={formValues.employeeDetails.fatherName}
                    placeholder="Father Name"
                    className={errors.employeeDetails.fatherName ? "error-input" : ""}
                    onChange={(e) =>
                    handleInputChange(e,"employeeDetails")
                    }
                    />
                </div>
                <div className="form-group">
                    <label className="passport-custom">
                    Passport Size Photo
                    
                    </label>
                    
                    <input
                    type="file"
                    key={passportFile}
                    isClearable
                    accept=".png,.jpeg"
                    className={`input-half ${errors.employeeDetails.passportSizePhoto ? "error-input" : ""}`}
                    name="passportSizePhoto"
                    onChange={(e) =>
                              handleImportfileChange(e,"employeeDetails")
                            }
                    />
                </div>
            </div>

          </div>
          <div className="img-frm-right">
            <div className="preview-frame">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-img" />
              ) : (
                <span className="no-preview-text">No Image</span>
              )}
            </div>
          </div>
      </div>
    </div>

<div className="employee-form_normal">
   <div className="form-group-box">
      <div className="form-group">
         <label>
         Date of Joinning<span className="required">*</span> 
         </label>
         <input
         className={`input-half ${errors.employeeDetails.dateOfJoinning ? "error-input" : ""}`}
         type="date"
         name="dateOfJoinning"
         value={formValues.employeeDetails.dateOfJoinning}
         onChange={(e) =>
         handleInputDateChange(e,"employeeDetails")
         }
         />
      </div>
      <div className="form-group">
         <label>
         Department<span className="required">*</span>
         </label>
         <Select
         className={`filter-select-wrapper ${errors.employeeDetails.department ? "error-input" : ""}`}
         value={formValues.employeeDetails.department}
         name="department"
         classNamePrefix="filter-select"
         options={departmentOpt}
         placeholder="(Department)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top"
         menuPortalTarget={document.body}
         menuPosition="fixed"
         styles={{
             menuPortal: base => ({ ...base, zIndex: 9999 })
         }}        
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "department","employeeDetails")
         }                
         />
      </div>
      <div className="form-group">
         <label>
         Designation<span className="required">*</span>
         </label>
         <Select
         className={`filter-select-wrapper ${errors.employeeDetails.designation ? "error-input" : ""}`}
         value={formValues.employeeDetails.designation}
         name="designation"
         classNamePrefix="filter-select"
         options={designationOpt}
         placeholder="(Designation)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top" 
         menuPortalTarget={document.body}
         menuPosition="fixed"
         styles={{
             menuPortal: base => ({ ...base, zIndex: 9999 })
         }}  
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "designation","employeeDetails")
         }                
         />
      </div>
      <div className="form-group">
         <label>Salary Type<span className="required">*</span> </label>
         <Select className={`filter-select-wrapper ${errors.employeeDetails.salaryType ? "error-input" : ""}`}
         value={formValues.employeeDetails.salaryType}
         name="salaryType"
         classNamePrefix="filter-select"
         options={salaryTypeOptions}
         placeholder="(Salary Type)"
         isClearable
         maxMenuHeight={200}
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "salaryType","employeeDetails")
         }
         />
      </div>
   </div>


      <div className="form-group-box">
      <div className="form-group">
         <label>
         Date of Left
         </label>
         <input
         className={`input-half ${errors.employeeDetails.dateofLeft ? "error-input" : ""}`}
         type="date"
         name="dateofLeft"
         value={formValues.employeeDetails.dateofLeft}
         onChange={(e) =>
         handleInputDateChange(e,"employeeDetails")
         }
         />
      </div>
      <div className="form-group">
         <label>
         Date of Rejoin
         </label>
         <input
         className={`input-half ${errors.employeeDetails.dateofRejoin ? "error-input" : ""}`}
         type="date"
         name="dateofRejoin"
         value={formValues.employeeDetails.dateofRejoin}
         onChange={(e) =>
         handleInputDateChange(e,"employeeDetails")
         }
         />
      </div>
      <div className="form-group">
         <label>
         Food Allowed
         </label>
         <Select
         className={`filter-select-wrapper ${errors.employeeDetails.foodAllowed ? "error-input" : ""}`}
         value={formValues.employeeDetails.foodAllowed}
         name="foodAllowed"
         classNamePrefix="filter-select"
         options={yesNoOptions}
         placeholder="(Food Allowed)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top" 
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "foodAllowed","employeeDetails")
         }                
         />
      </div>
      <div className="form-group">
         <label>Wage Type<span className="required">*</span> </label>
         <Select className={`filter-select-wrapper ${errors.employeeDetails.wageType ? "error-input" : ""}`}
         value={formValues.employeeDetails.wageType}
         name="v"
         classNamePrefix="filter-select"
         options={wageTypeOptions}
         placeholder="(Wage Type)"
         isClearable
         maxMenuHeight={200}
          menuPlacement="top" 
          menuPortalTarget={document.body}
         menuPosition="fixed"
         styles={{
             menuPortal: base => ({ ...base, zIndex: 9999 })
         }}  
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "wageType","employeeDetails")
         }
         />
      </div>
   </div>
<div className="form-group-box">
               <div className="form-group">
                  <label>
                  Marital Status<span className="required">*</span>
                  </label>
                  <Select
                  className={`filter-select-wrapper ${errors.employeeDetails.maritalStatus ? "error-input" : ""}`}
                  value={formValues.employeeDetails.maritalStatus}
                  name="maritalStatus"
                  classNamePrefix="filter-select"
                  options={maritalStatusOptions}
                  placeholder="(Marital Status)"
                  isClearable
                  maxMenuHeight={200}
                  menuPlacement="top"
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                              }}
                  onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "maritalStatus","employeeDetails")
                  }
                  />
                </div>
                   <div className="form-group">
                    <label>
                    Aadhar<span className="required">*</span>
                    </label>
                    <input
                    name="aadhar"
                    value={formValues.employeeDetails.aadhar}
                    placeholder="Aadhar"
                    className={errors.employeeDetails.aadhar ? "error-input" : ""}
                    onChange={(e) =>
                    handleInputChange(e,"employeeDetails")
                    }
                    />
                </div>
                   <div className="form-group">
                    <label>
                    PAN
                    </label>
                    <input
                    name="pan"
                    value={formValues.employeeDetails.pan}
                    placeholder="PAN"
                    className={errors.employeeDetails.pan ? "error-input" : ""}
                    onChange={(e) =>
                    handleInputChange(e,"employeeDetails")
                    }
                    />
                </div>
                <div className="form-group dummy-field"></div>
  </div>

</div>




</div>

{(formValues.employeeDetails.category?.value == "Worker" || 
  formValues.employeeDetails.category?.value == "Staff"
) && (<div className="form-card">
    <div className="form-header-box-addemp">
        <p>Basic Information</p>
    </div>
    <div className="employee-form_Add">
	    { (formValues.employeeDetails?.category?.value === "Worker" )&& (  <div className="form-group-box">
           <div className="form-group">
            <label>Salary Per Day<span className="required">*</span> </label>
            <input name="salaryWorker"  
            value={formValues.basicInformation.salaryWorker} 
                  placeholder="Salary Per Day"
                  className={errors.basicInformation.salaryWorker ? "error-input" : ""} 
                  type = "number"
                  disabled={true}
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div>


           <div className="form-group">
            <label>OT Amount Per Day<span className="required">*</span> </label>
            <input name="oTAmount"  value={formValues.basicInformation.oTAmount} 
            placeholder="OT Amount Per Day"
            disabled={true}
                  className={errors.basicInformation.oTAmount ? "error-input" : ""} type = "number"
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div>

          
                             
        </div>

        )}

     { (formValues.employeeDetails?.category?.value === "Staff" ) && ( <div className="form-group-box">
           <div className="form-group">
            <label>Salary<span className="required">*</span> </label>
            <input name="salaryStaff"  value={formValues.basicInformation.salaryStaff}
             placeholder="Salary"
                  className={errors.basicInformation.salaryStaff ? "error-input" : ""} type = "number"
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div>

         <div className="form-group">
            <label>Basic<span className="required">*</span> </label>
            <input name="basic"  disabled={true}
            value={formValues.basicInformation.basic} placeholder="Basic"
                  className={errors.basicInformation.basic ? "error-input" : ""} 
                  disabled={true}
                  type = "number"
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div> 


{formValues.employeeDetails?.designation?.value != "DRIVER" && (
           <div className="form-group">
            <label>HRA<span className="required">*</span> </label>
            <input name="hRA" disabled={true}
             value={formValues.basicInformation.hRA} placeholder="HRA"
                  className={errors.basicInformation.hRA ? "error-input" : ""} type = "number"
                  disabled={true}
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div> )}  
         {formValues.employeeDetails?.designation?.value != "DRIVER" && (  <div className="form-group">
            <label>Incentive<span className="required">*</span> </label>
            <input name="incentive" disabled={true}
             value={formValues.basicInformation.incentive} placeholder="Incentive"
                  className={errors.basicInformation.incentive ? "error-input" : ""} type = "number"
                  disabled={true}
                  onChange={(e) =>
                        handleInputChange(e,"basicInformation")
                      }
            />
          </div>       )} 

          {formValues.employeeDetails?.designation?.value === "DRIVER" && (   
             <div className="form-group"></div>  )}   
             {formValues.employeeDetails?.designation?.value === "DRIVER" && (    
             <div className="form-group"></div>)} 
                        
        </div>  
        )}

   
    <div className="form-group-box">
      {(formValues.employeeDetails?.category?.value === "Staff" ) && (
             
               <div className="form-group">
                  <label>Net Salary<span className="required">*</span> </label>
                  <input name="netSalary"
                    disabled={true}
                    value={formValues.basicInformation.netSalary} placeholder="Net Salary"
                        className={errors.basicInformation.netSalary ? "error-input" : ""} type = "number"
                        onChange={(e) =>
                              handleInputChange(e,"basicInformation")
                            }
                  />
              </div>
           )}
        <div className="form-group">
         <label>
        Effective From<span className="required">*</span>
         </label>
         <input
         className={`input-half ${errors.basicInformation.effectivefrom ? "error-input" : ""}`}
         type="date"
         name="effectivefrom"
         value={formValues.basicInformation.effectivefrom}
         onChange={(e) =>
         handleInputDateChange(e,"basicInformation")
         }
         />
         
    </div>
  
          
       <div className="form-group"> </div> 
         { (formValues.employeeDetails?.category?.value === "Staff" )&& (  
       <div className="form-group"> </div> 
         )}

      </div>

	 
	 </div>

</div>

)}


            
<div className="form-card">
<div className="form-header-box-addemp">
   <p>Contact Information</p>
</div>
<div className="employee-form_Add">
   <div className="form-group-box">
      <div className="form-group">
         <label>
         Address Line 1
         </label>
         <input
         name="addressLine1"
         value={formValues.contactInformation.addressLine1}
         placeholder="Address Line 1"
         className={errors.contactInformation.addressLine1 ? "error-input" : ""}
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
      <div className="form-group">
         <label>
         Address Line 2
         </label>
         <input
         name="addressLine2"
         value={formValues.contactInformation.addressLine2}
         placeholder="Address Line 2"
         className={errors.contactInformation.addressLine2 ? "error-input" : ""}
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
   </div>
   <div className="form-group-box">
      <div className="form-group">
         <label> Country </label>
         <Select className={`filter-select-wrapper ${errors.contactInformation.country ? "error-input" : ""}`}
         value={formValues.contactInformation.country}
         name="country"
         classNamePrefix="filter-select"
         options={countryOptions}
         placeholder="(Country)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top"
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "country","contactInformation")
         } 
         />                     
      </div>
      <div className="form-group">
         <label>State</label>
         <Select className={`filter-select-wrapper ${errors.contactInformation.state ? "error-input" : ""}`}
         value={formValues.contactInformation.state}
         name="state"
         classNamePrefix="filter-select"
         options={stateOptions}
         placeholder="(State)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top"
         menuPortalTarget={document.body}
         menuPosition="fixed"
         styles={{
         menuPortal: base => ({ ...base, zIndex: 9999 })
         }}
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "state","contactInformation")
         } 
         />
      </div>
      <div className="form-group">
         <label>District </label>
         <Select className={`filter-select-wrapper ${errors.contactInformation.district ? "error-input" : ""}`}
         value={formValues.contactInformation.district}
         name="district"
         classNamePrefix="filter-select"
         options={districtOptions}
         placeholder="(District)"
         isClearable
         maxMenuHeight={200}
         menuPlacement="top" 
         menuPortalTarget={document.body}
         menuPosition="fixed"
         styles={{
         menuPortal: base => ({ ...base, zIndex: 9999 })
         }}                             
         onChange={(selectedOption) =>
         handleSelectChange(selectedOption, "district","contactInformation")
         }
         />
      </div>
      <div className="form-group">
         <label> Town / City </label>
         <input name="townCity"  value={formValues.contactInformation.townCity} placeholder="Town / City"
         className={errors.contactInformation.townCity ? "error-input" : ""}
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
   </div>
   <div className="form-group-box">
      <div className="form-group">
         <label>Primary Contact Number </label>
         <input name="primaryContactNumber"  value={formValues.contactInformation.primaryContactNumber} placeholder="Primary Contact Number"
         className={errors.contactInformation.primaryContactNumber ? "error-input" : ""}
         type="number"
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
      <div className="form-group">
         <label>Secondary Contact Number </label>
         <input name="secondaryContactNumber"  value={formValues.contactInformation.secondaryContactNumber} placeholder="Secondary Contact Number"
         className={errors.contactInformation.secondaryContactNumber ? "error-input" : ""} 
         type="number"
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
      <div className="form-group">
         <label>Email</label>
         <input name="email"  value={formValues.contactInformation.email} placeholder="Email"
         className={errors.contactInformation.email ? "error-input" : ""}
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
      <div className="form-group">
         <label>Postal Code</label>
         <input name="postalCode"  value={formValues.contactInformation.postalCode} placeholder="Postal Code"
         className={errors.contactInformation.postalCode ? "error-input" : ""} type="number"
         onChange={(e) =>
         handleInputChange(e,"contactInformation")
         }
         />
      </div>
   </div>
</div>
</div>

          


            <div className="right-panel-container-buttons">
            <div className="form-actions">
                  <button type = "button"  className="btn-primary btn-tiny" 
                  style={{display:editbtn == true ? "none":"inline-block"}}  onClick={addEmployee}>
                    Save
                  </button>
                  <button type = "button" className="btn-primary btn-tiny"
                   style={{display:editbtn == true ? "inline-block":"none"}} onClick={updateEmployee}>
                    Update
                  </button>
                  <button type = "button"  className="btn-secondary btn-tiny" onClick={EmployeeList}>
                    Cancel
                  </button>
                  
                </div>
                {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </span>

            <img src={previewUrl} alt="Preview" className="preview-img" />
          </div>
        </div>
      )}
                </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
