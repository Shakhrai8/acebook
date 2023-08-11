# ACEBOOK - Social Media Application

ACEBOOK is a comprehensive social media application where users can create posts, like and comment on posts, manage their profile, and receive notifications. 

The application is built with a React.js frontend, and an Express.js backend with a set of REST APIs.

## Features

- User Authentication: Signup/Login/Logout functionality using JWT for token-based authentication.
- User Profiles: Each user has a profile page where they can update their profile picture and manage their information.
- Posts: Users can create posts with text and image content. They can also like posts.
- Comments: Users can comment on posts and like comments.
- Notifications: Users receive notifications for various activities related to their posts and interactions with other users.
- Search: Users can search posts based on keywords.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Shakhrai8/acebook.git
   ```

2. Install dependencies in both the frontend and backend directories

   ```bash
   cd frontend && npm install
   cd ..
   cd api && npm install
   ```

3. Start the frontend and backend servers

   - Frontend:

     ```bash
     cd frontend && npm start
     ```

   - Backend(need to specify the key token):

     ```bash
     cd api && npm start
     ```

The application will start on `localhost:3000` (React app) and `localhost:5000` (Express app).

## Running the tests

We use Jest for backend testing and Cypress for frontend end-to-end testing.

- To run backend tests(again need to specify the key token in order to run the test):

  ```bash
  cd api && jest
  ```

- To run frontend tests:

  ```bash
  cd frontend && npx run cypress run
  ```

## Built With

- [React.js](https://reactjs.org/) - The web framework used
- [Express.js](https://expressjs.com/) - Backend framework
- [JWT](https://jwt.io/) - Used for authentication
- [Multer](https://www.npmjs.com/package/multer) - Used for handling multipart/form-data
- [Jest](https://jestjs.io/) - Used for backend testing
- [Cypress](https://www.cypress.io/) - Used for end-to-end testing

