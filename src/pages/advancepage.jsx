
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import { showAlert } from "../common/alert/alertService.jsx";
import { useLoader } from "../common/loader/loaderService.jsx";
import {uploadDeductionsData,getAdvanceDetails,validateAdvanceEmployees,getOSAdvanceDetails,viewDetailedAdvace,getFilterBySearch,SaveManualDeductionData,
    DeleteSelectedRecord
} from "../common/apiService.jsx";

import Sidebar from "../components/Sidebar.jsx";
import "../css/advance.css";

export default function Advance() {

    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const [activeSubMenu, setActiveSubMenu] = useState("");
    const [salaryOpen, setSalaryOpen] = useState(false);
    const [activeAdvanceSection, setActiveAdvanceSection] = useState("bulk");
    const [previewData, setPreviewData] = useState([]);
    const [bulkAdvanceFilter, setBulkAdvanceFilter] = useState({ search: "", type: "",  date: "",  status: "", page: 1});
    const [file, setFile] = useState(null);
    const [fileDKey, setFileDKey] = useState(Date.now());
    const [importDdata, setImportDdata] = useState({ isfile: ""});
    const [importDerrors, setImportDerrors] = useState({});
    const [  bulkAdvancetotalElements,setBulkAdvanceTotalElements ] = useState(0);
    const [bulkAdvanceTotalPages,setBulkAdvanceTotalPages ] = useState(1);
    const [bulkAdvancetotalAmount, setBulkAdvanceTotalAmount] = useState(0);
    const recordsPerPage = 10;

    const [advanceFilter, setFilterData] = useState({"search": "", "type": "", "department": "", "status": ""});
    const [outstandingAdvanceData, setOutstandingAdvanceData] = useState({"totalBalanceAdvance": 0.0, "totalEmployees": 0.0, "totalRecovered": 0.0, "totalAdvance": 0.0});
    const [OSAdvanceFilter, setOSAdvanceFilter] = useState({ search: "", type: "",  department: "",  category: "ALL", page: 1 ,size: 10 });
    const [outstandingData, setOutstandingData] = useState([]);
    const [oSCurrentPage, setOSCurrentPage] = useState(1);
    const [oSTotalPages, setOSTotalPages] = useState(1);
    const [searchedStatus, setSearchedStatus] = useState("All");
    const [showAdvanceModal,setShowAdvanceModal]=useState(false);
    const [advanceDetails,setAdvanceDetails]=useState([]);


    const [mAFilterBySearch, setMAFilterBySearch] = useState({ empID: "", name: "",  department: "",  outStanding: 0.0 });
    const [manualHistoryData,setManualHistoryData] = useState({})
    const [manualDeductionSummary,setManualDeductionSummary] = useState({"totalAdvanceAmount":0.0,"totalSalaryDeducted":0.0,"totalManualDeducted":0.0,
        "totalRecovered":0.0,"outstandingAmount":0.0 })
    const [manualData, setManualData] = useState({deductionDate: "", deductionAmount: 0.0, deductionType: "Cash Deduction", paymentMode: "Cash", voucherNo: "",
                                                   voucherDate: "",remarks: "",file: null});
    const [manualErrors, setManualErrors] = useState({});


    const [selectedFileId, setSelectedFileId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileType, setSelectedFileType] = useState("");
    const [showFileModal, setShowFileModal] = useState(false);

    const onCliclOutStandingCard = () => {
        setActiveAdvanceSection("outstanding");
        showLoader("Please wait ...");
        ShowOutstandingAdvance();
        hideLoader();       
    }

useEffect(() => {
    if (activeAdvanceSection === "outstanding") {
        OSAdvanceFilterChange(OSAdvanceFilter);
    }
}, [activeAdvanceSection]);

const handleViewFile = (id, base64, fileExt) => {
    if (!base64) return;

    const extension = fileExt?.toLowerCase();

    let mimeType = "application/octet-stream";

    if (extension === "jpg" || extension === "jpeg") {
        mimeType = "image/jpeg";
    } else if (extension === "png") {
        mimeType = "image/png";
    } else if (extension === "gif") {
        mimeType = "image/gif";
    } else if (extension === "pdf") {
        mimeType = "application/pdf";
    }

    const fileData = base64.startsWith("data:")
        ? base64
        : `data:${mimeType};base64,${base64}`;

    setSelectedFileId(id);
    setSelectedFile(fileData);
    setSelectedFileType(extension);
    setShowFileModal(true);
};
const validateManualForm = () => {

    const errors = {};

    if (!manualData.deductionDate) {
        errors.deductionDate = true;
    }

    if (
        manualData.deductionAmount === "" ||
        manualData.deductionAmount === null ||
        Number(manualData.deductionAmount) <= 0
    ) {
        errors.deductionAmount = true;
    }

    if (!manualData.deductionType) {
        errors.deductionType = true;
    }

    if (!manualData.paymentMode) {
        errors.paymentMode = true;
    }

    if (!manualData.voucherNo || manualData.voucherNo.trim() === "") {
        errors.voucherNo = true;
    }

    if (!manualData.voucherDate) {
        errors.voucherDate = true;
    }

    if (!manualData.file) {
        errors.file = true;
    }

    if(!mAFilterBySearch.empID){
         errors.empID = true;
    }
    if (!manualData.remarks || manualData.remarks.trim() === "") {
        errors.remarks = true;
    }

    setManualErrors(errors);

    return Object.keys(errors).length === 0;
};




    const handleManualsearchChange = (key, value) => {

       setMAFilterBySearch((prev) => ({
            ...prev,
            [key]: value
        }));
       
    };

const handleManualChange = (e) => {
    const { name, value, type, checked } = e.target;

    setManualData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
    }));
    setManualErrors((prev) => ({
        ...prev,
        [name]: false
    }));
};



    const handleDeleteRecord = (id) => {

       if(id == "" ||id== null){
        return;
       }
       var input = {}
       input.id = id;
       showLoader("Please wait ...");
       DeleteSelectedRecord(
            {
                data: input
            },
            {
                success: (res) => {
                    console.log("After Delete Record Advances:", res);  
                    if (res && res.status === "0" ) {    
                        setMAFilterBySearch(res.data[0].FileredData)
                        setManualHistoryData(res.data[0].ManualHistory)
                        setManualDeductionSummary(res.data[0].DeductionSummary);
                    } else {
                         hideLoader();
                        showAlert( "No Data found.", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Failed to Delete Manual advances. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error deleting Manual advances:",
                        err
                    );
                }
            }
        ); 
    };


    const saveManualDeduction = () => {

       if (!validateManualForm()) {           
            return;
        }

        showLoader("Saving deduction...");
        const formData = new FormData();

            formData.append("empId", mAFilterBySearch.empID);
            formData.append("empName", mAFilterBySearch.name);
            formData.append("department", mAFilterBySearch.department);
            formData.append("deductionType", manualData.deductionType);
            formData.append("paymentMode", manualData.paymentMode);
            formData.append("voucherNo", manualData.voucherNo);
            formData.append("voucherDate", manualData.voucherDate);
            formData.append("deductionDate", manualData.deductionDate);
            formData.append("deductionAmount", manualData.deductionAmount);
            formData.append("remarks", manualData.remarks);

            if (manualData.file) {
                formData.append("file", manualData.file);
            }

        SaveManualDeductionData(
            {
                data: formData
            },
            {
                success: (res) => {
                    console.log("Manual Advances:", res);  
                    if (res && res.status === "0" ) {    
                        setMAFilterBySearch(res.data[0].FileredData)
                        setManualHistoryData(res.data[0].ManualHistory)
                        setManualDeductionSummary(res.data[0].DeductionSummary);
                        setManualData({deductionDate: "", deductionAmount: 0.0, deductionType: "Cash Deduction", paymentMode: "Cash", voucherNo: "",
                                                   voucherDate: "",remarks: "",file: null})
                         showAlert( "Manual Deduction upated successfully !!." );

                    }else if(res && res.status === "-1"){
                        showAlert( "Failed to add Manual Deduction : Manual Deduction amount is greater than Outstanding amount" ,"ok");
                    } else {
                         hideLoader();
                        showAlert( "Error in Saving Manual Deductions... !", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Error in Saving Manual Deductions. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error loading Manual advances:",
                        err
                    );
                }
            }
        ); 
    };

    const FrilteredByEmpID = (id) => {

       if(id == "" ||id== null){
        return;
       }
       var input = {}
       input.empId = id;
       showLoader("Please wait ...");
       getFilterBySearch(
            {
                data: input
            },
            {
                success: (res) => {
                    console.log("Manual Advances:", res);  
                    if (res && res.status === "0" ) {    
                        setMAFilterBySearch(res.data[0].FileredData)
                        setManualHistoryData(res.data[0].ManualHistory)
                        setManualDeductionSummary(res.data[0].DeductionSummary);
                    } else {
                         hideLoader();
                        showAlert( "No Data found.", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Failed to load Manual advances. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error loading Manual advances:",
                        err
                    );
                }
            }
        ); 
    };


const handleView = (id) => {
    console.log("Employee ID:", id);
    showLoader("Please wait ...");
    var input = {}
    input.empId = id;
    input.status = searchedStatus;
       viewDetailedAdvace(
            {
                data: input
            },
            {
                success: (res) => {
                    console.log("Detailed Advances:", res);  
                    if (res && res.status === "0" ) {    
                        setAdvanceDetails(res.data);
                        setShowAdvanceModal(true);
                    } else {
                         hideLoader();
                        showAlert( "No Data found.", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Failed to load Detailed advances. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error loading outstanding advances:",
                        err
                    );
                }
            }
        ); 

};


    var OSAdvanceFilterChange = (filter) => {
        showLoader("Please wait ...");
        
            getOSAdvanceDetails(
            {
                data: filter
            },
            {
                success: (res) => {

                    console.log("Outstanding Advances:", res);
                       

                    if (res && res.status === "0" ) {                                
                        if(res.data.length == 0){
                            setOSAdvanceFilter((prev) => ({
                                ...prev, page: 1 }));

                                  setOutstandingData([]);
                            setOSTotalPages([]);
                            setOSCurrentPage([]);
                            setOSCurrentPage(1);
                        }else{
                             setOutstandingData(res.data);
                            setOSTotalPages(res.totalPages);
                            setOSCurrentPage(res.currentPage);
                        }
                    } else {
                        showAlert( "No Data found.", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Failed to load outstanding advances. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error loading outstanding advances:",
                        err
                    );
                }
            }
        ); 
    }

    var ShowOutstandingAdvance = () => {
             getAdvanceDetails(
            {
                data: advanceFilter
            },
            {
                success: (res) => {

                    console.log("Outstanding Advances:", res);

                    if (res && res.status === "0" ) {
                        setOutstandingAdvanceData(res);
                    } else {
                        showAlert( "No Advance found.", "ok" );
                    }

                    hideLoader();
                },

                error: (err) => {

                    hideLoader();

                    showAlert(
                        "Failed to load outstanding advances. Please try again later.",
                        "ok"
                    );

                    console.error(
                        "Error loading outstanding advances:",
                        err
                    );
                }
            }
        );
    }

    const handleBulkAdvanceFilterChange = (key, value) => {
        setBulkAdvanceFilter((prev) => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const handleBulkAdvanceFilterSearch = () => {
        setBulkAdvanceFilter((prev) => ({
            ...prev,
            page: 1
        }));
    };

    const handleBulkAdvanceFilterClear = () => {

        const clearData = {
            search: "",
            type: "",
            date: "",
            status: "",
            page: 1
        };

        setBulkAdvanceFilter(clearData);
    };

    const TabClick = (tabName) => {
        showLoader("Please wait ...");
        navigate("/" + tabName);
        hideLoader();
    };


    const handleImportDfileChange = (e) => {

        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        const validExtensions = [
            ".xlsx",
            ".xls"
        ];

        const extension = selectedFile.name
            .substring(
                selectedFile.name.lastIndexOf(".")
            )
            .toLowerCase();

        if (!validExtensions.includes(extension)) {

            showAlert(
                "Only .xlsx and .xls files are allowed.",
                "ok"
            );

            e.target.value = "";

            return;
        }

        setFile(selectedFile);

        setImportDdata((prev) => ({
            ...prev,
            isfile: selectedFile
        }));

        setImportDerrors((prev) => {

            const errors = {
                ...prev
            };

            delete errors.isfile;

            return errors;
        });
    };

    const validateImportDForm = () => {

        const errors = {};

        if (!importDdata.isfile) {
            errors.isfile = true;
        }

        setImportDerrors(errors);

        return Object.keys(errors).length === 0;
    };

    const onclickuploadDbtn = () => {
    if (!validateImportDForm()) {
        return;
    }

    showLoader("Processing your file, Please wait ...");

    const selectedFile = importDdata.isfile;

    if (!selectedFile) {
        hideLoader();
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const data = event.target.result;

            const workbook = XLSX.read(data, {
                type: "array",
                cellDates: false,
                raw: true
            });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                defval: ""
            });

            const formatDate = (value) => {
                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return "";
                }

                if (typeof value === "number") {
                    const excelDate = XLSX.SSF.parse_date_code(value);

                    if (excelDate) {
                        const day = String(excelDate.d).padStart(2, "0");
                        const month = String(excelDate.m).padStart(2, "0");
                        const year = String(excelDate.y);

                        return `${day}/${month}/${year}`;
                    }
                }

                if (typeof value === "string") {
                    const dateValue = value.trim();

                    let match = dateValue.match(
                        /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
                    );

                    if (match) {
                        const day = String(match[1]).padStart(2, "0");
                        const month = String(match[2]).padStart(2, "0");
                        const year = match[3];

                        return `${day}/${month}/${year}`;
                    }

                    match = dateValue.match(
                        /^(\d{1,2})\/([A-Za-z]{3,9})\/(\d{4})$/
                    );

                    if (match) {
                        const day = String(match[1]).padStart(2, "0");
                        const monthName = match[2].toLowerCase();
                        const year = match[3];

                        const months = {
                            jan: "01",
                            january: "01",
                            feb: "02",
                            february: "02",
                            mar: "03",
                            march: "03",
                            apr: "04",
                            april: "04",
                            may: "05",
                            jun: "06",
                            june: "06",
                            jul: "07",
                            july: "07",
                            aug: "08",
                            august: "08",
                            sep: "09",
                            september: "09",
                            oct: "10",
                            october: "10",
                            nov: "11",
                            november: "11",
                            dec: "12",
                            december: "12"
                        };

                        const month = months[monthName];

                        if (month) {
                            return `${day}/${month}/${year}`;
                        }
                    }
                }

                return String(value);
            };

            const normalizeKey = (key) => {
                return String(key)
                    .trim()
                    .toLowerCase()
                    .replace(/[\s_-]+/g, "");
            };

            const getValue = (row, possibleKeys) => {
                const rowKeys = Object.keys(row);

                const normalizedPossibleKeys =
                    possibleKeys.map(normalizeKey);

                const matchedKey = rowKeys.find((key) =>
                    normalizedPossibleKeys.includes(
                        normalizeKey(key)
                    )
                );

                return matchedKey
                    ? row[matchedKey]
                    : "";
            };

            const formattedData = jsonData.map((row, index) => {
                const employeeId = getValue(row, [
                    "id",
                    "employeeid",
                    "empid",
                    "employee"
                ]);

                const amount = getValue(row, [
                    "amount",
                    "advanceamount",
                    "deductionamount"
                ]);

                const type = getValue(row, [
                    "type",
                    "typeofadvance",
                    "advancetype",
                    "deductiontype"
                ]);

                const dateValue = getValue(row, [
                    "date",
                    "dateofadvance",
                    "deductiondate",
                    "advancedate"
                ]);

                const category = getValue(row, [
                    "category"
                ]);

                const formattedDate = formatDate(dateValue);

                const validEmployee =
                    employeeId !== "" &&
                    employeeId !== null &&
                    employeeId !== undefined;

                return {
                    id: employeeId,
                    empId: employeeId,
                    amount: Number(amount) || 0,
                    type: type || "",
                    deductionDate: formattedDate,
                    category: category || "",
                    validEmployee: validEmployee,
                    remarks: "",
                    createdAt: null,
                    updatedAt: null,
                    excelRow: index + 2
                };
            });

            console.log("Excel Data:", jsonData);
            console.log("Preview Data:", formattedData);

           const employeeIds = formattedData
    .map((item) => item.empId)
    .filter(
        (id) =>
            id !== null &&
            id !== undefined &&
            String(id).trim() !== ""
    )
    .map((id) => Number(id));

validateAdvanceEmployees(
    {
        employeeIds: employeeIds
    },
    {
        success: (res) => {
            const validEmployeeIds = new Set(
                (res.validEmployeeIds || []).map(
                    (id) => String(id)
                )
            );

            const validatedData = formattedData.map(
                (item) => ({
                    ...item,
                    validEmployee:
                        validEmployeeIds.has(
                            String(item.empId)
                        )
                })
            );

            setPreviewData(validatedData);

            const totalElements =
                validatedData.length;

            const totalAmount =
                validatedData.reduce(
                    (total, item) =>
                        total +
                        (Number(item.amount) || 0),
                    0
                );

            setBulkAdvanceTotalElements(
                totalElements
            );

            setBulkAdvanceTotalAmount(
                totalAmount
            );

            setBulkAdvanceFilter({
                search: "",
                type: "",
                date: "",
                status: "",
                page: 1
            });

            setBulkAdvanceTotalPages(
                Math.max(
                    1,
                    Math.ceil(
                        totalElements / 10
                    )
                )
            );

            hideLoader();

            showAlert(
                `${validatedData.length} records validated successfully.`,
                "ok"
            );
        },

        error: (err) => {
            console.error(
                "Employee validation error:",
                err
            );

            hideLoader();

            showAlert(
                "Unable to validate employee IDs.",
                "ok"
            );
        }
    }
);





            const totalElements = formattedData.length;

            const totalAmount = formattedData.reduce(
                (total, item) =>
                    total + (Number(item.amount) || 0),
                0
            );

            setBulkAdvanceTotalElements(totalElements);
            setBulkAdvanceTotalAmount(totalAmount);

            setBulkAdvanceFilter({
                search: "",
                type: "",
                date: "",
                status: "",
                page: 1
            });

            setBulkAdvanceTotalPages(
                Math.max(
                    1,
                    Math.ceil(totalElements / 10)
                )
            );

            setFile(selectedFile);

            hideLoader();

            if (formattedData.length === 0) {
                showAlert(
                    "No records found in the selected Excel file.",
                    "ok"
                );
                return;
            }

            showAlert(
                `${formattedData.length} records loaded into preview.`,
                "ok"
            );

        } catch (error) {
            console.error(
                "Excel processing error:",
                error
            );

            hideLoader();

            showAlert(
                "Unable to process the selected Excel file.",
                "ok"
            );
        }
    };

    reader.onerror = () => {
        hideLoader();

        showAlert(
            "Unable to read the selected Excel file.",
            "ok"
        );
    };

    reader.readAsArrayBuffer(selectedFile);
};







    const onclickuploadFinalAdvancebtn = () => {
        if (!validateImportDForm()) {
            return;
        }

        showLoader("Processing your file, Please wait ...");

        const selectedFile = importDdata.isfile;

        if (!selectedFile) {
            hideLoader();
            return;
        }

        const reader = new FileReader();

reader.onload = (event) => {
    try {
        const data = event.target.result;

        const workbook = XLSX.read(data, {
             type: "array",
    cellDates: true
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, {
            raw: true,
            defval: ""
        });

const formatDate = (value) => {
    if (value === null || value === undefined || value === "") {
        return value;
    }

    // Excel serial number
    if (typeof value === "number") {
        return XLSX.SSF.format("dd/mm/yyyy", value);
    }

    // JavaScript Date
    if (value instanceof Date && !isNaN(value.getTime())) {
        return XLSX.SSF.format("dd/mm/yyyy", value);
    }

    if (typeof value === "string") {
        const str = value.trim();

        // Already DD/MM/YYYY or DD-MM-YYYY
        let match = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
        if (match) {
            return `${match[1].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[3]}`;
        }

        // YYYY-MM-DD or YYYY/MM/DD
        match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
        if (match) {
            return `${match[3].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[1]}`;
        }

        // Let JavaScript parse other formats
        const date = new Date(str);

        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        }
    }

    return value;
};
        const formattedData = jsonData.map((row) => {
            const newRow = { ...row };

           Object.keys(newRow).forEach((key) => {
                if (key.trim().toUpperCase() === "DATE") {
                    newRow[key] = formatDate(newRow[key]);
                }
            });

            return newRow;
        });

        console.log("Excel Data:", jsonData);
        console.log("Formatted Data:", formattedData);

        uploadDeductionsData(
            {
                excelData: formattedData
            },
            {
                success: (res) => {
                    hideLoader();

                    if (res && res.hasOwnProperty("status")) {
                        const code = res.status;

                        switch (code) {
                            case "0":
                                showAlert(
                                    "Advance Addedd Successfully !!!."
                                );

                                setFile(null);

                                setImportDdata({
                                    isfile: ""
                                });
                               setPreviewData([]);

                                setFileDKey(Date.now());

                                setImportDerrors({});

                                break;

                            case "-101":
                                showAlert(
                                    res.message,
                                    "ok"
                                );
                                break;

                            case "401":
                                localStorage.setItem(
                                    "token",
                                    ""
                                );

                                showAlert(
                                    "Invalid Session !!!",
                                    "ok"
                                );

                                navigate("/");
                                break;

                            default:
                                showAlert(
                                    "Something went wrong, please contact administration !!!."
                                );
                        }
                    } else {
                        showAlert(
                            "Something went wrong, please contact administration !!!."
                        );
                    }
                },

                error: () => {
                    hideLoader();

                    showAlert(
                        "Failed to upload Deductions"
                    );
                }
            }
        );

    } catch (error) {
        console.error(
            "Excel processing error:",
            error
        );

        hideLoader();

        showAlert(
            "Unable to process the selected Excel file."
        );
    }
};

        reader.onerror = () => {
            hideLoader();

            showAlert(
                "Unable to read the selected Excel file."
            );
        };

        reader.readAsArrayBuffer(selectedFile);
    };




const handleManualFileChange = (e) => {

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
        return;
    }

    setManualData((prev) => ({
        ...prev,
        file: selectedFile
    }));

    setManualErrors((prev) => ({
        ...prev,
        file: false
    }));
};

    const clearManualForm = () => {

        setManualData({
            empId: "",
            empName: "",
            department: "",
            deductionDate: "",
            deductionAmount: "",
            deductionType: "Cash Deduction",
            paymentMode: "Cash",
            voucherNo: "",
            voucherDate: "",
            remarks: "",
            file: null
        });
    };



    /*
     * LOCAL FILTERING
     */

    const filteredPreviewData =
        previewData.filter((item) => {

            const search =
                bulkAdvanceFilter.search
                    .trim()
                    .toLowerCase();

            const searchMatched =
                !search ||
                String(item.id ?? "")
                    .toLowerCase()
                    .includes(search) ||
                String(item.empId ?? "")
                    .toLowerCase()
                    .includes(search);

            const typeMatched =
                !bulkAdvanceFilter.type ||
                String(item.type ?? "")
                    .toLowerCase() ===
                String(
                    bulkAdvanceFilter.type
                ).toLowerCase();

            let dateMatched = true;

            if (
                bulkAdvanceFilter.date
            ) {

                const selectedDate =
                    new Date(
                        bulkAdvanceFilter.date
                    );

                if (
                    !isNaN(
                        selectedDate.getTime()
                    )
                ) {

                    const day =
                        String(
                            selectedDate.getDate()
                        ).padStart(2, "0");

                    const month =
                        String(
                            selectedDate.getMonth() + 1
                        ).padStart(2, "0");

                    const year =
                        selectedDate.getFullYear();

                    const formattedFilterDate =
                        `${day}/${month}/${year}`;

                    dateMatched =
                        item.deductionDate ===
                        formattedFilterDate;
                }
            }

            const statusMatched =
                !bulkAdvanceFilter.status ||
                (
                    bulkAdvanceFilter.status ===
                        "valid"
                        ? item.validEmployee
                        : !item.validEmployee
                );

            return (
                searchMatched &&
                typeMatched &&
                dateMatched &&
                statusMatched
            );
        });

    /*
     * PAGINATION
     */

    const currentPage =
        bulkAdvanceFilter.page;

    const localTotalPages =
        Math.max(
            1,
            Math.ceil(
                filteredPreviewData.length /
                recordsPerPage
            )
        );

    const safeCurrentPage =
        Math.min(
            currentPage,
            localTotalPages
        );

    const startIndex =
        (safeCurrentPage - 1) *
        recordsPerPage;

    const paginatedPreviewData =
        filteredPreviewData.slice(
            startIndex,
            startIndex + recordsPerPage
        );


    const filteredTotalAmount =
        filteredPreviewData.reduce(
            (total, item) =>
                total +
                (
                    Number(item.amount) ||
                    0
                ),
            0
        );

    const filteredValidRecords =
        filteredPreviewData.filter(
            (item) =>
                item.validEmployee
        ).length;

    const filteredInvalidRecords =
        filteredPreviewData.filter(
            (item) =>
                !item.validEmployee
        ).length;



 

    const SummaryCard = ({
        icon,
        title,
        value,
        type
    }) => {

        return (
            <div
                className={`summary-card ${
                    type || ""
                }`}
            >

                {icon && (
                    <div className="summary-icon">
                        <i
                            className={`ti ${icon}`}
                        ></i>
                    </div>
                )}

                <div className="summary-content">

                    <span>
                        {title}
                    </span>

                    <strong>
                        {value}
                    </strong>

                </div>

            </div>
        );
    };

    const renderNavigation = () => (

        <div className="adv2-navigation-cards">

            <button
                type="button"
                className={`adv2-navigation-card adv2-navigation-bulk ${
                    activeAdvanceSection === "bulk"
                        ? "adv2-navigation-active"
                        : ""
                }`}
                 onClick={() =>
                    setActiveAdvanceSection(
                        "bulk"
                    )
                }
              
            >

                <div className="adv2-navigation-icon">
                    <i className="ti ti-file-spreadsheet"></i>
                </div>

                <div className="adv2-navigation-details">

                    <span>01</span>

                    <h3>
                        Bulk Advance Entry
                    </h3>

                    <p>
                        Upload and validate multiple employee advances.
                    </p>

                </div>

                <div className="adv2-navigation-arrow">
                    <i className="ti ti-arrow-right"></i>
                </div>

            </button>

            <button
                type="button"
                className={`adv2-navigation-card adv2-navigation-outstanding ${
                    activeAdvanceSection === "outstanding"
                        ? "adv2-navigation-active"
                        : ""
                }`}
                  onClick={() => onCliclOutStandingCard()}
            >

                <div className="adv2-navigation-icon">
                    <i className="ti ti-wallet"></i>
                </div>

                <div className="adv2-navigation-details">

                    <span>02</span>

                    <h3>
                        Outstanding Advance
                    </h3>

                    <p>
                        View and manage outstanding employee balances.
                    </p>

                </div>

                <div className="adv2-navigation-arrow">
                    <i className="ti ti-arrow-right"></i>
                </div>

            </button>

            <button
                type="button"
                className={`adv2-navigation-card adv2-navigation-manual ${
                    activeAdvanceSection === "manual"
                        ? "adv2-navigation-active"
                        : ""
                }`}
                onClick={() =>
                    setActiveAdvanceSection("manual")
                }
            >

                <div className="adv2-navigation-icon">
                    <i className="ti ti-cash"></i>
                </div>

                <div className="adv2-navigation-details">

                    <span>03</span>

                    <h3>
                        Manual Advance
                    </h3>

                    <p>
                        Record manual deductions and payment details.
                    </p>

                </div>

                <div className="adv2-navigation-arrow">
                    <i className="ti ti-arrow-right"></i>
                </div>

            </button>

        </div>
    );

    return (

        <div className="id-layout-wrapper">

            <Sidebar
                activePage="advance"
                activeSubMenu={activeSubMenu}
                salaryOpen={salaryOpen}
                setSalaryOpen={setSalaryOpen}
                setActiveSubMenu={setActiveSubMenu}
                TabClick={TabClick}
            />

            <div className="adv2-page">

                <div className="adv2-scroll-container">

                    <div className="adv2-page-intro">

                        <div>

                            <span className="adv2-page-label">
                                ADVANCE MANAGEMENT
                            </span>

                            <h2>
                                Manage Employee Advances
                            </h2>

                            <p>
                                Choose a module below to manage employee advances.
                            </p>

                        </div>

                    </div>

                    {renderNavigation()}

                    <div className="adv2-section-divider">

                        <span>
                            {
                                activeAdvanceSection === "bulk" ? "Bulk Advance Entry"  : activeAdvanceSection === "outstanding"
                                        ? "Outstanding Advance"
                                        : "Manual Advance"
                            }
                        </span>

                    </div>

                    {activeAdvanceSection === "bulk" && (

                        <section className="adv2-section">

                            <div className="adv2-section-header">

                                <div className="adv2-section-header-left">

                                    <div className="adv2-section-number">
                                        01
                                    </div>

                                    <div>

                                        <span>
                                            Bulk Advance Entry
                                        </span>

                                        <h2>
                                            Bulk Advance Entry
                                        </h2>

                                        <p>
                                            Upload Excel file and validate employee advance records in bulk.
                                        </p>

                                    </div>

                                </div>

                                <div className="adv2-section-header-icon">
                                    <i className="ti ti-file-spreadsheet"></i>
                                </div>

                            </div>

                            <div className="adv2-section-body">

                                <div className="advance-card bulk-card">

                                    <div className="card-title">

                                        <div className="title-icon">
                                            <i className="ti ti-upload"></i>
                                        </div>

                                        <h2>
                                            BULK ADVANCE ENTRY
                                        </h2>

                                    </div>

                                    <div className="section-block">

                                        <div className="step-heading">

                                            <span className="step-number">
                                                1
                                            </span>

                                            <h3>
                                                Upload Excel File
                                            </h3>

                                        </div>

                                        <p className="section-description">
                                            Upload excel file as per the given format.
                                        </p>

                                        <div className="excel-format-box">

                                            <div className="format-title">
                                                Excel Format
                                            </div>

                                            <div className="format-row">
                                                <strong>Row 1</strong>
                                                <strong>ID</strong>
                                                <strong>AMOUNT</strong>
                                                <strong>TYPE</strong>
                                                <strong>DATE</strong>
                                                <strong>CATEGORY</strong>
                                            </div>

                                            <div className="format-row">
                                                <strong>Row 2</strong>
                                                <span>1001</span>
                                                <span>15000</span>
                                                <span>CASH ADVANCE</span>
                                                <span>01-07-2026</span>
                                                <span>WORKER</span>
                                            </div>

                                            <div className="format-row">
                                                <strong>Row 3</strong>
                                                <span>56</span>
                                                <span>10000</span>
                                                <span>EXIT ADVANCE</span>
                                                <span>01-07-2026</span>
                                                <span>STAFF</span>
                                            </div>

                                            <div className="format-row">
                                                <strong>Row 4</strong>
                                                <span>10111</span>
                                                <span>8000</span>
                                                <span>FINE ADVANCE</span>
                                                <span>09-07-2026</span>
                                                <span>WORKER</span>
                                            </div>

                                        </div>

                                        <div className="upload-area">

                                            <div className="selected-file">

                                                <div className="excel-file-icon">
                                                    <i className="ti ti-file-spreadsheet"></i>
                                                </div>

                                                <span
                                                    className={
                                                        file
                                                            ? "file-name selected"
                                                            : "file-name"
                                                    }
                                                >
                                                    {
                                                        file
                                                            ? file.name
                                                            : "No file chosen"
                                                    }
                                                </span>

                                            </div>

                                            <label
                                                className={`choose-file-button input-half ${
                                                    importDerrors.isfile
                                                        ? "error-input-advance"
                                                        : ""
                                                }`}
                                            >

                                                Choose Excel File

                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    key={fileDKey}
                                                    onChange={
                                                        handleImportDfileChange
                                                    }
                                                    name="isfile"
                                                    hidden
                                                />

                                            </label>

                                            <button
                                                type="button"
                                                className="primary-button upload-button"
                                                onClick={
                                                    onclickuploadDbtn
                                                }
                                            >

                                                <i className="ti ti-upload"></i>
                                                Upload

                                            </button>

                                        </div>

                                        <div className="file-hint">
                                            Only .xlsx, .xls files are allowed.
                                        </div>

                                    </div>

                                    <div className="divider"></div>

                                    <div className="section-block preview-section">

                                        <div className="preview-heading">

                                            <div className="step-heading">

                                                <span className="step-number">
                                                    2
                                                </span>

                                                <h3>
                                                    Preview &amp; Validate
                                                </h3>

                                            </div>

                                            <button
                                                type="button"
                                                className="validate-button"
                                                onClick={
                                                    handleBulkAdvanceFilterSearch
                                                }
                                            >

                                                <i className="ti ti-refresh"></i>
                                                Validate Data

                                            </button>

                                        </div>

                                        <div className="preview-filter-container">

                                            <div className="preview-filter search-filter">

                                                <label>
                                                    Search Employee
                                                </label>

                                                <div className="preview-input-wrapper">

                                                    <i className="ti ti-search"></i>

                                                    <input
                                                        type="text"
                                                        placeholder="Search Employee ID..."
                                                        value={
                                                            bulkAdvanceFilter.search
                                                        }
                                                        onChange={(e) =>
                                                            handleBulkAdvanceFilterChange(
                                                                "search",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="preview-filter">

                                                <label>
                                                    Type of Advance
                                                </label>

                                                <select
                                                    value={
                                                        bulkAdvanceFilter.type
                                                    }
                                                    onChange={(e) =>
                                                        handleBulkAdvanceFilterChange(
                                                            "type",
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        All Types
                                                    </option>

                                                    {
                                                        [
                                                            ...new Set(
                                                                previewData
                                                                    .map(
                                                                        (item) =>
                                                                            item.type
                                                                    )
                                                                    .filter(Boolean)
                                                            )
                                                        ].map(
                                                            (type) => (
                                                                <option
                                                                    key={type}
                                                                    value={type}
                                                                >
                                                                    {type}
                                                                </option>
                                                            )
                                                        )
                                                    }

                                                </select>

                                            </div>

                                            <div className="preview-filter">

                                                <label>
                                                    Date of Advance
                                                </label>

                                                <input
                                                    type="date"
                                                    value={
                                                        bulkAdvanceFilter.date
                                                    }
                                                    onChange={(e) =>
                                                        handleBulkAdvanceFilterChange(
                                                            "date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="preview-filter">

                                                <label>
                                                    Status
                                                </label>

                                                <select
                                                    value={
                                                        bulkAdvanceFilter.status
                                                    }
                                                    onChange={(e) =>
                                                        handleBulkAdvanceFilterChange(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        All Status
                                                    </option>

                                                    <option value="valid">
                                                        Valid
                                                    </option>

                                                    <option value="invalid">
                                                        Invalid
                                                    </option>

                                                </select>

                                            </div>

                                            <button
                                                type="button"
                                                className="preview-search-button"
                                                onClick={
                                                    handleBulkAdvanceFilterSearch
                                                }
                                            >

                                                <i className="ti ti-search"></i>
                                                Search

                                            </button>

                                            <button
                                                type="button"
                                                className="clear-preview-filter"
                                                onClick={
                                                    handleBulkAdvanceFilterClear
                                                }
                                            >

                                                <i className="ti ti-filter-off"></i>
                                                Clear

                                            </button>

                                        </div>

                                        <div className="preview-result-info">

                                            <span>

                                                Showing{" "}

                                                <strong>
                                                    {
                                                        filteredPreviewData.length > 0
                                                            ? startIndex + 1
                                                            : 0
                                                    }
                                                </strong>

                                                {" - "}

                                                <strong>
                                                    {
                                                        Math.min(
                                                            startIndex +
                                                                recordsPerPage,
                                                            filteredPreviewData.length
                                                        )
                                                    }
                                                </strong>

                                                {" of "}

                                                <strong>
                                                    {
                                                        filteredPreviewData.length
                                                    }
                                                </strong>

                                                {" records"}

                                            </span>

                                        </div>

                                        <div className="table-wrapper preview-table-wrapper">

                                            <table className="advance-table preview-table">

                                                <thead>

                                                    <tr>

                                                        <th>
                                                            Employee ID
                                                        </th>

                                                        <th>
                                                            Amount
                                                        </th>

                                                        <th>
                                                            Type of Advance
                                                        </th>

                                                        <th>
                                                            Date of Advance
                                                        </th>

                                                        <th>
                                                            Status
                                                        </th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {
                                                        paginatedPreviewData.length > 0
                                                            ? paginatedPreviewData.map(
                                                                (item, index) => (

                                                                    <tr
                                                                        key={
                                                                            `${item.id}-${item.excelRow ?? index}`
                                                                        }
                                                                    >

                                                                        <td>
                                                                            {item.id}
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                Number(
                                                                                    item.amount
                                                                                ).toLocaleString(
                                                                                    "en-IN"
                                                                                )
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {item.type}
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item.deductionDate
                                                                            }
                                                                        </td>

                                                                        <td>

                                                                            {
                                                                                item.validEmployee
                                                                                    ? (
                                                                                        <span className="status-valid">

                                                                                            <i className="ti ti-circle-check"></i>

                                                                                            Valid

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span className="status-in-valid">

                                                                                            <i className="ti ti-alert-circle"></i>

                                                                                            Invalid

                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )
                                                            : (
                                                                <tr>

                                                                    <td
                                                                        colSpan="5"
                                                                        className="preview-empty"
                                                                    >

                                                                        <i className="ti ti-database-off"></i>

                                                                        No records found

                                                                    </td>

                                                                </tr>
                                                            )
                                                    }

                                                </tbody>

                                            </table>

                                        </div>

                                     <div className="preview-pagination">

                                        <button
                                            type="button"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                if (currentPage > 1) {
                                                    setBulkAdvanceFilter((prev) => ({
                                                        ...prev,
                                                        page: prev.page - 1
                                                    }));
                                                }
                                            }}
                                        >
                                            <i className="ti ti-chevron-left"></i>
                                            Previous
                                        </button>

                                        <div className="preview-page-info">
                                            Page <strong>{currentPage}</strong> of{" "}
                                            <strong>{localTotalPages}</strong>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={currentPage >= localTotalPages}
                                            onClick={() => {
                                                if (currentPage < localTotalPages) {
                                                    setBulkAdvanceFilter((prev) => ({
                                                        ...prev,
                                                        page: prev.page + 1
                                                    }));
                                                }
                                            }}
                                        >
                                            Next
                                            <i className="ti ti-chevron-right"></i>
                                        </button>

                                    </div>

                                        <div className="bulk-summary">

                                            <SummaryCard
                                                icon="ti-users"
                                                title="Total Employees"
                                                value={
                                                    filteredPreviewData.length
                                                }
                                                type="employees"
                                            />

                                            <SummaryCard
                                                icon="ti-currency-rupee"
                                                title="Total Amount"
                                                value={`₹ ${filteredTotalAmount.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}`}
                                                type="amount"
                                            />

                                            <SummaryCard
                                                icon="ti-circle-check"
                                                title="Valid Records"
                                                value={
                                                    filteredValidRecords
                                                }
                                                type="valid"
                                            />

                                            <SummaryCard
                                                icon="ti-alert-triangle"
                                                title="Invalid Records"
                                                value={
                                                    filteredInvalidRecords
                                                }
                                                type="invalid"
                                            />

                                        </div>

                                    </div>

                                    <div className="divider"></div>

                                    <div className="bulk-actions">

                                        <button
                                            type="button"
                                            className="secondary-action"
                                        >

                                            <i className="ti ti-download"></i>

                                            Download Sample Excel

                                        </button>

                                        <button
                                            type="button"
                                            className="clear-action"
                                            onClick={() => {

                                                setPreviewData([]);

                                                setBulkAdvanceFilter({
                                                    search: "",
                                                    type: "",
                                                    date: "",
                                                    status: "",
                                                    page: 1
                                                });

                                                setBulkAdvanceTotalPages(1);
                                                setBulkAdvanceTotalElements(0);
                                                setBulkAdvanceTotalAmount(0);

                                                setFile(null);
                                                setImportDdata({
                                                    isfile: ""
                                                });

                                                setFileDKey(
                                                    Date.now()
                                                );
                                            }}
                                        >

                                            <i className="ti ti-trash"></i>

                                            Clear

                                        </button>

                                        <button
                                            type="button"
                                            className="primary-button save-button"
                                            onClick={onclickuploadFinalAdvancebtn}
                                        >

                                            <i className="ti ti-device-floppy"></i>

                                            Save All Advances

                                        </button>

                                    </div>

                                </div>

                            </div>

                            <div className="adv2-bottom-note">

                                <div className="adv2-note-icon">
                                    <i className="ti ti-info-circle"></i>
                                </div>

                                <div>

                                    <strong>
                                        Note :
                                    </strong>{" "}

                                    Please ensure the Excel file follows the exact
                                    format.

                                </div>

                            </div>

                        </section>
                    )}

                    {activeAdvanceSection === "outstanding" && (

                        <section className="adv2-section">

                            <div className="adv2-section-header">

                                <div className="adv2-section-header-left">

                                    <div className="adv2-section-number">
                                        02
                                    </div>

                                    <div>

                                        <span>
                                            Outstanding Advance
                                        </span>

                                        <h2>
                                            Outstanding Advance
                                        </h2>

                                        <p>
                                            View, filter and manage employee outstanding advance balances.
                                        </p>

                                    </div>

                                </div>

                                <div className="adv2-section-header-icon">
                                    <i className="ti ti-wallet"></i>
                                </div>

                            </div>

                            <div className="adv2-section-body">

                                <div className="advance-card outstanding-card">

                                    <div className="card-title">

                                        <div className="title-icon">
                                            <i className="ti ti-user-dollar"></i>
                                        </div>

                                        <h2>
                                            OUTSTANDING ADVANCE
                                        </h2>

                                    </div>

                                    <div className="outstanding-summary">

                                        <SummaryCard
                                            title="Total Employees"
                                            value={outstandingAdvanceData.totalEmployees}
                                        />

                                        <SummaryCard
                                            title="Total Advance"
                                            value={`₹ ${outstandingAdvanceData.totalAdvance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="advance"
                                        />

                                        <SummaryCard
                                            title="Total Recovered"
                                            value={`₹ ${outstandingAdvanceData.totalRecovered.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="recovered"
                                        />

                                        <SummaryCard
                                            title="Total Outstanding"
                                            value={`₹ ${outstandingAdvanceData.totalBalanceAdvance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="outstanding"
                                        />

                                    </div>

                                    <div className="filter-area">

                                        <div className="filter-row">

                                            <div className="filter-field employee-filter">

                                                <label>
                                                    Employee ID / Name
                                                </label>

                                                <div className="input-with-icon">

                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        value={OSAdvanceFilter.search}
                                                        onChange={(e) =>
                                                            setOSAdvanceFilter((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                                                        }
                                                    />

                                                    <i className="ti ti-search"></i>

                                                </div>

                                            </div>

                                            <div className="filter-field">

                                                <label>
                                                    Department
                                                </label>

                                                <div className="select-wrapper">

                                                    <select
                                                        defaultValue=""
                                                        value={OSAdvanceFilter.department}
                                                        onChange={(e) =>
                                                            setOSAdvanceFilter((prev) => ({ ...prev, department: e.target.value, page: 1 }))
                                                        }
                                                    >

                                                        <option value="">
                                                            All Department
                                                        </option>

                                                        <option>
                                                            Harvesting
                                                        </option>

                                                        <option>
                                                            Packing
                                                        </option>

                                                        <option>
                                                            Maintenance
                                                        </option>

                                                        <option>
                                                            Quality
                                                        </option>

                                                        <option>
                                                            Production
                                                        </option>

                                                    </select>

                                                    <i className="ti ti-chevron-down"></i>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="filter-row">

                                            <div className="filter-field">

                                                <label>
                                                    Advance Type
                                                </label>

                                                <div className="select-wrapper">

                                                    <select
                                                        defaultValue=""
                                                        value={OSAdvanceFilter.advanceType}
                                                        onChange={(e) =>
                                                            setOSAdvanceFilter((prev) => ({ ...prev, advanceType: e.target.value, page: 1 }))
                                                        }
                                                    >

                                                        <option value="">
                                                            All Type
                                                        </option>

                                                        <option>
                                                            Salary Advance
                                                        </option>

                                                        <option>
                                                            Medical Advance
                                                        </option>

                                                        <option>
                                                            Emergency Advance
                                                        </option>

                                                        <option>
                                                            Festival Advance
                                                        </option>

                                                    </select>

                                                    <i className="ti ti-chevron-down"></i>

                                                </div>

                                            </div>

                                            <div className="filter-field">

                                                <label>
                                                    Category
                                                </label>

                                                <div className="select-wrapper">

                                                    <select
                                                     defaultValue="ALL"
                                                        value={OSAdvanceFilter.category}
                                                        onChange={(e) =>
                                                            setOSAdvanceFilter((prev) => ({ ...prev, category: e.target.value, page: 1 }))
                                                        }
                                                    >
                                                     <option>
                                                            All
                                                        </option>

                                                        <option>
                                                            STAFF
                                                        </option>

                                                        <option>
                                                            WORKER
                                                        </option>

                                                    </select>

                                                    <i className="ti ti-chevron-down"></i>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="filter-actions">

                                            <button
                                                type="button"
                                                className="primary-button search-button"
                                                onClick = {() => {setOSCurrentPage(1),OSAdvanceFilterChange(OSAdvanceFilter),  setSearchedStatus(OSAdvanceFilter.status);}}
                                            >

                                                <i className="ti ti-search"></i>
                                                Search

                                            </button>

                                            <button
                                                type="button"
                                                className="reset-button"
                                            >
                                                Reset
                                            </button>

                                            <button
                                                type="button"
                                                className="export-button"
                                            >

                                                <i className="ti ti-file-spreadsheet"></i>

                                                Export Excel

                                            </button>

                                        </div>

                                    </div>

                                    <div className="table-wrapper outstanding-table-wrapper">

                                        <table className="advance-table outstanding-table">

                                            <thead>

                                                <tr>
                                                    <th>Employee ID</th>
                                                    <th>Employee Name</th>
                                                    <th>Department</th>
                                                <th>
                                                    {searchedStatus === "Recovered"
                                                        ? "Recovered Amount"
                                                        : "Outstanding Amount"}
                                                </th>
                                                    <th>Action</th>
                                                </tr>

                                            </thead>

                                            <tbody>

                                                {
                                                outstandingData.length > 0 ?
                                                    outstandingData.map(
                                                        (item) => (

                                                            <tr
                                                                key={item.id}
                                                            >

                                                                <td>
                                                                    {item.id}
                                                                </td>

                                                                <td>
                                                                    {item.name}
                                                                </td>

                                                                <td>
                                                                    {item.department}
                                                                </td>

                                                                <td className="outstanding-amount">
                                                                    {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="view-button"
                                                                        onClick={() => handleView(item.id)}
                                                                    >
                                                                        <i className="ti ti-eye"></i>
                                                                    </button>
                                                                </td>

                                                            </tr>

                                                        )
                                                    ) 
                                                            : (
                                                                <tr>

                                                                    <td
                                                                        colSpan="5"
                                                                        className="preview-empty"
                                                                    >

                                                                        <i className="ti ti-database-off"></i>

                                                                        No records found

                                                                    </td>

                                                                </tr>
                                                            )
                                                }

                                            </tbody>

                                        </table>
                                {showAdvanceModal && (
                                    <div className="advance-modal-overlay" onClick={() => setShowAdvanceModal(false)}>
                                        <div className="advance-modal" onClick={(e) => e.stopPropagation()}>

                                            <div className="advance-modal-header">
                                                <h3>
                                                    {searchedStatus === "Recovered"
                                                        ? "Recovered Advance Details"
                                                        : "Outstanding Advance Details"}
                                                </h3>

                                                <button
                                                    className="advance-close-btn"
                                                    onClick={() => setShowAdvanceModal(false)}
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="advance-modal-body">

                                                <table className="advance-detail-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Emp ID</th>
                                                            <th>Amount</th>
                                                            <th>OutStanding Amount</th>
                                                            <th>Type</th>
                                                            <th>Date</th>
                                                            <th>Category</th>
                                                            <th>Remarks</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {advanceDetails?.length > 0 ? (
                                                            (() => {
                                                                const sortedData = [...advanceDetails]
                                                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                                                                let outstanding = 0;
                                                                const outstandingValues = new Array(sortedData.length);

                                                                for (let i = sortedData.length - 1; i >= 0; i--) {
                                                                    const amount = Number(sortedData[i].amount);

                                                                    outstanding += sortedData[i].type === "DEDUCTION"
                                                                        ? -amount
                                                                        : amount;

                                                                    outstandingValues[i] = outstanding;
                                                                }

                                                                return sortedData.map((item, index) => (
                                                                    <tr
                                                                        key={index}
                                                                        style={{
                                                                            color: item.type === "DEDUCTION" ? "red" : "green"
                                                                        }}
                                                                    >
                                                                        <td>{item.empId}</td>

                                                                        <td>
                                                                            {item.type === "DEDUCTION" ? "( - ) " : "( + ) "}
                                                                            {Number(item.amount).toLocaleString("en-IN", {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2
                                                                            })}
                                                                        </td>

                                                                        <td>
                                                                            {outstandingValues[index].toLocaleString("en-IN", {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2
                                                                            })}
                                                                        </td>

                                                                        <td>
                                                                            {searchedStatus === "Recovered"
                                                                                ? "Recovered"
                                                                                : item.type}
                                                                        </td>

                                                                        <td>
                                                                            {searchedStatus === "Recovered"
                                                                                ? `${item.date}/${item.month}/${item.year}`
                                                                                : item.deductionDate}
                                                                        </td>

                                                                        <td>
                                                                            {searchedStatus === "Recovered"
                                                                                ? "-"
                                                                                : item.category || "-"}
                                                                        </td>

                                                                        <td>{item.remarks || "-"}</td>
                                                                    </tr>
                                                                ));
                                                            })()
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="no-data">
                                                                    No Records Found
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>
                                    </div>
                                )}
                                         <div className="preview-pagination">

                                        <button
                                            type="button"
                                            disabled={OSAdvanceFilter.page === 1}
                                            onClick={()=>{
                                                    if(OSAdvanceFilter.page>1){
                                                        const filter={...OSAdvanceFilter,page:OSAdvanceFilter.page-1};
                                                        setOSAdvanceFilter(filter);
                                                        OSAdvanceFilterChange(filter);
                                                        
                                                    }
                                                }
                                        }
                                        >
                                            <i className="ti ti-chevron-left"></i>
                                            Previous
                                        </button>

                                        <div className="preview-page-info">
                                            Page <strong>{OSAdvanceFilter.page}</strong> of <strong>{oSTotalPages}</strong>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={OSAdvanceFilter.page >= oSTotalPages}
                                                onClick={()=>{
                                                    if(OSAdvanceFilter.page<oSTotalPages){
                                                        const filter={...OSAdvanceFilter,page:OSAdvanceFilter.page+1};
                                                        setOSAdvanceFilter(filter);
                                                          OSAdvanceFilterChange(filter);
                                                    }
                                                }
                                            }
                                        >
                                            Next
                                            <i className="ti ti-chevron-right"></i>
                                        </button>

                                    </div>

                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                    {activeAdvanceSection === "manual" && (

                        <section className="adv2-section">

                            <div className="adv2-section-header">

                                <div className="adv2-section-header-left">

                                    <div className="adv2-section-number">
                                        03
                                    </div>

                                    <div>

                                        <span>
                                            Manual Advance
                                        </span>

                                        <h2>
                                            Manual Advance
                                        </h2>

                                        <p>
                                            Record manual deductions, voucher information and payment details.
                                        </p>

                                    </div>

                                </div>

                                <div className="adv2-section-header-icon">
                                    <i className="ti ti-cash"></i>
                                </div>

                            </div>

                            <div className="adv2-section-body">

                                <div className="manual-deduction-layout">

                                    <div className="manual-left-column">

                                        <div className="advance-card manual-employee-card">

                                            <div className="manual-card-heading">

                                                <div className="manual-card-heading-icon">
                                                    <i className="ti ti-user"></i>
                                                </div>

                                                <h2>
                                                    1. Employee Details
                                                </h2>

                                            </div>

                                            <div className="manual-employee-grid">

                                                <div className="manual-form-field">

                                                    <label>
                                                        Employee ID
                                                    </label>

                                                          <div className={`manual-search-field ${manualErrors.empID ? "manual-error" : ""}`}>

                                                         <input
                                                        type="text"
                                                        name="empId"
                                                        value={mAFilterBySearch.empID}
                                                        onChange={(e) => {
                                                            handleManualsearchChange("empID", e.target.value);
                                                            setManualErrors((prev) => ({
                                                                ...prev,
                                                                empID: false
                                                            }));
                                                        }}
                                                        placeholder="Enter Employee ID"
                                                    />

                                                        <button
                                                            type="button"
                                                            className="manual-search-button"
                                                           onClick={() => FrilteredByEmpID(mAFilterBySearch.empID)}
                                                        >

                                                            <i className="ti ti-search"></i>

                                                        </button>

                                                    </div>

                                                </div>

                                                <div className="manual-form-field">

                                                    <label>
                                                        Employee Name
                                                    </label>

                                                    <div className="manual-input-icon">

                                                        <i className="ti ti-user"></i>

                                                        <input
                                                            type="text"
                                                            name="empName"
                                                            disabled = {true}
                                                            value={
                                                                mAFilterBySearch.name
                                                            }
                                                             onChange={(e) => handleManualsearchChange( "name", e.target.value)}
                                                            placeholder="Employee Name"
                                                        />

                                                    </div>

                                                </div>

                                                <div className="manual-form-field">

                                                    <label>
                                                        Department
                                                    </label>

                                                    <div className="manual-input-icon">

                                                        <i className="ti ti-building"></i>

                                                        <input
                                                            type="text"
                                                            name="department"
                                                            disabled = {true}
                                                            value={
                                                                mAFilterBySearch.department
                                                            }
                                                             onChange={(e) => handleManualsearchChange( "departments", e.target.value)}
                                                            placeholder="Department"
                                                        />

                                                    </div>

                                                </div>

                                                <div className="manual-form-field">

                                                    <label>
                                                        Total Outstanding
                                                    </label>

                                                    <div className="manual-outstanding-box">
                                                       ₹   {mAFilterBySearch.outStanding.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </div>

                                                </div>

                                            </div>
                                            

                                        </div>
                                          <div className="advance-card manual-info-card">

            <div className="manual-card-heading">
                <div className="manual-card-heading-icon">
                    <i className="ti ti-info-circle"></i>
                </div>
                <h2>3. Deduction Type Explained</h2>
            </div>

            <div className="table-wrapper">

                <table className="advance-table">

                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>Cash Deduction</td>
                            <td>Amount collected directly from employee in cash.</td>
                        </tr>

                        <tr>
                            <td>Voucher Deduction</td>
                            <td>Amount adjusted using Missing Wages Voucher.</td>
                        </tr>

                        <tr>
                            <td>Other Deduction</td>
                            <td>Any other type of manual deduction.</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
                                        

                                    </div>

                                    <div className="advance-card manual-details-card">

                                        <div className="manual-card-heading">

                                            <div className="manual-card-heading-icon">
                                                <i className="ti ti-file-invoice"></i>
                                            </div>

                                            <h2>
                                                2. Manual Deduction Details
                                            </h2>

                                        </div>

                                        <div className="manual-details-grid">

                                            <div className="manual-form-field">

                                                <label>
                                                    Deduction Date
                                                </label>

                                               <div className={`manual-input-icon ${manualErrors.deductionDate ? "manual-error" : ""}`}>

                                                    <i className="ti ti-calendar"></i>

                                                    <input
                                                        type="date"
                                                        name="deductionDate"
                                                        value={
                                                            manualData.deductionDate
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="manual-form-field">

                                                <label>
                                                    Deduction Amount (₹)
                                                </label>

                                               <div className={`manual-input-icon ${manualErrors.deductionAmount ? "manual-error" : ""}`}>

                                                    <i className="ti ti-currency-rupee"></i>

                                                    <input
                                                        type="number"
                                                        name="deductionAmount"
                                                        value={
                                                            manualData.deductionAmount
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                        placeholder="Enter Amount"
                                                    />

                                                </div>

                                            </div>

                                            <div className="manual-form-field">

                                                <label>
                                                    Deduction Type
                                                </label>

                                                <div className={`manual-select-icon ${manualErrors.deductionType ? "manual-error" : ""}`}>

                                                    <i className="ti ti-category"></i>

                                                    <select
                                                        name="deductionType"
                                                        value={
                                                            manualData.deductionType
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                    >

                                                        <option>
                                                            Cash Deduction
                                                        </option>

                                                        <option>
                                                            Voucher Deduction
                                                        </option>

                                                        <option>
                                                            Other Deduction
                                                        </option>

                                                    </select>

                                                </div>

                                            </div>

                                           <div className="manual-form-field">

                                                <label>
                                                    Payment Mode
                                                </label>

                                                 <div className={`manual-select-icon ${manualErrors.paymentMode ? "manual-error" : ""}`}>

                                                    <i className="ti ti-wallet"></i>

                                                    <select
                                                        name="paymentMode"
                                                        value={
                                                            manualData.paymentMode
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                    >

                                                        <option>
                                                            Cash
                                                        </option>

                                                        <option>
                                                            Voucher
                                                        </option>

                                                        <option>
                                                            Bank Transfer
                                                        </option>

                                                        <option>
                                                            UPI
                                                        </option>

                                                        <option>
                                                            Cheque
                                                        </option>

                                                    </select>

                                                </div>

                                            </div>

                                            <div className="manual-form-field">

                                                <label>
                                                    Voucher No.
                                                </label>

                                               <div className={`manual-input-icon ${manualErrors.voucherNo ? "manual-error" : ""}`}>

                                                    <i className="ti ti-file-invoice"></i>

                                                    <input
                                                        type="text"
                                                        name="voucherNo"
                                                        value={
                                                            manualData.voucherNo
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                        placeholder="Enter Voucher Number"
                                                    />

                                                </div>

                                            </div>

                                            <div className="manual-form-field">

                                                <label>
                                                    Voucher Date
                                                </label>

                                               <div className={`manual-input-icon ${manualErrors.voucherDate ? "manual-error" : ""}`}>

                                                    <i className="ti ti-calendar"></i>

                                                    <input
                                                        type="date"
                                                        name="voucherDate"
                                                        value={
                                                            manualData.voucherDate
                                                        }
                                                        onChange={
                                                            handleManualChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="manual-form-field manual-form-full">

                                                <label>
                                                    Remarks
                                                </label>

                                                <textarea
                                                    className={manualErrors.remarks ? "manual-error" : ""}
                                                    name="remarks"
                                                    value={manualData.remarks}
                                                    onChange={handleManualChange}
                                                    placeholder="Enter Remarks"
                                                    rows="3"
                                                />

                                            </div>

                                         <div className="voucher-upload-section">

    <label>
        Upload Voucher / Receipt
    </label>

    <div className={`voucher-upload-box ${manualErrors.file ? "manual-error" : ""}`}>

        <label className="voucher-upload-btn">

            <i className="ti ti-upload"></i>

            Choose File

            <input
                type="file"
                hidden
                onChange={handleManualFileChange}
            />

        </label>

        {manualData.file ? (
            <>
                <span className="voucher-file-name">
                    {manualData.file.name}
                </span>

                <button
                    type="button"
                    className="voucher-remove-btn"
                    onClick={() =>
                        setManualData(prev => ({
                            ...prev,
                            file: null
                        }))
                    }
                >
                    <i className="ti ti-trash"></i>
                    Remove
                </button>
            </>
        ) : (
            <span className="voucher-placeholder">
                No file selected
            </span>
        )}

    </div>

</div>

                                        </div>

                                        <div className="manual-form-divider"></div>

                                        <div className="manual-form-actions">

                                            <button
                                                type="button"
                                                className="primary-button manual-save-button"
                                                onClick={
                                                    saveManualDeduction
                                                }
                                            >

                                                <i className="ti ti-device-floppy"></i>

                                                Save Deduction

                                            </button>

                                            <button
                                                type="button"
                                                className="clear-action"
                                                onClick={
                                                    clearManualForm
                                                }
                                            >

                                                <i className="ti ti-refresh"></i>

                                                Clear

                                            </button>

                                        </div>
                                        

                                    </div>                                   

                                </div>

                                <div className="advance-card manual-history-card">

                                    <div className="manual-card-heading">

                                        <div className="manual-card-heading-icon">
                                            <i className="ti ti-history"></i>
                                        </div>

                                        <h2>
                                            4. Manual Deduction History
                                        </h2>

                                    </div>

                                    <div className="table-wrapper manual-history-table-wrapper">

                                        <table className="advance-table manual-history-table">

                                            <thead>

                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Date</th>
                                                    <th>Deduction Type</th>
                                                    <th>Payment Mode</th>
                                                    <th>Voucher No.</th>
                                                    <th>Amount (₹)</th>
                                                    <th>Uploaded File</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>

                                            </thead>

                                            <tbody>

                                                {manualHistoryData?.length > 0 ? (
                                                    manualHistoryData.map(
                                                        (item,index) => (

                                                            <tr
                                                                key={item.id}
                                                            >

                                                                <td>
                                                                    {index + 1}
                                                                </td>

                                                                <td>
                                                                    {item.date}
                                                                </td>

                                                                <td>
                                                                    {item.deductionType}
                                                                </td>

                                                                <td>
                                                                    {item.paymentMode}
                                                                </td>

                                                                <td>
                                                                    {item.voucherNo}
                                                                </td>

                                                                <td>
                                                                    {item.amount}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="manual-view-link"
                                                                        onClick={() =>
                                                                            handleViewFile(
                                                                                item.id,
                                                                                item.uploadedFileName,
                                                                                item.fileExt
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="ti ti-eye"></i>
                                                                        View
                                                                    </button>
                                                                </td>

                                                                <td>
                                                                    {item.remarks}
                                                                </td>

                                                                <td>

                                                                    <button
                                                                        type="button"
                                                                        className="manual-delete-button"
                                                                        onClick={() =>handleDeleteRecord(item.id) }
                                                                    >

                                                                        <i className="ti ti-trash"></i>

                                                                    </button>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )) : (

                                                            <tr>
                                                                <td colSpan="7" className="no-data">
                                                                    No History Found
                                                                </td>
                                                            </tr>

                                                        )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                                <div className="advance-card manual-summary-card">

                                    <div className="manual-card-heading">

                                        <div className="manual-card-heading-icon">
                                            <i className="ti ti-report-money"></i>
                                        </div>

                                        <h2>
                                            5. Deduction Summary
                                        </h2>

                                    </div>

                                    <div className="outstanding-summary">

                                        <SummaryCard
                                            title="Total Advance Amount"
                                            value={`₹ ${manualDeductionSummary.totalAdvanceAmount.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        />

                                        <SummaryCard
                                            title="Total Salary Deducted"
                                            value={`₹ ${manualDeductionSummary.totalSalaryDeducted.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="recovered"
                                        />

                                        <SummaryCard
                                            title="Total Manual Deducted"
                                            value={`₹ ${manualDeductionSummary.totalManualDeducted.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="advance"
                                        />

                                        <SummaryCard
                                            title="Total Recovered"
                                           value={`₹ ${manualDeductionSummary.totalRecovered.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="valid"
                                        />

                                        <SummaryCard
                                            title="Outstanding Amount"
                                            value={`₹ ${manualDeductionSummary.outstandingAmount.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            type="outstanding"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                    <div className="adv2-bottom-space"></div>

                </div>

            </div>
            {showFileModal && (
    <div
        className="manual-file-modal-overlay"
        onClick={() => setShowFileModal(false)}
    >
        <div
            className="manual-file-modal"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="manual-file-modal-header">
                <div className="manual-file-modal-title">
                    <i className="ti ti-file"></i>
                    <span>Document Preview</span>
                </div>

                <button
                    type="button"
                    className="manual-file-modal-close"
                    onClick={() => setShowFileModal(false)}
                >
                    <i className="ti ti-x"></i>
                </button>
            </div>

            <div className="manual-file-modal-body">
                {selectedFileType === "pdf" ? (
                    <iframe
                        src={selectedFile}
                        title="Document Preview"
                        className="manual-file-pdf"
                    />
                ) : ["jpg", "jpeg", "png", "gif"].includes(selectedFileType) ? (
                    <div className="manual-file-image-container">
                        <img
                            src={selectedFile}
                            alt="Uploaded document"
                            className="manual-file-image"
                        />
                    </div>
                ) : (
                    <div className="manual-file-unsupported">
                        <i className="ti ti-file-off"></i>
                        <h4>Preview not available</h4>
                        <p>This file type cannot be previewed.</p>
                    </div>
                )}
            </div>

            <div className="manual-file-modal-footer">
                <button
                    type="button"
                    className="manual-file-close-btn"
                    onClick={() => setShowFileModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
}