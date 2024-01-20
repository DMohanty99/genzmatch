const express =require("express");
const app= express();
const mongoose=require("mongoose");
const MONGO_URI="mongodb+srv://dineshmohanty:abcd@nodeapp.lbishb2.mongodb.net/?retryWrites=true&w=majority"
const userDB=require("./models/UserDB")
const userRoute= require("./routes/userRoute")
const profileRoute=require("./routes/profileRoute")
const cookieParser= require("cookie-parser");
const {checkForAuthenticationCookie}=require("./middleware/authentication")



const PORT =8000
const path= require("path")

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")))
app.use("/usr",userRoute)
app.use("/profile",profileRoute)

// userDB.create({
//     firstName:"dinesh",
//     lastName:"Mohanty",
//     age:24
// }).then((res)=>console.log(res)).catch((err)=>{console.log(err)})

app.get("/",(req,res)=>{
    return res.render("home",{
        user:req.user,
    })
})
console.log(MONGO_URI)
mongoose.connect(MONGO_URI).
then(()=>{app.listen(PORT,()=>console.log("server started"))}).
catch((error)=>{console.log(error)})
