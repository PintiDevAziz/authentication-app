import React, { useContext } from "react";
import { FiMail } from "react-icons/fi";
import { auth } from "../../firebase";
import {
  AiFillLock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiFillGithub,
  AiOutlineGoogle,
} from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import Link from "next/link";
import ErrorText from "../../components/User/ErrorText";
const Login = () => {
  //! Email Regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  //! Router
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const {
    setUserLoading,
    loginWithEmail,
    loginError,
    setLoginError,
    loginWithGithub,
    loginWithGoogle,
  } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!formData.email.match(emailRegex) || formData.password.length < 6) {
      setLoginError("Please Fill ");
    } else {
      setLoginError(null);
    }
  }, [formData]);
  //! Scoail Provider list

  const [socialProviders] = useState([
    {
      name: "Github",
      icon: <AiFillGithub />,
      loginFunction: loginWithGithub,
    },
    {
      name: "Google",
      icon: <AiOutlineGoogle />,
      loginFunction: loginWithGoogle,
    },
  ]);

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
      <div className="rounded-2xl border-2 border-borderGray w-[32rem] p-8 ">
        <img src="/devchallenges.svg" className="h-6 mb-6" />
        <div className="mb-6">
          <h2 className="text-black text-2xl w-[22rem] font-semibold mb-4">
            Login
          </h2>
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
          <ErrorText error={loginError} />

          <button
            onClick={() => {
              loginWithEmail(formData.email, formData.password);
            }}
            disabled={loginError ? true : false}
            className="flex items-center disabled:cursor-not-allowed disabled:bg-themeBlue/50 justify-center bg-themeBlue text-white h-12 font-semibold transition-colors hover:bg-themeBlue/80 rounded-md w-full"
          >
            Login
          </button>
          <p className="mx-auto text-textGray font-semibold">
            or continue with these social profile
          </p>
          <div className="flex items-center gap-x-4 justify-center text-textGray text-3xl mt-4">
            {socialProviders &&
              socialProviders.map((provider, indeks) => (
                <div
                  key={indeks}
                  onClick={provider.loginFunction}
                  className="rounded-full cursor-pointer border border-borderGray flex items-center justify-center w-14 h-14 transition-colors hover:border-gray-500"
                >
                  {provider.icon}
                </div>
              ))}
          </div>
          <div className="flex justify-between items-center">
            <p className="mx-auto flex flex-col items-center text-textGray font-semibold">
              Don't have account yet ?{" "}
              <Link href="/user/register">
                <a className="text-themeBlue">Register</a>
              </Link>
            </p>
            <p className="mx-auto flex flex-col items-center text-textGray font-semibold">
              Forgot You Password ?{" "}
              <Link href="/user/reset_password">
                <a className="text-themeBlue">Reset Password</a>
              </Link>
            </p>
          </div>
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
