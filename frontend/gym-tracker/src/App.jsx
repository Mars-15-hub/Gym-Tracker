import { useState } from "react";

import WorkoutList from "./pages/WorkoutList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

import useAuth from "./hooks/useAuth";

const App = () => {
  const { user, logout } = useAuth();

  const [authPage, setAuthPage] = useState("login");

  return (
    <div className="app">
      <header className="navbar">
        <h2>Gym Tracker</h2>

        {user && (
          <div className="navbar-user">
            <span>{user.name}</span>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {user ? (
        <WorkoutList />
      ) : authPage === "login" ? (
        <Login
          onShowSignup={() =>
            setAuthPage("signup")
          }
        />
      ) : (
        <Signup
          onShowLogin={() =>
            setAuthPage("login")
          }
        />
      )}

      <Footer />
    </div>
  );
};

export default App;