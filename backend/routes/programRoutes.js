const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  assignProgram,
  getMyPrograms,
} = require("../controllers/programController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { uploadFileToFirebase } = require("../utils/firebase");

// POST: Trainer ➜ Assign a program
router.post("/assign", verifyToken, requireRole("TRAINER"), assignProgram);

// GET: Member ➜ View their own programs
router.get("/mine", verifyToken, getMyPrograms);


router.get("/member/:id/programs", verifyToken, async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { memberId: req.params.id },
      include: {
        programItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const newPrograms = programs.filter((p) => p.isLatest);
    const oldPrograms = programs.filter((p) => !p.isLatest);

    res.json({ newPrograms, oldPrograms });
  } catch (err) {
    console.error("Failed to fetch programs:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// POST: Upload file to Firebase
router.post(
  "/upload",
  verifyToken,
  requireRole("TRAINER"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const url = await uploadFileToFirebase(req.file);
      res.json({ url });
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
);

module.exports = router;
