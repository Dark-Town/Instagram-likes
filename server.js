const express = require("express");
const bodyParser = require("body-parser");
const { sendLikes } = require("./api/likes");

const app = express();
app.use(bodyParser.json());

app.post("/api/send-likes", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ success: false, message: "Invalid Instagram URL." });
  }

  const result = await sendLikes(url);
  res.json(result);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
