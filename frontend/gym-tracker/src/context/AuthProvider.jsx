import { useState } from "react";
import AuthContext from "./authContext.js";
import {
  login as loginRequest,
  signup as signupRequest,
} from "../services/authService.js";

const getStoredSession = () => {
  const storedSession = localStorage.getItem("gymTrackerSession");

  if (!storedSession) {
    return {
      user: null,
      token: null,
    };
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    localStorage.removeItem("gymTrackerSession");

    return {
      user: null,
      token: null,
    };
  }
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  const saveSession = (data) => {
    const newSession = {
      user: data.user,
      token: data.token,
    };

    localStorage.setItem(
      "gymTrackerSession",
      JSON.stringify(newSession)
    );

    setSession(newSession);
  };

  const login = async (email, password) => {
    const data = await loginRequest({
      email,
      password,
    });

    saveSession(data);
  };

  const signup = async (name, email, password) => {
    const data = await signupRequest({
      name,
      email,
      password,
    });

    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("gymTrackerSession");

    setSession({
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;