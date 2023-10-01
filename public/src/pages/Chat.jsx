import React, {useState, useEffect, useRef} from 'react'
import axios from "axios"; // can also use fetch from JS
import styled from 'styled-components';
import {Link, useNavigate} from "react-router-dom";
import { allUsersRoute, host } from '../utils/ApiRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [ selectedChat, setSelectedChat] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchCurrentUser = async ()=>{
      if(!localStorage.getItem('chat-app-user')){
        navigate("/login");
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    fetchCurrentUser();
  },[]);

  useEffect(() =>{
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser]);

  useEffect(()=> {
    const fetchContacts = async ()=>{
      if(currentUser) {
        if(currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }
        else {
          navigate("/setAvatar");
        }
      }
    }
    fetchContacts();
  }, [currentUser]);

  const handleChatSelection = (chat) => {
    setSelectedChat(chat);
  }
  return (
    <Container>
      <div className="container">
        <Contacts 
        contacts={contacts}
        currentUser = {currentUser}
        chatSelection = {handleChatSelection}
        />
        { isLoaded? 
        (
          selectedChat === null ?
          (
          <Welcome
          currentUser = {currentUser}
          />
          ) : (
            <ChatContainer 
            selectedChat={selectedChat}
            currentUser = {currentUser}
            socket = {socket} 
            />
          )
        ): null
      }
      </div>
    </Container>
    );
      
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display:flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: rgb(10 24 24);
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat
