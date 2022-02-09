const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model('Post')



router.get("/allPost", requireLogin, (req, res) => {
    console.log("userDetails", req.user)
    Post.find()
        .populate("postedby", "_id name profilePicture")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            console.log(err);
        })
})
router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        res.status.apply(422).json({ error: "please add all content" })
    }


    const post = new Post({
        title,
        body,
        photo,
        postedby: req.user
    })
    post.save().then(result => {
        console.log("userDetails", req.user)
        console.log("post details", result)
        res.json({ post: result })
    }).catch(err => {
        console.log(err);
    })
})
router.get("/mypost", requireLogin, (req, res) => {
    Post.find({ postedby: req.user._id })
        .populate("postedby", "_id name profilePicture")
        .then(posts => {
            res.json({ posts })
        }).catch(err => {
            console.log(err);
        })
})
router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id },
        $pull: { unlikes: req.user._id }
        

    }, {
        new: true
    }).populate("postedby","_id name profilePicture").exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})
router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id },
        $push:{unlikes: req.user._id}
    }, {
        new: true
    }).populate("postedby","_id name profilePicture").exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})
router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        name: req.body.name,
        postedby: req.user
    }
    
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("postedby","_id name profilePicture").exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
            
                res.json(result)
            }
        })
})

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  

    Post.findOne({ _id: req.params.postId })
        .populate("postedby", "_id name profilePicture")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedby._id.toString() === req.user._id.toString()) {
                post.remove()
                
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
})
router.delete("/deleteComment/:commentId/:postid", requireLogin, async (req, res) => {
    
    const post = await Post.findById(req.params.postid);

    const commId = mongoose.Types.ObjectId(req.params.commentId)
    
    
    const comment = post.comments.find(e => e._id.toString() === commId.toString())

    if(!comment){
        res.status(400).json({error:"Comment not found"})
    }
    if(comment.postedby.toString() === req.user._id.toString()){

    post.comments.remove(comment._id)

    await post.save();
    const newPost = await  Post.find()
    .populate("postedby", "_id name profilePicture")
    .then(posts => {
        console.log(posts)
        res.json(posts)
    })

    .catch(err => {
        console.log(err);
    })
}

   

   
})
module.exports = router;