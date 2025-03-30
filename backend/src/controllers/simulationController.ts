import { Request, Response } from "express";
import { messageHandler } from "../slack/messageHandler";
// Import Node.js modules
import fs from "fs";
import path from "path";

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
      // --- Dynamically read scenarios ---
      const scenariosDir = path.join(__dirname, "../slack/scenarios");
      const scenarioFiles = fs
        .readdirSync(scenariosDir)
        .filter((file) => file.endsWith(".json"));

      const scenarios = scenarioFiles
        .map((file) => {
          try {
            const filePath = path.join(scenariosDir, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const scenarioData = JSON.parse(fileContent);
            // Return only the needed fields for the list
            return {
              id: scenarioData.scenarioId,
              title: scenarioData.scenarioTitle,
              description: scenarioData.scenarioDescription,
              difficulty: scenarioData.difficulty || "Unknown",
              length: scenarioData.length || "Unknown",
            };
          } catch (parseError) {
            console.error(`Error parsing scenario file ${file}:`, parseError);
            return null; // Skip files that fail to parse
          }
        })
        .filter((scenario) => scenario !== null); // Filter out nulls from failed parses

      res.status(200).json({
        success: true,
        scenarios, // Return the dynamic list
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
        scenarioId: activeScenario.scenario.scenarioId,
        scenarioTitle: activeScenario.scenario.scenarioTitle,
        scenarioDescription: activeScenario.scenario.scenarioDescription,
        initialSituation: activeScenario.scenario.initialSituation,
        overallGoal: activeScenario.scenario.overallGoal,
        businessChannelId: activeScenario.businessChannelId,
        incidentChannelId: activeScenario.incidentChannelId,
        startedAt: activeScenario.startedAt,
        keyMilestones: activeScenario.keyMilestones || [],
        awardedBadges: activeScenario.awardedBadges,
        messageHistory: activeScenario.messageHistory,
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

  /**
   * Post a message to a simulation scenario
   * @route POST /api/simulations/message
   */
  postScenarioMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, channelId, message } = req.body;

      if (!userId || !channelId || !message) {
        res.status(400).json({
          error: "Missing required fields: userId, channelId, and message",
        });
        return;
      }

      console.log(
        `Forwarding message from user ${userId} to message handler for channel ${channelId}`
      );
      // Call processUserMessage on the messageHandler instance
      // Note: MessageHandler might not expose processUserMessage directly.
      // It likely handles messages internally via its setupMessageHandling method.
      // We might need a different method on messageHandler or rethink this call.
      // FOR NOW: Assuming messageHandler.ts setup intercepts Slack messages and calls scenarioService internally.
      // IF this endpoint is meant to *manually inject* a message, messageHandler needs an explicit method for it.
      // Let's comment out the direct call for now, assuming Slack event handling is the primary path.

      // await messageHandler.processUserMessage(userId, channelId, message); // Needs verification

      // TEMP: If this endpoint MUST manually inject messages, we'd need:
      // 1. Expose scenarioService from messageHandler OR
      // 2. Add a method like `handleManualMessage` to messageHandler that calls scenarioService.processUserMessage

      res.status(200).json({
        success: true,
        message: "Message received (processing via Slack events).",
      });
    } catch (error) {
      console.error("Error in postScenarioMessage endpoint:", error);
      res.status(500).json({ error: "Failed to handle message posting" });
    }
  },
};
