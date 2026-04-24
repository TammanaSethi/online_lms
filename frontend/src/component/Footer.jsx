import React from 'react'
import logo from "../assets/logo.jpg"
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-black text-gray-300 py-12 px-6'>

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10'>

        {/* LOGO + INFO */}
        <div className='lg:w-[40%] md:w-[60%] w-full'>
          <img src={logo} className='h-10 mb-4 rounded-md border' />
          <h2 className='text-xl font-semibold text-white mb-3'>Virtual Courses</h2>
          <p className='text-sm text-gray-400 leading-relaxed'>
            AI-powered learning platform to help you grow smarter.
            Learn anything, anytime, anywhere with ease and flexibility.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className='lg:w-[25%] md:w-full'>
          <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
          <ul className='text-sm space-y-2'>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/")}
            >
              Home
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/allcourses")}
            >
              All Courses
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/login")}
            >
              Login
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/mycourses")}
            >
              My Courses
            </li>

          </ul>
        </div>

        {/* CATEGORIES */}
        <div className='lg:w-[25%] md:w-full'>
          <h3 className='text-white font-semibold mb-3'>Categories</h3>
          <ul className='text-sm space-y-2'>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/allcourses")}
            >
              Web Development
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/allcourses")}
            >
              App Development
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/allcourses")}
            >
              AI / ML
            </li>

            <li
              className="hover:text-white cursor-pointer transition"
              onClick={() => navigate("/allcourses")}
            >
              UI / UX Designing
            </li>

          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className='border-t border-gray-800 mt-10 pt-5 text-sm text-center text-gray-500'>
        © {new Date().getFullYear()} Learn AI. All rights reserved.
      </div>

    </div>
  )
}

export default Footer