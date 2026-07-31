import React from "react";
import HRMLogo from "../assets/HRM-logo.svg"

const Sidebar = ({
    activePage,
    activeSubMenu,
    salaryOpen,
    setSalaryOpen,
    setActiveSubMenu,
    TabClick
}) => {
    return (
        <aside className="layout-menu">
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
                    <span>Weight Report</span>
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
                    <div className={`menu-link menu-parent ${salaryOpen ? "active" : ""}`}  onClick={() => {TabClick("commonsubmenuscreen"),setSalaryOpen(!salaryOpen),setActiveSubMenu("staff")}} >
                        <i className="menu-icon ti ti-cash"></i>
                        <span>Reports</span>

                        <i  className={`ti ${salaryOpen ? "ti-chevron-down" : "ti-chevron-right"}`}
                            style={{
                                marginLeft: "auto",
                                transition: "transform .3s ease",
                                transform: salaryOpen ? "rotate(0deg)" : "rotate(-0deg)"
                            }}
                        ></i>
                    </div>

                    <ul className={`submenu ${salaryOpen ? "open" : ""}`}>
                        <li className={`submenu-item ${activeSubMenu === "staff" ? "sub-active" : ""}`}  onClick={() => setActiveSubMenu("staff")}>
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
        </aside>
    );
};

export default Sidebar;