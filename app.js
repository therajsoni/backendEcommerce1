const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error.js");
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes.js");
const order = require("./routes/orderRoute.js");

app.use(express.json());
app.use(cookieParser);

//Route Imports
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1",order);


//Error MiddleWare for
app.use(errorMiddleware);

module.exports = app;
