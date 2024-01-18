const express =require("express");
const app= express();
const mongoose=require("mongoose");
const MONGO_URI="mongodb+srv://dineshmohanty:abcd@nodeapp.lbishb2.mongodb.net/?retryWrites=true&w=majority"
const userDB=require("./models/mongoDB")
const userRoute= require("./routes/userRoute")



const PORT =8000
const path= require("path")

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use("/usr",userRoute)

// userDB.create({
//     firstName:"dinesh",
//     lastName:"Mohanty",
//     age:24
// }).then((res)=>console.log(res)).catch((err)=>{console.log(err)})

app.get("/",(req,res)=>{
    return res.render("home")
})
console.log(MONGO_URI)
mongoose.connect(MONGO_URI).
then(()=>{app.listen(PORT,()=>console.log("server started"))}).
catch((error)=>{console.log(error)})
