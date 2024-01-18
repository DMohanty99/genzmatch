const express =require("express");
const router= express.Router();
const userModel=require("../models/mongoDB")

router.get("/signup",(req,res)=>{
 res.render("signup");
})

router.get("/signin",(req,res)=>{
    res.render("signin");
   })

router.post("/signup", async(req,res)=>{
    const {firstName,lastName,age,email,password} =req.body;
    console.log(req.body)
    const result=await  userModel.create({firstName,lastName,age,email,password});
    console.log(result)
    
    return res.redirect("/");
   
})

router.post("/signin",async(req,res)=>{
    const {email,password} =req.body;
    const foundUsr=await userModel.matchPassowrd(email,password);
    console.log("user",foundUsr);
    res.redirect("/");
     
})

module.exports=router;