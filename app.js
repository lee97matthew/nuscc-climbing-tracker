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
const e = require("express");

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
      const semester = temp1.slice(1, 2);
      console.log("temp1 is " + temp1);
      console.log("slice is " + temp1.slice(3, temp1.length - 1));
      const weekNo = temp1.slice(3, temp1.length - 1);
      const newTitle = "Sem " + semester + " Week " + weekNo;
      console.log("new title is " + newTitle);

      const oldWeekNo = getOldWeek(weekNo);
      console.log("old week is " + oldWeekNo);
      const oldTitle = "Sem " + semester + " Week " + oldWeekNo;

      /* test code */
      const oldSheet = doc.sheetsByTitle["Blank Sheet"];
      await oldSheet.duplicate({ title: newTitle });
      const newSheet = doc.sheetsByTitle[newTitle];
      await newSheet.loadCells();
      const title = newSheet.getCell(0, 0);
      title.value = getTitle(semester, weekNo);
      

      /* production code
      const oldSheet = doc.sheetsByTitle[oldTitle];
      await oldSheet.duplicate({ title: newTitle });

      const newSheet = doc.sheetsByTitle[newTitle];
      await newSheet.loadCells();
      const title = newSheet.getCell(0, 0);
      title.value = getTitle(semester, weekNo);

      // hide old sheet
      await oldSheet.updateProperties({ hidden: true });

      */

      // clearing old data
      {
        newSheet.clear("B6:E35");
        newSheet.clear("G6:J35");
        newSheet.clear("B37:E41");
        newSheet.clear("G37:J41");

        newSheet.clear("B46:E75");
        newSheet.clear("G46:J75");
        newSheet.clear("B77:E82");
        newSheet.clear("G77:J82");

        newSheet.clear("B89:E118");
        newSheet.clear("G89:J118");
        newSheet.clear("B120:E124");
        newSheet.clear("G120:J124");

        newSheet.clear("B130:E159");
        newSheet.clear("G130:J159");
        newSheet.clear("L130:O159");
        newSheet.clear("B161:E165");
        newSheet.clear("G161:J165");
        newSheet.clear("L161:O165");

        newSheet.clear("B171:E200");
        newSheet.clear("G171:J200");
        newSheet.clear("L171:O200");
        newSheet.clear("B202:E206");
        newSheet.clear("G202:J206");
        newSheet.clear("L202:O206");
      }

      // save new sheet
      await newSheet.saveUpdatedCells();

      axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: "New sheet created for " + newTitle + ".",
      });
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

function getTitle(semester, week) {
  console.log("semester is " + semester);
  console.log("week is " + week);

  if (semester == "1") {
    console.log("AAAAAA");
    switch (week) {
      case "1":
        return "Week 1 Bookings 8 Aug - 12 Aug";
      case "2":
        return "Week 2 Bookings 15 Aug - 19 Aug";
      case "3":
        return "Week 3 Bookings 22 Aug - 26 Aug";
      case "4":
        return "Week 4 Bookings 29 Aug - 2 Sep";
      case "5":
        return "Week 5 Bookings 5 Sep - 9 Sep";
      case "6":
        return "Week 6 Bookings 12 Sep - 16 Sep";
      case "7":
        return "Week 7 Bookings 26 Sep - 30 Sep";
      case "8":
        return "Week 8 Bookings 3 Oct - 7 Oct";
      case "9":
        return "Week 9 Bookings 10 Oct - 14 Oct";
      case "10":
        return "Week 10 Bookings 17 Oct - 21 Oct";
      case "11":
        return "Week 11 Bookings 24 Oct - 28 Oct";
      case "12":
        return "Week 12 Bookings 31 Oct - 4 Nov";
      case "13":
        return "Week 13 Bookings 7 Nov - 11 Nov";
      default:
        return "0";
    }
  } else {
    console.log("BBBBB");
    switch (week) {
      case "1":
        return "Week 1 Bookings 9 Jan - 13 Jan";
      case "2":
        return "Week 2 Bookings 16 Jan - 20 Jan";
      case "3":
        return "Week 3 Bookings 23 Jan - 27 Jan";
      case "4":
        return "Week 4 Bookings 30 Jan - 3 Feb";
      case "5":
        return "Week 5 Bookings 6 Feb - 10 Feb";
      case "6":
        return "Week 6 Bookings 13 Feb - 17 Feb";
      case "7":
        return "Week 7 Bookings 27 Feb - 4 Mar";
      case "8":
        return "Week 8 Bookings 6 Mar - 10 Mar";
      case "9":
        return "Week 9 Bookings 13 Mar - 17 Mar";
      case "10":
        return "Week 10 Bookings 20 Mar - 24 Mar";
      case "11":
        return "Week 11 Bookings 27 Mar - 31 Mar";
      case "12":
        return "Week 12 Bookings 3 Apr - 7 Apr";
      case "13":
        return "Week 13 Bookings 10 Apr - 14 Apr";
      default:
        return "0";
    }
  }
}

function getOldWeek(week) {
  switch (week) {
    case "1":
      return "0";
    case "2":
      return "1";
    case "3":
      return "2";
    case "4":
      return "3";
    case "5":
      return "4";
    case "6":
      return "5";
    case "7":
      return "6";
    case "8":
      return "7";
    case "9":
      return "8";
    case "10":
      return "9";
    case "11":
      return "10";
    case "12":
      return "11";
    case "13":
      return "12";
    default:
      return "0";
  }
}
