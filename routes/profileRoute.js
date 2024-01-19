const express =require("express");
const router= express.Router();
const profileModel=require("../models/ProfileDB")


router.get("/create",(req,res)=>{
    res.render("createProfile",{
        user:req.user
    });
   })

router.post("/", async(req,res)=>{
    const {firstName,lastName,age,description,gender,profileImageURL} =req.body; 
    console.log(req.body)
    const user=req.user;
    try {const result=await  profileModel.create({firstName,lastName,age,description,gender,user,profileImageURL});
    console.log(result)}
    catch(err){
        console.log(err)
    }
    
    return res.redirect("/");
   
})
router.get("/",async(req,res)=>{
   const profiles=await profileModel.find({});
   res.render("viewProfiles",{
    profiles,
    user:req.user
   })
})


module.exports=router;