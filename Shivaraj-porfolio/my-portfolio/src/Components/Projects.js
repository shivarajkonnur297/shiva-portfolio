// src/components/Projects.js
import React from 'react';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
  padding: 50px 0;
  text-align: center;
`;

const ProjectCard = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const Projects = () => {
  return (
    <ProjectsContainer>
      <h2>Projects</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ProjectCard>
          <h3>Maratha Matrimonial</h3>
          <p>"As the backend developer for the Maratha Samaj Matrimonial site, I played a pivotal role in architecting and implementing the robust foundation that powers our platform. Leveraging cutting-edge technologies, I designed and implemented a scalable and secure backend infrastructure, ensuring seamless user experiences and efficient data management. My responsibilities included database design, API development, user authentication, and system optimization, contributing to the overall reliability and performance of the matrimonial site. Through my expertise in backend development, I have crafted a technologically advanced and resilient system that empowers users to navigate, connect, and interact seamlessly within the Maratha Samaj community."</p>
        </ProjectCard>
        <ProjectCard>
          <h3>Human Resource Management System</h3>
          <p>"As the backend developer for the HRMS project, I spearheaded the development of a robust and scalable infrastructure that powers the entire system. My role involved designing and implementing the backend architecture, focusing on key functionalities such as employee data management, payroll processing, and seamless integration with various HR modules. I ensured the security and efficiency of data transactions, implemented user authentication systems, and optimized database structures for optimal performance. Through my expertise in backend technologies, I have contributed to the creation of a sophisticated HRMS that not only simplifies complex HR processes but also enhances organizational efficiency by providing a reliable and seamless backend foundation."</p>
        </ProjectCard>
        <ProjectCard>
          <h3>Apte Foods ecommerce platform</h3>
          <p>"As the backend developer for the Apte Foods ecommerce platform, I took a leading role in crafting a robust and dynamic backend infrastructure. My responsibilities included designing and implementing the backend architecture to support a wide range of features, including product categorization, inventory management, and seamless order processing. Leveraging my expertise, I ensured the scalability and performance of the platform, optimizing database structures and implementing efficient algorithms for inventory tracking and order fulfillment. Through meticulous backend development, I've contributed to the creation of a reliable and responsive ecommerce system that enhances the user experience, supports diverse product categories, and facilitates smooth inventory management for Apte Foods."</p>
        </ProjectCard>
        <ProjectCard>
          <h3>Mai Hyundai CRM</h3>
          <p>"As the backend developer for Mai Hyundai CRM, I played a key role in developing and optimizing critical modules, including Service Management, Post-Service Follow-up, and Insurance. I meticulously designed and implemented a suite of APIs to facilitate seamless communication between various forms and complex reporting functionalities. My focus on creating efficient and scalable backend solutions ensured a smooth user experience for both internal teams and end-users. I took the lead in architecting the backend infrastructure, implementing robust data handling mechanisms, and optimizing API performance. Through my contributions, I enhanced the CRM system's capabilities, providing Mai Hyundai with a powerful, data-driven backend that supports their service module, post-service follow-up, and insurance functionalities."</p>
        </ProjectCard>
      </div>
    </ProjectsContainer>
  );
};

export default Projects;
