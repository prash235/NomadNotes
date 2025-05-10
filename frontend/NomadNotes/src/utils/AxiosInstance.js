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


  export const handleGetUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Get User API error:", error);
      throw error;
    }
  };





