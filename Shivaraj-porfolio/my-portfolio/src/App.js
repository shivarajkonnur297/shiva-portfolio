// src/App.js
import React from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Services from './Components/Services';
import Projects from './Components/Projects';
import ContactForm from './Components/ContactForm'; // Import the ContactForm component
import Footer from './Components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <ContactForm /> {/* Use the ContactForm component */}
      <Footer />
    </div>
  );
}

export default App;
