import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import { UserTypeModel } from '../models/userModel.js';

export const authRouter = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// GOOGLE LOGIN
authRouter.post('/google', async (req, res) => {

  try {

    const { credential } = req.body;

    // Verify Google Token
    const ticket = await client.verifyIdToken({

      idToken: credential,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get User Data
    const payload = ticket.getPayload();

    const {
      sub,
      given_name,
      family_name,
      email,
      picture,
    } = payload;

    // Check Existing User
    let user = await UserTypeModel.findOne({ email });

    // Create User If Not Exists
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

    // JWT Token
    const token = jwt.sign(

      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRETKEY,

      {
        expiresIn: '7d',
      }
    );

    // COOKIE AUTH
    res
      .cookie('token', token, {

        httpOnly: true,

        secure: true,

        sameSite: 'None',

        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      .status(200)

      .json({

        message: 'Google Login Successful',

        payload: {
            user: {         
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                role: user.role,
            },
            token,
        },
      });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: err.message,
    });
  }
});

