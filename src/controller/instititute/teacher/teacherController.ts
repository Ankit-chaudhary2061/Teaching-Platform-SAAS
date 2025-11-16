import sequelize from "../../../database/connection.ts";
import { IExtendedRequest } from "../../../middleWare/type.ts";
import { Response } from "express";
import generateRandomPassword from "../../../services/generateRandomPassword.ts";
import { QueryTypes } from "sequelize";
import sendMail from "../../../services/sendMail.ts";


class TeacherController{
static async createTeacher(req: IExtendedRequest, res: Response) {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    if (!instituteNumber) {
      return res.status(400).json({ message: "Institute number is missing" });
    }

    const {
      teacherName,
      teacherEmail,
      teacherJoinedDate,         // ⬅ frontend field
      teacherExperience,
      teacherSalary,
      teacherPhoneNumber,
      courseId
    } = req.body;

    // Validate required
    if (
      !teacherName ||
      !teacherEmail ||
      !teacherJoinedDate ||
      !teacherExperience ||
      !teacherSalary ||
      !teacherPhoneNumber ||
      !courseId
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Generate random password
    const password = generateRandomPassword(teacherName);

    // File Upload (optional)
    const teacherPhoto = req.file ? req.file.path : null;

    // 🌟 FIXED — using teacherJoined for joinedDate
   

    // Insert query
    await sequelize.query(
      `INSERT INTO teacher_${instituteNumber}
      (teacherName, teacherEmail, teacherJoinedDate, teacherExperience, teacherSalary, teacherPhoneNumber, teacherPhoto, teacherPassword, courseId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          teacherName,
          teacherEmail,
          teacherJoinedDate,             // ⬅ backend column joinedDate
          teacherExperience,
          teacherSalary,
          teacherPhoneNumber,
          teacherPhoto,
          password.hashedVersion,
          courseId,
        ],
        type: QueryTypes.INSERT,
      }
    );

    // Get teacher ID
    const teacherData: { id: string }[] = await sequelize.query(
      `SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail = ?`,
      {
        replacements: [teacherEmail],
        type: QueryTypes.SELECT,
      }
    );

    if (!teacherData.length) {
      throw new Error("Teacher not found after creation");
    }

    const teacherId = teacherData[0]?.id;

    // Link teacher to course
    await sequelize.query(
      `UPDATE course_${instituteNumber} SET teacherId = ? WHERE id = ?`,
      {
        replacements: [teacherId, courseId],
        type: QueryTypes.UPDATE,
      }
    );

    // Mail info
    const mailInformation = {
      to: teacherEmail,
      subject: "Welcome to SASS MERN Project 🎉",
      text: `Hello ${teacherName}!\n\nYour account has been created.\n\nEmail: ${teacherEmail}\nPassword: ${password.plainnedVersion}\nInstitute: ${instituteNumber}`,
    };

    // Send email
    try {
      await sendMail(mailInformation);
      return res.status(200).json({
        message: "Teacher created and email sent successfully ✅",
      });
    } catch (mailError: any) {
      console.error("Email error:", mailError);
      return res.status(500).json({
        message: "Teacher created but failed to send email ❌",
        error: mailError.message,
      });
    }
  } catch (error: any) {
    console.error("Create teacher error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


    static async getTeachers (req:IExtendedRequest, res:Response){
        try {
             const instituteNumber = req.user?.currentInstituteNumber;
        if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
        }
        const teachers = await sequelize.query(`SELECT t.* , c.courseName FROM teacher_${instituteNumber} AS t JOIN course_${instituteNumber}  AS c ON t.courseId = c.id`,{
            type:QueryTypes.SELECT
        })

        res.status(200).json({
            message:'teachers fretch successfully ',
            data : teachers,
            instituteNumber
        })
        } catch (error : any) {
                console.error('fetch teacher error:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
        fullError: error,
        stack: error.stack 
        })
    }
}
static async deleteTeacher (req:IExtendedRequest, res:Response){
    try {
           const instituteNumber = req.user?.currentInstituteNumber;
        if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
        }
        const id  = req.params.id
        await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id = ?`, {
  replacements: [id],
  type: QueryTypes.DELETE
})

        res.status(200).json({
            message:'successfully delete  teacher'
        })
    } catch (error : any) {
          console.error('delete teacher error:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
        fullError: error,
        stack: error.stack 
        }) 
    }
}
}

export default TeacherController