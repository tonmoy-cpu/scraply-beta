import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  setEmail,
  setPhoneNumber,
  setToken,
  setUser,
  setUserID,
  setUserName,
  setfullname,
  setUserRole,
} from "./auth";

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const login = async () => {
    toast.loading("Loading..");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const user = response.data;

      if (!user) {
        throw new Error("No user data received");
      }

      localStorage.setItem("user", JSON.stringify(user));

      toast.dismiss();
      toast.success("Login Successful!");

      if (user) {
        setUser(user);
        setEmail(user.email);
        setToken(user.token);
        setPhoneNumber(user.phoneNumber);
        // Handle both fullname and fullName properties
        setfullname(user.fullname || user.fullName || user.name || "");
        setUserID(user.id);
        setUserRole(user.role || 'user');
        if (user.username) {
          setUserName(user.username);
        }
      }

      window.location.href = "/";
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.dismiss();
      if (error.response?.status === 401) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please check your email or sign up.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center md:h-screen h-[70vh]">
      <ToastContainer
        className="text-2xl"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Welcome back</span>
          <span className="font-light text-gray-400 mb-8">
            Welcome back! Please enter your details
          </span>
          <form className="py-4">
            <span className="mb-2 text-md">Email</span>
            <input
              type="text"
              className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              id="email"
              placeholder="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </form>
          <div className="py-4">
            <span className="mb-2 text-md">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="password"
              className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>
          <div className="flex justify-between w-full py-4">
            <label className="flex items-center text-sm mr-24">
              <input
                type="checkbox"
                name="ch"
                id="ch"
                placeholder="checkbox"
                className="mr-2 p-1"
                onClick={togglePasswordVisibility}
              />
              Show Password
            </label>
            <Link href="/forget-password" className="font-bold text-black">
              forgot password ?
            </Link>
          </div>

          <button
            className="w-full bg-black mt-4 text-white p-2 rounded-lg mb-6 hover:bg-emerald-400 hover:text-black hover:border hover:border-gray-300"
            onClick={login}
          >
            Sign in
          </button>

          <div className="text-center text-gray-400">
            Dont have an account?
            <Link
              href="/sign-up"
              className="font-bold text-black hover:text-emerald-300"
            >
              Sign up{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
