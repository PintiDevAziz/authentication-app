import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  onAuthStateChanged,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import Header from "../../components/User/Header";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { MdArrowBackIosNew } from "react-icons/md";
import { BsCamera } from "react-icons/bs";
import toast from "react-hot-toast";
import ErrorText from "../../components/User/ErrorText";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const Account = () => {
  const { currentUser, userLoading, setCurrentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [mode, setMode] = useState("view");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatarFile: null,
    bio: "",
  });

  //!Rotuer
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    if (router.query.account) {
      const docRef = doc(db, "users", router.query.account);
      onSnapshot(docRef, (snap) => {
        setProfileUser(snap.data());
      });
    }
    return () => {
      unsub;
    };
  }, [router.query.account]);
  const [animate] = useAutoAnimate();
  const save = () => {
    if ((formData.name && formData.avatarFile, formData.phone, formData.bio)) {
      const imgRef = ref(
        storage,
        `gs://authentication-app-8e407.appspot.com/photoUrls/${profileUser.id}`
      );
      const imgPromise = uploadBytes(imgRef, formData.avatarFile);
      toast.promise(imgPromise, {
        loading: "Profile Updating",
        success: "Profile Updated",
        error: "Error when updating profile",
      });
      imgPromise.then((data) => {
        getDownloadURL(imgRef).then((url) => {
          setDoc(
            doc(db, "users", profileUser.id),
            {
              photoURL: url,
              name: formData.name,
              bio: formData.bio,
              phoneNumber: formData.phone,
            },
            { merge: true }
          );
          updateProfile(currentUser, {
            photoURL: url,
            displayName: formData.name,
          });
        });
      });
    }
  };
  useEffect(() => {
    if (!formData.name || !formData.phone || !formData.bio) {
      setError("You have to fill all fields");
    } else {
      setError(null);
    }
  }, [formData]);
  return (
    <div className="h-screen  flex ">
      <div className="w-full h-full flex flex-col  justify-center">
        {profileUser ? (
          <>
            {" "}
            <Header user={profileUser} />
            <div className="w-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-semibold mb-2">Personal Info</h1>
                <p className="text-textGray">
                  Basic info,like your name and photo
                </p>
              </div>
            </div>
            <div ref={animate} className="w-[55rem] mx-auto">
              {mode === "edit" && (
                <button
                  onClick={() => {
                    setMode("view");
                    toast.success("Mode View");
                  }}
                  className="text-themeBlue flex  gap-x-2  items-center"
                >
                  <MdArrowBackIosNew />
                  <p>Back</p>
                </button>
              )}
              {mode === "view" ? (
                <div className=" h-auto rounded-lg border-2 border-borderGray mt-5">
                  <div className="border-b-2 border-borderGray h-24 px-10 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold ">Profile</h2>
                      <p className="text-textGray">
                        Some Info may be visible other persons
                      </p>
                    </div>
                    {profileUser.id === currentUser.uid && (
                      <button
                        onClick={() => {
                          if (mode === "view") {
                            setMode("edit");
                            toast.success("Mode Edit");
                          } else {
                            setMode("view");
                          }
                        }}
                        className="rounded-md border-borderGray p-2 border px-6"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="border-b border-borderGray p-4 flex px-10  items-center text-textGray gap-x-28">
                    <h1>Photo</h1>
                    <img
                      src={profileUser.photoURL}
                      alt=""
                      className="rounded-md h-20 w-20 object-cover object-left-top"
                    />
                  </div>
                  <div className="border-b border-borderGray p-4 flex px-10  items-center  gap-x-28">
                    <h1 className="text-textGray">Name</h1>
                    <p className="font-semibold">{profileUser.name}</p>
                  </div>
                  <div className="border-b border-borderGray p-4 flex px-10  items-center  gap-x-28">
                    <h1 className="text-textGray">Bio &nbsp; &nbsp;</h1>
                    <p className="font-semibold">{profileUser.bio}</p>
                  </div>
                  <div className="border-b border-borderGray p-4 flex px-10  items-center  gap-x-[6.6rem]">
                    <h1 className="text-textGray">Phone</h1>
                    <p className="font-semibold">{profileUser.phoneNumber}</p>
                  </div>
                  {profileUser.id === currentUser?.uid && (
                    <div className=" p-4 flex px-10  items-center  gap-x-28">
                      <h1 className="text-textGray">Email</h1>
                      <p className="font-semibold">{profileUser.email}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className=" h-auto rounded-lg border-2 border-borderGray mt-5 p-8 ">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold ">Change Info</h2>
                    <p className="text-textGray">
                      Some Info may be visible other persons
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-6">
                    <div className="flex  items-center gap-x-3">
                      <label
                        htmlFor="avatar"
                        className="group relative  w-24 h-24  "
                      >
                        <img
                          src={
                            formData.avatarFile !== null
                              ? URL.createObjectURL(formData.avatarFile)
                              : profileUser.photoURL
                          }
                          alt=""
                          className="rounded-md  w-full h-full object-cover"
                        />
                        <div className="absolute scale-0 rounded-md bg-black/40 group-hover:scale-100 transition-transform  left-0 top-0 w-full h-full flex items-center justify-center">
                          <BsCamera className="text-2xl text-white cursor-pointer" />
                        </div>
                      </label>
                      <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        onChange={(e) => {
                          setFormData({
                            name: formData.name,
                            bio: formData.bio,
                            phone: formData.phone,
                            avatarFile: e.target.files[0],
                          });
                        }}
                      />
                      <p className="text-textGray  uppercase ">
                        {formData.avatarFile !== null
                          ? formData.avatarFile.name
                          : "Change Photo"}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-textGray mb-1 text-sm">Name</p>
                      <input
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            name: e.target.value,
                            bio: formData.bio,
                            avatarFile: formData.avatarFile,
                            phone: formData.phone,
                          });
                        }}
                        placeholder="Enter Your Name"
                        className="rounded w-96 px-2 h-10 outline-none border-borderGray border  focus-within:border-gray-500"
                      />
                    </div>
                    <div>
                      <p className="text-textGray mb-1 text-sm">Bio</p>
                      <textarea
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            name: formData.name,
                            bio: e.target.value,
                            avatarFile: formData.avatarFile,
                            phone: formData.phone,
                          });
                        }}
                        placeholder="Enter Your Bio"
                        className="rounded w-96  resize-none py-1 px-2 h-20 outline-none border-borderGray border  focus-within:border-gray-500"
                      />
                    </div>
                    <div>
                      <p className="text-textGray mb-1 text-sm">Phone</p>
                      <input
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            name: formData.name,
                            bio: formData.bio,
                            avatarFile: formData.avatarFile,
                            phone: e.target.value,
                          });
                        }}
                        placeholder="Enter Your Phone"
                        className="rounded w-96 px-2 h-10 outline-none border-borderGray border  focus-within:border-gray-500"
                      />
                    </div>
                    <div className="w-44">
                      <ErrorText error={error} />
                    </div>
                    <button
                      onClick={save}
                      disabled={error ? true : false}
                      className="rounded-md  disabled:cursor-not-allowed disabled:opacity-50 bg-themeBlue text-white w-32 h-10"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
};

export default Account;
