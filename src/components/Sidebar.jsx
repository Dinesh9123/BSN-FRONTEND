import React, { useEffect, useRef, useState } from "react";
import HRMLogo from "../assets/HRM-logo.svg";
import "../css/sidebar.css";

const Sidebar = ({
    activePage,
    activeSubMenu,
    salaryOpen,
    setSalaryOpen,
    setActiveSubMenu,
    TabClick
}) => {

    const [menuOpen, setMenuOpen] = useState(false);

    const sidebarRef = useRef(null);

    const saveSidebarScroll = () => {
        if (sidebarRef.current) {
            sessionStorage.setItem(
                "sidebarScrollPosition",
                String(sidebarRef.current.scrollTop)
            );
        }
    };

    const restoreSidebarScroll = () => {
        const sidebar = sidebarRef.current;

        if (!sidebar) {
            return;
        }

        const savedPosition = sessionStorage.getItem(
            "sidebarScrollPosition"
        );

        if (savedPosition !== null) {
            const position = Number(savedPosition);

            requestAnimationFrame(() => {
                if (sidebarRef.current) {
                    sidebarRef.current.scrollTop = position;
                }
            });

            setTimeout(() => {
                if (sidebarRef.current) {
                    sidebarRef.current.scrollTop = position;
                }
            }, 50);

            setTimeout(() => {
                if (sidebarRef.current) {
                    sidebarRef.current.scrollTop = position;
                }
            }, 200);

            setTimeout(() => {
                if (sidebarRef.current) {
                    sidebarRef.current.scrollTop = position;
                }
            }, 500);
        }
    };

    useEffect(() => {
        const sidebar = sidebarRef.current;

        if (!sidebar) {
            return;
        }

        const handleScroll = () => {
            sessionStorage.setItem(
                "sidebarScrollPosition",
                String(sidebar.scrollTop)
            );
        };

        sidebar.addEventListener("scroll", handleScroll);

        restoreSidebarScroll();

        return () => {
            sessionStorage.setItem(
                "sidebarScrollPosition",
                String(sidebar.scrollTop)
            );

            sidebar.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleNavigation = (page) => {

        saveSidebarScroll();

        TabClick(page);
    };

    return (
        <>
            <button
                type="button"
                className={`hrms-side-toggle ${
                    menuOpen
                        ? "hrms-side-toggle-open"
                        : "hrms-side-toggle-closed"
                }`}
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <i
                    className={`ti ${
                        menuOpen
                            ? "ti-chevron-left"
                            : "ti-chevron-right"
                    }`}
                ></i>
            </button>

            <aside
                ref={sidebarRef}
                className={`hrms-side-panel ${
                    menuOpen
                        ? "hrms-side-panel-open"
                        : "hrms-side-panel-closed"
                }`}
            >

                <div className="hrms-side-container">

                    <div className="hrms-side-brand">
                        <img
                            src={HRMLogo}
                            className="hrms-side-logo"
                            alt="HRM"
                        />
                    </div>

                    <ul className="hrms-side-menu">

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("dashboard")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("Dashboard");
                                }}
                            >
                                <i className="ti ti-layout-dashboard"></i>
                                <span>Dashboard</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("weighingscale")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("WeighingScale");
                                }}
                            >
                                <i className="ti ti-scale"></i>
                                <span>Weighing Scale</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("employee")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("Employee");
                                }}
                            >
                                <i className="ti ti-id-badge"></i>
                                <span>Employee</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("reports")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("Reports");
                                }}
                            >
                                <i className="ti ti-report-analytics"></i>
                                <span>Weight Report</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("barcode")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("barcode");
                                }}
                            >
                                <i className="ti ti-barcode"></i>
                                <span>Employee Barcode</span>
                            </div>
                        </li>

                        {/* Reports - unchanged */}
                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    salaryOpen
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    setSalaryOpen(!salaryOpen);
                                    TabClick("commonsubmenuscreen");
                                }}
                            >
                                <i className="ti ti-cash"></i>
                                <span>Reports</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("salarysetting")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("SalarySetting");
                                }}
                            >
                                <i className="ti ti-tool"></i>
                                <span>Salary Configurations</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("idcard")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("idcard");
                                }}
                            >
                                <i className="ti ti-id-badge"></i>
                                <span>ID Card</span>
                            </div>
                        </li>

                        <li className="hrms-side-menu-item">
                            <div
                                className={`hrms-side-menu-link ${
                                    activePage.includes("advance")
                                        ? "hrms-side-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleNavigation("Advance");
                                }}
                            >
                                <i className="ti ti-wallet"></i>
                                <span>Advance</span>
                            </div>
                        </li>

                    </ul>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;