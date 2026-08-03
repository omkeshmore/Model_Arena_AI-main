import "dotenv/config";
import mongoose from "mongoose";

const connectTODB = async ()=>{
    // The ! tells TypeScript: "Trust me, this value is not undefined.
    mongoose.connect(process.env.MONGO_URL!).then(()=>{
        console.log("Database Connected Successfully")        
    }).catch((err)=>{
        console.log("Failed to connect DB")
    })
}

export default connectTODB;