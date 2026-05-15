import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {

    try {
      

      // read token from cookies
      let token = req.cookies.token;
      console.log("token:", token);
      console.log(req.cookies);

      if (!token) {
        return res.status(401).json({ message: "Unauthorized request. Please login." });
      }

      // verify token
      let decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

      // check role authorization
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden. You dont have access." });
      }
      console.log("Decoded token", decodedToken.role)
      decodedToken._id=decodedToken.userId;
      console.log("Decoded token",decodedToken)
      
      req.user = decodedToken;


      next();

    } catch (error) {
      if(error.name==="TokenExpiredError")
      {
        return res.status(401).json({message:"Session expired,Plz Login again"})
      }
      if(error.name==="JsonWebTokenError")
      {
        return res.status(401).json({message:"Invalid token,Plz login again"})
      }
      // next(error);
    }

  };
};