import { Request, Response} from 'express'
import sequelize from '../../../database/connection.ts';
import { IExtendedRequest } from '../../../middleWare/type.ts';
import { QueryTypes } from 'sequelize';


class CourseController {
    static async createCourse(req:IExtendedRequest, res:Response){
       try {
        const { courseName, coursePrice,courseDescription, courseDuration, courseLevel} = req.body
        if(!courseName || ! courseDescription || ! courseDuration || ! coursePrice|| ! courseLevel){
            return res.status(400).json({
                message:' please provide me all the mandatory data'
            })
        }
        console.log(req.file , ': file ')
        const courseThumbnail = req.file ? req.file.path : null;
        const instituteNumber = req.user?.currentInstituteNumber
       

        await sequelize.query(`INSERT INTO course_${instituteNumber}(
            courseName,coursePrice,courseDescription,courseDuration, courseLevel, courseThumbnail
        ) VALUES(?,?,?,?,?,?)`,
        {
            replacements:[courseName,coursePrice,courseDescription,courseDuration, courseLevel, courseThumbnail || '']
        })
        res.status(200).json({
            message:'successfull courses is created ',

        })
       } catch (error: any) {
        console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack

      });
       }
    }
    static async deleteCourse(req:IExtendedRequest, res:Response){
        try {
            const instituteNumber = req.user?.currentInstituteNumber
            
            const courseId = req.params.id
            await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id = ?`,{
                replacements :[courseId],
                type:QueryTypes.DELETE
            })
        } catch (error : any) {
        console.error('delete course error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack

      });
        }
    }
    static async fetchCourse(req:IExtendedRequest, res:Response){
        const instituteNumber = req.user?.currentInstituteNumber

        const courseId = req.params.id
        const courses = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`,{replacements:[courseId],type:QueryTypes.SELECT})
        res.status(200).json({
            message : 'Course fetched',
            data : courses
        })
    }
    static async getAllSingleCourse (req:IExtendedRequest, res:Response){
        try {
        const instituteNumber = req.user?.currentInstituteNumber

        const courseId = req.params.id
         const [course] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`,{replacements:[courseId],type:QueryTypes.SELECT})
         if(!course){
            return res.status(404).json({
                message:'no course with that id'
            })
           

         }
          res.status(200).json({
                message :'single course fetched',
                data : course

            })
        } catch (error : any) {
           console.error('delete course error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack

      }); 
        }
    }
}

export default CourseController