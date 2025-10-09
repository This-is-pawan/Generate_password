"use client";
import React, { useState } from "react";
import { MdWifiPassword } from "react-icons/md";
import { useRouter } from "next/navigation";

import axios from "axios";
import {toast} from 'react-toastify'
interface RegisterResponse {
  success: boolean;
  message?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
 
}
 const BASE_URL = "https://generate-password-flame.vercel.app/Auth";
const Register = () => {
  const router = useRouter();
  const [pass, setPass] = useState(true);
  const [register, setRegister] = useState<"login" | "register">("register");
  const [name, setName] = useState("peter");
  const [email, setEmail] = useState("peter@gmail.com");
  const [password, setPassword] = useState("peter123#");

  const registerHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: RegisterData = { name, email, password };

    try {
      const res = await axios.post<RegisterResponse>(
        `${BASE_URL}/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
     if (res.data.success) {
  toast.success("Registration successful!");
    router.push("/Dashboard");
    
} else {
  toast.error(res.data.message || "Already register ");
}
    } catch (error: any) {
       toast.error(error)
      
    }
  };

  const loginHandle = async(e: React.FormEvent,) => {
    e.preventDefault();
    const data: LoginData = { email, password };
    try {
      
      const res=await axios.post<RegisterResponse>(  `${BASE_URL}/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
      if (res.data.success) {
  toast.success("Login successful!");
    router.push("/Dashboard");
} else {
  toast.error(res.data.message || "Login fail ");
}
    } catch (error:any) {
      toast.error(error);
    }
    
  };

  return (
    <div className="w-full max-w-[400px] m-auto shadow-lg bg-white mt-[4rem] p-5 rounded">
      <form
        className="grid gap-3 relative"
        onSubmit={register === "register" ? registerHandle : loginHandle}
      >
        {register === "login" ? (
          <>
            {/* Login Form */}
            <label>Email</label>
            <input
              type="email"
              className="bg-pink-50 rounded-xl p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type={pass ? "password" : "text"}
              className="bg-pink-50 rounded-xl p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <MdWifiPassword
              className="absolute top-[8.5rem] right-3 cursor-pointer hover:text-pink-400"
              onClick={() => setPass(!pass)}
              size={18}
            />

            <button
              type="submit"
              className="p-3 bg-gray-950 text-white rounded-full mt-5 hover:bg-gray-700 cursor-pointer border-2"
            >
              Login
            </button>

            <p className="text-center m-3">
              Don’t have an account?
              <span
                className="text-blue-900 underline pl-2 cursor-pointer"
                onClick={() => setRegister("register")}
              >
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Register Form */}
            <label>Name</label>
            <input
              type="text"
              className="bg-pink-50 rounded-xl p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              className="bg-pink-50 rounded-xl p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type={pass ? "password" : "text"}
              className="bg-pink-50 rounded-xl p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <MdWifiPassword
              className="absolute top-[14rem] right-3 cursor-pointer hover:text-pink-400"
              onClick={() => setPass(!pass)}
              size={18}
            />

            <button
              type="submit"
              className="p-3 bg-gray-950 text-white rounded-full mt-5 hover:bg-gray-700 cursor-pointer border-2"
            >
              Register
            </button>

            <p className="text-center m-3">
              Already have an account?
              <span
                className="text-blue-900 underline pl-2 cursor-pointer"
                onClick={() => setRegister("login")}
              >
                Login
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
