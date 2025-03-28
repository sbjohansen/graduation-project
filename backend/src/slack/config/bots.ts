import { BotConfig } from "../types/botConfig";

export const botConfigs: BotConfig[] = [
  {
    id: "cs-bot",
    name: "CS-Bot",
    botToken: process.env.CS_BOT_TOKEN || "",
    signingSecret: process.env.CS_BOT_SIGNING_SECRET || "",
    appToken: process.env.CS_BOT_APP_TOKEN || "",
    role: "system",
    personality: "professional",
    avatar: process.env.CS_BOT_AVATAR || "",
    description:
      "A professional system bot focused on maintaining order and providing consistent support across the platform.",
  },
  {
    id: "hanna",
    name: "Hanna",
    botToken: process.env.HANNA_BOT_TOKEN || "",
    signingSecret: process.env.HANNA_BOT_SIGNING_SECRET || "",
    appToken: process.env.HANNA_BOT_APP_TOKEN || "",
    role: "incident_responder",
    personality: "analytical",
    avatar: process.env.HANNA_BOT_AVATAR || "",
    description:
      "An analytical incident response specialist who excels at breaking down complex security issues and coordinating effective responses.",
  },
  {
    id: "john",
    name: "John",
    botToken: process.env.JOHN_BOT_TOKEN || "",
    signingSecret: process.env.JOHN_BOT_SIGNING_SECRET || "",
    appToken: process.env.JOHN_BOT_APP_TOKEN || "",
    role: "security_analyst",
    personality: "methodical",
    avatar: process.env.JOHN_BOT_AVATAR || "",
    description:
      "A methodical security analyst who approaches threats with systematic precision and thorough investigation.",
  },
  {
    id: "pete",
    name: "Pete Mitchel",
    botToken: process.env.PETE_BOT_TOKEN || "",
    signingSecret: process.env.PETE_BOT_SIGNING_SECRET || "",
    appToken: process.env.PETE_BOT_APP_TOKEN || "",
    role: "ceo",
    personality: "business",
    avatar: process.env.PETE_BOT_AVATAR || "",
    description:
      "A business-oriented CEO bot focused on strategic decision-making and maintaining organizational vision.",
  },
  {
    id: "peter",
    name: "Peter",
    botToken: process.env.PETER_BOT_TOKEN || "",
    signingSecret: process.env.PETER_BOT_SIGNING_SECRET || "",
    appToken: process.env.PETER_BOT_APP_TOKEN || "",
    role: "network_engineer",
    personality: "detail-oriented",
    avatar: process.env.PETER_BOT_AVATAR || "",
    description:
      "A detail-oriented network engineer who ensures robust infrastructure and optimal network performance.",
  },
  {
    id: "mike",
    name: "Mike",
    botToken: process.env.MIKE_BOT_TOKEN || "",
    signingSecret: process.env.MIKE_BOT_SIGNING_SECRET || "",
    appToken: process.env.MIKE_BOT_APP_TOKEN || "",
    role: "security_engineer",
    personality: "proactive",
    avatar: process.env.MIKE_BOT_AVATAR || "",
    description:
      "A proactive security engineer who anticipates threats and implements preventive measures to protect systems.",
  },
  {
    id: "lazar",
    name: "Lazar",
    botToken: process.env.LAZAR_BOT_TOKEN || "",
    signingSecret: process.env.LAZAR_BOT_SIGNING_SECRET || "",
    appToken: process.env.LAZAR_BOT_APP_TOKEN || "",
    role: "software_engineer",
    personality: "investigative",
    avatar: process.env.LAZAR_BOT_AVATAR || "",
    description:
      "An investigative software engineer who digs deep into code issues and develops innovative solutions.",
  },
];
