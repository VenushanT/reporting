import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-xl font-semibold text-gray-100">
              Anonymous Crime Reporting
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-primary-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/safety-tips"
              className="text-gray-300 hover:text-primary-400 transition-colors"
            >
              Safety Tips
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-primary-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 