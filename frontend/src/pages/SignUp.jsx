import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const serverUrl = "http://localhost:8000";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
      toast.success("Signup successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 p-2 rounded ${
              role === "student"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("educator")}
            className={`flex-1 p-2 rounded ${
              role === "educator"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Educator
          </button>
        </div>

        <button className="w-full bg-black text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;