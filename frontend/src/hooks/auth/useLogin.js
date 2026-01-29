import { useContext, useState } from "react"
import { VariableContext } from "../../context/VariableContext"


export const useLogin = () => {
  const {host} = useContext(VariableContext);
  const [loginErr,setLoginErr] = useState(null);

  const login = async(email,password) => {
    try{
    const response = await fetch(`${host}/auth/login`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:email,password:password}),
    })
    const data  = await response.json();
    

    if (data && !data.msg) {
      const expiryTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 hours from now
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("token", JSON.stringify(data.token));
      window.localStorage.setItem("user", JSON.stringify(data.user));
      window.localStorage.setItem("expiryTime", expiryTime); // Save the expiry timestamp
      window.location = "/home";
      console.log("LoggedIn");
  }
  
    else{
      setLoginErr(data.msg);
      if(data.msg === "Please verify your email address. A verification email has been sent to your inbox. If you don’t see it, kindly check your spam or junk folder."){
        window.location = "/checkverification";
      }
    }


  }
  catch(error){
    console.log(error);
  }
  }
  return {login,loginErr};
}