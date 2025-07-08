const prisma = require("../prisma/client");

// Trainer assigns a structured program with multiple items
exports.assignProgram = async (req, res) => {
  try {
    const { title, description, userId, type, items } = req.body;

    console.log("Assign Program Payload:", req.body);

    const normalizedType = type?.toUpperCase();

    if (!title || !userId || !normalizedType || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing required fields or items must be an array" });
    }

    const validTypes = ["TRAINING", "MEAL"];
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid type. Must be TRAINING or MEAL" });
    }

    const program = await prisma.program.create({
      data: {
        title,
        description: description || "",
        type: normalizedType,
        userId,
        items: {
          create: items.map((item) => ({
            name: item.title, 
            description: item.description || "",
            mediaUrl: item.mediaUrl || "",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error("Failed to assign program:", error);
    res.status(500).json({ error: "Failed to assign program", details: error.message });
  }
};

// Member fetches their own assigned programs including items
exports.getMyPrograms = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    res.json(programs);
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    res.status(500).json({ error: "Failed to fetch programs", details: error.message });
  }
};
