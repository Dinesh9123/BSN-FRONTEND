import { ApiPostCall ,ApiGetCall,ApiPutCall,ApiDeleteCall,ApiGetExportCall,ApiGetbarcodePreviewCall,
  ApiPostExportCall,ApiPostPICKERSALARYREPORTPreviewCall,downloadIdCardsZip} from "./api/apiCalls.jsx";

export const createEmployee = (data, callback) => {


  ApiPostCall({
    endpoint: "/employees/add",
    data: data.data,
    callback: callback,
  });
};




export const updateEmployeeApi = (data,callback) => {
  ApiPostCall({
    endpoint: "/employees/update",
    data: data.data,
    callback: callback,
  });
};

export const DeleteEmployeeList = (data,callback) => {
  ApiDeleteCall({
    endpoint: "/employees/delete/"+data.empId,
    data: data,
    callback: callback,
  });
};


export const SaveWeightData = (data, callback) => {
  ApiPostCall({
    endpoint: "/weigh/weighsave",
    data: data,
    callback: callback,
  });
};


export const FetchReportsList = (callback) => {
  ApiGetCall({
    endpoint: "/reports/all",
    params: "",
    callback: callback,
  });
};

export const DownloadPDF = (data,callback) => {
  ApiGetExportCall({
    endpoint: "/reports/export/pdf?employee="+data.employee+"&roomNo="+data.roomNo+"&startDate="+data.startDate+"&endDate="+data.endDate,
    params: "",
    callback: callback,
  });
};

export const DownloadExcel = (data,callback) => {
  ApiGetExportCall({
    endpoint: "/reports/export/excel?employee="+data.employee+"&roomNo="+data.roomNo+"&startDate="+data.startDate+"&endDate="+data.endDate,
    params: "",
    callback: callback,
  });
};


export const FetchReportsListForFilter = (data,callback) => {
  ApiPostCall({
    endpoint: "/reports/filter",
    data: data,
    callback: callback,
  });
};


export const CheckLoginCall = (data, callback) => {
  ApiPostCall({
    endpoint: "/auth/login",
    data: data,
    callback: callback
  });
};

export const FetchEmployeeList = (callback) => {
  ApiGetCall({
    endpoint: "/employees/allEmployees",
    params: "",
    callback: callback
  });
};

export const FetchEmployeeBatchList = (data,callback) => {
  ApiPostCall({
    endpoint: "/employees/barcode/page",
    data: data,
    callback: callback
  });
};

export const FetchAllEmployeeBatchList = (data,callback) => {
  ApiPostCall({
    endpoint: "/employees/GetAllEmp",
    data: data,
    callback: callback
  });
};

export const FetchEmployeeBarcode = (data,callback) => {
  ApiGetCall({
    endpoint: "/barcode/empbarcode/"+data.EmpID,
    params: "",
    callback: callback,
  });
};


export const GetPreviewImg = (data, callback) => {
  ApiGetbarcodePreviewCall({
    endpoint: "/employee/barcode/preview/"+data.EmpID+"/"+data.Count,
    callback,
  });
};

export const GetbarcodePrint = (data,callback) => {
  ApiGetCall({
    endpoint:  "/employee/barcode/print/"+data.EmpID+"/"+data.Count,
    params: "",
    callback: callback,
  });
};


export const GetAutoWeightFromComService = (callback) => {
  ApiGetCall({
    endpoint:  "/weigh/getCOMserviceValue",
    params: "",
    callback: callback,
  });
};



export const GetEmpByID = (data,callback) => {
  ApiGetCall({
    endpoint: "/employees/"+data.empId,
    params: "",
    callback: callback,
  });
};
export const GetEmpBySearchID = (data,callback) => {
  ApiPostCall({
    endpoint: "/employees/search/employee",
    data: data,
    callback: callback,
  });
};

export const GetEmpBybarcodeSearchID = (data,callback) => {
  ApiPostCall({
    endpoint: "/employees/search/employeeforbarcode",
    data: data,
    callback: callback,
  });
};
export const SetPrinterPortConfiguration = (data,callback) => {
  ApiPostCall({
    endpoint: "/printerport/set",
    data: data,
    callback: callback
  });
};

export const getPrinterPortListfromServer = (data,callback) => {
  ApiGetCall({
    endpoint: "/printerport/get/"+data.id,
    params: "",
    callback: callback,
  });
};


export const getAllEmployeeCode = (callback) => {
  ApiGetCall({
    endpoint: "/salary/getAllEmployeeCode",
    params: "",
    callback: callback,
  });
};


export const GetEmployeeSalary = (data,callback) => {
  ApiPostCall({
    endpoint: "/salary/getEmployeeSalary",
    data: data,
    callback: callback,
  });
};


export const getActiveSalaryConfigValues = (callback) => {
  ApiGetCall({
    endpoint: "/salaryconfig/getActiveSalaryConfigValues",
    params: "",
    callback: callback,
  });
};

export const SetNewSalaryConfigurations = (data,callback) => {
  ApiPostCall({
    endpoint: "/salaryconfig/setNewSalaryConfigurations",
    data: data,
    callback: callback,
  });
};

export const UploadExcelWeightData = (data,callback) => {
  ApiPostCall({
    endpoint: "/salaryconfig/uploadExcelWeightData",
    data: data,
    callback: callback,
  });
};

export const uploadContractorAmountData = (data,callback) => {
  ApiPostCall({
    endpoint: "/salaryconfig/uploadContractorAmountData",
    data: data,
    callback: callback,
  });
};

export const uploadDeductionData = (data,callback) => {
  ApiPostCall({
    endpoint: "/salaryconfig/uploadDeductionData",
    data: data,
    callback: callback,
  });
};

export const uploadDeductionsData = (data,callback) => {
  ApiPostCall({
    endpoint: "/staff-upload/deductions",
    data: data,
    callback: callback,
  });
};


export const DownloadPickerFinalSalaryReportExcel = (data,fileName,callback) => {
  ApiPostExportCall({
    endpoint: "/salary/download/salaryExcel",
    data: data,
    fileName:fileName.fileName,
    callback: callback,
  });
};

export const GETPICKERSALARYFINALREPORT = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/download/GETPICKERSALARYFINALREPORTASPDF", 
    data: data,
    callback: callback,
  });
};


export const GETPICKERSALARYREPORT = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/PICKERSALARYREPORT", 
    data: data.filters,
    callback: callback,
  });
};


export const PICKERSALARYREPORTASEXCEL = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/PICKERSALARYREPORTASEXCEL", 
    data: data.filters,
    callback: callback,
  });
};

export const MOVEMENTREPORTASEXCEL = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/MOVEMENTREPORTASEXCEL", 
    data: data.filters,
    callback: callback,
  });
};

export const MOVEMENTREPORTASPDF = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/MOVEMENTREPORTASPDF", 
    data: data.filters,
    callback: callback,
  });
};

export const FormMDetailedasEXCEL = (data,callback) => {
  ApiPostCall({
    endpoint: "/worker-report/generate/excel/form-m-detailed", 
    data: data.filters,
    callback: callback,
  });
};

export const FormMDetailedaspdf = (data,callback) => {
  ApiPostCall({
    endpoint: "/worker-report/generate/pdf/form-m-detailed", 
    data: data.filters,
    callback: callback,
  });
};
  export const FormMWeeklyaspdf = (data,callback) => {
  ApiPostCall({
    endpoint: "/worker-report/generate/pdf/form-m-15days", 
    data: data.filters,
    callback: callback,
  });
};
// New Controller for Staff Salary Report
  export const StaffSalaryaspdf = (data,callback) => {
  ApiPostCall({
    endpoint: "/salary-report/generate/pdf/staff-salary-report", 
    data: data.filters,
    callback: callback,
  });
};

// New Controller for Staff Salary Report
  export const FinalizeStaffSalaryReport = (data,callback) => {
  ApiPostCall({
    endpoint: "/salary-report/finalize/staff-salary-report", 
    data: data.filters,
    callback: callback,
  });
};
 export const FinalizeWorker15DaysSalaryReport = (data,callback) => {
  ApiPostCall({
    endpoint: "/worker-report/finalize/form-m-15days", 
    data: data.filters,
    callback: callback,
  });
};

// old Controller for Staff Salary Report
//   export const StaffSalaryaspdf = (data,callback) => {
//   ApiPostCall({
//     endpoint: "/salary/export/StaffSalaryPDF", 
//     data: data.filters,
//     callback: callback,
//   });
// };

export const FormMWeeklyasEXCEL = (data,callback) => {
  ApiPostCall({
    endpoint: "/salary/export/formMWeeklyfor15Excel", 
    data: data.filters,
    callback: callback,
  });
};

export const StaffSalaryasExcel = (data,callback) => {
  ApiPostCall({
    endpoint: "/salary-report/generate/excel/staff-salary-report", 
    data: data.filters,
    callback: callback,
  });
};
export const GrowingAspdf = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/GrowingAspdf", 
    data: data,
    callback: callback,
  });
};

export const GrowingAsExcel = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/GrowingAsExcel", 
    data: data,
    callback: callback,
  });
};
  export const PreviewWorkerIdCard = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/idcard/PreviewWorkerIdCard", 
    data: data,
    callback: callback,
  });
};

  export const PreviewStaffIdCard = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/idcard/PreviewStaffIdCard", 
    data: data,
    callback: callback,
  });
};

  export const DownloadWorkerIdCard = (data,callback) => {
  downloadIdCardsZip({
    endpoint: "/idcard/DownloadWorkerIdCard", 
    data: data,
    data1:"LANDSCAPE",
    callback: callback,
  });
};

  export const DownloadStaffIdCard = (data,callback) => {
  downloadIdCardsZip({
    endpoint: "/idcard/DownloadStaffIdCard", 
    data: data,
    data1:"PORTRAIT",
    callback: callback,
  });
};
export const uploadDriverAttendanceData = (data,callback) => {
  ApiPostCall({
    endpoint: "/upload/driver-attendance",
    data: data,
    callback: callback,
  });
};

export const FetchDepartmentList = (callback) => {
  ApiPostCall({
    endpoint: "/employees/get/department",
     data: "",
    callback: callback
  });
};


export const DAILYMOVEMENTREPORTASPDF = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/DAILYMOVEMENTREPORTASPDF", 
    data: data.filters,
    callback: callback,
  });
};

export const DAILYMOVEMENTREPORTASEXCEL = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/DAILYMOVEMENTREPORTASEXCEL", 
    data: data,
    callback: callback,
  });
};

export const GROUPSUMMARYDETAILSASPDF = (data,callback) => {
  ApiPostCall({
    endpoint: "/worker-report/generate/worker-groupsummary-report", 
    data: data.filters,
    callback: callback,
  });
};

export const GROUPSUMMARYDETAILSASEXCEL = (data,callback) => {
  ApiPostPICKERSALARYREPORTPreviewCall({
    endpoint: "/salary/export/", 
    data: data,
    callback: callback,
  });
};