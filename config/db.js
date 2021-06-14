const mongoose = require('mongoose');
require("dotenv").config({path: './config/.env'});

mongoose.connect(process.env.MONGO_DB, {
    useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
.then(() => console.log("DataBase connected !!"))
.catch((err) => console.log("Failed to connect to MongoDB !!", err));

//const db = mongoose.connection;
//db.once("open", () => console.log("DataBase connected !!"));