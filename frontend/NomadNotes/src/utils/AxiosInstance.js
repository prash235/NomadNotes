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

  export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file); 
    try {
      const response = await axios.post(`${BASE_URL}/image-upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  export const addNewTravelStory = async (title, story, imageUrl, visitedLocation, visitedDate) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/add-travel-story`,
        {
          title,
          story,
          imageUrl,
          visitedLocation,
          visitedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("add travel story response----", response)
  
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  };

  export const editTravelStory = async (
    id,
    title,
    story,
    imageUrl,
    visitedLocation,
    visitedDate
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/edit-story/${id}`,
        {
          title,
          story,
          imageUrl,
          visitedLocation,
          visitedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("Edit Travel Story Response ====>", response);
      return response.data;
    } catch (error) {
      console.error("Edit Travel Story API Error:", error);
      throw error;
    }
  };

  
  export const deleteTravelStory = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete-story/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from localStorage or context
        },
      });
      
      console.log("Travel Story deleted successfully:", response.data);
      return response.data;  // You can use this data for further actions like showing a success message
    } catch (error) {
      console.error("Error deleting travel story:", error.response?.data || error.message);
      throw error; // You can handle this error further depending on your needs
    }
  };








