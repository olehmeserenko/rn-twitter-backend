import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Authentication
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];
  if (!jwtToken) {
    return res.sendStatus(401);
  }
  // decode the jwt token
  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "API token expired" });
    }

    req.user = dbToken.user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
};
