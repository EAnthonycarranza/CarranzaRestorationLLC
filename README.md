# Carranza Restoration LLC

## Overview

**Carranza Restoration LLC** is a leading platform dedicated to home restoration and improvement services. We specialize in transforming visions into reality with our expert estimates, meticulous renovations, and detailed project management. Explore our wide array of services, engage with our portfolio, and discover the exceptional quality we bring to every home improvement project.

## Links

Deployed application: https://carranzarestoration.org

GitHub repository: https://github.com/EAnthonycarranza/CarranzaRestorationLLC

## Table of Contents

* [Overview](#overview)
* [Screenshots](#screenshots)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Installation and Setup](#installation-and-setup)
* [Project Requirements](#project-requirements)
* [Collaborators](#collaborators)

## Screenshots

*Include screenshots of the application here.*

## Features
* **Service Exploration**: Discover a variety of home improvement services we offer.
* **Interactive Portfolio**: Browse through our top-picked projects to see the quality and range of our work.
* **Customer Engagement**: Get in touch with us for estimates, consultations, or any inquiries through our interactive contact form.
* **Responsive Design**: Enjoy a seamless experience across all devices, whether you're on a computer, tablet, or smartphone.
* **PWA Support**: Our platform is a Progressive Web Application (PWA), ensuring you can access it offline and enjoy faster loading times.
* **Dynamic User Interface**: Engage with a user-friendly interface designed for ease of navigation and enriched user interaction.

## Technologies Used

* **Frontend**: React, Bootstrap, Owl Carousel, Lightbox, Isotope
* **Backend**: Node.js, Express.js
* **Database**: Managed via third-party service integrations
* **Deployment**: Heroku
* **Additional Tools**: Axios, React Router, Service Workers (for PWA capabilities), Nodemailer (for email services)

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (version 7.x or higher recommended)
- Git (for cloning the repository)

#### Step 1: Clone the Repository

First, clone the Carranza Restoration LLC repository to your local machine using Git. Open a terminal and run the following command:
```sh
git clone https://github.com/EAnthonycarranza/CarranzaRestorationLLC.git
```

#### Step 2: Install Dependencies

After cloning the project, navigate to the project directory:
```sh
cd CarranzaRestorationLLC
```

This project is structured to include both the client (frontend) and the server (backend) code. You'll need to install dependencies for both. Start with the root dependencies:
```sh
npm install
```

Next, install client dependencies:
```sh
npm run install-client
```

Finally, install server dependencies:
```sh
npm run install-server
```

### Step 3: Configure Environment Variables

Create a '.env' file in the 'server' directory to store your environment variables such as email credentials for Nodemailer. Your .env file might look something like this:
```sh
EMAIL=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

#### Step 4: Run the Application
To run the application in development mode with both the frontend and backend servers concurrently, use the following command:

```sh
npm run dev
```

This command uses `concurrently` to run both servers at the same time. The frontend React app will be available at [http://localhost:3000](http://localhost:3000), and the backend Express server will run on [http://localhost:3001](http://localhost:3001).

#### Step 5: Build and Run for Production

To prepare the application for production, you can build the frontend which creates a build directory with a production 'build' of your app:
```sh
npm run build-client
```

After building the client, you can start the server which will serve both the API and the static frontend files:

```sh
npm start
```

Your Carranza Restoration LLC application is now running and accessible.

##### Additional Configuration

- **Deployment**: If deploying to Heroku or another platform, ensure you set up environment variables through their platform-specific configuration tools.
- **Database Configuration**: If your application requires database integration, ensure you configure the connection settings accordingly in your server code.

## Project Requirements
* Implement a **Progressive Web Application (PWA)** for offline access and improved performance.
* Use **React** for the frontend for a dynamic single-page application experience.
* Utilize **Node.js and Express.js** for the backend server.
* Employ **Nodemailer** for sending emails through the contact form.
* Deploy the application using **Heroku** for accessibility.

## Collaborators
This project is brought to you by the dedicated team at Carranza Restoration LLC. For collaborations or inquiries, please contact [admin@carranzarestoration.com](mailto:admin@carranzarestoration.com).

