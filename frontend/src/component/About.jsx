import React from 'react'
import about from "../assets/about.jpg"
import video from "../assets/video.mp4"
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className='w-full lg:h-[70vh] min-h-[60vh] flex flex-wrap items-center justify-center gap-6 px-4 mb-[40px]'>

      {/* IMAGE SECTION */}
      {/* IMAGE SECTION */}
<div className='lg:w-[40%] md:w-[80%] w-full h-full flex items-center justify-center relative'>
  
  <img 
    src={about} 
    className='w-[90%] h-[90%] rounded-xl shadow-lg object-cover'
  />

  {/* VIDEO OVERLAY */}
  <div className='absolute bottom-[-20px] right-[10%] w-[65%] md:w-[55%]'>
    <video
      src={video}
      className='w-full rounded-xl shadow-2xl border-4 border-white'
      controls
      autoPlay
      loop
      muted
    />
  </div>

</div>
      {/* TEXT SECTION */}
      <div className='lg:w-[50%] md:w-[80%] w-full h-full flex items-start justify-center flex-col px-[20px] md:px-[60px]'>

        {/* HEADER */}
        <div className='flex text-[18px] items-center gap-[10px] text-gray-600'>
          About us 
          <TfiLayoutLineSolid className='w-[30px] h-[30px]'/>
        </div>

        {/* TITLE */}
        <div className='md:text-[45px] text-[32px] font-bold mt-[10px] leading-tight'>
          We are Maximizing your Learning growth
        </div>

        {/* DESCRIPTION */}
        <div className='text-[15px] text-gray-600 mt-[15px] leading-relaxed'>
          We provide a modern Learning management system to simplify online education,
          track progress, and enhance student-instructor collaboration efficiently.
        </div>

        {/* FEATURES */}
        <div className='w-full lg:w-[70%] mt-[30px]'>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-[10px]'>
              <FaCheckCircle className='text-black w-[18px] h-[18px]'/>
              Simplified Learning
            </div>

            <div className='flex items-center gap-[10px]'>
              <FaCheckCircle className='text-black w-[18px] h-[18px]'/>
              Expert Trainers
            </div>
          </div>

          <div className='flex items-center justify-between mt-[20px]'>
            <div className='flex items-center gap-[10px]'>
              <FaCheckCircle className='text-black w-[18px] h-[18px]'/>
              Big experience
            </div>

            <div className='flex items-center gap-[10px]'>
              <FaCheckCircle className='text-black w-[18px] h-[18px]'/>
              Lifetime Access
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default About