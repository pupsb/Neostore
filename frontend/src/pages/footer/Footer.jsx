import React from 'react';
import { useContext } from 'react';
import { VariableContext } from '../../context/VariableContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {

  const { user } = useContext(VariableContext);
  // Construct the WhatsApp message dynamically
  const message = encodeURIComponent(
    `Name: ${user?.name || "N/A"}\nMobile: ${user?.mobilenumber || "N/A"}\nEmail: ${user?.email || "N/A"}\n\nHello Admin of neostore.in,\nCould you please assist me?`
  );

  // WhatsApp link with the constructed message
  const whatsappLink = `https://wa.me/919395578107?text=${message}`;

  return (
    <footer className="bg-white text-white py-6 px-4 md:px-10 mt-8">
      {/* About Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start mb-2">
        <div className="flex flex-col items-center items-start space-y-4 md:w-1/2">
          <div className="flex items-center space-x-4">
            <img src="/nav-logo.png" alt="logo" className="h-20 rounded-lg p-0.2" />
            {/* <h2 className="text-2xl text-black font-bold text-center font-franklin">Woex Supply</h2> */}
          </div>
          {/* <h3 className="text-m text-center">Woex Supply, YOUR CHOICE & YOUR SATISFACTION</h3> */}
          <p className="text-sm text-black leading-6 py-2">
            Welcome to NeoStore, the ultimate hotspot for exciting game top-ups and recharges worldwide! Dive into unbeatable prices, secure transactions, and a wide array of easy payment options designed to make your gaming experience seamless. Whether you're leveling up or unlocking new features, NeoStore has you covered.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col md:w-1/4">
          <h3 className="text-lg text-black font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/neo_store_official?igsh=MWc4dXEzdzU3Yjlr"
              className="flex items-center bg-white rounded-lg p-1 text-pink-500 hover:text-pink-600"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb2QJPp7YSd8Shbd200D"
              className="flex items-center bg-white rounded-lg p-1 text-blue-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb2QJPp7YSd8Shbd200D"
              className="flex items-center bg-white rounded-lg p-1 text-green-400 hover:text-green-600"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="2x" />
            </a>
            <a
              href="https://t.me/+wT8Xksmji55hYWE1"
              className="flex items-center bg-white rounded-lg p-1 text-blue-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faTelegram} size="2x" />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Channels and Contact Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start border-t border-white pt-2">
        {/* Payment Channels */}
        <div className="mb-2 md:mb-0 md:w-1/3">
          <h3 className="text-lg text-[#E11D48] font-bold mb-2">Payment Channels</h3>
          <div className="flex space-x-6">
            <img src="/upi.png" alt="UPI" className="h-8 bg-white rounded-lg p-1" />
            <img src="/paytm.png" alt="Paytm" className="h-8 bg-white rounded-lg p-1" />
            <img src="/gpay.png" alt="Google Pay" className="h-8 bg-white rounded-lg p-1" />
          </div>
        </div>

        {/* Contact Us */}
        {/* <div className="md:w-1/3">
          <h3 className="text-lg text-[#E11D48] font-bold mb-2">Contact Us</h3>
          <a
            href={whatsappLink}
            className="flex items-center text-black hover:text-white space-x-2"
          >
            <i className="fas fa-envelope text-2xl"></i>
            <span className="text-black">Customer Support - WhatsApp</span>
          </a>
          <a
            href="https://t.me/woexsupport"
            className="flex items-center text-black hover:text-white space-x-2"
          >
            <i className="fas fa-envelope text-2xl"></i>
            <span className="text-black">Customer Support - Telegram</span>
          </a>
        </div> */}
      </div>

      {/* Footer Bottom Links */}
      <div className="mt-3 text-center text-black text-sm border-t border-gray-400 pt-4">
        <div className="space-x-4 mb-3">
          <a href="terms-and-condition" className="hover:text-white">
            Terms &amp; Conditions
          </a>
          <a href="privacypage" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="refund-policy" className="hover:text-white">
            Refund Policy
          </a>
        </div>
        <p className='text-[#E11D48] mb-14'>&copy; COPYRIGHT 2024 © NeoStore. ALL RIGHTS RESERVED</p>
        {/* <p className='text-[#03045E] mb-20 md:mb-0 flex justify-center'>&copy; Designed & Developed By ~  &nbsp;
        <a
            href="https://wa.me/919883084820"
            className="flex items-center text-gray-300 hover:text-white space-x-2"
          >
           Abdul Rakib
          </a>
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;
