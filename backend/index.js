const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();


const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/authenticate", authRoute);
app.use("/api", userRoute);
app.use("/api", postRoute);

app.listen(8800, () => {
    console.log("Backend server is running!");
});