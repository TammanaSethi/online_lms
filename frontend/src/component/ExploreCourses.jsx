import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { FaUikit } from "react-icons/fa";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { PiOpenAiLogoBold } from "react-icons/pi";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboard2DataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

const ExploreCourses = () => {
    const navigate = useNavigate()
    return (
        <div className="w-screen min-h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-7">

            {/*left div*/}
            <div className='w-full lg:w-87.5 flex flex-col items-start justify-center gap-2 px-5 md:px-10'>
                <span className='text-[35px] font-semibold'>Explore</span>
                <span className='text-[35px] font-semibold'>Our Courses</span>
                <p className='text-[17px]'>Explore a wide range of online courses designed to help you learn new skills and advance your career. Our Learning Management System (LMS) offers flexible </p>
                <button className='px-[20px] py-[10px] border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px] cursor-pointer' onClick={()=>navigate("/allcourses")}>Explore courses< SiViaplay className=' h-[30px] w-[30px] fill-white ' /></button>
            </div>


            {/*right div*/}
            <div className='w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]'>

                {/* First div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center'><TbDeviceDesktopAnalytics className='w-[60px] h-[60px] text-[#6d6c6c]' />
                    </div>
                    Web Dev
                </div>

                {/* second div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center'><FaUikit className='w-[50px] h-[50px] text-[#6d6c6c]' />
                    </div>
                    UI/UX designing
                </div>

                {/* Third div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#fcb9c8] rounded-lg flex items-center justify-center'><MdAppShortcut className='w-[50px] h-[50px] text-[#6d6c6c]' />
                    </div>
                    App Dev
                </div>


                {/* Fourth div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center'><FaHackerrank className='w-[55px] h-[55px] text-[#6d6c6c]' />
                    </div>
                    Ethical hacking
                </div>


                {/* Fifth div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center'><PiOpenAiLogoBold className='w-[55px] h-[55px] text-[#6d6c6c]' />
                    </div>
                    AI/ML
                </div>


                {/* sixth div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#fcb9c8] rounded-lg flex items-center justify-center'><SiGoogledataproc className='w-[50px] h-[50px] text-[#6d6c6c]' />
                    </div>
                    Data Science
                </div>

                {/* seventh div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center'><BsClipboard2DataFill className='w-[50px] h-[50px] text-[#6d6c6c]' />
                    </div>
                    Data Analytics
                </div>

                {/* Eighth div */}
                <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
                    <div className='w-[100px] h-[90px]  bg-[#d9fbe0] rounded-lg flex items-center justify-center'><SiOpenaigym className='w-[50px] h-[50px] text-[#6d6c6c]' />
                    </div>
                    AI TOOLS
                </div>


            </div>

        </div>
    )
}

export default ExploreCourses
