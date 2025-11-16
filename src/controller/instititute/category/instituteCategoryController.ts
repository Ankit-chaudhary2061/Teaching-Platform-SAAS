import { Response } from "express";
import { IExtendedRequest } from "../../../middleWare/type.ts";
import sequelize from "../../../database/connection.ts";
import { QueryTypes } from "sequelize";
// import { SELECT } from "sequelize/lib/query-types";


class CategoryController {
static async createCategory(req:IExtendedRequest, res:Response){
    try {
          const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }
    const {categoryName, categoryDescription} = req.body
    if(!categoryName || !categoryDescription){
        return res.status(400).json({
            message :'please provide me catrgory name and category description'
        })
    }
     await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName, categoryDescription
      ) VALUES(?,?)`,{
        replacements:[categoryName, categoryDescription],
        type:QueryTypes.INSERT
      }
      )
   const [categoryData]: {id:string, createdAt: Date}[] = await sequelize.query(
  `SELECT id, createdAt FROM category_${instituteNumber} WHERE categoryName = ?`,
  {
    replacements: [categoryName],
    type: QueryTypes.SELECT
  }
);

if (!categoryData) {
  return res.status(404).json({ message: "Category not found" });
}

res.status(200).json({
  message: 'Category added successfully',
  data: {
    categoryName,
    categoryDescription,
    id: categoryData.id,
    createdAt: categoryData.createdAt
  }
});

    } catch (error : any) {
         console.error('Create category error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack
    })}
}

static async getAllCategories(req:IExtendedRequest,res:Response){
  try {
     const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }
    const categories = await sequelize.query(` SELECT * FROM category_${instituteNumber}`,{
      type:QueryTypes.SELECT
    })
     res.status(200).json({
        message:'category fetched sucessfully',
        data: categories,
        instituteNumber
      })

  } catch (error : any) {
    console.error('fetch category error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack
    })
  }

}
static async deletelCategories(req:IExtendedRequest,res:Response){
  try {
     const instituteNumber = req.user?.currentInstituteNumber;

      if (!instituteNumber) {
        return res.status(400).json({ message: "Institute number is missing" });
      }
      const id = req.params.id
     await sequelize.query(` DELETE FROM category_${instituteNumber } WHERE id = ?`, {
      replacements:[id],
      type: QueryTypes.DELETE
     })
     res.status(200).json({
        message:'category delete sucessfully',
        
      })

  } catch (error : any) {
    console.error('delete category error:', error);
      return res.status(500).json({
        message: 'Server error',
         error: error.message,
        fullError: error,
        stack: error.stack
    })
  }

}

}

export default CategoryController
