import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { sendEmailToken } from "../services/emailService";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

const router = Router();
const prisma = new PrismaClient();

const generateAuthToken = (tokenId: number) => {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
};

const generateEmailToken = () =>
  Math.floor(10000000 + Math.random() * 90000000).toString();

// Create a user, if it doesn't exist, generate the emailToken and send it to the user's email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });
    console.log(createdToken);
    await sendEmailToken(email, emailToken);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong!" });
  }
});

// Validate the emailToken and generate a long-lived JWT token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: { user: true },
  });

  if (!dbEmailToken || !dbEmailToken.valid) return res.sendStatus(401);

  if (dbEmailToken.expiration < new Date())
    return res.status(401).json({ error: "Token expired!" });

  if (dbEmailToken?.user?.email !== email) return res.sendStatus(401);

  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: { connect: { email } },
    },
  });

  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;
