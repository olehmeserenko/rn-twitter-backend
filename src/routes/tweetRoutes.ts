import { Router } from "express";

const router = Router();

// Tweet CRUD

// Create tweet
router.post("/", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

// Tweets list
router.get("/", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

// Get one tweet
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not implemented ${id}` });
});

// Update tweet
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not implemented ${id}` });
});

// Delete tweet
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not implemented ${id}` });
});

export default router;
