import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { handleGetUser } from '../utils/AxiosInstance';

const Home = () => {

  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null);

  // Get user

  const getUserInfo = async () => {
     try {
      const response = await handleGetUser()
      console.log("RSP--->",response)
      if(response && response.user){
        setUserInfo(response.user)
      }
     } catch (error) {
      localStorage.clear();
      navigate("/login")
      
     }
  }

  useEffect(()=> {
    getUserInfo();

    return () => {};
  }, [])
 

  return (
    <>
    <Navbar userInfo={userInfo}/>
    </>
  )
}

export default Home
