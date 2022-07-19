import { signOut } from "firebase/auth";
import React from "react";
import { AuthContext, AuthContextProvider } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Link from "next/link";
const Index = () => {
  //! amazing we fixed the bug :) next live next part bye
  const { setCurrentUser, currentUser, userLoading } = useContext(AuthContext);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unsub;
    };
  }, []);
  return (
    <div>
      {userLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          {currentUser == null ? (
            <div className="flex h-screen w-full items-center justify-center">
              <Link href={"user/register"}>
                <a className="border-2 hover:border-themeBlue border-borderGray rounded-md mx-4 p-4 ">
                  Create new account
                </a>
              </Link>
              <Link href={"user/register"}>
                <a className="border-2 hover:border-themeBlue border-borderGray rounded-md mx-4 p-4 ">
                  Login
                </a>
              </Link>
              <Link href={"user/reset_password"}>
                <a className="border-2 hover:border-themeBlue border-borderGray rounded-md mx-4 p-4 ">
                  Reset Password
                </a>
              </Link>
            </div>
          ) : (
            <div>
              {currentUser.email}

              <button
                onClick={() => {
                  signOut(auth);
                }}
              >
                Log Out
              </button>
              <Link href={`user/${currentUser.uid}`}>
                <a>My Profile</a>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
