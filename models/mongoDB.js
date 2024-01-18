const { randomBytes, createHmac } = require("crypto");

const mongoose=require("mongoose");

const Schema = mongoose.Schema;
const userSchema= new Schema ({
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
    email:{
        type: String,
        required:true,
        unique:true
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required:true
    },
    profileImageURL:{
        type: String,
        default:'/images/default.png'
    },
    role:{
        type: String,
        enum :["USER","ADMIN "],
        default:"USER"
    }
},{
    timestamps:true
})

userSchema.pre("save",function(next){
    const user =this;
    if(!user.isModified("password"))return;
    const salt=randomBytes(16).toString();
    console.log("hi")
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static("matchPassowrd",async function(email,password){
    const user=await this.findOne({email});
    //console.log("log",user,email);
    if(!user){ throw new Error("User not found") ; return false;}
    const salt=user.salt;
    const hashedPassword=user.password;
    const currentPasswordHash=createHmac("sha256",salt).update(password).digest("hex");
    if(hashedPassword!=currentPasswordHash) throw new Error("Incorrect password")
    return {...user,password:undefined,salt:undefined};
})

module.exports= mongoose.model('User',userSchema)

