"use client";

import React, { useState, useEffect } from "react";
import { FaClipboardCheck, FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import axios from "axios"; 
import { toast } from "react-toastify";
import { LuLoader } from "react-icons/lu";
interface UserItem {
  _id: string;
  name: string;
  url: string;
}
interface SaveResponse {
  success: boolean;
  message?: string;
  data?: UserItem[] | UserItem;
}

const Dashboard: React.FC = () => {
  const [clip, setClip] = useState(false);
  const [password, setPassword] = useState("");
  const [web, setWeb] = useState("website");
  const [name, setName] = useState("peter");
  const [loading, setLoading] = useState("");
  const [printGetUser, setPrintGetUser] = useState<UserItem[]>([]);

  const BASE_URL = "https://generate-password-backend.onrender.com/Auth";

  // Generate random password
  const randomPassword = (length: number = 30): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?/|";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  // Copy password to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setClip(true);
    } catch (err) {
      toast.error("Failed to copy password");
    }
  };

  // Hide copy feedback after delay
  useEffect(() => {
    if (clip) {
      const timer = setTimeout(() => setClip(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [clip]);

  // Fetch all saved users
  const fetchUsers = async () => {
    try {
      const res = await axios.get<SaveResponse>(`${BASE_URL}/findUser`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success && res.data.data) {
        const users = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setPrintGetUser(users);
      } else {
        setPrintGetUser([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error fetching users");
    }
  };

  // Save new website + name
  const handleWebName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('loading')
    try {
      const payload = { url: web, name };
      const res = await axios.post<SaveResponse>(`${BASE_URL}/save`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Password & user saved successfully!");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Failed to save data");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error while saving");
    }finally{
      setLoading("")
    }
  };

  // Delete user
  const deleteHandle = async (id: string) => {
    try {
      const res = await axios.delete<SaveResponse>(`${BASE_URL}/deleteUser/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error while deleting");
    }
  };

  // Update user
  const updateHandle = async (id: string, name: string, url: string) => {
    try {
      const res = await axios.patch<SaveResponse>(
        `${BASE_URL}/updateUser/${id}`,
        { name, url },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("User updated successfully!");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error while updating");
    }
  };

  // On first load
  useEffect(() => {
    setPassword(randomPassword());
    fetchUsers();
  }, []);

  return (
    <div className="w-full p-5">
      {/* Header */}
      <h1 className="text-center p-5 bg-amber-400 text-white capitalize text-3xl rounded-md shadow-md">
        Dashboard (create strong password )
      </h1>

      {/* Password Generator */}
      <div className="w-full max-w-4xl m-auto mt-10 shadow-lg bg-white flex flex-col md:flex-row items-center gap-4 p-5 rounded-lg">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            className="w-full p-4 bg-amber-200 rounded-md border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 pr-12"
            placeholder="Generated password"
            value={password}
            readOnly
          />
          <FaClipboardCheck
            className={`absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors ${
              clip ? "text-green-600" : "text-gray-500"
            }`}
            size={24}
            onClick={handleCopy}
          />
          {clip && (
            <span className="absolute bottom-[3rem] right-[0.5rem] text-[10px] shadow p-2 bg-amber-50 rounded-lg tracking-wide">
              Copied!
            </span>
          )}
        </div>

        <button
          className="w-full md:w-1/3 p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          onClick={() => setPassword(randomPassword())}
        >
          Generate
        </button>
      </div>

      {/* Save Website & Name */}
      <div className="w-full flex justify-center mt-4 bg-white gap-3 p-3 shadow rounded-lg">
        <form className="flex gap-2 max-sm:grid" onSubmit={handleWebName}>
        <p className="capitalize">
generate first then save 
</p>
          <input
            type="text"
            placeholder="Website/App/URL"
            className="bg-amber-200 pl-4 p-2 rounded-md"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            className="bg-amber-200 pl-4 p-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-800"
          >
        {loading==='loading' ?<LuLoader 
aria-hidden="true"
className="animate-spin"
/>:<span>Save</span>}  
          </button>
        </form>
      </div>

      {/* Saved Data List */}
      <div className="w-full min-h-20 mt-4 shadow bg-white rounded-lg">
        <h1 className="text-center border-b-2 capitalize p-2">Saved Data List</h1>
        {printGetUser.length > 0 ? (
          printGetUser.map((item) => (
            <div key={item._id} className="p-2 border-b">
              <p>Name: {item.name.toUpperCase()}</p>
             <p className="break-words text-sm sm:text-base">
  pass: {item.url.chartAt(30)}
</p>

              <div className="flex justify-end gap-3 mt-2">
                <FaEdit
                  className="cursor-pointer text-2xl hover:text-green-600 transition-all duration-300"
                  onClick={() => {
                    const newName = prompt("Enter new name:", item.name);
                    const newUrl = prompt("Enter new URL:", item.url);
                    if (newName && newUrl) {
                      updateHandle(item._id, newName, newUrl);
                    }
                  }}
                />
                <FaTrashCan
                  className="cursor-pointer text-xl hover:text-pink-600 transition-all duration-300"
                  onClick={() => deleteHandle(item._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="p-2 text-center">No data found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
