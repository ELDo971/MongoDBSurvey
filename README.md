
# Survey App

A full-stack survey application built with **React** (frontend) and **Node.js/Express + MongoDB Atlas** (backend).

- User authentication (JWT)
- Create, edit, and delete surveys (open and QCM questions)
- Answer surveys as logged-in or anonymous users
- View all surveys and your own surveys
- View answers to your surveys

## Features

- **User registration & login** (JWT authentication)
- **Create, edit, delete surveys** (open and multiple-choice questions)
- **Answer surveys** (no login required)
- **View all surveys** or just your own
- **See all responses** to your surveys
- Modern, modular codebase

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/survey-app.git
cd survey-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in the `backend/` folder with your MongoDB Atlas URI and a JWT secret:

  ```
  MONGODB_URI=mongodb+srv://:@cluster.mongodb.net/surveydb?retryWrites=true&w=majority
  JWT_SECRET=your_secret_key
  ```

- Start the backend server:

  ```bash
  npm start
  ```
  The backend runs by default on [http://localhost:23231](http://localhost:23231).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```
- The frontend runs by default on [http://localhost:3000](http://localhost:3000).

## Testing the App

- Make sure both the backend and frontend servers are running.
- **(Optional, but recommended):** To quickly populate your database with test users, surveys, and responses, run the provided initialization script:
  ```bash
  cd backend
  node mongoinit.js
  ```
  This will insert sample data into your MongoDB Atlas cluster so you can immediately test the app’s features.
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Register, log in, and try creating, editing, and answering surveys.
- Use the "View Answers" button on your surveys to see collected responses.

## Project Structure

```
backend/
  controllers/
  db/
    models/
  middleware/
  routes/
  mongoinit.js      # <--- test data script
  app.js
  .env
frontend/
  src/
    components/
    pages/
    App.js
  package.json
```

## Notes

- You need a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account to use the app.
- The backend uses JWT for authentication.
- Passwords are securely hashed.
- For demo/testing, you can register users and create surveys directly from the UI.
- To reset or re-populate your database, just re-run `node mongoinit.js`.



**Enjoy building and sharing surveys!**

---