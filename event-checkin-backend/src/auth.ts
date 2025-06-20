import jwt from 'jsonwebtoken';

export const generateToken = (user: { id: string; name: string; email: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

export const getUserFromToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};
