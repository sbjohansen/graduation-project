import { Request, Response } from "express";
import { messageHandler } from "../slack/messageHandler";

export const simulationController = {
  /**
   * Start a new simulation scenario
   * @route POST /api/simulations/start
   */
  startSimulation: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userEmail, scenarioId } = req.body;

      if (!userEmail || !scenarioId) {
        res
          .status(400)
          .json({ error: "Missing required fields: userEmail and scenarioId" });
        return;
      }

      console.log(
        `Starting simulation for ${userEmail} with scenario ${scenarioId}`
      );
      const channelInfo = await messageHandler.startScenario(
        userEmail,
        scenarioId
      );

      // Format the response with readable channel names
      const formattedChannelInfo = {
        ...channelInfo,
        businessChannelName: `business-${scenarioId}`,
        incidentChannelName: `incident-${scenarioId}`,
      };

      console.log(
        `Simulation started successfully: ${JSON.stringify(
          formattedChannelInfo
        )}`
      );
      res.status(201).json({
        success: true,
        message: "Simulation started successfully",
        channelInfo: formattedChannelInfo,
      });
    } catch (error) {
      console.error("Error starting simulation:", error);
      res.status(500).json({ error: "Failed to start simulation" });
    }
  },

  /**
   * End an active simulation
   * @route POST /api/simulations/end
   */
  endSimulation: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Missing required field: userId" });
        return;
      }

      await messageHandler.endScenario(userId);

      res.status(200).json({
        success: true,
        message: "Simulation ended successfully",
      });
    } catch (error) {
      console.error("Error ending simulation:", error);
      res.status(500).json({ error: "Failed to end simulation" });
    }
  },

  /**
   * List available scenarios
   * @route GET /api/simulations/scenarios
   */
  getScenarios: async (req: Request, res: Response): Promise<void> => {
    try {
      // This is a simplified implementation.
      // In a real app, you'd likely fetch this from a database
      // or dynamically read from the file system
      const scenarios = [
        {
          id: "drill-1",
          title: "Jeff's Big Day!",
          description:
            "Handle a cybersecurity incident during a major product launch",
        },
        // Add more scenarios here as needed
      ];

      res.status(200).json({
        success: true,
        scenarios,
      });
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  },

  /**
   * Get active simulation status
   * @route GET /api/simulations/:userId/status
   */
  getSimulationStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        res.status(400).json({ error: "Missing required parameter: userId" });
        return;
      }

      const activeScenario = messageHandler.getActiveScenario(userId);

      if (!activeScenario) {
        res.status(404).json({
          success: false,
          message: "No active simulation found for the specified user",
        });
        return;
      }

      res.status(200).json({
        success: true,
        status: {
          scenarioId: activeScenario.scenario.scenarioId,
          scenarioTitle: activeScenario.scenario.scenarioTitle,
          currentStep: activeScenario.currentStep,
          totalSteps: activeScenario.scenario.steps.length,
          startedAt: activeScenario.startedAt,
          completedObjectives: activeScenario.completedObjectives,
          awardedBadges: activeScenario.awardedBadges,
          channels: {
            business: activeScenario.businessChannelId,
            incident: activeScenario.incidentChannelId,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching simulation status:", error);
      res.status(500).json({ error: "Failed to fetch simulation status" });
    }
  },

  /**
   * Get available badges
   * @route GET /api/simulations/badges
   */
  getAvailableBadges: async (req: Request, res: Response): Promise<void> => {
    try {
      // This could be loaded from a database or configuration file
      const badges = [
        {
          id: "great-communicator",
          name: "Great Communicator",
          description:
            "Awarded for consistently providing clear updates to the business team.",
        },
        {
          id: "innovative-problem-solver",
          name: "Innovative Problem-Solver",
          description:
            "Awarded for finding creative solutions to challenging incidents.",
        },
        {
          id: "quick-responder",
          name: "Quick Responder",
          description:
            "Awarded for rapid initial response and containment actions.",
        },
      ];

      res.status(200).json({
        success: true,
        badges,
      });
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  },

  /**
   * List all active simulations
   * @route GET /api/simulations/active
   */
  getActiveSimulations: async (req: Request, res: Response): Promise<void> => {
    try {
      const activeSimulations = messageHandler.getAllActiveScenarios();

      const formattedSimulations = activeSimulations.map((sim) => ({
        userId: sim.userId,
        userEmail: sim.userEmail,
        scenarioId: sim.scenario.scenarioId,
        scenarioTitle: sim.scenario.scenarioTitle,
        currentStep: sim.currentStep,
        startedAt: sim.startedAt,
        businessChannelId: sim.businessChannelId,
        incidentChannelId: sim.incidentChannelId,
      }));

      res.status(200).json({
        success: true,
        count: formattedSimulations.length,
        simulations: formattedSimulations,
      });
    } catch (error) {
      console.error("Error fetching active simulations:", error);
      res.status(500).json({ error: "Failed to fetch active simulations" });
    }
  },
};
