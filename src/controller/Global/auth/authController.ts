import type { Request, Response } from "express"; 
import User from "../../../database/model/userModels.ts";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import generateJwtToken from "../../../services/generateJwtToken.ts";
class AuthController {
  // =======================
  // Register User
  // =======================
  static async registerUser(req: Request, res: Response) {
    try {
      // 1. Check if body exists
      if (!req.body ) {
        return res.status(400).json({
          message: "No data is sent",
        });
      }

      const { username, email, password } = req.body;

      // 2. Make sure all required fields are filled
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "All fields are mandatory!",
        });
      }

      // 3. Check if email already exists
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      // 4. Hash password (so we don't store plain text)
      const hashedPassword = await bcrypt.hash(password, 12);

      // 5. insert into Tables
      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // 6. Success response
      return res.status(201).json({
        message: "Congratulation! Successfully registered",
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  // ======================
  // Login User
  // ======================
  static async loginUser(req: Request, res: Response) {
    try {
        if (!req.body ) {
        return res.status(400).json({
          message: "No data is sent",
        });
      }
      const { email, password } = req.body;

      
      if (!email || !password) {
        return res.status(400).json({
          message: "Please provide both  email and password",
        });
      }

      // 1. Find user
      const userData = await User.findOne({ where: { email } });
      if (!userData) {
        return res.status(401).json({
          message: "email is not registered",
        });
      }

      // 2. Compare the entered password with the stored (hashed) password
      const passwordMatch = await bcrypt.compareSync(password, userData.password);
      if (passwordMatch) {
       const token= generateJwtToken({id: userData.id})
         res.status(200).json({
           data:{token,
            username :userData.username
           } ,
        message: "Login successful",
        
      });
      }else{
         res.status(400).json({
        message: "Invalid Email or Password",
        
      });
      }
     
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}

export default AuthController;