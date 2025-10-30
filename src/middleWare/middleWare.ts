import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import User from "../database/model/userModels.ts"
import { IExtendedRequest } from "./type.ts"

class MiddleWare{
    static async isLogedIn(req:IExtendedRequest, res:Response, next:NextFunction){

       const token = req.headers.authorization;
        if(!token){
            return res.status(400).json({
                message:"Please provide me  Token"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY as string, async(error, decoded:any)=>{
            if(error){
                res.status(401).json({
                    message:'Invalid Token'
                })
            }else{
                console.log(decoded)
             const data=  await  User.findOne({
                    where:{
                        id:decoded.id 
                    }
                })
                if(!data){
                     res.status(401).json({
                     message: "User no longer exists. Please login again."
                 });
                }else{
                    req.user = data
                    next()
                }
            }
        })
      
    }
}


export default MiddleWare