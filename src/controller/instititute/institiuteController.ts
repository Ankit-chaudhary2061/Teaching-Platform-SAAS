import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection.ts"; 
import { QueryTypes } from "sequelize";
import generateRandomInstituteNumber from "../../services/generateRandomNumber.ts"; 
import { IExtendedRequest } from "../../middleWare/type.ts";
import User from "../../database/model/userModels.ts";

class InstituteController {
  // ===============================
  // Create Institute
  // ===============================
  static async createInstitute(req:IExtendedRequest, res: Response, next:NextFunction) {
    try {
      const { instituteName, instituteAddress, instituteEmail, institutePhoneNumber } = req.body;
      const instituteVatNo = req.body.instituteVatNo || null;
      const institutePanNo = req.body.institutePanNo || null;

      //  Make sure all required fields are filled
      if (!instituteAddress || !instituteEmail || !instituteName || !institutePhoneNumber) {
        return res.status(400).json({
          message: 'Please provide instituteName, instituteAddress, instituteEmail, and institutePhoneNumber'
        });
      }

      // Generate unique institute number
      const instituteNumber = generateRandomInstituteNumber();

      // Create table with unique institute number
      await sequelize.query(
        `CREATE TABLE IF NOT EXISTS institute_${instituteNumber}(
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          instituteName VARCHAR(200) NOT NULL,
          instituteAddress VARCHAR(255) NOT NULL,
          instituteEmail VARCHAR(255) NOT NULL,
          institutePhoneNumber VARCHAR(225) NOT NULL,
          instituteVatNo VARCHAR(200),
          institutePanNo VARCHAR(200),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      );

      //  Insert data into the newly created table
      await sequelize.query(
        `INSERT INTO institute_${instituteNumber}(
          instituteName, instituteAddress, instituteEmail, institutePhoneNumber, instituteVatNo, institutePanNo
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [instituteName, instituteAddress, instituteEmail, institutePhoneNumber, instituteVatNo, institutePanNo],
          type: QueryTypes.INSERT
        }
      );
      //Create user_Institute table if not exists
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_Institute(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userId VARCHAR(244),
        instituteNumber VARCHAR(255)
        )`)

        
      if (req.user) {
        await sequelize.query(
          `INSERT INTO user_Institute(userId, instituteNumber) VALUES (?, ?)`,
          {
            replacements: [req.user.id, instituteNumber],
            type: QueryTypes.INSERT,
          }
        );

        // Update user info
        await User.update(
          {
            currentInstituteNumber: instituteNumber,
            role: "institute",
          },
          {
            where: { id: req.user.id },
          }
        );
      }

      // Pass instituteNumber to next middleware
     if (req.user) {
  req.user.currentInstituteNumber = instituteNumber;
  
}

      

      next();
    } catch (error: any) {
      console.error("Create institute error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
        fullError: error,
        stack: error.stack

      });
    
    }
  }
  // ==============================
  // Create Teacher Table 
  // ==============================

//  static async createTeacher(req: IExtendedRequest, res: Response, next:NextFunction) {
//     try {
//       const instituteNumber = req.user?.currentInstituteNumber;

//       if (!instituteNumber) {
//         return res.status(400).json({ message: "Institute number is missing" });
//       }

//      await sequelize.query(`
//       CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
//         id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
//         teacherName VARCHAR(200) NOT NULL,
//         teacherAddress VARCHAR(255),
//         teacherEmail VARCHAR(255) NOT NULL,
//         teacherExperience VARCHAR(255),
//         teacherPhoneNumber VARCHAR(255) NOT NULL,
//         teacherJoined DATE,
//         teacherSalary VARCHAR(100),
//         teacherPhoto VARCHAR(255),
//         teacherPassword VARCHAR(255),
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);

//   next()
     
//     } catch (error: any) {
//     console.error('Create student error:', error);
//       return res.status(500).json({
//         message: 'Server error',
//          error: error.message,
//         fullError: error,
//         stack: error.stack

//       });
//  }
//   }
static async createTeacher(req: IExtendedRequest, res: Response, next: NextFunction) {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;

    if (!instituteNumber) {
      return res.status(400).json({ message: "Institute number is missing" });
    }

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
        teacherName VARCHAR(255) NOT NULL, 
        teacherEmail VARCHAR(255) NOT NULL , 
        teacherPhoneNumber VARCHAR(255) NOT NULL,
        teacherExperience VARCHAR(255), 
        teacherJoinedDate DATE, 
        teacherSalary VARCHAR(100),
        teacherPhoto VARCHAR(255), 
        teacherPassword VARCHAR(255),
        courseId VARCHAR(100) REFERENCES course_${instituteNumber}(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating teacher table" });
  }
}


   // ==============================
  // Create Student Table 
  // ==============================
  static async createStudent(req:IExtendedRequest, res:Response, next:NextFunction){
    try {
     const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }

      await sequelize.query(`
         CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
  teacherName VARCHAR(255) NOT NULL, 
  teacherEmail VARCHAR(255) NOT NULL UNIQUE, 
  teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
  teacherExperience VARCHAR(255), 
  joinedDate DATE, 
  salary VARCHAR(100),
  teacherPhoto VARCHAR(255), 
  teacherPassword VARCHAR(255),
  courseId VARCHAR(100) REFERENCES course_${instituteNumber}(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
      `);

      next();
    } catch (error :any) {
      console.error('Create student error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack

      });
    }

  }
  // ==============================
  // Create Course Table 
  // ==============================
  static async createCourseTable(req:IExtendedRequest, res:Response){
   try {
   const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }

      await sequelize.query(`
          CREATE TABLE IF NOT EXISTS course_${instituteNumber} (
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          courseName VARCHAR(222) NOT NULL UNIQUE,
          coursePrice VARCHAR(255) NOT NULL,
          courseDuration VARCHAR(222),
          courseLevel ENUM('beginner', 'average', 'advance'),
          courseDescription TEXT,
          courseThumbnail VARCHAR(255),
          teacherId VARCHAR(36)  REFERENCES teacher_${instituteNumber} (id),
          categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber} (id),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      //  only now send the success response (after all tables created)
      return res.status(201).json({
        message: "Institute and all related tables created successfully ",
        instituteNumber,
      });
   } catch (error : any) {
     console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
       fullError: error, 
        stack: error.stack
      });
    }

  }
  // ==============================
  // Create Category Table 
  // ==============================
  static async createCategoryTable(req:IExtendedRequest , res:Response, next:NextFunction) {
    try {
    const institituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${institituteNumber}(
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    categoryName VARCHAR(100) NOT NULL,
    categoryDescription TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      
    )`)
    

    next()
      
    } catch (error : any) {
       console.error('Create category error:', error);
      return res.status(500).json({
       message: 'Server error',
       fullError: error, 
        stack: error.stack
      });
    }

  }

}

export default InstituteController;