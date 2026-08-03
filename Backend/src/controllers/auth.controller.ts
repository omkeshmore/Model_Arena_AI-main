import "dotenv/config";
import type { Request, Response} from "express";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response)=>{
    const {username, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username}, {email}]
    })

    if(isUserAlreadyExists){
        return res.status(401).json({
            message: "User Already Exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    },process.env.JWT_SECRET!, {expiresIn: "1d"})

    res.cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "lax" });

    res.status(201).json({
        message: "User registered successfully.",
        user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
    })
}

export const loginController = async (req: Request, res: Response)=>{
   const {email, password} = req.body;
    const user = await userModel.findOne({email}) as any;
    
    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials",
            success: false,
            err: "User not Found"
        })
    }
    
    const isMatchPassword = await user.comparePassword(password);
    
    if(!isMatchPassword){
        return res.status(400).json({
            message: "Invalid Credentials",
            success: false,
            err: "Incorrect Password"
        })    
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "lax" });

    res.status(200).json({
        message: "Login Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    }); 
}

export const logoutController = async(req: Request, res: Response) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
        res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed",
            success: false,
        });
    }
}

export const getMe = async (req: Request, res: Response)=>{
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false,
            error: "User not found"
        })
    }

    res.status(200).json({
        message: "User Details Fetched Successfully",
        success: true,
        user
    })
}