import { Request, Response } from 'express';
import sequelize from '../../database/connection.ts';
import { QueryTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import generateJwtToken from '../../services/generateJwtToken.ts';

interface ITeacher {
  id: string;
  teacherEmail: string;
  teacherPassword: string;
  // Add any other fields you need
}

const teacherLogin = async (req: Request, res: Response) => {
  try {
    const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body;

    // 1️ Validate input
    if (!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
      return res.status(400).json({
        message: 'Please provide teacherEmail, teacherPassword, and teacherInstituteNumber',
      });
    }

    // 2️ Fetch teacher from correct institute table
    const teacherData: ITeacher[] = await sequelize.query(
      `SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail = ?`,
      {
        replacements: [teacherEmail],
        type: QueryTypes.SELECT,
      }
    );

    if (teacherData.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️ Get teacher and compare password
    const teacher = teacherData[0]!; // non-null assertion since we checked length

    const isMatch = await bcrypt.compare(teacherPassword, teacher.teacherPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4️ Generate JWT token
    const token = generateJwtToken({id : teacher.id,
      instituteNumber:teacherInstituteNumber
    });

    // 5️ Send success response
    res.status(200).json({
      message: 'Login successful',
     
      data: {
        id: teacher.id,
        teacherEmail: teacher.teacherEmail,
        teacherToken : token,
        teacherInstituteNumber,
        // exclude password for security reasons
      },
    });

  } catch (error: any) {
    console.error('  Server Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: error.stack,
      fullError: error,
      
    });
  }
};

export default teacherLogin;
