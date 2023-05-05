import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

// USER CRUD

// Create user
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I am new here!",
      },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Username and email should be unique!" });
  }
});

// Users list
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();

  res.json(allUsers);
});

// Get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
 });

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  res.json(user);
});

// Update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, image, name } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, image, name },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: `Failed to update the user` });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(400).json({ error: `Failed to delete the user` });
  }
});

export default router;
