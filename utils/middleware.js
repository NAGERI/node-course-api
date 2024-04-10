import { StatusCodes } from 'http-status-codes'

function isAdmin(req,res,next) {
   if(res.tokenData.user_role !== 'ADMIN')
     return res.status(StatusCodes.FORBIDDEN).json({message:'Access denied, Not Admin'});
    next();
  
}


function isStudent(req,res,next) {
  if(res.tokenData.user_role !== 'STUDENT')
     return res.status(StatusCodes.FORBIDDEN).json({message:'Access denied, Not Student'});
    next();
}


function isTeacher(req,res,next) {
  if(res.tokenData.user_role !== 'TEACHER')
     return res.status(StatusCodes.FORBIDDEN).json({message:'Access denied, Not Teacher'});
    next();
}

export {isAdmin, isStudent, isTeacher}