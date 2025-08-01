# Anonymous Crime & Incident Reporting System

A secure and anonymous platform for reporting crimes and incidents, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- 🖼️ Image Upload & Analysis using Google Cloud Vision API
- 🗺️ Interactive Map Integration with Leaflet.js
- 📝 Anonymous Report Submission
- 🚨 Emergency 911 Button
- 🔒 Secure & Anonymous Data Storage
- 📱 Responsive Design with Tailwind CSS

## Project Structure

```
reporting/
├── backend/           # Express.js & MongoDB backend
├── frontend/          # React frontend with Tailwind CSS
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Vision API key
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   GOOGLE_CLOUD_VISION_API_KEY=your_api_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Security Features

- HTTPS enabled
- Input validation
- No personal data collection
- Secure image storage
- XSS protection
- CSRF protection

## API Endpoints

- `POST /api/reports` - Submit a new report
- `POST /api/upload` - Upload an image
- `GET /api/reports` - Get all reports (for admin purposes)

## Technologies Used

- Frontend:
  - React.js
  - Tailwind CSS
  - Leaflet.js
  - Axios
  - React Dropzone

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Google Cloud Vision API
  - Multer
  - GridFS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License
