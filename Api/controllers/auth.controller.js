import User from '../models/user.model.js'

export const signup=async(res,req)=>{
    const { username,email,password}=req.body;
    const newUser=new User({username,email,password});
    await newUser.save();
    res.status(201).json({message:"User created successfully"});
};