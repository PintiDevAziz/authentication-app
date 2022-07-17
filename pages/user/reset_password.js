import React, { useContext } from "react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { auth } from "../../firebase";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import ErrorText from "../../components/User/ErrorText";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const Login = () => {
  //! Email Regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  //! Router
  const router = useRouter();
  const {
    setUserLoading,
    resetError,
    setResetError,
    reset,
    resetSended,
    setResetSended,
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (!email.match(emailRegex)) {
      setResetError("Please Enter Your Email ");
    } else {
      setResetError(null);
    }
  }, [email]);

  //! autoPush home page after login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoading(false);
        router.push("/");
      }
    });
    return () => unsub;
  }, []);
  useEffect(() => {
    if (resetSended) {
      const interval = setInterval(() => {
        setSeconds((second) => second - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        if (seconds == 5) {
          setResetSended(false);
          router.push("/user/login");
        }
      }, 5000);
    }
  }, [resetSended]);
  const [animate] = useAutoAnimate()
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-full">
      <div ref={animate} className="rounded-2xl border-2 border-borderGray  w-[32rem] p-8 ">
        {resetSended ? (
          <div>
            <div className="text-black text-2xl font-semibold mb-3">
              Reset Email Sended Succesful &#9989;
            </div>
            <p className="text-textGray">
              Redirecting to the{" "}
              <Link href="/login">
                <a className="text-themeBlue">Login</a>
              </Link>{" "}
              page in {seconds} seconds
            </p>
          </div>
        ) : (
          <>
            {" "}
            <img src="/devchallenges.svg" className="h-6 mb-6" />
            <div className="mb-6">
              <h2 className="text-black text-2xl w-[22rem] font-semibold mb-4">
                Reset Password
              </h2>
              <p className=" w-[21rem] font-semibold text-textGray">
                If you forget your password Just enter your email adress and
                reset your password with link
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <label className="flex items-center relative w-full h-14">
                <FiMail className="absolute left-2" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email"
                  className="border px-10 outline-none transition-all focus-within:border-gray-500 border-borderGray rounded-md h-12 w-full"
                />
              </label>

              <ErrorText error={resetError} />
              <button
                onClick={() => {
                  reset(email);
                }}
                disabled={resetError ? true : false}
                className="flex items-center disabled:cursor-not-allowed disabled:bg-themeBlue/50 justify-center bg-themeBlue text-white h-12 font-semibold transition-colors hover:bg-themeBlue/80 rounded-md w-full"
              >
                Send Email
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-[32rem] px-2 text-textGray h-10 text-sm flex justify-between items-center">
        <p>
          Created By <b className="underline">PintiDevAziz</b>
        </p>
        <p>devchallenges.io</p>
      </div>
    </div>
  );
};

export default Login;
