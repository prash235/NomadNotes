import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {MdAdd} from "react-icons/md"
import {
  handleGetAllStories,
  handleGetUser,
  updateIsFavourite as updateIsFavouriteAPI,
  deleteTravelStory as deleteTravelStoryApi,
  searchTravelStoriesApi,
  getFilteredStoriesByDate
} from "../utils/AxiosInstance";
import TravelStoryCard from "../components/Cards/TravelStoryCard";
import Modal from "react-modal";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../components/Cards/EmptyCard";

import EmptyImg from "../assets/images/add-story.jpg"
import { Day, DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../components/Cards/FilterInfoTitle";
const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({from : null, to: null});

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
        setAllStories(response?.stories);
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

  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await deleteTravelStoryApi(storyId);

      if (response && !response.error) {
        toast.error("Story deleted successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Try again.");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await searchTravelStoriesApi(query);
      
    if(response && response.stories){
      setFilterType("search");
      setAllStories(response.stories);
    }
      
    } catch (error) {
      console.error("An unexpected error occurred. Try again.");
    }
  }

  const handleClearSearch = () => {
      setFilterType("")
      getAllTravelStories();
  }

  const filterStoriesByDate = async (day) => {
    try {

      console.log("Day Selected:==========>", day);

      const startDate = day.from ? moment(day.from).startOf('day').valueOf() : null;
  const endDate = day.to ? moment(day.to).endOf('day').valueOf() : null;
      console.log("start and end ", startDate, endDate)

      if (startDate && endDate) {
        const response = await getFilteredStoriesByDate(startDate, endDate);
        console.log("response date", response)

        if (response && response.stories) {
          setFilterType("date");
          setAllStories(response.stories);
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred. Try again.");
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    console.log("Day Selected: ", day); // Check what day.from and day.to contain
    filterStoriesByDate(day);
  }

  const resetFilter = () => {
    setDateRange({from:null, to:null});
    setFilterType("");
    getAllTravelStories();
  }
 
  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={() => {
          resetFilter();
        }}
        />
        
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
              <EmptyCard
                imgSrc={EmptyImg}
                message="Start creating your first travel story. Click the Add button"
              />
            )}
          </div>

          <div className="w-full lg:w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">

            <div className="p-3">
              <DayPicker
              captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
              />

            </div>
            
            </div>
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
              setOpenViewModal((prevState) => ({
                ...prevState,
                isShown: false,
              }));
            }}
            onEditClick={() => {
              setOpenViewModal((prevState) => ({
                ...prevState,
                isShown: false,
              }));
              handleEdit(openViewModal.data || null);
            }}
            onDeleteClick={() => {
              deleteTravelStory(openViewModal.data || null);
            }}
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
