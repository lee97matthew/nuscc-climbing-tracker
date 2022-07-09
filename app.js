// create an express app
const express = require("express");
const app = express();
const axios = require("axios");

// set port
const PORT = process.env.PORT || 5000;

// define the first route
app.get("/", (req, res) => {
  res.send("Welcome to the NUS Climbing Club Attendance Tracker!! - WIP -");
});

// open connection to NUSCCAttendanceBot
const TOKEN = "5499274329:AAGXNvB0eL7AAoF3E6UCPT2zP_MO7v54xnM";
const SERVER_URL = "https://nuscc-attendance-tracker.herokuapp.com";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const { botRequest } = require("./middlewares");

const botInit = async () => {
  // for Initializing connection to NUSCCAttendanceBot
  const result = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
  );
};

app.post(URI, async (req, res) => {
  // NUSCCAttendanceBot functions

  console.log(req.body);
//   const chatID = req.body.message.chat.id;
//   const teleID = req.body.message.chat.username;

//   if (req.body.message.text === "/update") {
//     console.log("Update Attendance Command Match");

//     // process
//     await botRequest.teleRequest({ task: "update" });
//   } else if (req.body.message.text === "/test") {
//     console.log("Test Command Match");
//     // no process
//     await botRequest.teleRequest({ task: "test" });
//   } else {
//     console.log("Command Not Matched");
//     axios.post(`${TELEGRAM_API}/sendMessage`, {
//       chat_id: chatID,
//       text:
//         "Hello " +
//         req.body.message.chat.first_name +
//         ", Please use the /update command to update the attendance.",
//     });
//   }
  return res.send();
});

// Initialize Server
app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await botInit();
});
