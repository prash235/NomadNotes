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

  export const handleGetAllStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/get-all-stories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Get All Stories API error:", error);
      throw error;
    }
  };

  export const updateIsFavourite = async (id, currentIsFavourite) => {
    try {
        const isFavourite = !currentIsFavourite;
      const response = await axios.put(
        `${BASE_URL}/update-is-favourite/${id}`,
        { isFavourite },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token if necessary
          },
        }
      );
  
      return response.data; // You can handle this response as needed
    } catch (error) {
      console.error("Error updating favourite status:", error);
      throw error; // You can handle this error further depending on your needs
    }
  };








