const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const connectToDatabase = async () => {
  await client.connect();
  console.log("Connected to PostgreSQL database");
};

const disconnectFromDatabase = async () => {
  await client.end();
  console.log("Disconnected from PostgreSQL database");
};

module.exports = {
  client,
  connectToDatabase,
  disconnectFromDatabase,
};
