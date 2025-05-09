import axios from "axios";
// import { BASE_URL } from "./Constants";
const BASE_URL = "http://localhost:8000"; // Ensure the port is correct and matches your backend

export const handleLogin = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    console.log("resp----", response)

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};


export const handleSignUp = async (fullName,email,password) => {
    try {
      const response = await axios.post(`${BASE_URL}/create-account`, {
        fullName,
        email,
        password,
      });
      console.log("resp----", response)
  
      return response.data;
    } catch (error) {
      console.error("SignUp API error:", error);
      throw error;
    }
  };


