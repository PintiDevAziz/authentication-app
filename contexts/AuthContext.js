import React, { createContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [resetError, setResetError] = useState(null);
  const [resetSended, setResetSended] = useState(false);
  //!Login function
  const loginWithEmail = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        setLoginError(null);
      })
      .catch((err) => {
        setLoginError(err.code?.replace("auth/", ""));
      });
  };
  //! LoginProviders
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();
  //! Login with Github
  const loginWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then(() => {
        setLoginError(null);
      })
      .catch((err) => {
        setLoginError(err.code.replace("auth/", ""));
      });
  };
  //! Login with Google
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        setLoginError(null);
      })
      .catch((err) => {
        setLoginError(err.code.replace("auth/", ""));
      });
  };

  //! Register

  const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setRegisterError(null);
      })
      .catch((err) => {
        setRegisterError(err.code.replace("auth/", ""));
      });
  };

  //! Password Reset
  const reset = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetError(null);
        setResetSended(true);
      })
      .catch((err) => {
        setResetError(err.code.replace("auth/", ""));
      });
  };
  const value = {
    currentUser,
    setCurrentUser,
    resetError,
    setResetError,
    userLoading,
    setUserLoading,
    loginWithEmail,
    registerError,
    setRegisterError,
    setLoginError,
    reset,
    loginError,
    register,
    loginWithGithub,
    resetSended,
    loginWithGoogle,
    loginWithEmail,
    setResetSended,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
