import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import mongoose from "mongoose";
export const userRoute = exp.Router();


//Register user
userRoute.post(
        "/users",
        upload.single("profileImageUrl"),
        async (req, res, next) => {
        let cloudinaryResult;
        console.log("BODY", req.body);
        console.log("FILE", req.file);

            try {
                let userObj = req.body;

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );

//Read all articles(protected route)
userRoute.get(
  "/articles",
  verifyToken("USER"),
  async (req, res) => {
    try {
      const articles = await ArticleModel.find({
        isArticleActive: true
      })
      .populate("author", "-password") // hide password
      .populate("comments.user", "firstName email");

      res.status(200).json({
        message: "All active articles",
        payload: articles
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);
//Add comment to an article(protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  //get comment obj from req
  const { userId, articleId, comment } = req.body;
  //check user(req.user)
  console.log("Userreq",req.body);
  console.log("userId",userId);
  if (userId !== req.user.userId) {
    
    return res.status(403).json({ message: "Forbidden" });
  }
  //find artcleby id and update
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { comments: { user: userId, comment } } },
    { new: true, runValidators: true },
  ).populate("comments.user", "firstName email");

  //if article not found
  if (!articleWithComment) {
    return res.status(404).json({ message: "Article not found" });
  }
  //send res
  res.status(200).json({ message: "comment added successfully", payload: articleWithComment });
});


userRoute.get(
  "/article/:id",
  verifyToken(),
  async (req, res) => {

    try {

      const article = await ArticleModel.findById(req.params.id)
        .populate("author", "-password")
        .populate("comments.user", "firstName lastName email");

      if (!article || !article.isArticleActive) {

        return res.status(404).json({
          message: "Article not found"
        });

      }

      res.status(200).json({
        message: "Article fetched successfully",
        payload: article
      });

    } catch (error) {

      res.status(500).json({
        message: "Server error",
        error: error.message
      });

    }
  }
);

//next() ---> next middleware
//next(err) ---> error handling middleware