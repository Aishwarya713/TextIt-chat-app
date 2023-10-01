import React from 'react'
import styled from 'styled-components';
import Robot from "../assets/robot.gif";

export default function Welcome(props) {
    const {currentUser} = props;
  return (
    <Container>
       <img src={Robot} alt="Robot" />
       <h1>
           Welcome, <span className="username">{currentUser.username}!</span>
       </h1>
       <h3>
           Select a chat to start texting.
       </h3>
    </Container>
  )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
.username {
    color:rgb(37, 211, 102);
}
img {
    height: 20rem;
}
span {
    color: #4e0eff;
}
`;
