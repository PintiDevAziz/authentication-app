import { signOut } from "firebase/auth";
import React from "react";
import { AuthContext, AuthContextProvider } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
const Index = () => {
  //! amazing we fixed the bug :) next live next part bye
  const { setCurrentUser, currentUser, userLoading, } = useContext(AuthContext);
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
            "Not user signed"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
