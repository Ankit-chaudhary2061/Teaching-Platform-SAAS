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
          id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
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
      req.instituteNumber = instituteNumber;

      next();
    } catch (error: any) {
      console.error("Create institute error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
        fullError: error,
      });
    
    }
  }
  // ==============================
  // Create Teacher Table 
  // ==============================

 static async createTeacher(req: IExtendedRequest, res: Response, next:NextFunction) {
    try {
      const instituteNumber = req.instituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }

    await sequelize.query(`
  CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    teacherName VARCHAR(200) NOT NULL,
    teacherAddress VARCHAR(255),
    teacherEmail VARCHAR(255) NOT NULL,
    teacherExperties VARCHAR(255),
    teacherPhoneNumber VARCHAR(255) NOT NULL,
    joined DATE,
    salary VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

        next()
      return res.status(201).json({
        message: "Institute and teacher table created successfully",
        instituteNumber,
      });
    } catch (error: any) {
    console.error('Create student error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
      });
 }
  }
   // ==============================
  // Create Student Table 
  // ==============================
  static async createStudent(req:IExtendedRequest, res:Response, next:NextFunction){
    try {
      const instituteNumber = req.instituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }
      await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
       id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      studentName VARCHAR(255) NOT NULL,
      studentAddress VARCHAR(255),
      studentPhoneNumber VARCHAR(255),
      enrolledDate DATE,
      studentImage VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`)
      next()
    } catch (error :any) {
      console.error('Create student error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
      });
    }

  }
  // ==============================
  // Create Student Table 
  // ==============================
  static async createCourseTable(req:IExtendedRequest, res:Response){
   try {
       const instituteNumber = req.instituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }
     await sequelize.query(`
      CREATE TABLE IF NOT EXISTS course_${instituteNumber} (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        courseName VARCHAR(222) NOT NULL UNIQUE,
        coursePrice VARCHAR(255) NOT NULL,
        courseDuration VARCHAR(222),
        courseLevel ENUM('beginner', 'average', 'advance'),
        courseDescription TEXT,
        courseThumbnail VARCHAR(255)
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

     return res.status(200).json({
        message: "Institute  created successfully",
        instituteNumber,
      });
   } catch (error : any) {
     console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
      });
    }

  }

}

export default InstituteController;