const axios = require("axios");
const TOKEN = process.env.TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

teleRequest = (req, res) => {
  if (req) {
    console.log("teleRequest for " + req.telegramHandle);
  }

  // Update attendance for previous week
  if (req.task === "update") {
    // Update

    // Successful update
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: req.chatID,
      text:
        "Attendance has been updated.",
    });
  } else if (req.task === "test") {
    // No task
    axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: req.chatID,
        text:
          "There is no functionality here yet.",
      });
  }
};

const botRequest = {
    teleRequest
};

module.exports = botRequest;