// Initialize a new instance of express
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cron = require("node-cron");
// const Expo = require("expo-server-sdk").default;
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const serviceAccount = require("./expo-recall-56743-firebase-adminsdk-zc45j-f84ee77898.json");

const app = express();

app.use(express.json());

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// let expo = new Expo();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "sk-proj-g0cyDuwLqlyY24joBZAlT3BlbkFJjGV89VpleH9tbNSzsjaa",
  organization: "org-omfZqAoc9T33daDJ9uw8dC27",
  project: "proj_hfjU3Mjt2Nfd5Q3cR6xfz4l3",
});

const extractResourceTextSample = async (resource, maxPage) => {
  const filePath = path.join(
    // eslint-disable-next-line no-undef
    __dirname,
    "/assets/pdfs/" + resource.storedName
  );
  const pdfBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const newPdfDoc = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();

  // Generate a random integer between 0 and maxPage
  const startPage = Math.floor(Math.random() * (maxPage - 2)) + 1;
  const endPage = startPage + 2;

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage
  );

  for (const pageNumber of pages) {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }
  }

  // Save the new PDF document containing only the selected pages
  const newPdfBytes = await newPdfDoc.save();

  // Parse the text from the new PDF document
  const parsedData = await pdfParse(newPdfBytes);
  return parsedData.text;
};

const generatePrompt = async (subscription) => {
  const { userId, resource: resourceRef, maxPage } = subscription;

  // Initialize prompt with boilerplate text
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

  // Fetch all question ever asked to user for this resource
  const questionsRef = db.collection("questions");

  const questionsSnapshot = await questionsRef
    .where("userId", "==", userId)
    .where("resource", "==", resourceRef)
    .get();

  const questionsAsked = questionsSnapshot.docs.map((doc) => doc.data().prompt);

  questionsAsked.forEach((question) => {
    prompt += question + "\n";
  });

  // Add text extract to prompt
  const resourceDoc = await resourceRef.get();
  const resource = resourceDoc.data();
  const sample = await extractResourceTextSample(resource, maxPage);
  prompt += "\nTHE TEXT EXTRACT:\n" + sample;

  return prompt;
};

// const sendNotification = async (to, title, body) => {
//   // Create question object
//   let message = {
//     to,
//     sound: "default",
//     title,
//     body,
//   };

//   if (!Expo.isExpoPushToken(to)) {
//     console.error(`Push token ${to} is not a valid Expo push token`);
//     return;
//   }

//   // Send the push notification
//   (async () => {
//     let ticket = await expo.sendPushNotificationsAsync([message]);
//     console.log(ticket);
//   })();
// };

cron.schedule("*/10 * * * * *", async () => {
  try {
    // Get all resourceSubscriptions from the database
    const resourceSubscriptions = await db
      .collection("resourceSubscriptions")
      .get();

    // Filter resourceSubscriptions to only those that are due for a quiz
    const resourceSubscriptionsToQuiz = resourceSubscriptions.docs.filter(
      (doc) => {
        const { shouldQuiz } = doc.data();
        return shouldQuiz;
      }
    );

    await Promise.all(
      resourceSubscriptionsToQuiz.map(async (doc) => {
        const resourceSubscription = doc.data();

        const prompt = await generatePrompt(resourceSubscription);

        let completion;
        try {
          completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            response_format: {
              type: "json_object",
            },
            model: "gpt-3.5-turbo",
          });
        } catch (error) {
          console.error(error);
        }

        const output = JSON.parse(completion.choices[0].message.content);

        const newQuestion = {
          prompt: output.question,
          choices: output.options,
          answer: output.answer,
          selection: null,
          type: "MCQ",
          userId: resourceSubscription.userId,
          resource: resourceSubscription.resource,
          dateCreated: new Date(),
        };

        await db.collection("questions").add(newQuestion);

        // await sendNotification(
        //   "ExponentPushToken[7V9dZ7Qq9f8Zv5FjQgJjX-]",
        //   "New Quiz Available",
        //   "A new quiz is available for you to take"
        // );
      })
    );

    console.log("Quiz generation completed");
  } catch (error) {
    console.error(error);
  }
});

// Start the server on the specified port
// Define the port number
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
