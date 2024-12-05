import bcryptjs from 'bcryptjs';
import User from '../models/user.models.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.models.js';

export const test=(req,res)=>{
    res.json({
        message:'Api is working',
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      if (req.body.contact) {
        const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
        if (!mobileRegex.test(req.body.contact)) {
            return next(errorHandler(400, 'Invalid mobile number format.'));
        }      
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            contact: req.body.contact,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only delete your own account!'));
    try{
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');

    }catch(error){
      next(error);
    }
   
  };

  
export const getUserListings = async(req,res,next) =>{
  if(req.user.id === req.params.id){
    try{
      const listings = await Listing.find({userRef:req.params.id});
      res.status(200).json(listings);
    }catch(error){
        next(error);
    }
  }else{
    return next(errorHandler(401,'You can only view your own listings!'));
  }
  
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async(req,res,next) => {
 
    if(!req.user.isAdmin){
      return next(errorHandler(403,'Your not allow to see all users'));
    }

    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;

      const searchTerm = req.query.searchTerm || '';

      const usersQuery = User.find({

        $or: [
          { username: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        
        ]
      
      });

      const users = await usersQuery

        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });


      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ isAdmin: true });
      const totalCustomers = await User.countDocuments({ isAdmin: false });

      const now = new Date();

      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      const lastMonthCustomers = await User.countDocuments({
        isAdmin: false ,
        createdAt: { $gte: oneMonthAgo },
      });
      const lastMonthAdmin = await User.countDocuments({
        isAdmin: true ,
        createdAt: { $gte: oneMonthAgo },
      });


      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthCustomers,
        totalAdmins,
        totalCustomers,
        lastMonthAdmin,
        lastMonthUsers

      });
    } catch (error) {
      next(error);
    }
};

  