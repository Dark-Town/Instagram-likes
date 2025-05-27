// index.js
const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer");

const token = "8077337815:AAFQ38sr8TPQFrNRpGPl4HMnXT4mwMP1cfM";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/https:\/\/www\.instagram\.com\/p\/[A-Za-z0-9_-]+/, async (msg, match) => {
  const chatId = msg.chat.id;
  const instaUrl = match[0];

  bot.sendMessage(chatId, "Processing your request, please wait 60 seconds...");

  // Simulate countdown
  setTimeout(async () => {
    try {
      // Launch Puppeteer to automate like submission
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto("https://myinstafollow.com/free-instagram-likes/", {
        waitUntil: "networkidle2",
      });

      // Fill input (adjust selector as needed)
      await page.type('input[name="url"]', instaUrl);

      // Click the send/submit button
      await page.click('button[type="submit"]');

      // Wait for response (adjust delay based on behavior)
      await page.waitForTimeout(10000);

      await browser.close();
      bot.sendMessage(chatId, "Success! Likes have been sent to your post.");
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "Failed to process the request.");
    }
  }, 60000);
});

bot.on("message", (msg) => {
  if (!msg.text.includes("instagram.com")) {
    bot.sendMessage(msg.chat.id, "Please send a valid Instagram post URL.");
  }
});
