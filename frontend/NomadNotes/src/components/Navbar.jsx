import React from 'react'
import LOGO from "../assets/images/logo.png"
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token")
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 md:px-6 md:py-3 shadow sticky top-0 z-10">
      <img src={LOGO} alt='travel story' className='h-8 md:h-10 w-auto max-w-[120px]' />
      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
