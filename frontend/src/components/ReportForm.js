import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function ReportForm({ selectedLocation }) {
  const [formData, setFormData] = useState({
    reportType: '',
    description: '',
    location: null,
    image: null,
    imagePreview: null,
    imageAnalysis: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Update location when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng
        }
      }));
    }
  }, [selectedLocation]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Reset states
      setUploadError(null);
      setIsUploading(true);

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);

      // Upload and analyze image
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 second timeout
        });

        if (!response.data || !response.data.analysis) {
          throw new Error('Invalid response from server');
        }

        const { analysis } = response.data;
        
        // Validate analysis data
        if (!analysis.suggestedReportType || !analysis.description) {
          throw new Error('Incomplete analysis data received');
        }

        setFormData(prev => ({
          ...prev,
          imageAnalysis: analysis,
          reportType: analysis.suggestedReportType || prev.reportType
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        let errorMessage = 'Failed to analyze image. Please try again.';
        
        if (error.response) {
          // Server responded with an error
          errorMessage = error.response.data.error || error.response.data.details || errorMessage;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check your connection.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        }
        
        setUploadError(errorMessage);
        // Clear the image preview and analysis on error
        setFormData(prev => ({
          ...prev,
          image: null,
          imagePreview: null,
          imageAnalysis: null
        }));
      } finally {
        setIsUploading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      alert('Please select a location on the map');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reports', {
        reportType: formData.reportType,
        description: formData.description,
        location: formData.location,
        imageUrl: formData.imageAnalysis?.imageUrl,
        imageAnalysis: formData.imageAnalysis
      });

      console.log('Report submitted:', response.data);
      
      // Reset form
      setFormData({
        reportType: '',
        description: '',
        location: null,
        image: null,
        imagePreview: null,
        imageAnalysis: null
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };

  // Helper function to format the AI response
  const formatAIResponse = (text) => {
    if (!text) return '';
    
    // Split the text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    // Format each paragraph
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-2">
        {paragraph}
      </p>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-xl shadow-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-200">
          Report Type
        </label>
        <select
          value={formData.reportType}
          onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
          className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Select a type</option>
          <option value="theft">Theft</option>
          <option value="vandalism">Vandalism</option>
          <option value="accident">Accident</option>
          <option value="suspicious">Suspicious Activity</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Location
        </label>
        <div className="mt-1 text-sm text-gray-400">
          {formData.location ? (
            <p className="flex items-center">
              <svg className="h-4 w-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
            </p>
          ) : (
            <p className="flex items-center text-gray-500">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Please select a location on the map
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Upload Image
        </label>
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg transition-all duration-200 ${
            isDragActive ? 'border-primary-500 bg-gray-800' : 'hover:border-primary-500 hover:bg-gray-800'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="space-y-1 text-center">
            {isUploading ? (
              <ArrowPathIcon className="mx-auto h-12 w-12 text-primary-500 animate-spin" />
            ) : (
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-400">
              <input {...getInputProps()} disabled={isUploading} />
              <p className="pl-1">
                {isUploading ? 'Analyzing image...' : 'Drag and drop an image, or click to select'}
              </p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
          {uploadError}
        </div>
      )}

      {formData.imagePreview && (
        <div className="relative">
          <img
            src={formData.imagePreview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg shadow-lg"
          />
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null, imageAnalysis: null }))}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {formData.imageAnalysis && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Image Analysis Results
            </h3>
            
            <div className="space-y-4">
              {/* Report Type Section */}
              <div className="bg-gray-700/50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-200">Suggested Report Type</h4>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                        {formData.imageAnalysis.suggestedReportType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Description Section */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-200 mb-2">Detailed Analysis</h4>
                <div className="text-sm text-gray-400 space-y-2">
                  {formatAIResponse(formData.imageAnalysis.description)}
                </div>
              </div>

              {/* Confidence Score Section */}
              {formData.imageAnalysis.confidence && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Confidence Score</h4>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${formData.imageAnalysis.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(formData.imageAnalysis.confidence * 100)}% confidence in analysis
                  </p>
                </div>
              )}

              {/* Model Information */}
              {formData.imageAnalysis.modelUsed && (
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Analysis performed using: {formData.imageAnalysis.modelUsed}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        Submit Report
      </button>
    </form>
  );
}

export default ReportForm; 