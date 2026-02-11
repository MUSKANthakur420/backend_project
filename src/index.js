// require('dotenv').config({path:'./env'}) --> isko file mai sabse phele likh the hai jo opening file ho taki sare variable availabele hojaye
import dotenv from "dotenv"
import connect_db from "./db/index.js";
dotenv.config()
// const app = express();

connect_db({path:'./env'})
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
     app.listen(process.env.PORT,()=>[
        console.log("App is listening on port")
     ])
    } catch (error) {
        console.error("ERROR :",error)
    }
})()
    
    */