import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./auth"; // make sure this points to your correct file

const prisma = new PrismaClient();

export const createContext = ({ req, io }: { req: any; io: any }) => {
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  const user = getUserFromToken(token);

  console.log("✅ Decoded user from token:", user);

  return {
    prisma,
    user,
    io,
  };
};
