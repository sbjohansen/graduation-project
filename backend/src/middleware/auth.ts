import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("WARNING: JWT_SECRET is not set in environment variables");
}

export interface AuthRequest extends Request {
  user?: { id: number; email: string; isAdmin: boolean };
}

// General authentication middleware
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: number; 
      email: string; 
      isAdmin: boolean;
    };

    // Verify user exists in database
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Set user on request
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Admin-specific middleware
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // First authenticate the token
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Double-check admin status from database (not just from token)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
