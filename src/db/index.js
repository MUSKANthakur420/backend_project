import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connect_db = async () => {
    console.log("DB URL:", process.env.MONGODB_URL);
console.log("DB NAME:", DB_NAME);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMongoDB connected DB HOST : ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("connection error :", error)
        process.exit(1)
    }
}

export default connect_db