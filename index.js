const TelegramBot = require("node-telegram-bot-api");
const { sendLikes } = require("./api/likes");
const token = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

const requiredChannel = "@paidtechzone";
const logChannel = "@deployed_bots";

// Helper: Check if user is in required channel
async function isUserInChannel(userId) {
  try {
    const status = await bot.getChatMember(requiredChannel, userId);
    return ["member", "creator", "administrator"].includes(status.status);
  } catch (e) {
    return false;
  }
}

// Start command with buttons
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const joined = await isUserInChannel(chatId);
  if (!joined) {
    return bot.sendMessage(chatId, "Please join our channel first: " + requiredChannel);
  }

  bot.sendMessage(chatId, "Welcome! Choose an option below:\n- TCRONEB HACKX", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Instagram", callback_data: "instagram" },
          { text: "Telegram", callback_data: "telegram" }
        ],
        [
          { text: "TikTok", callback_data: "tiktok" },
          { text: "YouTube", callback_data: "youtube" }
        ]
      ]
    }
  });
});

// Handle button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  if (data === "instagram") {
    bot.sendMessage(chatId, "Send me your Instagram post URL.\n- TCRONEB HACKX");
  } else {
    bot.sendMessage(chatId, `${data.charAt(0).toUpperCase() + data.slice(1)} feature coming soon.\n- TCRONEB HACKX`);
  }
});

// Handle Instagram URLs
bot.onText(/https:\/\/www\.instagram\.com\/p\/[A-Za-z0-9_-]+/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const instaUrl = match[0];

  const joined = await isUserInChannel(chatId);
  if (!joined) {
    return bot.sendMessage(chatId, "You must join our channel first: " + requiredChannel);
  }

  bot.sendMessage(chatId, "Processing your request, please wait 60 seconds...\n- TCRONEB HACKX");

  setTimeout(async () => {
    const result = await sendLikes(instaUrl);
    bot.sendMessage(chatId, result.message + "\n- TCRONEB HACKX");

    // Log to admin channel
    bot.sendMessage(logChannel, `User: @${msg.from.username || msg.from.id} sent IG URL:\n${instaUrl}`);
  }, 60000);
});

// Fallback for invalid messages
bot.on("message", (msg) => {
  if (!msg.text.includes("instagram.com") && !msg.text.startsWith("/start")) {
    bot.sendMessage(msg.chat.id, "Please send a valid Instagram post link.\n- TCRONEB HACKX");
  }
});
