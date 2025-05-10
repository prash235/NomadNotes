import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../Input/PasswordInput";
import { validateEmail } from "../../utils/Helper";
import {handleSignUp as handleSignUpApi} from "../../utils/AxiosInstance";



const signUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // console.log("email===",email,password)

    if (!name) {
      setError("please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("please enter a valid email");
      return;
    }

    if(!password){
      setError("please enter password");
      return;
    }
    setError("")

    //Login API call 

    try {
      const response = await handleSignUpApi(name,email, password);
      console.log("Login successful:", response);
      console.log(response.message);
      console.log(response.accessToken);

      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Full login error:", error); 

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("an unexpected error occurred. Please Try again.");
      }
    }


  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">

      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-center h-full">
        {/* Left side image + text */}
        <div className="w-full lg:w-1/2 h-[300px] lg:h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-6 lg:p-10 mb-10 lg:mb-0">
          <div>
            <h4 className="text-3xl md:text-4xl lg:text-5xl text-white font-extrabold leading-snug lg:leading-[58px]">
              Join the <br /> Adventures
            </h4>
            <p className="text-sm md:text-base text-white  leading-6 pr-2 mt-3">
              Create an account to start documenting your notes and preserving your memories 
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg lg:rounded-r-lg relative p-6 md:p-12 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-xl md:text-2xl font-semibold mb-6">Sign Up</h4>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-box"
            />

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1 ">{error} </p>}
            <button type="submit" className="btn-primary">
            CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default signUp;
