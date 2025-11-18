import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection.ts";
import { IExtendedRequest } from "../../../../middleWare/type.ts"
import { Response } from "express"



class LessonController{
    static async createChapterLessonTable( req:IExtendedRequest, res:Response){
try {
  
    const instituteNumber = req.user?.currentInstituteNumber
  if (!instituteNumber) {
      return res.status(400).json({ message: "Institute number is missing" });
    }
const {lessonName , lessonDescription,chapterId, lessonVedioUrl} =req.body

      if (!lessonName || !lessonDescription || !chapterId) {
        return res.status(400).json({
          message: "Please provide lessonName, lessonDescription and chapterId",
        });
      }
const lessonThumbnail = req.file? req.file.path : null;
 if (!lessonThumbnail) {
        return res
          .status(400)
          .json({ message: "Both thumbnail and video are required" });
      }


      await sequelize.query(`INSERT INTO chapter_lesson_${instituteNumber}(lessonName , lessonDescription, chapterId, lessonThumbnail, lessonVedioUrl )  VALUES(?,?,?,?,?)`,{
        replacements:[lessonName , lessonDescription, chapterId, lessonThumbnail, lessonVedioUrl],
        type:QueryTypes.INSERT
      })
      res.status(200).json({
        message:' lesson added to chapter'
      })

} catch (error :any) {
      console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
       fullError: error, 
        stack: error.stack
      })

    }
}
static async fetchChapterLesson(req:IExtendedRequest, res:Response){
   try {
     const {chapterId}= req.params
    const instituteNumber = req.user?.currentInstituteNumber
    if (!instituteNumber) {
      return res.status(400).json({
        message: "Institute number missing from token",
      });
    }

    if (!chapterId) {
      return res.status(400).json({
        message: "chapterId is required",
      });
    }
    const lessons = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE chapterId = ?`,{
        replacements:[chapterId],
        type:QueryTypes.SELECT
    })
    return res.status(200).json({
      message: "Lessons fetched successfully",
      data: lessons,
    });
   } catch (error :any ) {
     console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
       fullError: error, 
        stack: error.stack
      })
   }
}
}

export default LessonController