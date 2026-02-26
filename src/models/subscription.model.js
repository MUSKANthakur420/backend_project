import mongoose from "mongoose";
const subscriptionSchema=new mongoose.Schema({
subscriber:{
    type:mongoose.Schema.Types.ObjectId, //one who has subscribed
    ref:"User"
},
channel:{
    type:mongoose.Schema.Types.ObjectId ,// subscriber jiss channel ko subscribe kar raha
    ref:"User"

}
},{timestamps:true})
export const Subscription=mongoose.model("Subscription",subscriptionSchema);