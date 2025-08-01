import React from 'react';

function About() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700 mt-8">
      <h1 className="text-3xl font-bold text-primary-400 mb-4">About</h1>
      <p className="text-gray-200 text-lg mb-2">
        This platform allows you to anonymously report crimes and incidents in your community. Our mission is to make neighborhoods safer by empowering citizens to share information securely and confidentially.
      </p>
      <p className="text-gray-400 text-sm">
        Your reports help local authorities and the community stay informed and take action. Thank you for contributing to a safer environment.
      </p>
    </div>
  );
}

export default About; 