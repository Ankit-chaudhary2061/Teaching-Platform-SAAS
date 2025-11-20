import { Response } from "express";
import { IExtendedRequest } from "../../../middleWare/type.ts";
import sequelize from "../../../database/connection.ts";
import { QueryTypes } from "sequelize";




class CartController{
    static async insertIntoCartTableOfStudent(req:IExtendedRequest,res:Response){
        const userId=req.user?.id
        // const newUserId = userId?.split('-').join('_')
        const {instituteId,courseId}=req.body
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_cart_${userId}(
     
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
            courseId VARCHAR(36) REFERENCES course_${instituteId}(id),
            instituteId VARCHAR(36) REFERENCES institute_${instituteId}(id), 
            userId VARCHAR(36) REFERENCES users (id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
              updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
       await sequelize.query(`INSERT INTO student_cart_${userId}(courseId,instituteId ,userId) VALUES(?,?,?)`,{
        type : QueryTypes.INSERT, 
        replacements : [courseId,instituteId,userId]
    })
    res.status(200).json({
        message : "Course added to cart"
    })

        
    }
    static async fetchStudentCartItems(req:IExtendedRequest,res:Response){
        const userId=req.user?.id
       
    let cartDatas = []
    const datas :{instituteId : string, courseId : string}[] = await sequelize.query(`SELECT courseId,instituteId FROM student_cart_${userId} WHERE userId=?`,{
        type : QueryTypes.SELECT, 
        replacements : [userId]
    })
    
    
    for(let data of datas){
        //69237346-4d84-11f0-ad8d-3e73c3890034
    const test =  await sequelize.query(`SELECT * FROM course_${data.instituteId} JOIN category_${data.instituteId} ON course_${data.instituteId}.categoryId = category_${data.instituteId}.id WHERE id='${data.courseId}'`,{
        type : QueryTypes.SELECT
    })
    console.log(test)
    cartDatas.push(...test)
    }
    res.status(200).json({
        message : "Cart fetchd", data : cartDatas
    })



        
    }
 static async deleteStudentCartItem(req: IExtendedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const cartItemId = req.params.id; 

            if (!cartItemId) {
                return res.status(400).json({
                    message: "Cart item ID is required",
                });
            }

            await sequelize.query(
                `DELETE FROM student_cart_${userId} WHERE id = ?`,
                {
                    type: QueryTypes.DELETE,
                    replacements: [cartItemId],
                }
            );

            res.status(200).json({
                message: "Item deleted successfully",
            });

        } catch (error) {
            console.error("Delete cart error:", error);
            res.status(500).json({ message: "Server error while deleting cart item", error });
        }
    }

}

export default CartController