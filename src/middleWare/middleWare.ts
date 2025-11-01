import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/model/userModels.ts";
import { IExtendedRequest } from "./type.ts";

class MiddleWare {
  static async isLogedIn(req: IExtendedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ message: "Please provide a token" });
    }

    jwt.verify(token, process.env.SECRET_KEY as string, async (error, decoded: any) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const data = await User.findByPk(decoded.id, {
        attributes: ["id", "currentInstituteNumber"],
      });

      if (!data) {
        return res.status(401).json({ message: "User no longer exists. Please login again." });
      }

      // ✅ Attach both user and instituteNumber separately
      req.user = {
        id: data.id,
        currentInstituteNumber: data.currentInstituteNumber,
      };
console.log("👉 req.user:", req.user);

   

      next();
    });
  }
}

export default MiddleWare;

// import { NextFunction, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../database/model/userModels.ts"; // ✅ remove .ts extension
// import { IExtendedRequest } from "./type.ts";

// class MiddleWare {
//   static async isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction) {
//     try {
//       const authHeader = req.headers.authorization;

//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Please provide a valid token" });
//       }

//       const token = authHeader.split(" ")[1]; // extract actual token

//       // ✅ Verify token synchronously
//       const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

//       // ✅ Fetch user from DB
//       const user = await User.findByPk(decoded.id, {
//         attributes: ["id", "currentInstituteNumber"],
//       });

//       if (!user) {
//         return res.status(401).json({
//           message: "User no longer exists. Please login again.",
//         });
//       }

//       // ✅ Attach user info to request
//       req.user = { id: user.id };
//       req.instituteNumber = user.currentInstituteNumber;

//       next(); // move to next controller
//     } catch (error: any) {
//       console.error("Auth Error:", error);
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   }
// }

// export default MiddleWare;
