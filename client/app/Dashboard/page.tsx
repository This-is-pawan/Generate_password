'use client';
import React, { useState, useEffect } from "react";
import { FaClipboardCheck } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [printGetUser, setPrintGetUser] = useState<UserItem[]>([]);

  // Generate random password
  const randomPassword = (length: number = 30): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?/|";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    return pass;
  };

  useEffect(() => {
    setPassword(randomPassword());
    fetchUsers();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setClip(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    if (clip) {
      const timer = setTimeout(() => setClip(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [clip]);

  const fetchUsers = async () => {
  try {
    const res = await axios.get<SaveResponse>("http://localhost:5000/Auth/findUser", {
      withCredentials: true,
    });

    console.log("Fetched data:", res.data.data); // 👈 check if _id exists

    if (res.data.success && res.data.data) {
      const users = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      setPrintGetUser(users);
    } else {
      setPrintGetUser([]);
    }
  } catch (error: any) {
    toast.error(error.message || "Server error while fetching users");
  }
};


  const handleWebName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = { url: web, name };
      const res = await axios.post<SaveResponse>("http://localhost:5000/Auth/save", payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Password & user successfully saved");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Not saved");
      }
    } catch (error: any) {
      toast.error(error.message || "Server error while saving");
    }
  };

  const deleteHandle = async (id: string) => {
    try {
      const res = await axios.delete<SaveResponse>(
        `http://localhost:5000/Auth/deleteUser/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Not deleted");
      }
    } catch (error: any) {
      toast.error(error.message || "Server error while deleting");
    }
  };
const updateHandle = async (id: string, name: string, url: string) => {
  try {
    const res = await axios.patch<SaveResponse>(
      `http://localhost:5000/Auth/updateUser/${id}`, 
      { name, url },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("User updated successfully");
      fetchUsers(); 
    } else {
      toast.error(res.data.message || "Not updated");
    }
  } catch (error: any) {
    toast.error(error.message || "Server error while updating");
  }
};

  return (
    <div className="w-full p-5">
      <h1 className="text-center p-5 bg-amber-400 text-white capitalize text-3xl rounded-md shadow-md">
        Dashboard
      </h1>

      {/* Password generator */}
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
      <div className="w-full flex justify-center mt-4 bg-white gap-3 p-3 shadow">
        <form className="flex gap-2" onSubmit={handleWebName}>
          <input
            type="text"
            placeholder="Website/App/URL"
            className="bg-amber-200 pl-4 p-2 rounded-md"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="bg-amber-200 pl-4 p-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-800"
          >
            Save
          </button>
        </form>
      </div>

      {/* Saved Data List */}
      <div className="w-full min-h-20 mt-4 shadow bg-white">
        <h1 className="text-center border-b-2 capitalize p-2">Saved Data List</h1>
        {printGetUser.length > 0 ? (
          printGetUser.map((item, index) => (
            <div key={item._id || index} className="p-2 border-b">
              <p>Name: {item.name}</p>
              <p>URL: {item.url}</p>
              <div className="flex justify-end gap-3">
              <FaEdit
  className="transition-all duration-300 ease-in cursor-pointer text-2xl hover:text-green-600"
  onClick={() => {
    const newName = prompt("Enter new name:", item.name);
    const newUrl = prompt("Enter new URL:", item.url);
    if (newName && newUrl) {
      updateHandle(item._id, newName, newUrl);
    }
  }}
/>


                <FaTrashCan
                  className="transition-all duration-300 ease-in cursor-pointer text-xl hover:text-pink-600"
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
