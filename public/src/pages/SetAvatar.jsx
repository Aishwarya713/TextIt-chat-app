import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import loader from "../assets/loader.gif";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Buffer } from 'buffer';
import { setAvatarRoute } from '../utils/ApiRoutes';


export default function SetAvatar() {

    const api = "https://api.multiavatar.com/45678945"; //open source api
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      };

      useEffect(()=> {
        if(!localStorage.getItem('chat-app-user')){
          navigate("/login");
        }
      }, []);
    
    const fetchData = async () => {
        let data =[];
        for (let i = 0; i < 4; i++) {
            const image = await axios.get(
                `${api}/${Math.round(Math.random() * 1000)}`
            );
        const buffer = new Buffer(image.data); // Convert image data to a buffer
        data.push(buffer.toString("base64")); // Convert buffer back to base64 string and push to the data array
        };
        setAvatars(data);
        setIsLoading(false);
    };

    useEffect(()=>{
        fetchData();
    },[]);
    const setProfilePicture = async ()=> {
        if (selectedAvatar === undefined) {
            toast.error("Please choose an avatar", toastOptions);
          }
        else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image: avatars[selectedAvatar],
            });

            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate("/");
            }
            else{
                toast.error("Failed to set Avatar, please try again", toastOptions);
            }
        }
    };

    const getAvatars = () => {
        const avatarIcon = Object.keys(avatars).map((index) => {
            const avatar = avatars[index];
          return (
            <div className={`avatar ${
                selectedAvatar === index ? "selected" : ""
              }`}>
              <img
                src={`data:image/svg+xml;base64,${avatar}`}
                alt="avatar"
                onClick={() => setSelectedAvatar(index)}
              />
           </div>
          );
        });
        return(
            <>
                {avatarIcon}
            </>
        );
    };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Choose an avatar</h1>
          </div>
          <div className="avatars">
            {getAvatars()}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )
      };
    </>
      )
};

const Container = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: rgb(10, 24, 24);
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }`;
