import "../css/loginpage.css";
import SigninImg from "../assets/sign-img.jpg"
import HRMLogo from "../assets/HRM-logo.svg"
import { useNavigate } from "react-router-dom";
import { useLoader } from "../common/loader/loaderService";
import { CheckLoginCall,getPrinterPortListfromServer,SetPrinterPortConfiguration} from "../common/apiService.jsx";
import { useState,useContext } from "react";
import { showAlert} from "../common/alert/alertService.jsx";

export default function Login() {
  var navigate = useNavigate();




  var { showLoader, hideLoader } = useLoader();
  var [formData,setFormData] = useState({userName:"",password:""});
  var [errors,setErrors] = useState({});


   var PerformLogin = (e) => {
             setToken("");
          e.preventDefault();
          if (!validateForm()) return;
          showLoader("Please wait...");
          CheckLoginCall(
               {
                 username : formData.userName ,
                 password : formData.password
               },
               {
                success: (res) => {
                  console.log(res)
                  ValidateRes(res);
                },
                error: (err) => {
                  hideLoader();
                  console.error("Error ->"+err)
                  showAlert("Failed to Login ,Please contact administration", "ok");
                },
            }
    
          )
    
  };

  var setPrinterPortService = (data) =>{
        SetPrinterPortConfiguration(
          {
            id: data.id,
            comservice: data.comservice,
            printername: data.printername
          },
          {
            success: (res) => {
                 if(res.hasOwnProperty("code")){
                    var code = res.code;
                    if(code === "0"){
                       hideLoader();     
                    }else if(code === "-1"){
                       hideLoader();
    
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
              showAlert("Failed to set configuration !!!.");  
            },
          }
        );
  }
var getPrinterPortList =() =>{

     try {
          getPrinterPortListfromServer(
                {
                  id: localStorage.getItem("printerportconfiguniqueid")
                },
                {
                  success: (res) => {
                       if(res.hasOwnProperty("code")){
                          var code = res.code;
                          if(code === "0"){
                             setPrinterPortService(res.data[0]);
                          }else if(code === "-1"){
                             hideLoader();
          
                          } else if(code === "-101"){
                             hideLoader();
                             showAlert(res.message, "ok");
                             return;
          
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
                    showAlert("Failed to set configuration !!!.");  
                  },
                }
              );
      } catch (err) {
        hideLoader();
        console.error("Printer Error:", err);
      }
}
  var ValidateRes = (res) => {
          if(res.hasOwnProperty("code")){
             var code = res.code;
             if(code === "0"){
                var data = res.data;
                  if(!data.length == 0) {
                    var data2 = data[0];
                     if(data2.hasOwnProperty("UserDetails"))
                     {

                     }
                     if(data2.hasOwnProperty("token")){
                      var token = data2.token;                        
                        setToken(token);
                        hideLoader();
                        showAlert("Welcome "+formData.userName +"!!!");
                        navigate("/Dashboard"); 
                     }else{
                      hideLoader();
                      showAlert("Somthing went wrong , Please contact administration !!!.","ok");                         
                     }

                  }else{
                      hideLoader();
                      showAlert("Somthing went wrong , Please contact administration !!!.","ok");            
                  }
                 
             }else if(code === "-1"){
                      hideLoader();
                      setErrors({userName:true,password:true})
                      showAlert(res.message , "ok");
             }else{
              hideLoader();
              showAlert("Somthing went wrong , Please contact administration !!!.","ok");      
             }
          } else{
               hideLoader();
              showAlert("Somthing went wrong , Please contact administration !!!.","ok");             
          }
  }


var setToken = (token) => {
   localStorage.setItem("token", token);
  }

  var loginHandleChange = (e)=>{
       var {name,value} = e.target;
       setFormData({...formData,[name]:value});
       setErrors((prevErrors) =>{
        var updatedErrors = {...prevErrors};
        delete updatedErrors[name];
        return updatedErrors;
       });


  }
  var validateForm = () => {
    var t = {};
    if (!formData.userName) t.userName = true;
    if (!formData.password) t.password = true;
    setErrors(t);
    return Object.keys(t).length === 0;
  };
  return (
    <div className="authentication-wrapper authentication-cover authentication-bg">
      <div className="authentication-inner">
        <div className="auth-left">
          <img src={SigninImg} alt="login" />
        </div>

        <div className="auth-right">
          <div className="login-card">
            <div className="brand">
              <img src={HRMLogo} alt="HRM" />
            </div>

            <div className="login-header">
              <h2>Welcome to HRM</h2>
              <p>Please sign-in to your account and start the adventure</p>
            </div>

            <div>
              <div className="form-group">
                <label>Email or Username</label>
                <input type="text" 
                  name = "userName" 
                  value = {formData.userName} 
                  placeholder="Enter your email or username" 
                  onChange={loginHandleChange}
                  className={` ${errors.userName ? "error-input" : ""}`}
                  />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" 
                       name = "password" 
                       value = {formData.password} 
                       placeholder="••••••••••••"
                       onChange={loginHandleChange}
                       className={` ${errors.password ? "error-input" : ""}`}
                 />
              </div>

              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>

              <button className="login-btn"type="submit" onClick={PerformLogin}>Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
