// create an express app
const express = require("express");
const cors = require("cors");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const axios = require("axios");

require("dotenv").config();
const app = express();

// set port
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define the first route
app.get("/", (req, res) => {
  res.send("Welcome to the NUS Climbing Club Attendance Tracker!! - WIP -");
});

// open connection to NUSCCAttendanceBot
const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

console.log("web hook url is + " + WEBHOOK_URL);

const { botRequest } = require("./middlewares");

const botInit = async () => {
  // for Initializing connection to NUSCCAttendanceBot
  const result = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
  );
  console.log(result.data);
};

const doc = new GoogleSpreadsheet(
  "1kWMyeS0YVZzjXV_Nft_dtbnZ9xjC9_GFNMAyPeYmFNw"
);
console.log("doc iniitalized");

const sheetInit = async () => {
  console.log("enter sheetInit");

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  console.log("leave sheetInit");
};

app.post(URI, async (req, res) => {
  // NUSCCAttendanceBot functions
  // console.log("Enter async functions");
  console.log(req.body);
  const chatID = req.body.message.chat.id;
  const teleID = req.body.message.chat.username;

  if (req.body.message.text == "/update") {
    console.log("Update Attendance Command Match");

    // process
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", Please type 'update xx' to update the attendance." +
        "\n" +
        "For example, 'update 1' to update week 1",
    });
  } else if (req.body.message.text == "/generate") {
    console.log("Generate Command Match");
    console.log("look to add to document : " + doc.title);
    // process

    const masterSheet = doc.sheetsByTitle['AY22/23 Sem 1'];
    console.log("master sheet title is " + masterSheet.title);
    console.log("master sheet row count is " + masterSheet.rowCount);

    const rows = await masterSheet.getRows();
    console.log(rows[6].name);
    console.log(rows[6].newMember);
    console.log(rows[6].wk1);

  } else {
    // check if its an update command

    const str = JSON.stringify(req.body.message.text);
    // console.log("str is " + str);
    // console.log("str length " + str.length);
    // console.log("str includes update " + str.includes("update"));
    
    if (str.length > 5 && str.includes("update")) {
      const cmd = str.split(" ");

      // get week number
      const weekNo = cmd[1].slice(0,cmd[1].length-1);
      console.log("week number to update is " + weekNo);

      // do update

    } else {
      // no command
      console.log("Command Not Matched");

      axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text:
          "Hello " +
          req.body.message.chat.first_name +
          ", Please use the /update command to update the attendance.",
      });
    }
  }
  return res.send();
});

// Initialize Server
app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await botInit();
  setTimeout(() => {
    sheetInit();
  }, 3000);
});
