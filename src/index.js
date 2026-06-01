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
   
//    dotenv.config({ path: "./env" }); // OR "./.env"

import "./config/env.js";   // 👈 MUST BE FIRST
import { app } from "./app.js";
import connect_db from "./db/index.js";
   
   connect_db()
     .then(() => {
       app.on("error", (error) => {
         console.log("Error:", error);
         throw error;
       });
   
       app.listen(process.env.PORT || 8000, () => {
         console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT || 8000}`);
       });
     })
     .catch((err) => {
       console.log("Mongo DB connection failed", err);
     });