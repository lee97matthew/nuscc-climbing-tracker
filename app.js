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
    // /update command
    console.log("Update Attendance Command Match");

    // process
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", Please type 'update xx' to update the attendance." +
        "\n" +
        "For example, 'update 1' to update week 1.",
    });
  } else if (req.body.message.text == "/generate") {
    // /generate command
    console.log("Generate Command Match");
    console.log("look to add to document : " + doc.title);

    // process
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text:
        "Hello " +
        req.body.message.chat.first_name +
        ", Please type 'generate sXwY' to create a signup sheet." +
        "\n" +
        "For example, 'generate s1w7' for sem 1 week 7.",
    });

    // backup code for sheets
    {
      // using row
      // const rows = await masterSheet.getRows();
      // rows[6].wk2 = "E"; //[goes by no idx]
      // await rows[6].save();

      // using cell
      // await masterSheet.loadCells();
      // const cell = masterSheet.getCell(7,7); // 0 index
      // cell.value = "E";
      // await masterSheet.saveUpdatedCells();

      // const newSheet = await doc.addSheet({ title: 'Sem 1 Week 1' });
      // await newSheet.resize({ rowCount : 12, columnCount : 206});

      // sheet2.clear('G6:J35');
      // await sheet2.saveUpdatedCells();
    }
    
  } else {
    // check if its an update command
    const str = JSON.stringify(req.body.message.text);
    const cmd = str.split(" ");

    if (str.length > 5 && str.includes("update")) {
      // update x command

      // get week number
      const weekNo = cmd[1].slice(0, cmd[1].length - 1);
      console.log("week number to update is " + weekNo);

      // do update
    } else if (str.length > 5 && str.includes("generate")) {
      // generate x y command
      const temp1 = cmd[1];
      const semester = temp1.slice(1,2);
      console.log("temp1 is " + temp1);
      console.log("slice is " + temp1.slice(3, temp1.length - 1));
      const weekNo = temp1.slice(3, temp1.length - 1);
      const newTitle = "Sem " + semester + " Week " + weekNo;

      const oldWeekNo = getOldWeek(weekNo);
      console.log("old week is " + oldWeekNo);

      console.log("new title is " + newTitle);

      const sheet1 = doc.sheetsByTitle["Blank Sheet"];
      await sheet1.duplicate({ title : newTitle });

      const sheet2 = doc.sheetsByTitle[newTitle];
      await sheet2.loadCells();
      const title = sheet2.getCell(0, 0);
      title.value = getTitle(weekNo);

      await sheet2.saveUpdatedCells();
      // await sheet1.updateProperties({hidden : true});

      // axios.post(`${TELEGRAM_API}/sendMessage`, {
      //   chat_id: chatID,
      //   text:
      //     "New sheet created."
      // });
      
    } else {
      // no command
      console.log("Command Not Matched");

      axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text:
          "Hello " +
          req.body.message.chat.first_name +
          ", Please use the /update or /generate commands.",
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

function getTitle(week) {
  switch (week) {
    case '1':
      return 'Week 1 Bookings x Aug - y Aug';
    case '2':
      return 'Week 2 Bookings y Aug - z Aug';
    case '3':
      return 'Week 3 Bookings z Aug - a Aug';
    default :
      return '0';
  }
}

function getOldWeek(week) {
  switch (week) {
    case '1':
      return '0';
    case '2':
      return '1';
    case '3':
        return '2';
    default :
      return '0';
  }
}
