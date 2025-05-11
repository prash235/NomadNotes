import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {MdAdd} from "react-icons/md"
import {
  handleGetAllStories,
  handleGetUser,
  updateIsFavourite as updateIsFavouriteAPI,
} from "../utils/AxiosInstance";
import TravelStoryCard from "../components/Cards/TravelStoryCard";
import Modal from "react-modal";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStoreis] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type: "add",
    data: null
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data:null
  })

  // get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await handleGetAllStories();
      // console.log("RSP--->", response);
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
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });


  };

  const handleViewStory = (data) => {
    setOpenViewModal({
      isShown: true, data
    });

  };

  const updateIsFavourite = async (data) => {
    const storyId = data._id;
    const isFavourite = data.isFavourite;

    try {
      const response = await updateIsFavouriteAPI(storyId, isFavourite);

      console.log("isfavourite resp----->>>", response);

      if (response && response.story) {
        toast.success("Story updated successfully!");
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
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

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba (0,0,0,0.2)",
              zIndex: 999,
            },
          }}
          appElement={document.getElementById("root")}
          className="model-box"
        >
          <AddEditTravelStory
            type={openAddEditModal.type}
            storyInfo={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }}
            getAllTravelStories={getAllTravelStories}
          />
        </Modal>

        <Modal
          isOpen={openViewModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba (0,0,0,0.2)",
              zIndex: 999,
            },
          }}
          appElement={document.getElementById("root")}
          className="model-box"
        >
          <ViewTravelStory
            storyInfo={openViewModal.data || null}
            onClose={() => {
              setOpenViewModal((prevState) => ({...prevState, isShown:false}));
            }}
            onEditClick={() => {
              setOpenViewModal((prevState) => ({...prevState, isShown:false}));
              handleEdit(openViewModal.data || null);
            }}
            onDeleteClick={() => {}}
          />
        </Modal>

        <button
          className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>

      <ToastContainer autoClose={400} hideProgressBar={true} />
    </>
  );
};

export default Home;
