import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { handleGetAllStories, handleGetUser } from "../utils/AxiosInstance";
import TravelStoryCard from "../components/Cards/TravelStoryCard";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStoreis] = useState([]);

  // get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await handleGetAllStories();
      console.log("RSP--->", response);
      if (response && response.stories) {
        setAllStoreis(response?.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Try again.");
    }
  };

  // get user
  const getUserInfo = async () => {
    try {
      const response = await handleGetUser();
      if (response && response.user) {
        setUserInfo(response.user);
      }
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return ( <TravelStoryCard key={item._id} />);
                })}
              </div>
            ) : (
              <>empty card here</>
            )}
          </div>
          <div className="w-[320px]">
            {/* Sidebar or additional content goes here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
