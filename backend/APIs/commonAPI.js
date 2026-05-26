import exp from 'express'
import { authenticate } from '../services/authService.js';
import { UserTypeModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
export const commonRouter=exp.Router()
import rateLimit from "express-rate-limit";
import {verifyToken} from '../middleware/verifyToken.js'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 10, // max requests
  message: "Too many requests, try later",
});


//login
commonRouter.post('/login',async(req,res)=>
{
//get user cred object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save token as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,// 1 day
  });
  //send res
  res.status(200).json({ message: "login success", payload: user });
})
//logout

//logout for User, Author and Admin
commonRouter.get('/logout',limiter, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

//update password
commonRouter.put('/change-password',async(req,res)=>
{
//get current paassword and new password
let {userID,email,currentPassword,newPassword}=req.body
let userDB=await UserTypeModel.findById(userID)
if(!userDB)
{
    return res.status(404).json({message:"Invalid user"})
}
//check the current password is correct
let pass=await bcrypt.compare(currentPassword,userDB.password)
if(pass===false)
{
    return res.status(400).json({message:"incorrect password"})
}

//replace the current password with new password
userDB.password=await bcrypt.hash(newPassword,10)
await userDB.save()

//send res
res.status(200).json({message:"password updated succesfully",payload:userDB})
})

//route to handlle page refresh 
commonRouter.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>
{
  console.log("req.user",req.data)
  console.log("req.payload from check auth",req.payload)

  res.status(200).json({message:"authenticated",payload:req.user})
})

