const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model('Post')
const User = mongoose.model('User')




router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(userdata => {
            Post.find({ postedby: req.params.id })
                .populate("postedby", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ userdata, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "user not found" })
        })
})
router.put('/follow', requireLogin, (req, res) => {

    User.findByIdAndUpdate(req.body.followid, {
        $push: { followers: req.user._id }

    }, {
        new: true
    }, (err, result) => {
        if (err) {

            return res.status(422).json({ error: err })
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followid }
        }, {
            new: true
        }).select("-password").then(result => {

            res.json(result)
        }).catch(err => {

            return res.status(404).json({ error: "user not found" })
        })

    })



})
router.put('/unfollow', requireLogin, (req, res) => {
    console.log("unfollow entered")
    User.findByIdAndUpdate(req.body.followid, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        console.log("result after pulling", result)
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followid }
        }, {
            new: true
        }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(404).json({ error: "user not found" })
        })
    })



})

router.get('/followers', requireLogin, (req, res) => {



User.find({_id:{$in:req.user.followers}}).then(data=>res.json(data))
   
        .catch(err => {
            console.log(err)
        })

})
router.get('/followers/:userid', requireLogin, (req, res) => {


const userid = req.params.userid


    User.find({_id:userid})
    .then( result => result.forEach(function(item) {
        
        User.find({_id:item.followers}).then(data=>res.json(data))
      
      }))
    
       
            .catch(err => {
                console.log(err)
            })
           
       
    
    })
router.get('/following/:userid', requireLogin, (req, res) => {
    
    const userid = req.params.userid


    User.find({_id:userid})
    .then( result => result.forEach(function(item) {
        
        User.find({_id:item.following}).then(data=>res.json(data))
      
      }))
    
       
            .catch(err => {
                console.log(err)
            })
           
       
})
router.get('/following', requireLogin, (req, res) => {
    
    User.find({_id:{$in:req.user.following}}).then(data=>res.json(data))
   
    .catch(err => {
        console.log(err)
    })

})
router.put('/profilePicUpdate',requireLogin,(req,res)=>{
    const {pic} = req.body
    console.log("inside route",pic)
    User.findByIdAndUpdate({_id:req.user._id},{
        profilePicture:pic
    },{
        new:true
    }).select("-password").then(result=>{
        res.json(result);
        console.log("route result",result)
    })
})

module.exports = router;