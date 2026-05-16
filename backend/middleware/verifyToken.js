
import jwt from "jsonwebtoken";

export const verifyToken = (...role) => {

  return (req, res, next) => {

    try {

      const token = req.cookies.token;

      console.log("token:", token);

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRETKEY
      );

      console.log("Decoded token", decoded);

      req.user = decoded;

      // IMPORTANT FIX
      // only validate role if role exists
      if (
        role.length > 0 &&
        !role.some(r => r === decoded.role?.toUpperCase())
      ) {

        return res.status(403).json({
          message: "Forbidden. You dont have access."
        });

      }

      next();

    } catch (err) {

      console.log(err);

      return res.status(401).json({
        message: "Invalid token"
      });

    }
  };
};
