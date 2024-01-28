const mongoose=require("mongoose");

const Schema = mongoose.Schema;
const chatSchema= new Schema ({
    chat:{
        type: String,
        required:true
    },
    from:{
        type: Schema.Types.ObjectId,
        ref:"profile",
        required:true
    },
    to:{
        type: Schema.Types.ObjectId,
        ref:"profile",
        required:true
    }
},{
    timestamps:true
})

module.exports= mongoose.model("chat",chatSchema); 