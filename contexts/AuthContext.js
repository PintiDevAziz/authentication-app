import React, { createContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
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
        let docRef = doc(db, "users", user.user.uid);
        setDoc(docRef, {
          name: user.user.displayName,
          email: user.user.email,
          photoURL: user.user.photoURL,
          bio: "No Bio Yet",
          phone: "No Phone Number",
          id: user.user.uid,
        });
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
      .then((user) => {
        setLoginError(null);
        let docRef = doc(db, "users", user.user.uid);
        setDoc(docRef, {
          name: user.user.displayName,
          email: user.user.email,
          photoURL: user.user.photoURL,
          bio: "No Bio Yet",
          phone: "No Phone Number",
          id: user.user.uid,
        });
      })
      .catch((err) => {
        setLoginError(err.code?.replace("auth/", ""));
      });
  };
  //! Login with Google
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((user) => {
        setLoginError(null);
        let docRef = doc(db, "users", user.user.uid);
        setDoc(docRef, {
          name: user.user.displayName,
          email: user.user.email,
          photoURL: user.user.photoURL,
          bio: "No Bio Yet",
          phone: "No Phone Number",
          id: user.user.uid,
        });
      })
      .catch((err) => {
        setLoginError(err.code?.replace("auth/", ""));
      });
  };

  //! Register

  const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setRegisterError(null);
      })
      .catch((err) => {
        setRegisterError(err.code?.replace("auth/", ""));
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
