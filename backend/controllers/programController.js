const prisma = require("../prisma/client");

// Assign a structured program
exports.assignProgram = async (req, res) => {
  try {
    const { title, description, userId, type, items } = req.body;
    const normalizedType = type?.toUpperCase();

    if (!title || !userId || !normalizedType || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing required fields or items must be an array" });
    }

    const validTypes = ["TRAINING", "MEAL"];
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid type. Must be TRAINING or MEAL" });
    }

    // Mark previous as not latest
    await prisma.program.updateMany({
      where: { memberId: userId, type: normalizedType, isLatest: true },
      data: { isLatest: false },
    });

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 14);

    const program = await prisma.program.create({
      data: {
        title,
        description: description || "",
        type: normalizedType,
        memberId: userId,
        startDate: now,
        endDate,
        isLatest: true,
        programItems: {
          create: items.map((item) => ({
            title: item.title,
            description: item.description || "",
            mediaUrl: item.mediaUrl || "",
          })),
        },
      },
      include: { programItems: true, member: true },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error("Failed to assign program:", error);
    res.status(500).json({ error: "Failed to assign program", details: error.message });
  }
};

// Get member's programs (new/past)
exports.getMyPrograms = async (req, res) => {
  try {
    const allPrograms = await prisma.program.findMany({
      where: { memberId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { programItems: true },
    });

    const newPrograms = allPrograms.filter((p) => p.isLatest);
    const oldPrograms = allPrograms.filter((p) => !p.isLatest);

    res.json({ newPrograms, oldPrograms });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    res.status(500).json({ error: "Failed to fetch programs", details: error.message });
  }
};
