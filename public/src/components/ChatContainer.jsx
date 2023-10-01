import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import {v4 as uuidv4} from "uuid";
import { getAllMessagesRoute, sendMessageRoute } from '../utils/ApiRoutes';

export default function ChatContainer(props) {
  const {selectedChat, currentUser, socket} = props;
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(()=> {
    const fetchMessages = async () => {
      const response = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: selectedChat._id,
      });
      setMessages(response.data);
    }
    fetchMessages();
  }, [selectedChat, currentUser]);

  const handleSendMsg = async (msg)=>{
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: selectedChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: selectedChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg});
    setMessages(msgs);
  };

  useEffect(()=>{
    if (socket.current) {
      socket.current.on("msg-recieved", (msg)=> {
        setArrivalMessage({fromSelf:false, message:msg});
      });
    }
  },[]);

  useEffect(()=>{
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  },[arrivalMessage]);

  useEffect(()=> {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  },[messages]);

  return (
    <>
    {
      selectedChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
              <img src={`data:image/svg+xml;base64,${selectedChat.avatarImage}`} />
              </div>
              <div className="username">
                <h3>{selectedChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {
              messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div className={`message ${message.fromSelf ? "sent": "recieved"}`}>
                      <div className="content">
                        <p>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )
    }
    </>
  )
}

const Container = styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  border-bottom: 0.2rem solid rgb(10 24 24);
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sent {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}
`;
