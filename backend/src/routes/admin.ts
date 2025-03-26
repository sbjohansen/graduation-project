import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/users", async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const adminCount = await prisma.user.count({
      where: { isAdmin: true },
    });

    res.json({
      stats: {
        totalUsers: userCount,
        adminUsers: adminCount,
        regularUsers: userCount - adminCount,
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.put("/users/:id/admin", async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isAdmin } = req.body;

    if (typeof isAdmin !== 'boolean') {
      return res.status(400).json({ error: "isAdmin must be a boolean value" });
    }

    if (req.user?.id === userId && !isAdmin) {
      return res.status(400).json({ 
        error: "You cannot remove your own admin privileges" 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user admin status:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router; 