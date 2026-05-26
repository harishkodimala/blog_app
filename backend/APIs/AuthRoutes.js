import express from 'express';

import jwt from 'jsonwebtoken';

import { OAuth2Client } from 'google-auth-library';

import { UserTypeModel } from '../models/userModel.js';

export const authRouter = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

authRouter.post('/google', async (req, res) => {

  try {

    const { credential } = req.body;

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get user data from Google
    const payload = ticket.getPayload();

    const {
      sub,
      given_name,
      family_name,
      email,
      picture,
    } = payload;

    // Check if user already exists
    let user = await UserTypeModel.findOne({ email });

    // Register user if not exists
    if (!user) {

      user = await UserTypeModel.create({

        firstName: given_name,

        lastName: family_name || "",

        email,

        profileImageUrl: picture,

        googleId: sub,

        provider: "GOOGLE",

        role: "USER",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // Response
    res.status(200).json({

      message: 'Login Successful',

      token,

      user,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: err.message,
    });
  }
});
