import axios from "axios";
// import { BASE_URL } from "./Constants";
const BASE_URL = "http://localhost:8000"; // Ensure the port is correct and matches your backend

const handleLogin = async (email, password) => {
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

export default handleLogin;
