const express =require("express");
const router= express.Router();
const profileModel=require("../models/ProfileDB")
const likeModel=require("../models/LikesDB")
const chatModel=require("../models/ChatDB")
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
    //console.log(req.body)
    const user=req.user;
    try{
      const res=await profileModel.findOne({createdBy:user._id});
      if(res){
        const result=await  profileModel.findOneAndUpdate({createdBy:user._id},{firstName,lastName,age,description,gender,user,profileImageURL:`./uploads/${req.file.filename}`},{new:true});
        //console.log("edit",result)
      }
      else{
            const result=await  profileModel.create({firstName,lastName,age,description,gender,user,profileImageURL:`../uploads/${req.file.filename}`,createdBy:user._id});
        //console.log("create",result)
      }

    }
    catch(err){
      console.log(err)
    }
  
    
    return res.redirect("/");
   
})

router.post("/like/:id",async (req,res)=>{
  //console.log(req.params.id);
  const profileId=req.params.id;
  const result =await likeModel.create({profileLiked:profileId,likedBy:req.user._id});
  res.redirect("/profile")
})

router.post("/chat/:to",async (req,res)=>{
  //console.log(req.params.to);
  console.log("profile chat post request called")
  const toProfileId=req.params.to;
  const text=req.body.chat;
  console.log(req.body)
  const user_id=req.user._id;
  const myProfile= await profileModel.findOne({createdBy:user_id})
  const from=myProfile._id
  console.log("hi",user_id,myProfile.firstName,from)
  const result =await chatModel.create({chat:text,from,to:toProfileId});
  res.redirect(`./${toProfileId}`)
})

router.get("/chat/:id",async (req,res)=>{
  //console.log(req.params.id);
  const profileId=req.params.id;

  const user_id=req.user._id;
  const myProfile= await profileModel.findOne({createdBy:user_id})
  try{
    const messages= await chatModel.find({$or:[{from:profileId,to:myProfile._id},{to:profileId,from:myProfile._id}]}).sort({'createdAt':'ascending'})
    //console.log("messages",messages)
    res.render("chatPage",{
      messages,
      profileId,
      user:req.user,
      myProfile
  
    })
  }
  catch(err){
    console.log(err);
  }
  
})


router.post("/dislike/:id",async (req,res)=>{
  //console.log(req.params.id);
  const profileId=req.params.id;
  const result =await likeModel.findOneAndDelete({profileLiked:profileId,likedBy:req.user._id});
  res.redirect("/profile")
})



router.get("/",async(req,res)=>{
  const user_id=req.user._id ;
   const profiles=await profileModel.find({});
   //console.log(profiles);
   const likes=await likeModel.find({likedBy:req.user._id});
   const myProfile= profiles.find((obj)=>obj.createdBy==user_id)
   if(!myProfile) {return res.redirect("./profile/create");  
}
   //console.log(myProfile)
   const likesOpp=await likeModel.find({profileLiked:myProfile._id});
   res.render("viewProfiles",{
    profiles,
    user:req.user,
    likes,
    likesOpp
   })
})

router.get("/self",async(req,res)=>{
  const user_id=req.user._id ;
  const profiles=await profileModel.find({createdBy:user_id});
  if(!profiles.length) {return res.redirect("./profile/create");  
}
  //console.log(profiles);
  res.render("viewProfiles",{
   profiles,
   user:req.user
  })
})


module.exports=router;