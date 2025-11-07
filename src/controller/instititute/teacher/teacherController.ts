import sequelize from "../../../database/connection.ts";
import { IExtendedRequest } from "../../../middleWare/type.ts";
import { Response } from "express";
import generateRandomPassword from "../../../services/generateRandomPassword.ts";
import { QueryTypes } from "sequelize";
import sendMail from "../../../services/sendMail.ts";


class TeacherController{
    static async createTeacher(req:IExtendedRequest, res :Response){
        try {
        const instituteNumber = req.user?.currentInstituteNumber;
        if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
        }
        const {teacherName, teacherEmail, teacherJoined,  teacherExpertise, teacherSalary, teacherPhoneNumber, courseId} =req.body
        if(!teacherName || ! teacherEmail || ! teacherJoined || ! teacherExpertise || !teacherSalary || ! teacherPhoneNumber){
            return res.status(400).json({
                message:'provide me teacherName, teacherEmail, teacherJoinedDate,  teacherExpertise, teacherSalary, teacherPhoneNumber'
            })

        }

        const password =generateRandomPassword(teacherName)
        const teacherPhoto = req.file? req.file?.path : null
        await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherEmail, teacherJoined,  teacherExpertise, teacherSalary, teacherPhoneNumber, teacherPhoto, teacherPassword) VALUES(?,?,?,?,?,?,?,?)`,{
            replacements:[teacherName, teacherEmail, teacherJoined,  teacherExpertise, teacherSalary, teacherPhoneNumber, teacherPhoto, password.hashedVersion]
        })
        const teacherData: { id: string }[] = await sequelize.query(
        `SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail = ?`,
        {
          replacements: [teacherEmail],
          type: QueryTypes.SELECT
        })
       
        if (teacherData.length === 0) {
        throw new Error("Teacher not found")
         }

        const teacherId = teacherData[0]?.id;
        if(!teacherId){
         return res.status(500).json({
        message: "Teacher creation failed - unable to retrieve teacher ID",
         });
         }
        await sequelize.query(
          `UPDATE course_${instituteNumber} SET teacherId = ? WHERE Id = ?`,
          {
            type: QueryTypes.UPDATE,
            replacements: [teacherId, courseId],
        })
        // send mail
        const mailInformation ={
            to:teacherEmail,
            subject:'suprise motherfucker wellcome to sass mern project',
            text:`Hello Ankit! 👋 This is a test email sent using Nodemailer.
            welcome xa hai ${teacherName} timilai, timro email ${teacherEmail} and your password is ${password.plainnedVersion} and your institute number is ${instituteNumber}`
        }
         try {
  await sendMail(mailInformation)
  res.status(200).json({ message: 'Teacher created and email sent successfully' })
} catch (error :any) {
  console.error(error)
  res.status(500).json({ message: 'Teacher created, but failed to send email' ,
     error: error.message,
        fullError: error,
        stack: error.stack
  })
}

        res.status(200).json({
            message:'successfully create teacher '
        })
        } catch (error : any) {
            console.error('Create teacher error:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
        fullError: error,
        stack: error.stack
            
        })
    }
    }
    static async getTeachers (req:IExtendedRequest, res:Response){
        try {
             const instituteNumber = req.user?.currentInstituteNumber;
        if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
        }
        const teachers = await sequelize.query(`SELECT * FROM teacher_${instituteNumber}`,{
            type:QueryTypes.SELECT
        })

        res.status(200).json({
            message:'teachers fretch successfully ',
            data : teachers
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