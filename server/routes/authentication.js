const express =require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {JWT_SECRET}=require('../config/valueKeys')
const requireLogin = require("../middleware/requireLogin")


router.get("/",(req,res)=>{
res.send("hello");
})

router.post("/signup",(req,res)=>{
    const {name,email,password,pic} = req.body
    console.log("enn")
    if(!email || !password || !name){
        res.status(422).json({error:"give all information"})
    }
   
    User.findOne({email:email}).then((savedUser=>{
        if(savedUser){
            return res.status(422).json({error:"User email already exists"})
        }
        bcrypt.hash(password,10).then(hashedpassword =>{
         const user = new User(
             {
                 name,
                 email,
                 password:hashedpassword,
                 profilePicture:pic
             }
         )
         user.save()
         .then(user=>{
             res.json({message:"saved successfully"})
         }).catch(err=>{
             console.log(err);
         })
     })
        }))
      .catch(err=>{
       console.log(err);
   })



})

router.get("/protected",requireLogin,(req,res)=>{
    res.send("gained");
})

router.post("/signin",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
       return res.status(422).json({error:"email or password missing"})

    }
    User.findOne({email:email})
    .then(savedUser=>{
if(!savedUser){
    return res.status(422).json({error:"invalid email or password"})
}
bcrypt.compare(password,savedUser.password)
.then(doMatch=>{
    if(doMatch){
        const {_id,name,email,profilePicture} = savedUser
const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
res.json({token,user:{
_id,name,email,profilePicture
}
})
    }
    else{
        res.status(422).json({error:"invalid  password"})
            }
})
.catch(err=>{
    console.log(err)
})
    })
})

module.exports=router;