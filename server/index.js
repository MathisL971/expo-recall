// Initialize a new instance of express
const express = require("express");
const cron = require("node-cron");
const Expo = require("expo-server-sdk").default;
const axios = require("axios");
const app = express();
let expo = new Expo();
const { OpenAI } = require("openai");

// Define the port number
const port = 3002;

const openai = new OpenAI({
  apiKey: "sk-proj-g0cyDuwLqlyY24joBZAlT3BlbkFJjGV89VpleH9tbNSzsjaa",
  organization: "org-omfZqAoc9T33daDJ9uw8dC27",
  project: "proj_hfjU3Mjt2Nfd5Q3cR6xfz4l3",
});

// Put text above in a variable
let text =
  "'There comes a time,' Aldous Huxley wrote, 'when one asks even of Shakespeare, even of Beethoven, is this all?'";
text +=
  "It is difficult to think of a sentence that identifies Hinduism’ attitude toward";
text += "the world more precisely. The world’s offerings are not bad. By and";
text +=
  "large they are good. Some of them are good enough to command our enthusiasm";
text += "for many lifetimes. Eventually, however, every human being comes";
text +=
  "to realize with Simone Weil that 'there is no true good here below, that";
text +=
  "everything that appears to be good in this world is finite, limited, wears";
text +=
  "out, and once worn out, leaves necessity exposed in all its nakedness.'";
text +=
  "When this point is reached, one finds oneself asking even of the best this";
text += "world can offer, 'Is this all?'";
text += "This is the moment Hinduism has been waiting for. As long as people";
text +=
  "are content with the prospect of pleasure, success, or service, the Hindu";
text +=
  "sage will not be likely to disturb them beyond offering some suggestions";
text +=
  "as to how to proceed more effectively. The critical point in life comes when";
text +=
  "these things lose their original charm and one finds oneself wishing that";
text +=
  "life had something more to offer. Whether life does or does not hold more";
text +=
  "is probably the question that divides people more sharply than any other.";
text +=
  "The Hindu answer to the question is unequivocal. Life holds other possibilities.";
text += "To see what these are we must return to the question of what";
text +=
  "people want. Thus far, Hinduism would say, we have been answering this";
text +=
  "question too superficially. Pleasure, success, and duty are never humanity’s";
text +=
  "ultimate goals. At best they are means that we assume will take us in the";
text +=
  "direction of what we really want. What we really want are things that lie";
text += "at a deeper level.";
text +=
  "First, we want being. Everyone wants to be rather than not be; normally,";
text += "no one wants to die. A World War II correspondent once described the";
text += "atmosphere of a room containing thirty-five men who had been assigned";
text +=
  "to a bombing mission from which, on average, only one-fourth returned.";

const questionsAsked = [];

// Define the route for the root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

cron.schedule("*/10 * * * * *", async () => {
  console.log("Time: ", new Date().toLocaleString());

  // Fetch resource pdf

  // Construct prompt
  let prompt = "";
  prompt +=
    "The following text represents an extract from a resource provided by our user.\n";
  prompt +=
    "Your job is to generate a question meant to quiz the user on the key concepts and ideas proposed by its author(s).\n\n";

  prompt += "CONSTRAINTS:\n";
  prompt += "Type of question: MCQ (multiple choice)\n";
  prompt += "Number of answer choices: 3\n";
  prompt +=
    "There should only be one correct answer out of the choices offered\n\n";

  prompt += "JSON format of output:\n";
  prompt +=
    '{\
      "question": "string",\
      "options": [\
        "string",\
        "string",\
        "string"\
      ],\
      "answer": "string"\
    }\n\n';

  prompt += "DO NOT ADD ANY ADDITIONAL TEXT IN YOUR RESPONSE\n";

  prompt +=
    "Never repeat a question that has already been asked. Here is the list of the questions you have already asked:\n";

  for (let x = 0; x < questionsAsked.length; x++) {
    prompt += x + 1 + " " + questionsAsked[x] + "\n";
  }

  text = "\nTHE TEXT EXTRACT:\n" + text;

  // Generate a question, choices, and asnwer from LLM API
  // const { data } = await axios.post("http://localhost:11434/api/generate", {
  //   model: "llama3",
  //   prompt,
  //   stream: false,
  // });

  // let completion;
  // try {
  //   completion = await openai.chat.completions.create({
  //     messages: [
  //       { role: "system", content: prompt },
  //       { role: "user", content: text },
  //     ],
  //     response_format: {
  //       type: "json_object",
  //     },
  //     model: "gpt-3.5-turbo",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  // const output = JSON.parse(completion.choices[0].message.content);
  // console.log("Question: ", output.question);
  // console.log("Options: ", output.options);
  // console.log("Answer: ", output.answer);

  // questionsAsked.push(JSON.parse(completion.choices[0].message.content));

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
