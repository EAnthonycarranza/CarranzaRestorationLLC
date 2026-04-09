# Carranza Restoration LLC

## Overview

**Carranza Restoration LLC** is a leading platform dedicated to home restoration and improvement services. We specialize in transforming visions into reality with our expert estimates, meticulous renovations, and detailed project management. Explore our wide array of services, engage with our portfolio, and discover the exceptional quality we bring to every home improvement project.

## Links

- **Deployed Application**: [carranzarestoration.org](https://carranzarestoration.org)
- **GitHub Repository**: [EAnthonycarranza/CarranzaRestorationLLC](https://github.com/EAnthonycarranza/CarranzaRestorationLLC)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Challenges & Solutions](#challenges--solutions)
- [Installation and Setup](#installation-and-setup)
- [Project Requirements](#project-requirements)
- [Collaborators](#collaborators)
- [License](#license)

## Features

### Customer Features
- **Service Exploration**: Detailed information about restoration and renovation services.
- **Interactive Portfolio**: A dynamic gallery showcasing past projects using Isotope filtering and Lightbox previews.
- **Free Quote System**: A multi-step appointment scheduling form with address auto-completion (Google Places API).
- **Blog System**: An informative blog with categories, recent posts, and a comment system for user engagement.
- **Customer Dashboard**: Personalized space for users to track their interactions and manage their profile.
- **Progressive Web App (PWA)**: Optimized for mobile with offline support and fast loading times.

### Administrative Features
- **Admin Dashboard**: Comprehensive management of blog posts, customer inquiries, and system analytics.
- **Blog Creator/Editor**: Rich-text editing (React Quill) for creating engaging content.
- **Analytics & Graphs**: Visual representation of lead sources and contact trends using Recharts.
- **JobNimbus Integration**: Automated lead synchronization with JobNimbus CRM for efficient project management.
- **Google Sheets Integration**: Secondary backup for lead tracking and referrals.
- **Travel Time Calculation**: Automated travel time calculation (Google Directions API) for inspection planning.

## Technologies Used

### Frontend (Client)
- **React 18**: Core UI library.
- **State Management**: React Hooks (useState, useEffect, useRef).
- **Routing**: React Router Dom v6.
- **Styling**: Vanilla CSS, Bootstrap 5, and customized components.
- **UI Components**: Material UI (MUI), React-Bootstrap, FontAwesome.
- **Charts**: Recharts for data visualization.
- **Rich Text**: React Quill.
- **Maps/Places**: Google Maps JavaScript API, `@react-google-maps/api`.

### Backend (Server)
- **Node.js & Express**: Server environment and framework.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: Passport.js (Local Strategy & Google OAuth 2.0), JSON Web Tokens (JWT).
- **File Storage**: Google Cloud Storage for handling project images and uploads.
- **Communication**: Nodemailer (Email).
- **Scheduling**: Node-cron and Node-schedule for automated tasks.
- **Security**: Helmet, reCAPTCHA v3.

### Third-Party Integrations
- **JobNimbus CRM**: Lead and contact management.
- **Google Cloud Platform**: Cloud Storage, Google Sheets, Maps, and Places APIs.

## Challenges & Solutions

### 1. Mobile UI Responsiveness & Navigation
**Challenge**: The initial mobile navigation suffered from alignment issues, particularly with nested "Pages" dropdowns, and lacked visual feedback for the menu state.
**Solution**: Rehauled the mobile navbar with a custom sidebar design. Implemented a CSS-based "X" animation for the toggle button and adjusted padding/margins to ensure links were perfectly centered and legible on small screens.

### 2. Branding & Visual Consistency
**Challenge**: Multiple sections (Portfolio, Footer, Partners) used inconsistent logo assets, some hosted externally and others locally, leading to broken images and fragmented branding.
**Solution**: Consolidated all partner logos into a local asset folder and updated all components (Portfolio-2, Footer) to use these shared imports, ensuring 100% reliability and visual harmony.

### 3. Text Visibility on Dynamic Backgrounds
**Challenge**: Several sections used dark, high-contrast background images (e.g., the Appointment section), making standard dark text unreadable.
**Solution**: Applied utility classes and targeted CSS overrides to ensure text elements ("Request a Free Quote") automatically switch to light colors when placed over dark hero sections.

### 4. Secure Authentication & Role Management
**Challenge**: Establishing a secure admin-only area while allowing social login (Google) for regular users.
**Solution**: Built a dual-strategy authentication system using Passport.js. Implemented JWT for session-less authentication and created custom middleware (`adminOnly`) to protect sensitive administrative routes and dashboards.

### 5. Automated CRM Synchronization
**Challenge**: Ensuring leads from the website were instantly available in JobNimbus without manual data entry.
**Solution**: Developed a backend service that hooks into the "Free Quote" form submission, formats the data according to JobNimbus API requirements, and pushes it via secure headers, with a fallback to Google Sheets.

## Installation and Setup

### Prerequisites
- Node.js (version 20.x recommended)
- MongoDB instance (Local or Atlas)
- Google Cloud Service Account (for Storage and Sheets)

### Step 1: Clone the Repository
```bash
git clone https://github.com/EAnthonycarranza/CarranzaRestorationLLC.git
cd CarranzaRestorationLLC
```

### Step 2: Install Dependencies
```bash
npm install
npm run install-client
npm run install-server
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID_1=your_google_oauth_id
JOBNIMBUS_TOKEN=your_jn_token
RECAPTCHA_SECRET_KEY=your_recaptcha_key
```

### Step 4: Run the Application
```bash
npm run dev
```

## Project Requirements
- **PWA Compliance**: Manifest and service worker for offline capabilities.
- **Security**: Encryption of sensitive user data and secure API endpoints.
- **Reliability**: Automated error logging and status notifications for administrators.

## Collaborators
This project is maintained by the **Carranza Restoration LLC** team. For inquiries, contact [admin@carranzarestoration.com](mailto:admin@carranzarestoration.com).

## License
MIT License - Copyright (c) 2026 Carranza Restoration LLC.
