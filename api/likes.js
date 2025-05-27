const puppeteer = require("puppeteer");

async function sendLikes(instaUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto("https://myinstafollow.com/free-instagram-likes/", {
      waitUntil: "networkidle2",
    });

    await page.type('input[name="url"]', instaUrl);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(10000); // wait 10s for submission

    await browser.close();
    return { success: true, message: "Likes sent." };
  } catch (err) {
    console.error("sendLikes error:", err);
    return { success: false, message: "Failed to send likes." };
  }
}

module.exports = { sendLikes };
