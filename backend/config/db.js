import mongoose from "mongoose";
export const connectDB  = async()=>{
    await mongoose.connect('mongodb+srv://btech1055723:resume123@cluster0.ptb5vz7.mongodb.net/RESUME')
    .then(()=>console.log('DB CONNECTED'))
}