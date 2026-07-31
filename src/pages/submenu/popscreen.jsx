import React from "react";
import "../../css/popscreen.css";
import Select from "react-select";
import { useState ,useEffect} from "react";
import {MOVEMENTREPORTASEXCEL,MOVEMENTREPORTASPDF} from "../../common/apiService.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import { showAlert,showConfirm} from "../../common/alert/alertService.jsx";

export default function PopScreen({
    title,
    onClose,
    config,
    categoryOptions,
    departmentOptions,
    stateOptions,
    genderOptions,
    designationOptions,
    deprtdesifnation,
    employeeDetails,
    onFinalize,
    onPreview,
    onPdf,
    onExcel,
    ReportType,
     SReportType,
    firstFinalizedMonthandYear,
    lastFinalizedMonthandYear
}) {

var [designationOptionsDup, setDesignationOptionsDup] = useState(null);

var [category, setCategory] = useState(null);

var [department, setDepartment] = useState(null);

var [designation, setDesignation] = useState(null);

var [state, setState] = useState(null);

var [selectedEmpCode, setSelectedEmpCode] = useState(null);

var [selectedEmpName, setSelectedEmpName] = useState(null);

var [gender, setGender] = useState(null);

var [fromDate, setFromDate] = useState("");

var [toDate, setToDate] = useState("");

var [listWith, setListWith] = useState(null);

var [categoryDisabled, setCategoryDisabled] = useState(true);

var [errors, setErrors] = useState({});

var [filters, setFilters] = useState({category: null,department: null,designation: null, state: null, code: "", name: "", gender: null,fromDate:null,toDate:null,listwith:null});
var isRequired = (field) => config?.required?.[field] ?? false;

var show = (field) => config?.visible?.[field] ?? true;



useEffect(() => {
    if (category?.value?.toUpperCase() === "WORKER") {
        setDesignationOptionsDup(designationOptions);
    }
}, [category, designationOptions]);
useEffect(() => {
    if ( (title != "InPunch Movement" && title != "Daily Movement" && title != "Movement") ||  title === "Staff Salary") {
        setCategory(categoryOptions?.[0] || null);        
    }
     if ( title === "InPunch Movement" || title === "Daily Movement" || title === "Movement" ){
         setCategoryDisabled(false);
     }
}, [title, categoryOptions]);




let finalDesignationOptions = designationOptions;
if (ReportType === "MOVEMENT") {

    if (category?.value?.toUpperCase() === "STAFF") {

        finalDesignationOptions = department?.value
            ? [
                ...new Map(
                    deprtdesifnation
                        .filter(item =>
                            item.category === "STAFF" &&
                            item.departmentname === department.value.toUpperCase()
                        )
                        .map(item => [
                            item.designation,
                            {
                                value: item.designation,
                                label: item.designation
                            }
                        ])
                ).values()
            ]
            : [];

    } else if (category?.value?.toUpperCase() === "WORKER") {

        finalDesignationOptions = designationOptions;

    } else {

        finalDesignationOptions = [];
    }

} else if (ReportType === "STAFF") {

    finalDesignationOptions = [
        ...new Map(
            deprtdesifnation
                .filter(item =>
                    item.category === "STAFF" &&
                    item.departmentname === department?.value?.toUpperCase()
                )
                .map(item => [
                    item.designation,
                    {
                        value: item.designation,
                        label: item.designation
                    }
                ])
        ).values()
    ];

}   


var filterOptionsforEmpCode = employeeDetails
    .slice()
    .sort((a, b) => Number(a.empId) - Number(b.empId))
    .map(data => ({
        value: data.empId,
        label: data.empId
    }));
var filterOptionsforEmpName = employeeDetails
    .slice()
    .sort((a, b) => a.empName.localeCompare(b.empName))
    .map(data => ({
        value: data.empName,
        label: data.empName
    }));

    let movementDepartmentOptions = [];

if (ReportType === "MOVEMENT" && category?.value) {

    movementDepartmentOptions = [
        ...new Map(
            deprtdesifnation
                .filter(item => item.category === (category.value).toUpperCase())
                .map(item => [
                    item.departmentname,
                    {
                        value: item.departmentname,
                        label: item.departmentname
                    }
                ])
        ).values()
    ];

}

var validateForm = () => {
    let t = {};

    Object.keys(config?.required || {}).forEach(field => {

        if (!config.required[field]) return;

        var value = filters[field];

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            t[field] = true;
        }
    });

    setErrors(t);

    return Object.keys(t).length === 0;
};


var updateFilter = (field, value, setter = null) => {

    if (setter) {
        setter(value);
    }

    setFilters(prev => ({
        ...prev,
        [field]: value
    }));

    setErrors(prev => {
        var temp = { ...prev };
        delete temp[field];
        return temp;
    });
};

const months = {
    JANUARY: 0,
    FEBRUARY: 1,
    MARCH: 2,
    APRIL: 3,
    MAY: 4,
    JUNE: 5,
    JULY: 6,
    AUGUST: 7,
    SEPTEMBER: 8,
    OCTOBER: 9,
    NOVEMBER: 10,
    DECEMBER: 11
};

// const getFinalizedDates = (first, last) => {
//     const dates = [];
//     if (!firstFinalizedMonthandYear || !lastFinalizedMonthandYear) {
//         return true;
//     }

//     let year = Number(first.year);
//     let month = months[first.month.toUpperCase()];

//     const endYear = Number(last.year);
//     const endMonth = months[last.month.toUpperCase()];

//     while (year < endYear || (year === endYear && month <= endMonth)) {
//         dates.push(new Date(year, month, 21));
//         dates.push(new Date(year, month + 1, 20));

//         month++;

//         if (month > 11) {
//             month = 0;
//             year++;
//         }
//     }

//     return dates;
// };


const getFinalizedDates = (first, last) => {

    const dates = [];

    if (!first || !last) {
        return dates;
    }

    if (ReportType === "STAFF") {

        let year = Number(first.year);
        let month = months[first.month.toUpperCase()];

        const endYear = Number(last.year);
        const endMonth = months[last.month.toUpperCase()];

        while (year < endYear || (year === endYear && month <= endMonth)) {

            dates.push(new Date(year, month, 21));
            dates.push(new Date(year, month + 1, 20));

            month++;

            if (month > 11) {
                month = 0;
                year++;
            }
        }

    } else if (SReportType === "Form M Weekly") {

        dates.push(new Date(first.fromDate));
        dates.push(new Date(last.toDate));

    }

    return dates;
};
const finalizedDates = getFinalizedDates(
    firstFinalizedMonthandYear,
    lastFinalizedMonthandYear
);

let startDate = null;
let endDate = null;

if (firstFinalizedMonthandYear && lastFinalizedMonthandYear) {

    if (ReportType === "STAFF") {

        startDate = new Date(
            Number(firstFinalizedMonthandYear.year),
            months[firstFinalizedMonthandYear.month.toUpperCase()],
            21
        );

        endDate = new Date(
            Number(lastFinalizedMonthandYear.year),
            months[lastFinalizedMonthandYear.month.toUpperCase()] + 1,
            20
        );

    } else if (SReportType === "Form M Weekly") {

        const parseLocalDate = (dateStr) => {
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day);
        };

        startDate = parseLocalDate(firstFinalizedMonthandYear.fromDate);
        endDate = parseLocalDate(lastFinalizedMonthandYear.toDate);
    }
}

const isFinalizedDate = (date) => {
    if (!startDate || !endDate) return false;

    return date >= startDate && date <= endDate;
};

const validateFinalizedDates = (from, to) => {
    if (!from || !to || !startDate || !endDate) return true;

    const fromFinalized = from >= startDate && from <= endDate;
    const toFinalized = to >= startDate && to <= endDate;

    return fromFinalized === toFinalized;
};

const isAlreadyFinalized = (date) => {
    if (!startDate || !endDate) return false;

    const selectedDate = new Date(date);
    return selectedDate >= startDate && selectedDate <= endDate;
};

const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

    return (
        <div className="report-popup-overlay">
            <div className="report-popup">

                {/* Header */}
                <div className="report-popup-header">

                    <h2 className="report-popup-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="report-popup-close"
                        onClick={onClose}
                    >
                        <i className="ti ti-x"></i>
                    </button>

                </div>

                {/* Body */}
                <div className="report-popup-body">

                    <div className="report-filter-grid">
                        <div className="form-group">
                            <label>Employee Code{isRequired("code") && (<span className="required">*</span> )}</label>
                            <Select
                               className={`filter-select-wrapper ${errors.code  ? "error-input" : ""}`}

                                classNamePrefix="filter-select"
                                placeholder="Employee Code"
                                options={filterOptionsforEmpCode}
                                 value={selectedEmpCode}
                                 onChange={(option) => {

                                        updateFilter("code", option, setSelectedEmpCode);

                                        var emp = employeeDetails.find(
                                            e => String(e.empId) === String(option?.value)
                                        );

                                        if (emp) {

                                            var empName = {
                                                value: emp.empName,
                                                label: emp.empName
                                            };

                                            updateFilter("name", empName, setSelectedEmpName);

                                        } else {

                                            updateFilter("name", null, setSelectedEmpName);
                                        }
                                    }}
                                isClearable
                                maxMenuHeight={200}
                            
                            />
                        </div>
                        {show("fromDate") && (<div className="form-group">
                                <label>
                                From Date{isRequired("fromDate") && (<span className="required">*</span> )}
                                </label>
                                {/* <input */}
                            {/*     className={`input-half ${errors.fromDate? "error-input" : ""}`}
                            //     min={minDate}
                            //     max={maxDate}
                            //     type="date"
                            //     name="dateOfJoinning"
                            //    onChange={(e) => updateFilter("fromDate", e.target.value, setFromDate)}
                            //     value={fromDate}
                            //     /> */}

                            <DatePicker
                                selected={fromDate ? new Date(fromDate) : null}
                                onChange={(date) => {
                                   if (!date) {
                                            updateFilter("fromDate", "", setFromDate);
                                            return;
                                        }

                                        const newFromDate = date;
                                        const existingToDate = toDate ? new Date(`${toDate}T00:00:00`) : null;

                                        if (existingToDate && !validateFinalizedDates(newFromDate, existingToDate)) {
                                            showAlert("From Date and To Date should both be either finalized or non-finalized.");

                                            updateFilter("fromDate", "", setFromDate);
                                            updateFilter("toDate", "", setToDate);
                                            return;
                                        }

                                        updateFilter(
                                            "fromDate",
                                            format(newFromDate, "yyyy-MM-dd"),
                                            setFromDate
                                        );
                                }}
                                dateFormat="dd-MM-yyyy"
                                className={`input-half ${errors.fromDate ? "error-input" : ""}`}
                                placeholderText="Select From Date"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                scrollableYearDropdown
                                yearDropdownItemNumber={5}
                                fixedHeight={false}
                                renderDayContents={(day, date) => {

                                        const currentDate = normalizeDate(date);

                                        const isFinalized =
                                            startDate &&
                                            endDate &&
                                            currentDate >= startDate &&
                                            currentDate <= endDate;

                                        return (
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                            >
                                                {day}

                                                {isFinalized && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            top: 1,
                                                            right: 2,
                                                            fontSize: "7px",
                                                            color: "#28a745",
                                                            fontWeight: "bold",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        F
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }}
                            />




                        </div> )}
                      {show("toDate") && (  <div className="form-group">
                                <label>
                                To Date{isRequired("toDate") && (<span className="required">*</span> )}
                                </label>
                               {/* <input
                                className={`input-half ${errors.toDate ? "error-input" : ""}`}
                                type="date"
                               onChange={(e) => updateFilter("toDate", e.target.value, setToDate)}
                                value={toDate}
                                name="dateOfJoinning"
                                /> */}

                                <DatePicker
                                selected={toDate ? new Date(toDate) : null}
                                onChange={(date) => {
                                     if (!date) {
                                            updateFilter("toDate", "", setToDate);
                                            return;
                                        }

                                        const newToDate = date;
                                        const existingFromDate = fromDate ? new Date(`${fromDate}T00:00:00`) : null;

                                        if (existingFromDate && !validateFinalizedDates(existingFromDate, newToDate)) {
                                            showAlert("From Date and To Date should both be either finalized or non-finalized.");

                                            updateFilter("fromDate", "", setFromDate);
                                            updateFilter("toDate", "", setToDate);
                                            return;
                                        }

                                        updateFilter(
                                            "toDate",
                                            format(newToDate, "yyyy-MM-dd"),
                                            setToDate
                                        );
                                }}
                                dateFormat="dd-MM-yyyy"
                                className={`input-half ${errors.toDate ? "error-input" : ""}`}
                                placeholderText="Select To Date"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                scrollableYearDropdown
                                yearDropdownItemNumber={5}
                                 fixedHeight={false}
                                renderDayContents={(day, date) => {

                                        const currentDate = normalizeDate(date);

                                        const isFinalized =
                                            startDate &&
                                            endDate &&
                                            currentDate >= startDate &&
                                            currentDate <= endDate;

                                        return (
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                            >
                                                {day}

                                                {isFinalized && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            top: 1,
                                                            right: 2,
                                                            fontSize: "7px",
                                                            color: "#28a745",
                                                            fontWeight: "bold",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        F
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }}
                            />
                        </div>)}

                        <div className="form-group">
                            <label>Category{isRequired("category") && (<span className="required">*</span> )}</label>

                            <Select
                             className={`filter-select-wrapper ${errors.category ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                placeholder="Select Category"
                                options={categoryOptions}
                                isDisabled={categoryDisabled}
                                onChange={(option) => {

                                            updateFilter("category", option, setCategory);

                                            updateFilter("department", null, setDepartment);

                                            updateFilter("designation", null, setDesignation);

                                        }}
                                value={category}
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>Department{isRequired("department") && (<span className="required">*</span> )}</label>

                            <Select
                              className={`filter-select-wrapper ${errors.department ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                placeholder="Select Department"
                                menuPlacement="top" 
                               options={
                                        ReportType === "MOVEMENT"
                                            ? movementDepartmentOptions
                                            : departmentOptions
                                    }
                               onChange={(option) => {

                                    updateFilter("department", option, setDepartment);

                                    updateFilter("designation", null, setDesignation);

                                }}
                                value={department}
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>Designation{isRequired("designation") && (<span className="required">*</span> )}</label>

                            <Select
                             className={`filter-select-wrapper ${errors.designation ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                menuPlacement="top" 
                                placeholder="Select Designation"
                                options={finalDesignationOptions}
                              onChange={(option) => updateFilter("designation", option, setDesignation)}
                                value={designation}
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>State{isRequired("state") && (<span className="required">*</span> )}</label>

                            <Select
                               className={`filter-select-wrapper ${errors.state ? "error-input" : ""}`}

                                classNamePrefix="filter-select"
                                menuPlacement="top" 
                                placeholder="Select State"
                                options={stateOptions}
                               onChange={(option) => updateFilter("state", option, setState)}
                                value={state}
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>

                        

                        <div className="form-group">
                            <label>Employee Name{isRequired("name") && (<span className="required">*</span> )}</label>

                            <Select
                                 className={`filter-select-wrapper ${errors.name   ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                placeholder="Employee Name"
                                options={filterOptionsforEmpName}
                                isClearable
                                menuPlacement="top" 
                                maxMenuHeight={200}
                                 value={selectedEmpName}
                                    onChange={(option) => {

                                        updateFilter("name", option, setSelectedEmpName);

                                        var emp = employeeDetails.find(
                                            e => e.empName === option?.value
                                        );

                                        if (emp) {

                                            var empCode = {
                                                value: emp.empId,
                                                label: emp.empId
                                            };

                                            updateFilter("code", empCode, setSelectedEmpCode);

                                        } else {

                                            updateFilter("code", null, setSelectedEmpCode);
                                        }
                                    }}
                            
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender{isRequired("gender") && (<span className="required">*</span> )}</label>

                            <Select
                               className={`filter-select-wrapper ${errors.gender ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                placeholder="Select Gender"
                                 options={genderOptions}
                                 onChange={(option) => updateFilter("gender", option, setGender)}
                                value={gender}
                                menuPlacement="top" 
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>
                        
                      {show("listwith") && ( <div className="form-group">
                            <label>List With{isRequired("listwith") && (<span className="required">*</span> )}</label>

                            <Select
                               className={`filter-select-wrapper ${errors.listwith ? "error-input" : ""}`}
                                classNamePrefix="filter-select"
                                placeholder="Select List"
                                  menuPlacement="top" 
                                options={[
                                    {
                                        value: "All",
                                        label: "All"
                                    },
                                    {
                                        value: "Present",
                                        label: "Present"
                                    },
                                    {
                                        value: "Absent",
                                        label: "Absent"
                                    }
                                ]}
                                onChange={(option) => updateFilter("listwith", option, setListWith)}
                                value={listWith}
                                isClearable
                                maxMenuHeight={200}
                            />
                        </div>
                      )}

                    </div>

                </div>

                {/* Footer */}
         <div className="report-popup-footer">
            {(ReportType ==="STAFF" || SReportType ==="Form M Weekly") &&(
             <button
                    className="report-btn report-btn-finalize"
                    onClick={() => {
                         if (isAlreadyFinalized(fromDate)) {
                            showAlert("The selected period is already finalized.");
                            return;
                        }
                        if (validateForm()) {
                           var payload = Object.fromEntries(
                                Object.entries(filters).map(([key, value]) => {
                                    let finalValue =
                                        value && typeof value === "object" && "value" in value
                                            ? value.value
                                            : value;

                                    return [key, finalValue === "" ? null : finalValue];
                                })
                            );

                            console.log(payload);
                            onFinalize(payload);
                        }
                    }}
                >
                    <i className="ti ti-circle-check"></i>
                    Finalize Report
                </button>
                )}

                <button
                    className="report-btn report-btn-preview"
                    onClick={() => {
                        if (validateForm()) {
                           var payload = Object.fromEntries(
                                Object.entries(filters).map(([key, value]) => {
                                    let finalValue =
                                        value && typeof value === "object" && "value" in value
                                            ? value.value
                                            : value;

                                    return [key, finalValue === "" ? null : finalValue];
                                })
                            );

                            console.log(payload);
                            onPreview(payload);
                        }
                    }}
                >
                    <i className="ti ti-eye"></i>
                    Preview
                </button>

                <button
                    className="report-btn report-btn-pdf"
                    onClick={() => {
                        if (validateForm()) {
                           var payload = Object.fromEntries(
                                Object.entries(filters).map(([key, value]) => {
                                    let finalValue =
                                        value && typeof value === "object" && "value" in value
                                            ? value.value
                                            : value;

                                    return [key, finalValue === "" ? null : finalValue];
                                })
                            );
                            console.log(payload);
                            onPdf(payload);
                        }
                    }}
                >
                    <i className="ti ti-file-type-pdf"></i>
                    Export PDF
                </button>

                <button
                    className="report-btn report-btn-excel"
                    onClick={() => {
                        if (validateForm()) {
                             var payload = Object.fromEntries(
                                Object.entries(filters).map(([key, value]) => {
                                    let finalValue =
                                        value && typeof value === "object" && "value" in value
                                            ? value.value
                                            : value;

                                    return [key, finalValue === "" ? null : finalValue];
                                })
                            );
                            console.log(payload);
                            onExcel(payload);
                        }
                    }}
                >
                    <i className="ti ti-file-spreadsheet"></i>
                    Export Excel
                </button>

            </div>

            </div>
        </div>
    );
}