const prisma = require("../prisma/client");

//  Get all users (basic function if needed elsewhere)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

//  Get all members (users with role 'MEMBER')
exports.getAllMembers = async (req, res) => {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      select: { id: true, name: true, email: true, isActive: true },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

//  Toggle a member's active/inactive status
exports.toggleMemberStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.user.findUnique({ where: { id } });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !member.isActive },
    });

    res.json({
      message: "Member status updated",
      member: {
        id: updated.id,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update member status" });
  }
};
