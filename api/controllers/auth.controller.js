import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';
import  Jwt  from "jsonwebtoken";

export const signup=async (req,res,next)=>{
    const {username,email,password} =req.body;
    const hashedpassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashedpassword});

try{
    await newUser.save();
    res.status(201).json({message:'user created successfully'});

}catch(error){
    next(error);
}
    
} ;

export const signin=async(req,res,next)=>{
    const{email,password}=req.body;
    try{
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(401,'User not found'));
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid password'));
        const token=Jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const{password:hashedpassword,...rest}=validUser._doc;
        const Expirydate=new Date(Date.now(),3600000);//1 hour 
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        

    }catch(error){
        next(error);
    }
}
