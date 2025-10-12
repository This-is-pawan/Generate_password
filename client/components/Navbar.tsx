'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LuSunMoon } from 'react-icons/lu';
import { IoPartlySunnySharp } from 'react-icons/io5';
import type { IconType } from 'react-icons';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [themeValue, setThemeValue] = useState<boolean>(true);
  const [dark, setDark] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDark(savedTheme);
      setThemeValue(savedTheme === 'light');
      document.body.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleToggle = () => {
    const newTheme = themeValue ? 'dark' : 'light';
    setThemeValue(!themeValue);
    setDark(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
  };

  const ThemeIcon: IconType = themeValue ? LuSunMoon : IoPartlySunnySharp;

  // ✅ New function for toast
  const handleLogoutToast = () => {
    toast.success('Logout successful!');
  };

  return (
    <div className="bg-blue-800 p-4">
      <div className="flex justify-around items-center ">
        <Link
          href="/"
          onClick={handleLogoutToast} // ✅ show toast on Home click
          className="text-blue-900 border-2 p-2 pl-4 pr-4 rounded-2xl border-white text-white"
        >
          Home
        </Link>

        <ThemeIcon
          size={24}
          color={dark === 'light' ? '#000' : '#fff'}
          className="cursor-pointer"
          onClick={handleToggle}
        />

        <Link
          href="/Register"
          className="text-blue-900 border-2 p-2 rounded-2xl border-white text-white"
        >
          Sign Up / Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
