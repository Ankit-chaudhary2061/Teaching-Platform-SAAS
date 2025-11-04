import bcrypt from 'bcrypt'


const generateRandomPassword =( teacherName : string)=>{
 const randomNumber =  Math.floor( 1000 + Math.random() * 90000)
 const passwordData = {
    hashedVersion:bcrypt.hashSync(`${randomNumber}_${teacherName}`, 12),
    plainnedVersion :` ${randomNumber}_${teacherName}`
 }
 return passwordData
}

export default generateRandomPassword