const express =require("express");
const router= express.Router();
const userModel=require("../models/UserDB")


router.get("/signup",(req,res)=>{
 res.render("signup");
})

router.get("/signin",(req,res)=>{
    res.render("signin");
   })


router.post("/signup", async(req,res)=>{
    const {firstName,lastName,age,email,password} =req.body;
    const result=await  userModel.create({firstName,lastName,age,email,password});
    console.log(result)
    
    return res.redirect("/");
   
})


router.post("/signin",async(req,res)=>{
    const {email,password} =req.body;
    const token=await userModel.matchPasswordAndCreateToken(email,password);
    if(!token) return res.render("signin",{
        "error":"incorrect username or password"
    })
    console.log("token",token);
    return res.cookie("token",token).redirect("/");
     
})

router.get("/logout",(req,res)=>{
    return res.clearCookie('token').redirect('/');
})
module.exports=router;