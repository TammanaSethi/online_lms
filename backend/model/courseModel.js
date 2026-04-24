import mongoose from "mongoose";
const courseSchema=new mongoose.Schema({
    title:{      //title is main name of course
        type:String,
        required:true
    },
    subTitle:{      //short tagline about course
        type:String
    },
    description:{     //complete detail about course
        type:String
    },
     category:{      //type of course like programming,design,marketing,finanace
        type:String,
        required:true
     },
    level: {
  type: String,
  enum: ["Beginner", "Intermediate", "Advanced"],
  default: "Beginner", // ✅ THIS IS THE RIGHT WAY
},
     price:{
        type:Number,
     },
     thumbnail:{    //thumbnail is string Because we store the image URL, not the image file itself.
        type:String
     },
     enrolledStudents:[{    //Stores IDs of students who purchased the course.
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }],
     lectures:[{     //Stores all lecture IDs inside the course
       type:mongoose.Schema.Types.ObjectId,
        ref:"Lecture"
     }],
     creater:{    //Stores the Instructor / Teacher ID who created the course.
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
     },
     isPublished:{    //Whether the course is visible to students or not.
      type:Boolean,
      default:false,
     },
     reviews:[{    //Stores all review IDs of students.
     type:mongoose.Schema.Types.ObjectId,
     ref:"Review"
     }]

},{timestamps:true})

const Course=mongoose.model("Course",courseSchema);
export default Course;