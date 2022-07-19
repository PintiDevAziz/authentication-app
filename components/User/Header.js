import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import React, { useState } from "react";
import { MdArrowDropDown, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsPeople } from "react-icons/bs";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
const Header = ({ user }) => {
  const [dropDown, setDropDown] = useState(false);
  const [animate] = useAutoAnimate();
  return (
    <div className="flex items-center justify-between px-20 h-16 mb-10 absolute w-full top-0">
      <Link href={"/"}>
        <a>
          <img src="/devchallenges.svg" className="h-6" />
        </a>
      </Link>
      <div className="flex items-center gap-x-3 relative">
        <img
          src={user.photoURL}
          alt={user.displayName}
          className={"rounded-md h-10 w-10"}
        />
        <p className="font-semibold">{user.name}</p>
        <button
          onClick={() => {
            setDropDown(!dropDown);
          }}
          className={`text-2xl transition-transform ${
            dropDown ? "rotate-180" : "rotate-0"
          }`}
        >
          <MdArrowDropDown />
        </button>
        <div ref={animate}>
          {dropDown && (
            <ul className="absolute flex flex-col gap-y-2  w-[13rem] right-0 top-8 shadow-xl border  rounded-md py-2 px-3">
              <Link href={"user/"}>
                <a className="flex  items-center gap-x-2 hover:bg-gray-200 p-2 rounded-md">
                  <CgProfile size={21} />
                  <p>My Profile</p>
                </a>
              </Link>

              <Link href={"user/"}>
                <a className="flex items-center gap-x-2 hover:bg-gray-200 p-2 rounded-md">
                  <BsPeople size={21} />
                  <p>Chat Group</p>
                </a>
              </Link>
              <div className="h-[1px] w-full bg-gray-200"></div>
              <button
                onClick={() => {
                  signOut(auth);
                }}
                className="flex items-center gap-x-2 text-red-500 py-2 px-2 cursor-pointer font-semibold"
              >
                <MdLogout />
                <p>Logout</p>
              </button>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
