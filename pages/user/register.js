import React, { useContext } from "react";
import { FiMail } from "react-icons/fi";
import { auth } from "../../firebase";
import {
  AiFillLock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import ErrorText from "../../components/User/ErrorText";
const Login = () => {
  //! Email Regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  //! Router
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { setUserLoading, registerError, setRegisterError, register } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repassword: "",
  });

  useEffect(() => {
    if (!formData.email.match(emailRegex) || formData.password.length < 6) {
      setRegisterError("Please Fill ");
    } else if (formData.password != formData.repassword) {
      setRegisterError("Passwrods have to match");
    } else {
      setRegisterError(null);
    }
  }, [formData]);

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
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-full">
      <div className="rounded-2xl border-2 border-borderGray  w-[32rem] p-8 ">
        <img src="/devchallenges.svg" className="h-6 mb-6" />
        <div className="mb-6">
          <h2 className="text-black text-2xl w-[22rem] font-semibold mb-4">
            Join thousands of learners from around the world
          </h2>
          <p className=" w-[21rem] font-semibold text-textGray">
            Master web developement by making real-life projects. There are
            multiple paths for you to chose{" "}
          </p>
        </div>
        <div className="flex flex-col gap-y-3">
          <label className="flex items-center relative w-full h-14">
            <FiMail className="absolute left-2" size={20} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  email: e.target.value,
                  password: formData.password,
                  repassword: formData.repassword,
                });
              }}
              placeholder="Email"
              className="border px-10 outline-none transition-all focus-within:border-gray-500 border-borderGray rounded-md h-12 w-full"
            />
          </label>
          <label className="flex items-center relative w-full h-14">
            <AiFillLock className="absolute left-2" size={20} />
            <input
              type={visible ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({
                  email: formData.email,
                  password: e.target.value,
                  repassword: formData.repassword,
                });
              }}
              className="border px-10 outline-none transition-all focus-within:border-gray-500 border-borderGray rounded-md h-12 w-full"
            />
            <div
              onClick={() => {
                setVisible(!visible);
              }}
              className="absolute right-2 text-lg cursor-pointer"
            >
              {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </label>
          <label className="flex items-center relative w-full h-14">
            <AiFillLock className="absolute left-2" size={20} />
            <input
              type={visible ? "text" : "password"}
              placeholder="Again Password"
              value={formData.repassword}
              onChange={(e) => {
                setFormData({
                  email: formData.email,
                  password: formData.password,
                  repassword: e.target.value,
                });
              }}
              className="border px-10 outline-none transition-all focus-within:border-gray-500 border-borderGray rounded-md h-12 w-full"
            />
            <div className="absolute right-2 text-lg">
              {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </label>
          <ErrorText error={registerError} />
          <button
            onClick={() => {
              register(formData.email, formData.password);
            }}
            disabled={registerError ? true : false}
            className="flex items-center disabled:cursor-not-allowed disabled:bg-themeBlue/50 justify-center bg-themeBlue text-white h-12 font-semibold transition-colors hover:bg-themeBlue/80 rounded-md w-full"
          >
            Start Coding Now
          </button>
        </div>
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
