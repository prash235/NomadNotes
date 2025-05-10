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

  // handle edit story

  const handleEdit = (data) => {

  }

  const handleViewStory = (data) => {

  }

  const updateIsFavourite = (data) => {

  }

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
  <div className="flex flex-col lg:flex-row gap-6">
    <div className="flex-1">
      {allStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allStories.map((item) => (
            <TravelStoryCard
              key={item._id}
              imageUrl={item.imageUrl}
              title={item.title}
              story={item.story}
              date={item.visitedDate}
              visitedLocation={item.visitedLocation}
              isFavourite={item.isFavourite}
              onEdit={() => handleEdit(item)}
              onClick={() => handleViewStory(item)}
              onFavouriteClick={() => updateIsFavourite(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No stories available.</div>
      )}
    </div>

    <div className="w-full lg:w-[320px]">
      {/* Sidebar or additional content */}
    </div>
  </div>
</div>

    </>
  );
};

export default Home;
