import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Logo from "../assets/logo.png";

export default function Contacts(props) {
    const {contacts, currentUser, chatSelection} = props;
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserImage, setCurrentUserImage] = useState(null);
    const [currentSelectedChat, setCurrentSelectedChat] = useState(null);

    useEffect(() => {
        if(currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelectedChat(index);
        chatSelection(contact);
    };
  return (
    <>
      {
          currentUserImage && currentUserName && (
              <Container>
                  <div className="brand">
                      <img src={Logo} alt="logo"/>
                      <h3>TextIt</h3>
                  </div>
                  <div className="contacts">
                      {
                          contacts.map((contact, index) => {
                              return (
                                  <div className={`contact ${currentSelectedChat === index ? "selected":""}`} key={index} onClick={()=> changeCurrentChat(index, contact)}>
                                      <div className="avatar">
                                          <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} />
                                      </div>
                                      <div className="username">
                                          <h3>{contact.username}</h3>
                                      </div>
                                  </div>
                              );
                          })
                      }
                  </div>
                  <div className="current-user">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${currentUserImage}`} />
                    </div>
                    <div className="username">
                        <h2>{currentUser.username}</h2>
                    </div>
                  </div>
              </Container>
          )
      }
    </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: rgb(4 26 30);
    .brand {
        display: flex; 
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
        height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff34;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.5s ease-in-out;
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
        .selected {
            background-color: #25D366;
        }
    }
    .current-user {
        background-color: rgb(255 255 255 / 13%);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        .avatar {
            img {
              height: 4rem;
              max-inline-size: 100%;
            }
        }
        .username {
            h2 {
              color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            .username {
              h2 {
                font-size: 1rem;
              }
            }
        }
    }
`;
