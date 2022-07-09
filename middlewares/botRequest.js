const axios = require("axios");
const TOKEN = process.env.TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const { GoogleSpreadsheet } = require("google-spreadsheet");

const masterSheet = new GoogleSpreadsheet(
  "1kWMyeS0YVZzjXV_Nft_dtbnZ9xjC9_GFNMAyPeYmFNw"
);

masterSheet.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
});

teleRequest = (req, res) => {
  if (req) {
    console.log("teleRequest for " + req.telegramHandle);
  }

  // Update attendance for previous week
  if (req.task === "update") {
    // insert update code
    console.log("Enter Update Method");

    // Successful update
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: req.chatID,
      text: "Attendance has been updated. (no not really haha jokes)",
    });
  } else if (req.task === "generate") {
    // insert generate code
    console.log("Enter Generate Method");

    masterSheet.loadInfo(); // loads document properties and worksheets
    console.log(masterSheet.title);

    // Successful create
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: req.chatID,
      text: "New sign-up sheet has been created.",
    });
  }
};

const botRequest = {
  teleRequest,
};

module.exports = botRequest;
