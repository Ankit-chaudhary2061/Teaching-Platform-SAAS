import { Request } from "express";

export enum UserRole{
Teacher = 'teacher',
Student = 'student',
Institute = 'institute',
SuperAdmin = 'superadmin'
}

export interface IExtendedRequest extends Request {
  user?: {
    id: string;
    currentInstituteNumber?: string | number;
    role:UserRole
  };
  
}
