import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))
app.use(cookieParser())
 //limit of json files to reduce server crash
 app.use(express.json({limit:"16kb"}))
 //to encode url
 app.use(express.urlencoded({extended:true}))
 app.use(express.static("public"))



 //routes 
import userRouter from "./routes/user.routes.js"

//router declaration
app.use("/api/v1/users",userRouter)




export {app}