import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';

function EmergencyButton({ modalOpen, setModalOpen }) {
  const handleEmergencyClick = () => {
    if (window.innerWidth <= 768) {
      // On mobile, directly call 911
      window.location.href = 'tel:911';
    } else {
      // On desktop, show confirmation dialog
      setModalOpen(true);
    }
  };

  const handleConfirm = () => {
    window.location.href = 'tel:911';
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleEmergencyClick}
        className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors border border-red-700 z-50"
      >
        <PhoneIcon className="h-8 w-8" />
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-start pl-12 bg-black/75 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl">
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              Emergency Call Confirmation
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to call 911? This should only be used for real emergencies.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors border border-red-700"
              >
                Call 911
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton; 