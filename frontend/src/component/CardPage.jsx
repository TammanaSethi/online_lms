import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../component/Card";

const CardPage = () => {
  const { creatorCourseData, courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const [coursesToShow, setCoursesToShow] = useState([]);

  useEffect(() => {
    if (userData?.role === "educator") {
      setCoursesToShow(creatorCourseData || []);
    } else {
      setCoursesToShow(courseData || []);
    }
  }, [creatorCourseData, courseData, userData]);

  return (
    <div className="flex flex-col items-center w-full py-10">

      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        {userData?.role === "educator"
          ? "Your Courses"
          : "Popular Courses"}
      </h1>

      <p className="text-gray-500 text-center mb-8 max-w-2xl px-4">
        Explore top-rated courses designed to boost your skills and grow your career
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 md:px-6">
        
        {coursesToShow.length > 0 ? (
          coursesToShow.map((course) => (
            <Card
              key={course._id}
              thumbnail={course.thumbnail}
              title={course.title}
              category={course.category}
              price={course.price}
              id={course._id}
              reviews={course.reviews}

              
              isEnrolled={course.isEnrolled}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No courses available
          </p>
        )}

      </div>
    </div>
  );
};

export default CardPage;