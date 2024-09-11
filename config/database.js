const mongoose = require("mongoose");

const ConnectDB = () => {
  mongoose
    .connect(process.env.MONGODBSTRINGCONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true, // by default use for Index make no complex code
    })
    .then((data) => {
      console.log(data.connection.host, `here is mongoodb host connect`);
    });
  // .catch((err) => {
  //   console.log(err.message);
  // });
};

module.exports = ConnectDB;
