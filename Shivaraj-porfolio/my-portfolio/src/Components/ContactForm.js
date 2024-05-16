// src/components/ContactForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ContactFormContainer = styled.div`
  background-color: #f5f5f5;
  padding: 50px;
  text-align: center;
  &:hover {
    background-color: #eee;
  }

  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    margin-bottom: 8px;
    display: flex;
  }

  input,
  textarea {
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease; /* Add transition for smooth effect */

    &:hover,
    &:focus {
      border-color: #555; /* Change border color on hover or focus */
    }
  }

  button {
    padding: 12px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
`;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await fetch('http://3.110.210.178:5001/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });

        alert('Contact form submitted successfully!');
      } else {
        console.error('Error submitting contact form:', response.statusText);
        alert('Error submitting contact form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error submitting contact form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ContactFormContainer>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" >Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Darshan Kalli'
        />

        <label htmlFor="email" >Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder='darshan@gmail.com'
        />

        <label htmlFor="message" >Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder='Draft your Message Here'
        ></textarea>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </ContactFormContainer>
  );
};

export default ContactForm;
