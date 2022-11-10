const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js")

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connect to mongodb.');
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongodb Disconnected.")
})

mongoose.connection.on("Connected", () => {
    console.log("mongodb connected.")
})

app.listen(process.env.PORT, () => {
    connect();
    console.log(`server started on port ${process.env.PORT}`);
});