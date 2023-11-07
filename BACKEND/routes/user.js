const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const { hashPassword } = require('../utils/hash');
const auth = require('../middleware/auth');
//const User = require('../models/user')
const bcrypt = require('bcrypt')

// Create new user
router.post('/signup', async(req,res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const isUnique = (await User.count({username: req.body.username})) === 0;
    if(!isUnique)
    return res.status(401).json({error: 'The username or password is not valid'});

    try {
        const user = new User(req.body);
        user.password = await hashPassword(user.password);
        await user.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json(err);
    }
})

// Gets all the users
router.get('', (req, res) =>{
    User.find().then((users)=>{
        res.json(
            {
                message: 'Users found',
                users:users
            }
        )
    })
})

router.get('/profile', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send the user's data as the response
      res.json({ user: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Delete a user
router.delete("/:id", (req, res)=>{
    User.deleteOne({_id: req.params.id})
    .then((result)=>
    {
        res.status(200).json({message:"User Deleted"});
    })
})

module.exports = router