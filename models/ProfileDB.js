const mongoose=require("mongoose");

const Schema = mongoose.Schema;
const profileSchema= new Schema ({
    firstName:{
        type: String,
        required : true
    },
    lastName :{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    profileImageURL:{
        type: String,
        default:'/images/default.png'
    },
    description:{
        type:String,
        default:" Not Mentioned"
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        required:true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
})


module.exports= mongoose.model('Profile',profileSchema)
