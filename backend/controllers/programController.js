const prisma = require("../prisma/client");

// Trainer assigns a program to a member
exports.assignProgram = async (req, res) => {
  try {
    const { title, description, userId, mediaUrl, type } = req.body;

    console.log("📦 Assign Program Payload:", req.body); // Debug incoming data

    //  Normalize type input (e.g., "training" ➜ "TRAINING")
    const normalizedType = type?.toUpperCase();

    // Check for required fields
    if (!title || !userId || !normalizedType) {
      return res.status(400).json({ error: "Missing required fields: title, userId, or type" });
    }

    // Validate enum manually (just in case)
    const validTypes = ["TRAINING", "MEAL"];
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid type. Must be TRAINING or MEAL" });
    }

    // Create the program
    const program = await prisma.program.create({
      data: {
        title,
        description: description || "",
        contentUrl: mediaUrl || "", 
        type: normalizedType,
        userId,
      },
    });

    console.log(" Program assigned:", program);
    res.status(201).json(program);
  } catch (error) {
    console.error(" Failed to assign program:", error.message, error);
    res.status(500).json({ error: "Failed to assign program", details: error.message });
  }
};

// Member fetches their own assigned programs
exports.getMyPrograms = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(programs);
  } catch (error) {
    console.error("Failed to fetch programs:", error.message, error);
    res.status(500).json({ error: "Failed to fetch programs", details: error.message });
  }
};
