import exp from "express";
import { authenticate, register } from "../services/authService.js";
import { UserTypeModel } from "../models/userModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middleware/checkAuthor.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = exp.Router();
authorRoute.post(
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
                role: "AUTHOR",
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

//Create article(protected route)
authorRoute.post("/articles",verifyToken("AUTHOR") , async (req, res) => {
  //get article from req
  let article = req.body;
  console.log("Article data", req.user);
article.author = req.user.userId;


  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});
authorRoute.get(
  "/article/:articleId",
  async (req, res) => {

    try {

      const { articleId } = req.params;

      const article = await ArticleModel.findById(articleId)
        .populate("author", "firstName email role");

      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }

      res.status(200).json({
        message: "Article found",
        payload: article
      });

    } catch(err) {

      res.status(500).json({
        message: err.message
      });

    }
  }
);
//Read artiles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR") ,checkAuthor, async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid }).populate("author", "firstName email").populate("comments.user", "firstName lastName email").exec();
  //send res
  console.log("Articles of author", articles);
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put("/articles",verifyToken("AUTHOR") ,checkAuthor,async (req, res) => {
  let { articleId, title, category, content } = req.body;

// get author from token (secure way)
const userId = req.user.userId;
console.log("User id",req.user.userId)


let articleOfDB = await ArticleModel.findOne({
  _id: articleId,
  author: userId
});
console.log(articleId)
if (!articleOfDB) {
  return res.status(403).json({ message: "You are not allowed to edit this article" });
}
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});


//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    article,
  });
});