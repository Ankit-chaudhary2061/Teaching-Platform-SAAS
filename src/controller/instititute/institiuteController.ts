import { Request, Response } from "express";
import sequelize from "../../database/connection.ts"; 
import { QueryTypes } from "sequelize";
import generateRandomInstituteNumber from "../../services/generateRandomNumber.ts"; 

class InstituteController {
  static async createInstitute(req: Request, res: Response) {
    try {
      const { instituteName, instituteAddress, instituteEmail, institutePhoneNumber } = req.body;
      const instituteVatNo = req.body.instituteVatNo || null;
      const institutePanNo = req.body.institutePanNo || null;

      // 1. Make sure all required fields are filled
      if (!instituteAddress || !instituteEmail || !instituteName || !institutePhoneNumber) {
        return res.status(400).json({
          message: 'Please provide instituteName, instituteAddress, instituteEmail, and institutePhoneNumber'
        });
      }

      // 2. Generate unique institute number
      const instituteNumber = generateRandomInstituteNumber();

      // 3. Create table with unique institute number
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

      // 4. Insert data into the newly created table
      await sequelize.query(
        `INSERT INTO institute_${instituteNumber}(
          instituteName, instituteAddress, instituteEmail, institutePhoneNumber, instituteVatNo, institutePanNo
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [instituteName, instituteAddress, instituteEmail, institutePhoneNumber, instituteVatNo, institutePanNo],
          type: QueryTypes.INSERT
        }
      );

      return res.status(201).json({
        message: 'Institute created successfully'
       
      });

    } catch (error: any) {
      console.error('Create institute error:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }
}

export default InstituteController;