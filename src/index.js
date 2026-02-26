// require('dotenv').config({path:'./env'}) --> isko file mai sabse phele likh the hai jo opening file ho taki sare variable availabele hojaye
/*

//TO IMMEDIATELY EXCECUTE ANY FUNTION USE --> ()()
//connection of database
(async ()=>{
    try {
     await   mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
     app.on("errror",()=>{
        console.log("Error : ",error);
        throw error;
     })
     app.listen(process.env.PORT,()=>{
        console.log("App is listening on port")
})
    } catch (error) {
        console.error("ERROR :",error)
    }
})()
    
    */

   //if changes occur in .env file then we have to restart the server again no other choices
   
import dotenv from "dotenv/config";
import express from "express";
import connect_db from "./db/index.js";
import { app } from "./app.js";
// dotenv.config() use directly dotenv/config or this method after importing dotnev
// const app = express();

connect_db({path:'./.env'})
.then(()=>{
    app.on("errror",()=>{
        console.log("Error : ",error);
        throw error;
     });
app.listen(process.env.PORT || 8000,()=>{
    console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`)
});
})
.catch((err)=>{
    console.log("Mongo DB connection failed",err);
})