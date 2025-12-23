import express from 'express'
const router = express.Router()
import User from '../models/user.js'

import { jwtAuthMiddleware, generateToken } from '../jwt.js';


//POST route  to add a user 
router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    const payload = { id: savedUser._id, role: savedUser.role };
    const token = generateToken(payload);

    return res.status(201).json({
      message: "User created",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    console.log(err);

    // common duplicate key error from unique fields
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email or citizenshipNumber already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login Route
router.post('/login', async (req, res) => {
  try {
    //extract Username and password from  request body 
    const { citizenshipNumber, password } = req.body;
    console.log(citizenshipNumber)
    console.log(req.body)

    // Find the user by citizenshipNumber
    const user = await User.findOne({ citizenshipNumber: citizenshipNumber });

    // if users does not exists or password  does  not match , return error 
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // generate Token 
    const payload = {
      id: user.id,
      role: user.role
      //username: User.username
    }
    const token = generateToken(payload);
    // return  token as response 
    res.json({ token })
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error ' });
  }
})
// Profile Routes 
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;

    const userID = userData.id;
    const User = await User.findById(userId);
    res.status(200).json(user);

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Interal server Error' });

  }
});
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user; // Extract the id  from the token \
    const { currentPassword, newPassword } = req.body // extract current and new passwords  from request body

    /// Find the user by   userID
    const user = await User.findById(userId);


    //if password does not match ,return error
    if (!await user.comparePassword(currentPassword)) {
      return res.status(402).json({ error: 'Invalid username or password' });
    }
    //updated the user password
    user.password = newPassword;
    await user.save();

    console.log('pasword updated');
    res.status(200).json({ message: "Password  updated" });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ eror: ' Internal server Error ' });
  }
})
router.get('/count', async (req, res) => {
  try {
    // list all user sigup 
    const userCount = await User.countDocuments();
    return res.status(200).json({ userCount });

  }
  catch (err) {
    console.log(err);
    res.status(200).json({ error: ' Internal server error' });
  }
});

export default router