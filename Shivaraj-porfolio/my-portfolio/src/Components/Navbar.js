// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: #fffff0;
  padding: 20px;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
    color: white;
  }
`;

const LogoContainer = styled.div`
  background-image: url('/images/logo3.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  height: 40px;
`;

const Navbar = () => {
  return (
    <NavContainer>
      <div>
        <LogoContainer></LogoContainer>
      </div>
      <div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Projects</li>
          <li>Contact</li>
        </ul>
      </div>
    </NavContainer>
  );
};

export default Navbar;
