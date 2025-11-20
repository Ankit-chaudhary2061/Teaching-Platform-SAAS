import { Request, Response } from "express";
import sequelize from "../../../database/connection.ts";
import { QueryTypes } from "sequelize";



const  instituteListForStudent = async(req:Request,res:Response)=>{

  try {
   const tables = await sequelize.query(`SHOW TABLES LIKE 'institute_%'`,{
    type : QueryTypes.SHOWTABLES
  })
//   console.log(tables,"Tables") institute_111017, institute_123123
  let allDatas = []
 for(let table of tables){
    console.log(table)
    // table --> institute_1234,institute_3434, 
    const instituteNumber = table.split("_")[1]
   const [data] =  await sequelize.query(`SELECT instituteName, institutePhoneNumber FROM ${table}`,{
        type : QueryTypes.SELECT
    })

    allDatas.push({instituteNumber : instituteNumber,...data})
 }
  res.status(200).json({
    message : "data fetched", data : allDatas
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

const instituteCourseListForStudent = async(req:Request, res: Response ) =>{
  try {
    const {instituteId} =  req.params

   const datas  = await sequelize.query(`SELECT co.id as courseId,co.courseName,co.courseDescription,co.coursePrice,cat.id,cat.categoryName FROM course_${instituteId} AS co JOIN category_${instituteId} AS cat ON co.categoryId = cat.id`,
      {
         type:QueryTypes.SELECT
      }
   )
   if(datas.length == 0){
      res.status(400).json({
         message:'no course found'
      })
   }else{
      res.status(200).json({
         message:'course fetched',
         data : datas
      })
   }
  } catch (error:any)  {
    console.error('Create course error:', error);
      return res.status(500).json({
        message: 'Server error',
       fullError: error, 
        stack: error.stack
      })
  }
}


export {instituteCourseListForStudent,instituteListForStudent}