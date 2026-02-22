
import mongooseAggregatePaginate from"mongoose-aggregate-paginate-v2";
import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
    videofile: {
        type: String, //cloudnary url
        required:true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, //cloudnary
        required: true
    },
    views: {
        type: Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })
videoSchema.plugin(mongooseAggregatePaginat)
export const Video = mongoose.model("Video", videoSchema)