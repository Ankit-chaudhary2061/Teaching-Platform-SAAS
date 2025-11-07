import jwt from 'jsonwebtoken';

const generateJwtToken = (data: { 
  id: string;
  instituteNumber?: string;
}) => {
  const token = jwt.sign(
    data,                                 // 👈 direct payload (no extra nesting)
    process.env.SECRET_KEY as string,
    { expiresIn: '30d' }
  );
  return token;
};

export default generateJwtToken;
