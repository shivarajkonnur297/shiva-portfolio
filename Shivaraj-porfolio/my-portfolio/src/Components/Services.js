// src/components/Services.js
import React from 'react';
import styled from 'styled-components';

const ServicesContainer = styled.div`
  background-color: #f4f4f4;
  padding: 50px 0;
  text-align: center;
`;

const ServiceCard = styled.div`
  background-color: white;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }
`;

const Services = () => {
  return (
    <ServicesContainer>
      <h2>Skills and knowledge</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ServiceCard>
          <h3>Backend Development</h3>
          <p>Building Rest Apis with Optimised Queries and Code.</p>
        </ServiceCard>
        <ServiceCard>
          <h3>UI/UX Design</h3>
          <p>Creating intuitive and visually appealing user interfaces.</p>
        </ServiceCard>
        <ServiceCard>
          <h3>SEO Optimization</h3>
          <p>Optimizing websites for search engines to improve visibility.</p>
        </ServiceCard>
      </div>
    </ServicesContainer>
  );
};

export default Services;
