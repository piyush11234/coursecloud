import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    description:{type:String},
    role:{type:String,enum:["instructor", "student"],required:true},
    photoUrl:{type:String,default:''},
    enrolledCourses:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}],
    isVerified:{type:Boolean,default:false},
    isLoggedIn:{type:Boolean,default:false},
    token:{type:String,default:null},
    otp:{type:String,default:null},
    otpExpiry:{type:Date,default:null},

},{timestamps:true})

export const User=mongoose.model('User',userSchema);