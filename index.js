const TelegramBot = require("node-telegram-bot-api");
const { sendLikes } = require("./api/likes");

const token = "8077337815:AAFQ38sr8TPQFrNRpGPl4HMnXT4mwMP1cfM";
const bot = new TelegramBot(token, { polling: true });

const requiredChannel = "@paidtechzone";
const logChannel = "@deployed_bots";

// Check if user joined
async function isUserInChannel(userId) {
  try {
    const status = await bot.getChatMember(requiredChannel, userId);
    return ["creator", "administrator", "member"].includes(status.status);
  } catch {
    return false;
  }
}

// /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const joined = await isUserInChannel(userId);
  if (!joined) {
    return bot.sendMessage(chatId, `Please join our channel first: ${requiredChannel}`);
  }

  // Send welcome video
  await bot.sendVideo(chatId, "https://example.com/welcome.mp4", {
    caption: "Welcome to Insta Likes Bot!\n- TCRONEB HACKX"
  });

  // Send buttons
  await bot.sendMessage(chatId, "Choose an option below:\n- TCRONEB HACKX", {
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
    bot.sendMessage(chatId, "Please send your Instagram post link.\n- TCRONEB HACKX");
  } else {
    bot.sendMessage(chatId, `${data} support coming soon.\n- TCRONEB HACKX`);
  }
});

// Handle Instagram links
bot.onText(/https:\/\/www\.instagram\.com\/p\/[A-Za-z0-9_-]+/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const instaUrl = match[0];

  const joined = await isUserInChannel(userId);
  if (!joined) {
    return bot.sendMessage(chatId, `Please join our channel first: ${requiredChannel}`);
  }

  bot.sendMessage(chatId, "Please wait 60 seconds...\n- TCRONEB HACKX");

  setTimeout(async () => {
    const result = await sendLikes(instaUrl);
    bot.sendMessage(chatId, result.message + "\n- TCRONEB HACKX");

    bot.sendMessage(logChannel, `@${msg.from.username || userId} used the bot:\n${instaUrl}`);
  }, 60000);
});

// Fallback for other messages
bot.on("message", (msg) => {
  if (!msg.text.startsWith("/start") && !msg.text.includes("instagram.com")) {
    bot.sendMessage(msg.chat.id, "Please send a valid Instagram post URL.\n- TCRONEB HACKX");
  }
});
