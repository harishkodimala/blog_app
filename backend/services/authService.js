import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel";
import {config} from 'dotenv'
config()

//register function
export const register = async (userObj) => {
  //Create document
  const userDoc = new UserTypeModel(userObj);
  //validate for emprty passwords
  await userDoc.validate();
  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  //save
  const created = await userDoc.save();
  //convert document to object to remove password
  const newUserObj = created.toObject();
  //remove password
  delete newUserObj.password;
  //return user obj without password
  return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password }) => {
    //check user with email & role
  const user = await UserTypeModel
  .findOne({ email })
  .select("+password");

  if (!user) {
    const err = new Error("Invalid email ");
    err.status = 401;
    throw err;
  }
  //if user valid ,but blocked by admin
  if(user.isActive===false)
  {
    const err=new Error("Your Account is blocked,plz contact admin");
    err.status=403;
    throw err;
  }
  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  //generate token
  const token = jwt.sign({ userId: user._id, profileImageUrl:user.profileImageUrl,firstName:user.firstName,
    role: user.role, email: user.email }, 
    process.env.JWT_SECRETKEY, {
    expiresIn: "10h",
  });

  const userObj = user.toObject();
  console.log("UserObj from authenitcate :", userObj)
  delete userObj.password;

  return { token, user: userObj };
  
};