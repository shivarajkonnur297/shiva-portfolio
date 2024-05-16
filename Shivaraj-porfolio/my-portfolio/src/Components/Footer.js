// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 15px;
  text-align: center;
  &:hover {
    opacity: 0.9;
  }
`;

const Footer = () => {
  return <FooterContainer>&copy; 2023 Darshan's Portfolio</FooterContainer>;
};

export default Footer;
