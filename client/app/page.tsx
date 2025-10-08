import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import img from './home.svg'
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-pink-500">Welcome to Home Page</h1>

      <Image
        src={img}
        alt="Authentication illustration"
        width={400}
        height={300}
        priority
      />

      <Link href="/Register" className= "w-full max-w-[200px] text-center text-blue-500 mt-10 rounded-full  border-2 p-4 ">
        Go to Login
      </Link>
    </div>
  )
}

export default HomePage
