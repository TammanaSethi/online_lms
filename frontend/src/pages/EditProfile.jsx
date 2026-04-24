import React,{useState} from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {setUserData} from "../redux/userSlice"
import { ClipLoader } from "react-spinners";
import axios from "axios"
import { toast } from "react-toastify";

const EditProfile = () => {
    const handleSubmit=(e)=>{
        e.preventDefault();
    }
    const { userData } = useSelector((state) => state.user);
      const navigate = useNavigate();
     const handleNavigate = () => {
    navigate("/profile");
  };
     const serverUrl = "http://localhost:8000";
  const [name,setName]=useState(userData?.name||"");
  const[description,setDescription]=useState(userData?.description||"");

  const [photoUrl,setPhotoUrl]=useState(null);
  const dispatch=useDispatch();
  const[loading,setLoading]=useState(false);

  const formData=new FormData();
  formData.append("name",name);
  formData.append("description",description);
  formData.append("photoUrl",photoUrl);
  const handleEditProfile=async()=>{
    setLoading(true)
    try {
        const result=await axios.post(serverUrl + "/api/user/profile",formData,{withCredentials: true});
        dispatch(setUserData(result.data));
        setLoading(false);
        navigate("/");
        toast.success("Profile updated");
    } catch (error) {
        setLoading(false);
        console.log(error);
        console.log(error.response.data.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeft className="absolute top-[5%] left-[5%] w-[22px] h-[22px]" cursor-pointer onClick={handleNavigate} />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit profile</h2>
        <form action="" className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center text-center">
             {userData?.photoUrl ? (
            <img
              src={userData?.photoUrl}
              alt=""
              className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white">
              {(userData?.name?.slice(0, 1) || "").toUpperCase()}
            </div>
          )}
           </div>

          <div className="">
         <label htmlFor="image" className="text-sm font-medium text-gray-700">Select Avatar</label>
         <input type="file" id="image" name="photoUrl" accept="image/*" placeholder="photoUrl" onChange={(e)=>setPhotoUrl(e.target.files[0])} className="w-full px-4 py-2 border rounded-md text-sm"/>
          </div>

          <div className="">
         <label htmlFor="name" className="text-sm font-medium text-gray-700">UserName</label>
         <input type="text" id="name"  placeholder={userData.name} accept="image/*" className="w-full px-4 py-2 border rounded-md text-sm" value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>

        <div >
         <label  className="text-sm font-medium text-gray-700">Email</label>
         <input  readOnly type="email"  placeholder={userData.email} className="w-full px-4 py-2 border rounded-md text-sm"/>
          </div>
           

           <div className="">
         <label className="text-sm font-medium text-gray-700">Bio</label>
         <textarea type="text" className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[balck]" placeholder="Tell us about yourself" rows={3} name="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
          </div>


        <button className="w-full bg-black active:bg=[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer" disabled={loading} onClick={handleEditProfile}>{loading?<ClipLoader size={30} color="white" />:"Save changes"}</button>
        </form>

      </div>
    </div>
  );
};

export default EditProfile;