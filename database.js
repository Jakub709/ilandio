const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(
        "mongodb+srv://JakubSolnicka:bubicekakropolis709@akropoliscluster.brkoy.mongodb.net/dataDB?retryWrites=true&w=majority"
      )
      .then(() => console.log("Database is connected"))
      .catch((err) => console.log("Database connnection error: " + err));
  }
}

module.exports = new Database();
