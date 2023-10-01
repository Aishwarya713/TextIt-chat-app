import React, {useState} from 'react'
import styled from 'styled-components';
import { IoMdSend }  from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
export default function ChatInput(props) {
  const {handleSendMsg} = props;

  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  

  const handleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
  };

  const handleChange = (event)=> {
    let updatedMsg = event.target.value;
    setMsg(updatedMsg);
  }

  const handleEmojiClick = (emojiObject, event) => {
    setMsg((prevMsg)=> prevMsg+emojiObject.emoji);
  };

  const sendText = (event) => {
    event.preventDefault();
    if(msg.length>0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
      
    <Container>
      <div className="button-container">
          <div className="emoji">
              <BsEmojiSmileFill onClick={handleEmojiPicker} />
              {showEmojiPicker && <EmojiPicker onEmojiClick = {(e)=>handleEmojiClick(e)} height={350} width={280} />}
          </div>
      </div>
      <form className="input-container" onSubmit = {(e) => sendText(e)}>
          <input type="text" placeholder="Start typing..." value={msg} onChange={(event) => {handleChange(event)}} />
          <button type="submit">
              <IoMdSend />
          </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: rgb(10 24 24 / 52%);
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .EmojiPickerReact {
        position: absolute;
        top: -370px;
        background-color: #080420;
        box-shadow: 0 5px 10px #25D366;
        border-color: #25D366;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #25D366;
          }
        }
        .epr-emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #25D366;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #25D366;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #25D366;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;