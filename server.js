const app = require("./app.js");

const dotenv = require("dotenv");

const ConnectDB = require("./config/database.js");

// jab koi invalid word ho tab
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...");
  console.log(`${err.message}`);
  process.exit(1);
});

// config -- config and give path
dotenv.config({
  path: "backend/config/config.env",
});

// ConnectDB -- connect to database
ConnectDB();

// middleware for env file
// app.use();

const server = app.listen(process.env.PORT, () => {
  console.log(`connect to netWork`);
});

// unhandled promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`${err.message}`);
  console.log(
    `Shutting down the server due to unhandled Rejection it possible when MongoDb String is invalid Rejection provide what and where error happen in code it also Debug it and show it gracefully-daya se shutdown karta hai system ko`
  );
  server.close(() => {
    process.exit(1);
  }); // mongoDB se catch block hata dete hai
});
