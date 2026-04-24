import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import img from "../assets/empty.jpg";
import { setSelectedCourse } from "../redux/courseSlice";
import { FaStar } from "react-icons/fa6";
import { IoIosPlayCircle } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import Card from "../component/Card";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { selectedCourse } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setcreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const serverUrl = "http://localhost:8000";
  useEffect(() => {
    const handlecreator = async () => {
      if (selectedCourse?.creater) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creater",
            { userId: selectedCourse.creater },
            { withCredentials: true },
          );

          setcreatorData(result.data);
        } catch (error) {
          console.log(error.message);
        }
      }
    };

    handlecreator();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchCreatorCourses = async () => {
      if (selectedCourse?.creater) {
        try {
          const res = await axios.get(
            `${serverUrl}/api/course/creator-courses/${selectedCourse.creater}`,
            { withCredentials: true },
          );

          const filtered = res.data.data.filter(
            (c) => c._id.toString() !== courseId.toString(),
          );

          setCreatorCourses(filtered);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchCreatorCourses();
  }, [selectedCourse, courseId]);

  const checkEnrollement = () => {
    const verify = userData?.enrolledCourses?.some(
      (c) =>
        (typeof c == "string" ? c : c._id).toString() === courseId?.toString(),
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getcourse/${courseId}`,
          { withCredentials: true },
        );

        console.log("FULL COURSE:", result.data.data);

        dispatch(setSelectedCourse(result.data.data)); // ✅ FIX
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    checkEnrollement();
  }, [userData, courseId]);

  console.log("THUMBNAIL:", selectedCourse?.thumbnail);

const handleEnroll = async (courseId) => {
  try {
    const orderData = await axios.post(
      serverUrl + "/api/order/razorpay-order",
      { courseId },
      { withCredentials: true }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.data.order.amount,
      currency: "INR",
      name: "vIRTUAL COURSES",
      description: "COURSE ENROLLEMENT PAYMENT",
      order_id: orderData.data.order.id,

      handler: async function (response) {
        try {
          const verifyPayment = await axios.post(
            serverUrl + "/api/order/verifyPayment",
            {
              ...response,
              courseId,
            },
            { withCredentials: true }
          );

          setIsEnrolled(true);

          const updatedUser = await axios.get(
            serverUrl + "/api/user/getcurrentuser",
            { withCredentials: true }
          );

          dispatch(setUserData(updatedUser.data));

          toast.success(verifyPayment.data.message);
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.log(error);
    toast.error("something went wrong while enrolling");
  }
};

  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      const freeLecture = selectedCourse.lectures.find((l) => l.isPreviewFree);

      setSelectedLecture(freeLecture || selectedCourse.lectures[0]);
    } else {
      setSelectedLecture(null); // ✅ handle empty case
    }
  }, [selectedCourse]);

  const handleReview = async () => {
    if (!rating) return toast.error("Please select rating");
    if (!comment.trim()) return toast.error("Please write comment");

    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/review/create`,
        { rating, comment, courseId },
        { withCredentials: true },
      );

      toast.success(res.data.message);

      const newReview = res.data.review;

      // ✅ update reviews UI
      setReviews((prev) => [newReview, ...prev]);

      // ✅ update course data
      dispatch(
        setSelectedCourse({
          ...selectedCourse,
          reviews: [newReview, ...(selectedCourse?.reviews || [])],
        }),
      );

      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }

    setLoading(false);
  };

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/review/${courseId}`);
      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* top section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* thumbnail section */}
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            <img
              src={
                selectedCourse?.thumbnail &&
                selectedCourse.thumbnail.trim() !== ""
                  ? selectedCourse.thumbnail.startsWith("http")
                    ? selectedCourse.thumbnail
                    : `http://localhost:8000/${selectedCourse.thumbnail}`
                  : img
              }
              onError={(e) => (e.target.src = img)} // ✅ fallback if broken
              className="rounded-xl w-full h-[280px] object-cover"
              alt="thumbnail"
            />
          </div>

          {/* course info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
            <p className="tetx-gray-600">{selectedCourse?.subTitle}</p>

            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center justify-start gap-1">
                  <FaStar />
                  {avgRating}
                </span>
                <span className="text-gray-400">(1200 Reviews)</span>
              </div>
              <div>
                <span className="text-xl font-semibold text-black">
                  Rs.{selectedCourse?.price}
                </span>
                {""}
                <span className="line-through text-sm text-gray-400">
                  Rs.599
                </span>
              </div>

              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li> ✅ 10+ hours of video content</li>
                <li> ✅ Lifetime access to course materials</li>
              </ul>
              {!isEnrolled ? (
                <button
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer"
                  onClick={() => {
                    if (!userData) {
                      toast.error("Please login first");
                      navigate("/login");
                      return;
                    }
                    handleEnroll( courseId);
                  }}
                >
                  Enroll Now
                </button>
              ) : (
                <button
                  className="bg-green-100 text-green-500 px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer"
                  onClick={() => navigate(`/viewLecture/${courseId}`)}
                >
                  watch Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">What you will learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn{selectedCourse?.category} from Begning</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Who this course is for</h2>
          <p className="text-gray-700">
            Beginner,aspiring developers, and professionals looking to upgrade
            skills
          </p>
        </div>

        <div className=" flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length}Lectures
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  }${selectedLecture?.lectureTitle === lecture?.lectureTitle ? "bg-gray-100 border-gray-400" : ""}`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <IoIosPlayCircle /> : <FaLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {" "}
                    {lecture?.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  key={selectedLecture.videoUrl}
                  className="w-full h-full object-contain bg-black"
                  src={`http://localhost:8000/${selectedLecture.videoUrl}`}
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <span className="text-white text-sm">
                  Select a preview lecture to watch
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ⭐ REVIEW SECTION */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>

          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Write your review..."
              rows={3}
            />

            <button
              className={`mt-3 px-5 py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
              disabled={loading}
              onClick={handleReview}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          <div className="space-y-4">
            {reviews?.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="border p-4 rounded-lg">
                  <p className="font-semibold">{r.user?.name}</p>

                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        className={
                          s <= r.rating ? "text-yellow-500" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* for creator info */}

        <div className="flex items-center gap-4 border-t">
          {creatorData?.photoUrl ? (
            <img
              src={creatorData.photoUrl}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black text-white">
              {creatorData?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg  font-semibold">{creatorData?.name}</h2>
            <p className="md:text-sm text-gray-600 text-10px">
              {creatorData?.description}
            </p>
            <p className="md:text-sm text-gray-600 text-10px">
              {creatorData?.email}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold mb-2">
            Other published courses by educator
          </p>
        </div>

        <div className="w-full trnsition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]">
          {creatorCourses.length > 0 ? (
            creatorCourses.map((course, index) => (
              <Card
                key={index}
                thumbnail={course.thumbnail}
                id={course._id}
                price={course.price}
                title={course.title}
                category={course.category}
                reviews={course.reviews} // ✅ ADD THIS
              />
            ))
          ) : (
            <p>No other courses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
