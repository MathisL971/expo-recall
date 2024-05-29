// Initialize a new instance of express
const express = require("express");
const cron = require("node-cron");
const Expo = require("expo-server-sdk").default;
const axios = require("axios");
const app = express();
let expo = new Expo();

// Define the port number
const port = 3002;

// Define the route for the root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

cron.schedule("*/30 * * * * *", async () => {
  console.log("Time: ", new Date().toLocaleString());

  // Fetch resource pdf

  // Construct prompt

  // Generate a question, choices, and asnwer from LLM API
  const { data } = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt:
      "Generate a simple multiple choice question from the following text: 'The quick brown fox jumps over the lazy dog.'",
    stream: false,
  });

  console.log(data);

  // Create question object

  let message = {
    to: "ExponentPushToken[obZUMjDgCcbkGeXwdas1CM]",
    sound: "default",
    title: "Time to study!",
    body: "Can you answer this question?",
  };

  if (!Expo.isExpoPushToken(message.to)) {
    console.error(`Push token ${message.to} is not a valid Expo push token`);
    return;
  }

  // Send the push notification
  (async () => {
    let ticket = await expo.sendPushNotificationsAsync([message]);
    console.log(ticket);
  })();
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
