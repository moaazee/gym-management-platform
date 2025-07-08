const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  assignProgram,
  getMyPrograms,
} = require("../controllers/programController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { uploadFileToFirebase } = require("../utils/firebase");

// POST: Trainer ➜ Assign a program (training or meal)
router.post("/assign", verifyToken, requireRole("TRAINER"), assignProgram);

// GET: Member ➜ View their assigned programs
router.get("/mine", verifyToken, getMyPrograms);

// POST: Upload media (image/video/pdf) to Firebase
router.post(
  "/upload",
  verifyToken,
  requireRole("TRAINER"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const url = await uploadFileToFirebase(req.file);
      res.json({ url });
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
);

module.exports = router;
