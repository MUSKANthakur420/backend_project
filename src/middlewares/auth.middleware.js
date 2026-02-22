import {asynchandler} from "../utils/asynchandler";
import { apierror } from "../utils/apierror.js";
import jwt from "jsonwebtoken";
export const verifyJWT= asynchandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken || req.header
    ("Authorization")?.replace("Bearer ","")
    if(!token)
        throw new apierror(401,"unauthorized request")
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
})