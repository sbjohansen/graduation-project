import express from "express";
import { simulationController } from "../controllers/simulationController";

const router = express.Router();

// Get available scenarios
router.get("/scenarios", simulationController.getScenarios);

// Get available badges
router.get("/badges", simulationController.getAvailableBadges);

// Get all active simulations
router.get("/active", simulationController.getActiveSimulations);

// Get status of a specific simulation
router.get("/:userId/status", simulationController.getSimulationStatus);

// Start a new simulation
router.post("/start", simulationController.startSimulation);

// End an active simulation
router.post("/end", simulationController.endSimulation);

export default router;
