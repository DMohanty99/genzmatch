require('dotenv').config()
const { Server } = require("socket.io");
const express =require("express");
const { createServer } = require('node:http');
const mongoose=require("mongoose");
const MONGO_URI=process.env.MONGO_URI;
const userDB=require("./models/UserDB")
const userRoute= require("./routes/userRoute")
const profileRoute=require("./routes/profileRoute")
const cookieParser= require("cookie-parser");
const Redis = require("ioredis");
const {checkForAuthenticationCookie}=require("./middleware/authentication")
const redis = new Redis();


const app= express();
const server = createServer(app);
const io = new Server(server);

const PORT =process.env.PORT
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


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('register',async (ProfileId)=>{
      await redis.set(ProfileId, socket.id);
      console.log("register socket on server",ProfileId)
    })
    socket.on('chatMessage', async({to:to,temp:msg}) => {
      // const msg = req.temp;
      // const to=req.to;
        console.log('message: ' + msg);
        console.log("to",to);
        const toSocketId=await redis.get(to);
        console.log("toSocketID",toSocketId);
        if(toSocketId){
        io.to(toSocketId).emit("recieveMessage",msg);
        
        }
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });



mongoose.connect(MONGO_URI).
then(()=>{server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });}).
catch((error)=>{console.log(error)})
