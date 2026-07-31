import HRMLogo from "../assets/HRM-logo.svg";
import { useState } from "react";
import { showAlert,showConfirm} from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../css/dashboard.css"
import {} from "../common/apiService.jsx";
import Sidebar from "../components/Sidebar.jsx"

export default function Dashboard() {

var [activePage, setActivePage] = useState("dashboard");
var [headerTitle, setHeaderTitle] = useState("Dashboard");
var { showLoader, hideLoader } = useLoader();
var navigate = useNavigate();
var [salaryOpen, setSalaryOpen] = useState(false);
var [activeSubMenu, setActiveSubMenu] = useState("");



var TabClick = (tabName) =>{
    showLoader("Please wait ...");
    setActivePage("dashboard");
    navigate("/"+tabName);
    hideLoader();
}
    return (
<div className="layout-wrapper"> 


       <Sidebar
        activePage="dashboard"
        activeSubMenu={activeSubMenu}
        salaryOpen={salaryOpen}
        setSalaryOpen={setSalaryOpen}
        setActiveSubMenu={setActiveSubMenu}
        TabClick={TabClick}
    />


           <div className="layout-page"> 
                <div class="dashboard-container">
                  <div class="card">
                    <div class="icon blue"><i class="ti ti-settings"></i></div>
                    <h3>Add Category</h3>
                    <a href="#">Category</a>
                  </div> 

                  <div class="card">
                    <div class="icon green"><i class="ti ti-building"></i></div>
                    <h3>Add Department</h3>
                    <a href="#">Department</a>
                  </div>

                  <div class="card">
                    <div class="icon yellow"><i class="ti ti-currency-dollar"></i></div>
                    <h3>Add Salary</h3>
                    <a href="#">Salary</a>
                  </div>

                  <div class="card" onClick={() => {TabClick("Employee")}}>
                    <div class="icon blue"><i class="ti ti-users"></i></div>
                    <h3>Add Employee</h3>
                    <a href="#">Employee</a>
                  </div>

                  <div class="card">
                    <div class="icon blue"><i class="ti ti-user-off"></i></div>
                    <h3>Inactive Employee</h3>
                    <a href="#">Inactive Employee List</a>
                  </div>

                  <div class="card">
                    <div class="icon blue"><i class="ti ti-report"></i></div>
                    <h3>Generate Report</h3>
                    <a href="#">Active Employee Report</a>
                    <a href="#">Inactive Employee Report</a>
                  </div>

                  <div class="card" onClick={() => {TabClick("SalarySetting")}}>
                    <div class="icon blue"><i class="ti ti-clipboard-list"></i></div>
                    <h3>Transaction</h3>
                    <a href="#">Driver Attendance</a>
                  </div>
                </div>
            </div>
</div>

    )};