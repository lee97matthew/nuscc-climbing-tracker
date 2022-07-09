// create an express app
const express = require("express");
const app = express();
const axios = require("axios");

// set port
let port = process.env.PORT || 3000;

// define the first route
app.get("/", (req, res) => {
  res.send("Welcome to the NUS Climbing Club Attendance Tracker!! - WIP -");
});

// open connection to NUSCCAttendanceBot
const TOKEN = process.env.TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const { botRequest } = require("./middleware");

const botInit = async () => {
  // for Initializing connection to NUSCCAttendanceBot
  const result = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
  );
};

app.post(URI, async (req, res) => {
  // NUSCCAttendanceBot functions
  const chatID = req.body.message.chat.id;
  const teleID = req.body.message.chat.username;

  if (req.body.message.text === "/update") {
    console.log("Update Attendance Command Match");

    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", Update is being processed, please wait.",
    });
    // process
    // await botRequest.teleRequest({ task: "update" });
  } else if (req.body.message.text === "/test") {
    console.log("Test Command Match");
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", There is no functionality here yet.",
    });

    // no process
    // await botRequest.teleRequest({ task: "test" });
  } else {
    console.log("Command Not Matched");
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", Please use the /update command to update the attendance.",
    });
  }
  return res.send();
});

// start the server listening for requests
app.listen(port, () => {
  console.log("Server is running!!");
});
