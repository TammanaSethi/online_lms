import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { RiMic2AiFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AI from "../assets/ai.png";
import startSound from "../assets/start.mp3";

const SearchWithAi = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);

  const serverUrl = "http://localhost:8000";

  // 🎤 Speech API
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // init speech
  if (SpeechRecognition && !recognitionRef.current) {
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";
  }

  // init audio
  if (!audioRef.current) {
    audioRef.current = new Audio(startSound);
    audioRef.current.volume = 0.5;
  }

  // 🎤 Mic click
  const handleMicClick = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported");
      return;
    }

    // 🔊 Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    recognitionRef.current.start();

    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.onerror = () => {
      toast.error("Voice recognition failed");
    };
  };

  // 🔍 API call
  const handleRecommendation = async (query) => {
    if (!query.trim()) {
      setRecommendation([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${serverUrl}/api/course/search`,
        { input: query },
        { withCredentials: true }
      );

      setRecommendation(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRecommendation(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const showSearchIcon = input.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-6">
      
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        
        {/* Back */}
        <FaArrowLeft
          className="text-black w-[22px] h-[22px] cursor-pointer absolute top-4 left-4"
          onClick={() => navigate(-1)}
        />

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={AI} alt="AI" className="w-8 h-8" />
          Search with <span className="text-[#CB99C7]">AI</span>
        </h1>

        {/* Search Box */}
        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full">
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            placeholder="What do you want to learn? (eg: AI, MERN...)"
          />

          {/* 🔍 Search Icon */}
          {showSearchIcon && (
            <button
              onClick={() => handleRecommendation(input)}
              className="absolute right-14 sm:right-16 bg-white rounded-full"
            >
              <img
                src={AI}
                alt="search"
                className="w-10 h-10 p-2 rounded-full"
              />
            </button>
          )}

          {/* 🎤 Mic */}
          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleMicClick}
          >
            <RiMic2AiFill className="w-5 h-5 text-[#CB99C7]" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="mt-4 text-gray-500">Searching...</p>
        )}

        {/* 📦 Course Cards */}
        {input.trim() && recommendation.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {recommendation.map((course, index) => (
              <div
                key={index}
                onClick={() => navigate(`/viewCourse/${course._id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={
                    course.thumbnail?.startsWith("http")
                      ? course.thumbnail
                      : `${serverUrl}/${course.thumbnail}`
                  }
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3 text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {course.title}
                  </h3>

                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {course.subTitle || "No description"}
                  </p>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs bg-[#CB99C7] text-white px-2 py-1 rounded">
                      {course.level || "Beginner"}
                    </span>

                    <span className="text-sm font-bold text-gray-700">
                      ₹{course.price || "Free"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ❌ No results */}
        {input.trim() && !loading && recommendation.length === 0 && (
          <p className="mt-4 text-gray-400">No courses found</p>
        )}
      </div>
    </div>
  );
};

export default SearchWithAi;