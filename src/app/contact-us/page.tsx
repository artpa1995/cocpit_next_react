"use client";

import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import GoustHeader from '../components/GoustHeader';
import UserHeader from '../components/user/UserHeader';
import GoustFooter from '../components/GoustFooter';
import UserFooter from '../components/user/UserFooter';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [header, setHeader] = useState<JSX.Element>(<GoustHeader />);
  const [footer, setFooter] = useState<JSX.Element>(<GoustFooter />);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      setHeader(<UserHeader />);
      setFooter(<UserFooter />);
      try {
        jwtDecode(storedToken); 
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('Message is sent!');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setFormStatus('Error sending message.');
      }
    } catch (error) {
      setFormStatus('Error sending message.');
    }
  };

  return (
    <div className='flex min-h-screen flex-col justify-between'>
      {/* {header} */}
      <div className='flex justify-center mt-5 mb-5'>
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </div>
          {formStatus && <p className="text-center">{formStatus}</p>}
        </form>
      </div>
      {/* {footer} */}
    </div>
  );
};

export default ContactForm;
