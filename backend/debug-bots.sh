#!/bin/bash

echo "=== Bot Configuration Debug Tool ==="
echo ""
echo "This script will help you debug your Slack bot configuration."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ No .env file found. Please create one."
  echo "Creating a sample .env file..."
  
  cat > .env.sample <<EOL
# CS-Bot Configuration (REQUIRED)
CS_BOT_TOKEN=xoxb-your-bot-token
CS_BOT_SIGNING_SECRET=your-signing-secret
CS_BOT_APP_TOKEN=xapp-your-app-token

# Character Bots (OPTIONAL)
PETE_BOT_TOKEN=xoxb-pete-token
PETE_BOT_SIGNING_SECRET=pete-signing-secret
PETE_BOT_APP_TOKEN=xapp-pete-app-token

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini-2025-04-14
OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
OPENAI_MAX_RETRIES=3
OPENAI_RETRY_DELAY=1000

# Server Configuration
PORT=3000
EOL
  
  echo "✅ Created .env.sample file. Please rename it to .env and fill in your credentials."
  exit 1
fi

# Run the debugBots.ts script
npx ts-node src/debugBots.ts

echo ""
echo "=== Instructions ==="
echo "If you're missing CS_BOT tokens, you need to:"
echo "1. Go to https://api.slack.com/apps"
echo "2. Select your CS-Bot app (or create one)"
echo "3. Under Basic Information, find your Signing Secret"
echo "4. Under OAuth & Permissions, install the app to your workspace and get the Bot User OAuth Token"
echo "5. Under Basic Information > App-Level Tokens, generate a token with 'connections:write' scope"
echo ""
echo "Add these to your .env file as:"
echo "CS_BOT_TOKEN=xoxb-your-bot-token"
echo "CS_BOT_SIGNING_SECRET=your-signing-secret"
echo "CS_BOT_APP_TOKEN=xapp-your-app-token"
echo ""
echo "For help, please refer to the Slack API documentation: https://api.slack.com/start" 