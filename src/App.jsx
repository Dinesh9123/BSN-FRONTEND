import Dashboard from "./pages/dashboard.jsx"
import Employee from "./pages/employee.jsx"
import LoginPage from "./pages/loginpage.jsx";
import Reports from "./pages/reports.jsx"
import WeighingScale from "./pages/weighingscale.jsx";
import Barcode from "./pages/barcode.jsx"
import Salary from "./pages/salary.jsx";
import SalarySetting from "./pages/salarysetting.jsx"
import IDCard from "./pages/idcard.jsx"
import Advance from "./pages/advancepage.jsx"
import CommonSubMenuScreen from "./pages/submenu/commonsubmenuscreen.jsx"
import { Routes, Route } from "react-router-dom";
import { AlertProvider } from "./common/alert/alertService.jsx"
import { LoaderProvider } from "./common/loader/loaderService.jsx"


function App() {
  return (
    <LoaderProvider>
      <AlertProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/WeighingScale" element={<WeighingScale />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/barcode" element={<Barcode />} />   
          <Route path="/Salary" element={<Salary />} />     
          <Route path="/SalarySetting" element={<SalarySetting />} />     
          <Route path="/IDCard" element={<IDCard/>} />   
          <Route path="/Advance" element={<Advance/>} />   
          <Route path="/commonsubmenuscreen" element={<CommonSubMenuScreen/>} /> 
        </Routes>
      </AlertProvider>
    </LoaderProvider>
  );
}

export default App;
