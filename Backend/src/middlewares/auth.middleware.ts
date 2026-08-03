import "dotenv/config";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction} from "express";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;    
    if(!token){
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            error: "No Token provided"
        })
    }
    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            error: "Invalid Token"
        })
    }
}