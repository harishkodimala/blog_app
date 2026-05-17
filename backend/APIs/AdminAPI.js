import exp from 'express'

import { UserTypeModel } from '../models/userModel.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkAdmin } from '../middleware/checkAdmin.js'

export const adminRoute = exp.Router()


// GET ALL USERS
adminRoute.get(
  "/users",
  verifyToken("ADMIN"),
  checkAdmin,
  async (req, res) => {

    try {

      const users = await UserTypeModel.find()
        .select("-password")

      res.status(200).json({
        message: "users fetched",
        payload: users
      })

    } catch (error) {

      res.status(500).json({
        message: error.message
      })

    }
})


// BLOCK USER
adminRoute.put(
  '/block/:userId',
  verifyToken("ADMIN"),
  checkAdmin,
  async (req, res) => {

    try {

      const userID = req.params.userId

      const user = await UserTypeModel.findById(userID)

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        })

      }

      if (!user.isActive) {

        return res.status(400).json({
          message: "User already blocked"
        })

      }

      const updatedUser =
        await UserTypeModel.findByIdAndUpdate(
          userID,
          {
            $set: {
              isActive: false
            }
          },
          { new: true }
        )

      res.status(200).json({
        message: "User blocked successfully",
        payload: updatedUser
      })

    } catch (error) {

      res.status(500).json({
        message: error.message
      })

    }
})


// UNBLOCK USER
adminRoute.put(
  '/unblock/:userId',
  verifyToken("ADMIN"),
  checkAdmin,
  async (req, res) => {

    try {

      const userID = req.params.userId

      const user = await UserTypeModel.findById(userID)

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        })

      }

      if (user.isActive) {

        return res.status(400).json({
          message: "User already unblocked"
        })

      }

      const updatedUser =
        await UserTypeModel.findByIdAndUpdate(
          userID,
          {
            $set: {
              isActive: true
            }
          },
          { new: true }
        )

      res.status(200).json({
        message: "User unblocked successfully",
        payload: updatedUser
      })

    } catch (error) {

      res.status(500).json({
        message: error.message
      })

    }
})