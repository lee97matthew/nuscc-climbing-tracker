// create an express app
const express = require("express");
const app = express();

// set port
let port = process.env.PORT || 3000;

// use the express-static middleware
// app.use(express.static("public"))

// define the first route
app.get("/", (req, res) => {
  res.send("Welcome to the NUS Climbing Club Attendance Tracker")
})

// start the server listening for requests
app.listen(port, () => {
    console.log('Server is running!!');
});