import cors from "cors";
import express from "express";
import {
  authenticateToken,
  AuthRequest,
  requireAdmin,
} from "./middleware/auth";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import slackRoutes from "./slack/routes";
import { initializeSlackBot } from "./slack/slackBot";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Protected route example
app.get("/api/protected", authenticateToken, (req: AuthRequest, res) => {
  res.json({
    message: "This is a protected route",
    user: { id: req.user?.id, email: req.user?.email },
  });
});

// Admin-only protected route
app.get(
  "/api/admin",
  authenticateToken,
  requireAdmin,
  (req: AuthRequest, res) => {
    res.json({ message: "This is an admin-only route" });
  }
);

// Admin routes group
app.use("/api/admin", authenticateToken, requireAdmin, adminRoutes);

// Slack routes
app.use("/api/slack", slackRoutes);

// Initialize Slack bot
initializeSlackBot().catch((error) => {
  console.error("Failed to initialize Slack bot:", error);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
