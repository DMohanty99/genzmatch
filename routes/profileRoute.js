const express =require("express");
const router= express.Router();
const profileModel=require("../models/ProfileDB")
const likeModel=require("../models/LikesDB")
const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName= Date.now()+file.originalname;
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/create",(req,res)=>{
    res.render("createProfile",{
        user:req.user
    });
   })

router.post("/", upload.single("profileImage"),async(req,res)=>{
    const {firstName,lastName,age,description,gender} =req.body; 
    console.log(req.body)
    const user=req.user;
    try {const result=await  profileModel.create({firstName,lastName,age,description,gender,user,profileImageURL:`./uploads/${req.file.filename}`,createdBy:user._id});
    console.log(result)}
    catch(err){
        console.log(err)
    }
    
    return res.redirect("/");
   
})

router.post("/like/:id",async (req,res)=>{
  console.log(req.params.id);
  const profileId=req.params.id;
  const result =await likeModel.create({profileLiked:profileId,likedBy:req.user._id});
  res.redirect("/profile")
})

router.post("/dislike/:id",async (req,res)=>{
  console.log(req.params.id);
  const profileId=req.params.id;
  const result =await likeModel.findOneAndDelete({profileLiked:profileId,likedBy:req.user._id});
  res.redirect("/profile")
})

router.get("/",async(req,res)=>{
   const profiles=await profileModel.find({});
   const likes=await likeModel.find({likedBy:req.user._id});
   res.render("viewProfiles",{
    profiles,
    user:req.user,
    likes
   })
})


module.exports=router;