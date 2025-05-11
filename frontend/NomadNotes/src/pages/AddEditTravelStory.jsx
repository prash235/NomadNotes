import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../Input/DateSelector";
import ImageSelector from "../Input/ImageSelector";
import TagInput from "../Input/TagInput";
import {
  uploadImage as uploadImageApi,
  addNewTravelStory as addNewTravelStoryApi,
} from "../utils/AxiosInstance";
import moment from "moment";
import { toast } from "react-toastify";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [error, setError] = useState(null);

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      if (storyImg) {
        const imgUploadRes = await uploadImageApi(storyImg);
        console.log("IMAGE UPLOAD RESPONSE ====>", imgUploadRes);
        imageUrl = imgUploadRes.imageURL || "";
      }

      const response = await addNewTravelStoryApi(
        title,
        story,
        imageUrl || "",
        visitedLocation,
        visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
      );

      console.log("ADD NEW TRAVEL STORY RESPONSE ====>", response);

      if (response && response.story) toast.success("Story added successfully");
      getAllTravelStories();
      onClose();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateTravelStory = async () => {};

  const handleAddOrUpdateClick = () => {
    console.log("input data", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please Enter the Title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  const handleDeleteStoryImg = async () => {};

  return (
    <div className="relative w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow rounded-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h5 className="text-xl sm:text-2xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-cyan-50/50 p-2 rounded-lg">
          {type === "add" ? (
            <>
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" />
                <span className="ml-1">ADD STORY</span>
              </button>
              <button className="btn-small btn-delete" onClick={onClose}>
                <MdDeleteOutline className="text-lg" />
                <span className="ml-1">DELETE</span>
              </button>
            </>
          ) : (
            <>
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" />
                <span className="ml-1">UPDATE STORY</span>
              </button>
            </>
          )}

          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
        )}
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="input-label text-sm font-medium text-gray-600">
            TITLE
          </label>
          <input
            type="text"
            className="text-lg sm:text-xl text-slate-950 outline-none  border-gray-300 focus:border-sky-500 transition-all duration-200 p-1"
            placeholder="A day at Mumbai"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label className="input-label text-sm font-medium text-gray-600">
            VISITED DATE
          </label>
          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>
        </div>

        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-labe">STORY</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="your story"
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        <div className="pt-3">
          <label className="input-label">VISITED LOCATION</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
