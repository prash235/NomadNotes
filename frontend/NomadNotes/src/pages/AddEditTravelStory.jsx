import React, { useState } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import DateSelector from '../Input/DateSelector';

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
    const [title, setTitle] = useState("")
    const [storyImg, setStoryImg] = useState(null);
    const [story, setStory] = useState("");
    const [visitedLocation, setVisitedLocation] = useState([])
  const [visitedDate, setVisitedDate] = useState(null);

  const handleAddOrUpdateClick = () => {
    // logic here
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow rounded-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h5 className="text-xl sm:text-2xl font-medium text-slate-700">
          {type === 'add' ? 'Add Story' : 'Update Story'}
        </h5>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-cyan-50/50 p-2 rounded-lg">
          {type === 'edit' ? (
            <button className="btn-small" onClick={() => {}}>
              <MdAdd className="text-lg" />
              <span className="ml-1">ADD STORY</span>
            </button>
          ) : (
            <>
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" />
                <span className="ml-1">UPDATE STORY</span>
              </button>

              <button className="btn-small btn-delete" onClick={onClose}>
                <MdDeleteOutline className="text-lg" />
                <span className="ml-1">DELETE</span>
              </button>
            </>
          )}

          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
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
            onChange={({target}) => setTitle(target.value)}
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

        
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-labe'>STORY</label>
            <textarea
            type="text"
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='your story'
            rows={10}
            value={story}
            onChange={({target}) => setStory(target.value)}
            />

        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
