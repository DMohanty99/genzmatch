const mongoose=require("mongoose");

const Schema = mongoose.Schema;
const likeSchema= new Schema ({
    profileLiked:{
        type: Schema.Types.ObjectId,
        ref:"profile"
    },
    likedBy:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
})

module.exports= mongoose.model("Like",likeSchema); 