import dotenv from "dotenv";

// Load environment variables
dotenv.config();

function checkBotConfig(botName: string, envPrefix: string) {
  const token = process.env[`${envPrefix}_BOT_TOKEN`];
  const signingSecret = process.env[`${envPrefix}_BOT_SIGNING_SECRET`];
  const appToken = process.env[`${envPrefix}_BOT_APP_TOKEN`];

  console.log(`\n=== Checking ${botName} Bot Configuration ===`);

  // Check token
  if (!token) {
    console.error(`❌ ${envPrefix}_BOT_TOKEN is missing`);
  } else {
    console.log(
      `✅ ${envPrefix}_BOT_TOKEN is set: ${token.substring(0, 5)}...`
    );
  }

  // Check signing secret
  if (!signingSecret) {
    console.error(`❌ ${envPrefix}_BOT_SIGNING_SECRET is missing`);
  } else {
    console.log(
      `✅ ${envPrefix}_BOT_SIGNING_SECRET is set: ${signingSecret.substring(
        0,
        5
      )}...`
    );
  }

  // Check app token
  if (!appToken) {
    console.error(`❌ ${envPrefix}_BOT_APP_TOKEN is missing`);
  } else {
    console.log(
      `✅ ${envPrefix}_BOT_APP_TOKEN is set: ${appToken.substring(0, 5)}...`
    );

    // Check if app token has the correct prefix
    if (!appToken.startsWith("xapp-")) {
      console.error(
        `⚠️ ${envPrefix}_BOT_APP_TOKEN does not start with 'xapp-'. This may be incorrect.`
      );
    }
  }

  // Overall status
  if (token && signingSecret && appToken) {
    console.log(`✅ ${botName} Bot is properly configured`);
    return true;
  } else {
    console.error(`❌ ${botName} Bot is missing configuration`);
    return false;
  }
}

// Main debug function
function debugBotConfigurations() {
  console.log("=== Bot Configuration Debug Tool ===");

  // Check CS-Bot (main bot)
  const csBot = checkBotConfig("CS", "CS");

  // Check character bots
  const peteBotStatus = checkBotConfig("Pete", "PETE");
  const hannaBotStatus = checkBotConfig("Hanna", "HANNA");
  const johnBotStatus = checkBotConfig("John", "JOHN");
  const peterBotStatus = checkBotConfig("Peter", "PETER");
  const mikeBotStatus = checkBotConfig("Mike", "MIKE");
  const lazarBotStatus = checkBotConfig("Lazar", "LAZAR");

  // Overall summary
  console.log("\n=== Summary ===");
  if (!csBot) {
    console.error(
      "❌ CS-Bot configuration is missing. This is critical as it's the main bot."
    );
    console.log(
      "- You must set CS_BOT_TOKEN, CS_BOT_SIGNING_SECRET, and CS_BOT_APP_TOKEN"
    );
  }

  const characterBots = [
    peteBotStatus,
    hannaBotStatus,
    johnBotStatus,
    peterBotStatus,
    mikeBotStatus,
    lazarBotStatus,
  ];
  const configuredBots = characterBots.filter((status) => status).length;

  console.log(
    `Character bots configured: ${configuredBots}/${characterBots.length}`
  );

  if (configuredBots === 0) {
    console.log(
      "⚠️ No character bots are configured. The simulation will still work, but CS-Bot will handle all messages."
    );
  }

  // Provide information about generating tokens
  console.log("\n=== How to Generate Missing Tokens ===");
  console.log("1. Go to https://api.slack.com/apps");
  console.log("2. Select your bot app");
  console.log(
    "3. For BOT_TOKEN: Go to 'OAuth & Permissions' and copy the 'Bot User OAuth Token'"
  );
  console.log(
    "4. For SIGNING_SECRET: Go to 'Basic Information' and copy the 'Signing Secret'"
  );
  console.log(
    "5. For APP_TOKEN: Go to 'Basic Information' > 'App-Level Tokens' > 'Generate Token and Scopes'"
  );
  console.log("   - Add 'connections:write' scope");
  console.log("   - Token should start with 'xapp-'");
}

// Run the debug tool
debugBotConfigurations();
