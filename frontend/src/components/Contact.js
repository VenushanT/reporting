import React from 'react';

function Contact() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700 mt-8">
      <h1 className="text-3xl font-bold text-primary-400 mb-4">Contact</h1>
      <p className="text-gray-200 text-lg mb-2">
        Have questions, feedback, or need support? Reach out to us:
      </p>
      <ul className="text-gray-400 text-sm space-y-1">
        <li>Email: <a href="mailto:support@anonymousreporting.com" className="text-primary-400 underline">support@anonymousreporting.com</a></li>
        <li>Phone: <a href="tel:+1234567890" className="text-primary-400 underline">+1 (234) 567-890</a></li>
      </ul>
      <p className="text-gray-500 text-xs mt-4">We value your privacy and will never share your information.</p>
    </div>
  );
}

export default Contact; 