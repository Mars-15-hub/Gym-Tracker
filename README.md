# Gym Tracker

Gym Tracker is a full-stack web application for creating and managing personalized workout routines.

Users can sign up, log in, create workouts, choose exercises, record sets, weight and repetitions, and edit or delete their own workout data. Each workout is linked to the authenticated user so users only see and manage their own workouts.

## Its Features

- User signup and login
- JWT-based authentication
- Personalized workouts for each user
- Create, view, edit and delete workouts
- Add multiple exercises to a workout
- Add multiple sets to each exercise
- Edit and remove exercises and sets
- Record weight and repetitions
- Search workouts by name
- Filter workouts by duration
- Automatic workout refresh
- Workout summaries showing exercise count, set count and total training volume
- Expand and collapse workout exercise details
- Loading and error states
- Responsive user interface

## Its Architecture

Gym Tracker uses a client-server architecture.

```text
React / Vite Frontend
        |
        | HTTP requests
        v
Express / Node.js Backend
        |
        | Mongoose
        v
MongoDB Atlas
```

The frontend is built with React and Vite. It displays the user interface, manages authentication state and sends requests to the backend API.

The backend is built with Node.js and Express. It handles authentication, validation, workout operations, exercise management and set management.

MongoDB Atlas stores the application data and Mongoose is used to define schemas and relationships between collections.

The main database relationships are:

```text
User
 |
 | 1 : many
 v
Workout
 |
 | 1 : many
 v
WorkoutExercise
 |             |
 |             | 1 : many
 v             v
Exercise      Set
```

A user can have many workouts. A workout can contain many workout exercises. Each workout exercise references one exercise and can contain multiple sets.

JWT authentication is used to identify the logged-in user. Protected backend routes use the authenticated user's ID so users can only access their own workouts.

# The Project Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Mars-15-hub/Gym-Tracker.git
cd Gym-Tracker
```

2. Install the backend dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
```

4. Start the backend:

```bash
npm run dev
```

5. Open another terminal and install the frontend dependencies:

```bash
cd frontend
cd gym-tracker
npm install
```

6. Start the frontend:

```bash
npm run dev
```

7. Open the frontend URL shown by Vite in the terminal. It is normally:

```text
http://localhost:5173
```

The backend normally runs on:

```text
http://localhost:3001
```

To use the seed script, run: 

```bash
npm run seed
```

from the backend folder before using the application.