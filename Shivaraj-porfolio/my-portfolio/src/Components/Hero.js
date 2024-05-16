// src/components/Hero.js
import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.div`
  background-image: url('/images/code2.jpg');
  background-size: cover;
  color: white;
  text-align: center;
  padding: 200px 0;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <h1>Darshan Kalli</h1>
      <p> Node Js Developer | Web Developer</p>
    </HeroContainer>
  );
};

export default Hero;
