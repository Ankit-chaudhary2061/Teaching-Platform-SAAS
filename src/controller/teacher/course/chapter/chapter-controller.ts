import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection.ts";
import { IExtendedRequest } from "../../../../middleWare/type.ts";
import { Response } from "express";

class ChapterController {
  // ====================================================
  // addChapterCourse
  // ====================================================
  static async addChapterCourse(req: IExtendedRequest, res: Response) {
    try { 
      const { courseId } = req.params;
      const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number missing" });
      }

      if (!courseId) {
        return res.status(400).json({ message: "courseId is required" });
      }

      const { chapterName, chapterDuration, chapterLevel } = req.body;

      if (!chapterName || !chapterDuration || !chapterLevel) {
        return res.status(400).json({
          message: "Please provide chapterName, chapterDuration & chapterLevel",
        });
      }

      const [course]: any = await sequelize.query(
        `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
        { replacements: [courseId], type: QueryTypes.SELECT }
      );

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

    const courseChapter: any[] = await sequelize.query(
  `SELECT * FROM course_chapter_${instituteNumber} 
   WHERE courseId = ? AND chapterName = ?`,
  {
    replacements: [courseId, chapterName],
    type: QueryTypes.SELECT,
  }
);

if (courseChapter.length > 0) {
  return res.status(400).json({
    message: "Chapter already exists",
  });
}


      const data = await sequelize.query(
        `INSERT INTO course_chapter_${instituteNumber}
          (courseId, chapterName, chapterDuration, chapterLevel)
        VALUES (?, ?, ?, ?)`,
        {
          replacements: [
            courseId,
            chapterName,
            chapterDuration,
            chapterLevel,
          ],
          type:QueryTypes.INSERT
        }
      );

      return res.status(201).json({
        message: "Chapter created successfully",
        data,
        instituteNumber,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ====================================================
  // fetchCourseChapter
  // ====================================================
  static async fetchCourseChapter(
    req: IExtendedRequest,
    res: Response
  ) {
    try {
      const { courseId } = req.params;
      const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({
          message: "Institute number missing from token",
        });
      }

      if (!courseId) {
        return res.status(400).json({
          message: "courseId is required",
        });
      }

      // ---------------- Fetch chapters ----------------
      const chapters = await sequelize.query(
        `SELECT * FROM course_chapter_${instituteNumber} WHERE courseId = ?`,
        {
          replacements: [courseId],
          type: QueryTypes.SELECT,
        }
      );
      

      return res.status(200).json({
        message: "Course chapters fetched successfully",
        chapters,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
// ====================================================
// fetchCourseChapter
// ====================================================
static async deleteCourseChapter(req: IExtendedRequest, res: Response) {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    const { id } = req.params;

    if (!instituteNumber) {
      return res.status(400).json({
        message: "Institute number missing from token",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Chapter id is required",
      });
    }

    // Delete chapter
    await sequelize.query(
      `DELETE FROM course_chapter_${instituteNumber} WHERE id = ?`,
      {
        replacements: [id],
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      message: "Chapter deleted successfully",
      deletedId: id,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

}

export default ChapterController;
