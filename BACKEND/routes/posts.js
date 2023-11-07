const router = require('express').Router();
const { Post, validatePost } = require('../models/posts');
const auth = require('../middleware/auth');

//Get all posts
router.get('/all', async (req,res) => {
    const posts = await Post.find();
    res.send(posts);
})

//create new post
router.post('/create', async (req,res) => {
    const {error} = validatePost(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const post = new Post(req.body);
    post.save();
    res.send(post);
});

// Delete a single post
router.delete("/:id",auth , (req, res)=>{
    Post.deleteOne({_id: req.params.id})
    .then((result)=>
    {
        res.status(200).json({message:"Post Deleted"});
    })
})

module.exports =  router